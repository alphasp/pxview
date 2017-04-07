import test from 'ava';
import sinon from 'sinon';
import { delay } from 'redux-saga';
import { take, takeEvery, fork, call, put, race } from 'redux-saga/effects';
import { LOGIN_REQUEST, LOGOUT, login, successLogin, failedLogin, logUserOut } from 'common/actions/auth';
import { REQUEST_RECOMMENDED_ILLUSTS, requestRecommended } from 'common/actions/recommendedIllust';
import { REQUEST_NEW_ILLUSTS, requestNewIllusts } from 'common/actions/newIllust';
import { addError, resetError } from 'common/actions/error';
import pixiv from 'common/helpers/ApiClient';
import { watchApiRequest, matchRequest } from 'common/sagas/api';


//requestRecommended(isPublicRecommended, offset, url)
test('watchApiRequest', t => {
  const generator = watchApiRequest();
  t.deepEqual(
    generator.next().value,
    // take('*REQUEST')
    take(matchRequest)
  );
  t.deepEqual(
    //value inside next() = result of yield;
    generator.next(requestNewIllusts(0)).value,
    put(failedLogin())
  );
  // t.deepEqual(
  //   //value inside next() = result of yield;
  //   generator.next(logUserOut()).value,
  //   put(failedLogin())
  // );


  // t.deepEqual(
  //   generator.next().value,
  //   take(/^(?=.*REQUEST)(?!.LOGIN_REQUEST).*/)
  // );
  // t.deepEqual(
  //   //value inside next() = result of yield;
  //   generator.next(login('a', 'b')).value,
  //   null
  // );
})
