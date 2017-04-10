import { delay } from 'redux-saga';
import { take, takeEvery, takeLatest, fork, call, apply, put, race, select } from 'redux-saga/effects';
import * as Keychain from 'react-native-keychain';
import { REHYDRATE } from 'redux-persist/constants';
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_ERROR, LOGOUT, login, requestLogin, successLogin, failedLogin, doneRehydrate } from '../../src/common/actions/auth';
import { addError, resetError } from '../../src/common/actions/error';
import pixiv from '../../src/common/helpers/ApiClient';
import { watchLoginRequest, watchRehydrate, authAndRefreshTokenOnExpiry, authorize, handleLogout } from '../../src/common/sagas/auth';
import { getAuthUser } from '../../src/common/selectors';

const email = 'test@gmail.com';
const password = 'password';
const credentials = { username: email, password };
const mockLoginResponse = {
  user: {
    id: 123
  },
  access_token: 'access_token',
  refresh_token: 'refresh_token',
  expires_in: new Date('2017-01-01')
};

Date.now = jest.genMockFunction().mockReturnValue(0);

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
  expect(generator.next().value)
    .toEqual(call(handleLogout));
  //loop again
  expect(generator.next().value)
    .toEqual(take(LOGIN_REQUEST));
})

test('login success', () => {  
  const generator = authAndRefreshTokenOnExpiry(email, password);
  const delayMilisecond = (mockLoginResponse.expires_in - 300) * 1000;

  expect(generator.next().value)
    .toEqual(call(authorize, email, password));
  expect(generator.next(mockLoginResponse).value)
    .toEqual(call(Keychain.getGenericPassword));
  expect(generator.next(credentials).value)
    .toEqual(call(delay, delayMilisecond));
  // expect(generator.next().value)
  //   .toEqual(call(authorize, credentials.username, credentials.password));

  // // loop again
  // expect(generator.next(mockLoginResponse).value)
  //   .toEqual(call(Keychain.getGenericPassword));

    
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
    .toEqual(apply(pixiv, pixiv.login, [email, password]));
  expect(generator.next(mockLoginResponse).value)
    .toEqual(call(Keychain.setGenericPassword, email, password));
  expect(generator.next().value)
    .toEqual(put(successLogin(mockLoginResponse)));
  expect(generator.next().done)
    .toBe(true);
});

// test('watchLogout', () => {
//   const generator = watchLogout();
//   expect(generator.next().value)
//     .toEqual(takeLatest(LOGOUT, handleLogout));
// });

test('handleLogout', () => {
  const generator = handleLogout();
  expect(generator.next().value)
    .toEqual([
      call(Keychain.resetGenericPassword),
      call(pixiv.logout)
    ]);
});

test('Login after redux rehydrated if state auth user is found', () => {
  const generator = watchRehydrate();
  const user = {};
  expect(generator.next().value)
    .toEqual(take(REHYDRATE));
  expect(generator.next().value)
    .toEqual(select(getAuthUser));
  expect(generator.next(user).value)
    .toEqual(call(Keychain.getGenericPassword));
  expect(generator.next(credentials).value)
    .toEqual(put(requestLogin(credentials.username, credentials.password)));
  expect(generator.next().value)
    .toEqual(take([
      LOGIN_SUCCESS,
      LOGIN_ERROR
    ]));
  expect(generator.next().value)
    .toEqual(put(doneRehydrate()));
});