import test from 'ava';
import sinon from 'sinon';
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

test('watchLoginRequest should take every login request', t => {
  const generator = watchLoginRequest();
  // console.log(generator.next().value)
  // console.log(generator.next().value)
  t.deepEqual(
    generator.next().value,
    take(LOGIN_REQUEST),
  );
  t.deepEqual(
    //value inside next() = result of yield;
    generator.next(login(email, password)).value,
    race([
      take(LOGOUT),
      call(authAndRefreshTokenOnExpiry, email, password)
    ])
  );
  //loop again
  t.deepEqual(
    generator.next().value,
    take(LOGIN_REQUEST)
  );
})

test('login success', t => {  
  sinon.useFakeTimers(Date.now());
  const credentials = { email, password };
  //  const mockTask = createMockTask();
  const generator = authAndRefreshTokenOnExpiry(email, password);
  t.deepEqual(
    generator.next().value,
    call(authorize, email, password)
  );
  t.deepEqual(
    generator.next(mockLoginResponse).value,
    call(Keychain.getGenericPassword)
  );
  t.deepEqual(
    generator.next(credentials).value,
    call(delay, mockLoginResponse.expires_in - 300)
  );
  t.deepEqual(
    generator.next().value,
    call(authorize, credentials.email, credentials.password) 
  );

  // loop again
  t.deepEqual(
    generator.next(mockLoginResponse).value,
    call(Keychain.getGenericPassword)
  );
});

test('login failure', t => {  
  const mockError = {
    errors: {
      system: {
        message: 'some error'
      }
    }
  };
  const generator = watchLoginRequest();
  t.deepEqual(
    generator.next().value,
    take(LOGIN_REQUEST)
  );
  t.deepEqual(
    generator.throw(mockError).value,
    put(failedLogin())
  );
  const errMessage = (mockError.errors && mockError.errors.system && mockError.errors.system.message) ? mockError.errors.system.message : '';
  t.deepEqual(
    generator.next().value,
    put(addError(errMessage))
  );
  //loop again
  t.deepEqual(
    generator.next().value,
    take(LOGIN_REQUEST)
  );
});

test('authorize', t => {  
  sinon.useFakeTimers(Date.now());
  const generator = authorize(email, password);
  t.deepEqual(
    generator.next().value,
    call(pixiv.login, email, password)
  );
  t.deepEqual(
    generator.next(mockLoginResponse).value,
    call(Keychain.setGenericPassword, email, password)
  );
  t.deepEqual(
    generator.next().value,
    put(successLogin(mockLoginResponse))
  );
  t.true(generator.next().done);
});

