import { DeviceEventEmitter } from 'react-native';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  sendVerificationEmailSuccess,
  sendVerificationEmailFailure,
} from '../actions/verificationEmail';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import i18n from '../helpers/i18n';
import { VERIFICATION_EMAIL } from '../constants/actionTypes';

export function* handleSendVerificationEmail() {
  try {
    yield apply(pixiv, pixiv.sendAccountVerificationEmail);
    yield put(sendVerificationEmailSuccess());
    yield apply(DeviceEventEmitter, DeviceEventEmitter.emit, [
      'showToast',
      i18n.emailVerificationSent,
    ]);
  } catch (err) {
    yield put(sendVerificationEmailFailure());
    yield put(addError(err));
  }
}

export function* watchSendVerificationEmail() {
  yield takeEvery(VERIFICATION_EMAIL.REQUEST, handleSendVerificationEmail);
}
