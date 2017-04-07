import { delay } from 'redux-saga';
import { take, takeEvery, fork, call, put, race } from 'redux-saga/effects';
import * as Keychain from 'react-native-keychain';
import { LOGIN_REQUEST, LOGOUT, login, successLogin, failedLogin } from 'common/actions/auth';
import { addError, resetError } from 'common/actions/error';
import pixiv from 'common/helpers/ApiClient';
import { watchLoginRequest, authAndRefreshTokenOnExpiry, authorize } from 'common/sagas/auth';

const email = 'test@gmail.com';
const password = 'password';
const mockLoginResponse = {
  user: {
    id: 123
  },
  access_token: 'access_token',
  refresh_token: 'refresh_token',
  expires_in: new Date('2017-01-01')
};

jest.useFakeTimers();

test('watchLoginRequest should take every login request', () => {
  const generator = watchLoginRequest();
  // console.log(generator.next().value)
  // console.log(generator.next().value)
  expect(generator.next().value)
    .toEqual(take(LOGIN_REQUEST));
  //value inside next() = result of yield;
  expect(generator.next(login(email, password)).value)
    .toEqual(race([
      take(LOGOUT),
      call(authAndRefreshTokenOnExpiry, email, password)
    ]));
  //loop again
  expect(generator.next().value)
    .toEqual(take(LOGIN_REQUEST));
})

test('login success', () => {  
  const credentials = { email, password };
  //  const mockTask = createMockTask();
  const generator = authAndRefreshTokenOnExpiry(email, password);
  expect(generator.next().value)
    .toEqual(call(authorize, email, password));
  expect(generator.next(mockLoginResponse).value)
    .toEqual(call(Keychain.getGenericPassword));
  expect(generator.next(credentials).value)
    .toEqual(call(delay, mockLoginResponse.expires_in - 300));
  expect(generator.next().value)
    .toEqual(call(authorize, credentials.email, credentials.password));

  // loop again
  expect(generator.next(mockLoginResponse).value)
    .toEqual(call(Keychain.getGenericPassword));
});

test('login failure', () => {  
  const mockError = {
    errors: {
      system: {
        message: 'some error'
      }
    }
  };
  const generator = watchLoginRequest();
  expect(generator.next().value)
    .toEqual(take(LOGIN_REQUEST));
  expect(generator.throw(mockError).value)
    .toEqual(put(failedLogin()));
  const errMessage = (mockError.errors && mockError.errors.system && mockError.errors.system.message) ? mockError.errors.system.message : '';
  expect(generator.next().value)
    .toEqual(put(addError(errMessage)));
  //loop again
  expect(generator.next().value)
    .toEqual(take(LOGIN_REQUEST));
});

test('authorize', () => {  
  const generator = authorize(email, password);
  expect(generator.next().value)
    .toEqual(call(pixiv.login, email, password));
  expect(generator.next(mockLoginResponse).value)
    .toEqual(call(Keychain.setGenericPassword, email, password));
  expect(generator.next().value)
    .toEqual(put(successLogin(mockLoginResponse)));
  expect(generator.next().done)
    .toBe(true);
});

