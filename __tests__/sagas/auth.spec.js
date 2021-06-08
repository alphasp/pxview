import {
  take,
  call,
  apply,
  put,
  race,
  select,
  cancel,
  fork,
  delay,
} from 'redux-saga/effects';
import { cloneableGenerator, createMockTask } from '@redux-saga/testing-utils';
import { REHYDRATE } from 'redux-persist';
import {
  login,
  loginSuccess,
  loginFailure,
  logout,
  signUpSuccess,
  signUpFailure,
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
  watchLoginRequestTask,
  watchRefreshAccessTokenRequestTask,
  watchSignUpRequest,
  watchRehydrate,
  refreshAccessTokenOnExpiry,
  handleRefreshAccessToken,
  scheduleRefreshAccessToken,
  authorize,
  handleLogout,
  signUp,
} from '../../src/common/sagas/auth';
import { getAuthUser, getLang } from '../../src/common/selectors';
import {
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_REFRESH_ACCESS_TOKEN,
  AUTH_SIGNUP,
} from '../../src/common/constants/actionTypes';

const code = 'code';
const codeVerifier = 'codeVerifier';
const email = 'test@gmail.com';
const password = 'password';
const nickname = 'nickname';
const isProvisionalAccount = false;
const loginOptions = {
  isProvisionalAccount,
  password,
};
const refreshToken = 'refreshToken';
const delayMilisecond = 1000 * 60 * 60;
const tokenRequestAction = {
  payload: {
    code,
    codeVerifier,
  },
};
const refreshTokenRequestAction = {
  payload: {
    refreshToken,
  },
};
const signUpRequestAction = {
  payload: {
    nickname,
  },
};
const mockLoginResponse = {
  user: {
    id: 123,
  },
  access_token: 'access_token',
  refresh_token: 'refresh_token',
  expires_in: new Date('2017-01-01'),
  isProvisionalAccount: false,
};
const mockSignUpResponse = {
  user_account: 'user_account',
  password,
  device_token: 'device_token',
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

Date.now = jest.fn();

test('authorize', () => {
  const generator = authorize(code, codeVerifier);
  expect(generator.next().value).toEqual(
    apply(pixiv, pixiv.tokenRequest, [code, codeVerifier]),
  );
  expect(generator.next(mockLoginResponse).value).toEqual(
    put(loginSuccess(mockLoginResponse, loginOptions)),
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
        select(getAuthUser),
      );
      expect(data.generator.next(mockAuthUser).value).toEqual(
        put(refreshAccessTokenSuccess(mockLoginResponse, loginOptions)),
      );
      expect(data.generator.next().done).toBe(true);
    });
  });

  describe('on request failure', () => {
    test('refreshAccessTokenFailure', () => {
      expect(data.generator2.throw(mockError).value).toEqual(
        put(refreshAccessTokenFailure()),
      );
      expect(data.generator2.next().done).toBe(true);
    });
  });
});

test('scheduleRefreshAccessToken', () => {
  const generator = scheduleRefreshAccessToken(refreshToken, delayMilisecond);
  expect(generator.next().value).toEqual(delay(delayMilisecond));
  expect(generator.next(mockLoginResponse).value).toEqual(
    call(handleRefreshAccessToken, refreshToken),
  );
  expect(generator.next().done).toBe(true);
});

test('handleLogout', () => {
  const generator = handleLogout();
  expect(generator.next().value).toEqual(apply(pixiv, pixiv.logout));
});

test('watchLoginRequest', () => {
  const generator = watchLoginRequest();
  expect(generator.next().value).toEqual(fork(watchLoginRequestTask));
  const mockTask = createMockTask();
  expect(generator.next(mockTask).value).toEqual(take(AUTH_LOGIN.STOP));
  expect(generator.next().value).toEqual(cancel(mockTask));
});

describe('watchLoginRequestTask', () => {
  const data = {};
  data.generator = cloneableGenerator(watchLoginRequestTask)();

  test('watchLoginRequestTask should take every login request', () => {
    expect(data.generator.next().value).toEqual(take(AUTH_LOGIN.REQUEST));
    data.generator2 = data.generator.clone();
  });

  describe('on login success', () => {
    test('login success', () => {
      expect(data.generator.next(tokenRequestAction).value).toEqual(
        call(authorize, code, codeVerifier),
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
      const errMessage =
        mockError.errors &&
        mockError.errors.system &&
        mockError.errors.system.message
          ? mockError.errors.system.message
          : '';
      expect(data.generator2.next().value).toEqual(put(addError(errMessage)));
      expect(data.generator2.next().value).toEqual(take(AUTH_LOGIN.REQUEST));
    });
  });
});

test('watchRefreshAccessTokenRequest', () => {
  const generator = watchRefreshAccessTokenRequest();
  expect(generator.next().value).toEqual(
    fork(watchRefreshAccessTokenRequestTask),
  );
  const mockTask = createMockTask();
  expect(generator.next(mockTask).value).toEqual(take(AUTH_LOGIN.STOP));
  expect(generator.next().value).toEqual(cancel(mockTask));
});

describe('watchRefreshAccessTokenRequestTask', () => {
  const data = {};
  data.generator = cloneableGenerator(watchRefreshAccessTokenRequestTask)();

  test('watchRefreshAccessTokenRequestTask should take every refresh access token request', () => {
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
      const errMessage =
        mockError.errors &&
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

describe('watchSignUpRequest', () => {
  const data = {};
  data.generator = cloneableGenerator(watchSignUpRequest)();

  test('watchSignUpRequest should take every login request', () => {
    expect(data.generator.next().value).toEqual(take(AUTH_SIGNUP.REQUEST));
    data.generator2 = data.generator.clone();
  });

  describe('on signup success', () => {
    test('signup success', () => {
      expect(data.generator.next(signUpRequestAction).value).toEqual(
        call(signUp, nickname),
      );
      expect(data.generator.next(mockSignUpResponse).value).toEqual(
        put(
          login(
            mockSignUpResponse.user_account,
            mockSignUpResponse.password,
            true,
          ),
        ),
      );
    });
  });

  describe('on signup failure', () => {
    test('signup failure', () => {
      expect(data.generator2.throw(mockError).value).toEqual(
        put(signUpFailure()),
      );
      const errMessage =
        mockError.errors &&
        mockError.errors.system &&
        mockError.errors.system.message
          ? mockError.errors.system.message
          : '';
      expect(data.generator2.next().value).toEqual(put(addError(errMessage)));
    });
  });
});

test('signUp', () => {
  const generator = signUp(nickname);
  expect(generator.next().value).toEqual(
    apply(pixiv, pixiv.createProvisionalAccount, [nickname]),
  );
  expect(generator.next(mockSignUpResponse).value).toEqual(
    put(signUpSuccess(mockSignUpResponse)),
  );
  expect(generator.next().done).toBe(true);
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
