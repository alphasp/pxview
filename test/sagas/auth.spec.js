import { delay } from 'redux-saga';
import { take, call, apply, put, race, select } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { REHYDRATE } from 'redux-persist/constants';
import {
  loginSuccess,
  loginFailure,
  logout,
  refreshAccessToken,
  refreshAccessTokenSuccess,
  refreshAccessTokenFailure,
  rehydrateSuccess,
} from '../../src/common/actions/auth';
import { setLanguage } from '../../src/common/actions/i18n';
import { addError } from '../../src/common/actions/error';
import pixiv from '../../src/common/helpers/apiClient';
import {
  watchLoginRequest,
  watchRefreshAccessTokenRequest,
  watchRehydrate,
  refreshAccessTokenOnExpiry,
  handleRefreshAccessToken,
  scheduleRefreshAccessToken,
  authorize,
  handleLogout,
} from '../../src/common/sagas/auth';
import { getAuthUser, getLang } from '../../src/common/selectors';
import {
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_REFRESH_ACCESS_TOKEN,
} from '../../src/common/constants/actionTypes';

const email = 'test@gmail.com';
const password = 'password';
const refreshToken = 'refreshToken';
const delayMilisecond = 1000 * 60 * 60;
const loginRequestAction = {
  payload: {
    email,
    password,
  },
};
const refreshTokenRequestAction = {
  payload: {
    refreshToken,
  },
};
const mockLoginResponse = {
  user: {
    id: 123,
  },
  access_token: 'access_token',
  refresh_token: 'refresh_token',
  expires_in: new Date('2017-01-01'),
};

const mockAuthUser = {
  id: 123,
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  expiresIn: new Date('2017-01-01'),
};

const mockError = {
  errors: {
    system: {
      message: 'some error',
    },
  },
};

Date.now = jest.genMockFunction().mockReturnValue(0);

test('authorize', () => {
  const generator = authorize(email, password);
  expect(generator.next().value).toEqual(
    apply(pixiv, pixiv.login, [email, password]),
  );
  expect(generator.next(mockLoginResponse).value).toEqual(
    put(loginSuccess(mockLoginResponse)),
  );
  expect(generator.next().done).toBe(true);
});

describe('handleRefreshAccessToken', () => {
  const data = {};
  // data.generator = handleRefreshAccessToken(refreshToken);
  data.generator = cloneableGenerator(handleRefreshAccessToken)(refreshToken);
  test('call refreshAccessToken api', () => {
    expect(data.generator.next().value).toEqual(
      apply(pixiv, pixiv.refreshAccessToken, [refreshToken]),
    );
    data.generator2 = data.generator.clone();
  });

  describe('on request success', () => {
    test('refreshAccessTokenSuccess', () => {
      expect(data.generator.next(mockLoginResponse).value).toEqual(
        put(refreshAccessTokenSuccess(mockLoginResponse)),
      );
      expect(data.generator.next().done).toBe(true);
    });
  });

  describe('on request failure', () => {
    test('refreshAccessTokenFailure', () => {
      expect(data.generator2.throw(mockError).value).toEqual(
        put(refreshAccessTokenFailure()),
      );
      expect(data.generator2.next().value).toEqual(put(logout()));
      expect(data.generator2.next().done).toBe(true);
    });
  });
});

test('scheduleRefreshAccessToken', () => {
  const generator = scheduleRefreshAccessToken(refreshToken, delayMilisecond);
  expect(generator.next().value).toEqual(call(delay, delayMilisecond));
  expect(generator.next(mockLoginResponse).value).toEqual(
    call(handleRefreshAccessToken, refreshToken),
  );
  expect(generator.next().done).toBe(true);
});

test('handleLogout', () => {
  const generator = handleLogout();
  expect(generator.next().value).toEqual(apply(pixiv, pixiv.logout));
});

describe('watchLoginRequest', () => {
  const data = {};
  data.generator = cloneableGenerator(watchLoginRequest)();

  test('watchLoginRequest should take every login request', () => {
    expect(data.generator.next().value).toEqual(take(AUTH_LOGIN.REQUEST));

    data.generator2 = data.generator.clone();
  });

  describe('on login success', () => {
    test('login success', () => {
      expect(data.generator.next(loginRequestAction).value).toEqual(
        call(authorize, email, password),
      );
      // value inside next() = result of yield;
      expect(data.generator.next(mockLoginResponse).value).toEqual(
        race([
          take(AUTH_LOGOUT.SUCCESS),
          call(refreshAccessTokenOnExpiry, mockLoginResponse),
        ]),
      );
      expect(data.generator.next().value).toEqual(call(handleLogout));
      expect(data.generator.next().value).toEqual(take(AUTH_LOGIN.REQUEST));
    });
  });

  describe('on login failure', () => {
    test('login failure', () => {
      expect(data.generator2.throw(mockError).value).toEqual(
        put(loginFailure()),
      );
      const errMessage = mockError.errors &&
        mockError.errors.system &&
        mockError.errors.system.message
        ? mockError.errors.system.message
        : '';
      expect(data.generator2.next().value).toEqual(put(addError(errMessage)));
      expect(data.generator2.next().value).toEqual(take(AUTH_LOGIN.REQUEST));
    });
  });
});

describe('watchRefreshAccessTokenRequest', () => {
  const data = {};
  data.generator = cloneableGenerator(watchRefreshAccessTokenRequest)();

  test('watchRefreshAccessTokenRequest should take every refresh access token request', () => {
    expect(data.generator.next().value).toEqual(
      take(AUTH_REFRESH_ACCESS_TOKEN.REQUEST),
    );

    data.generator2 = data.generator.clone();
  });

  describe('on refresh token success', () => {
    test('refresh token success', () => {
      expect(data.generator.next(refreshTokenRequestAction).value).toEqual(
        call(handleRefreshAccessToken, refreshToken),
      );
      expect(data.generator.next(mockLoginResponse).value).toEqual(
        race([
          take(AUTH_LOGOUT.SUCCESS),
          call(refreshAccessTokenOnExpiry, mockLoginResponse),
        ]),
      );
      expect(data.generator.next().value).toEqual(call(handleLogout));
      expect(data.generator.next().value).toEqual(
        take(AUTH_REFRESH_ACCESS_TOKEN.REQUEST),
      );
    });
  });

  describe('on refresh token failure', () => {
    test('refresh token failure', () => {
      expect(data.generator2.throw(mockError).value).toEqual(
        put(refreshAccessTokenFailure()),
      );
      const errMessage = mockError.errors &&
        mockError.errors.system &&
        mockError.errors.system.message
        ? mockError.errors.system.message
        : '';
      expect(data.generator2.next().value).toEqual(put(addError(errMessage)));
      expect(data.generator2.next().value).toEqual(
        take(AUTH_REFRESH_ACCESS_TOKEN.REQUEST),
      );
    });
  });
});

describe('watchRehydrate', () => {
  const generator = watchRehydrate();
  test('watchRehydrate should take every rehydrate request', () => {
    expect(generator.next().value).toEqual(take(REHYDRATE));
    expect(generator.next().value).toEqual(select(getAuthUser));
  });

  describe('refresh access token if user is logged in', () => {
    test('request refresh access token', () => {
      expect(generator.next(mockAuthUser).value).toEqual(
        put(refreshAccessToken(mockAuthUser.refreshToken)),
      );
    });
    test('request refresh access token success', () => {
      expect(generator.next().value).toEqual(
        take([
          AUTH_REFRESH_ACCESS_TOKEN.SUCCESS,
          AUTH_REFRESH_ACCESS_TOKEN.FAILURE,
          AUTH_LOGOUT.SUCCESS,
        ]),
      );
    });
  });
  test('set language current language to redux store', () => {
    const lang = 'en';
    expect(generator.next().value).toEqual(select(getLang));
    expect(generator.next(lang).value).toEqual(put(setLanguage(lang)));
  });
  test('dispatch rehydrate success action after rehydrate work done', () => {
    expect(generator.next().value).toEqual(put(rehydrateSuccess()));
  });
});
