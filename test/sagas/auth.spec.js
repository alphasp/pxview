import test from 'ava';
import sinon from 'sinon';
import { take, takeEvery, fork, call, put } from 'redux-saga/effects';
import * as Keychain from 'react-native-keychain';
import { LOGIN_REQUEST, login, successLogin, failedLogin } from 'common/actions/auth';
import { addError, resetError } from 'common/actions/error';
import pixiv from 'common/helpers/ApiClient';
import { watchLoginRequest, loginFlow, authorize } from 'common/sagas/auth';

const email = 'test@gmail.com';
const password = 'password';

test('watchLoginRequest should take every login request', t => {
  const generator = watchLoginRequest()
  t.deepEqual(
    generator.next().value,
    takeEvery(LOGIN_REQUEST, loginFlow)
  );
})

test('login success', t => {  
  sinon.useFakeTimers(Date.now());
  const mockLoginResponse = {
    user: {
      id: 123
    },
    access_token: 'access_token',
    refresh_token: 'refresh_token',
    expires_in: '2017-01-01'
  };
  //  const mockTask = createMockTask();
  const generator = loginFlow(login(email, password));
  t.deepEqual(
    generator.next().value,
    call(pixiv.login, email, password)
  );
  t.deepEqual(
    generator.next(mockLoginResponse).value,
    put(successLogin(mockLoginResponse))
  );

  // it should be done
  t.true(generator.next().done);
});

test('login failure', t => {  
  const mockError = {
    error: {
      system: {
        message: 'some error'
      }
    }
  };
  const generator = loginFlow(login(email, password));
  t.deepEqual(
    generator.next().value,
    call(pixiv.login, email, password)
  );

  t.deepEqual(
    generator.throw(mockError).value,
    put(failedLogin())
  );

  t.deepEqual(
    generator.next(mockError).value,
    put(addError(mockError))
  );
  // it should be done
  t.true(generator.next().done);
});

// const iterator = loginSaga()

// assert.deepEqual(iterator.next().value, take(LOGIN_REQUEST))

// // resume the generator with some dummy action
// const mockAction = {user: '...', pass: '...'}
// assert.deepEqual(
//   iterator.next(mockAction).value, 
//   call(request.post, '/login', mockAction)
// )

// // simulate an error result
// const mockError = 'invalid user/password'
// assert.deepEqual(
//   iterator.throw(mockError).value, 
//   put({ type: LOGIN_ERROR, error: mockError })
// )

// describe('Sagas/ login', () => {
//     describe('watchRequestLogin', () => {
//         const generator = watchRequestLogin()
//         it('should take every login request', () => {
//             const expected = takeEvery(LOGIN_REQUEST, loginFlow)
//             const actual = generator.next().value
//             assert.equal(expected.name, actual.name)
//         })
//     })
// });


