import { Platform } from 'react-native';
import { takeEvery, apply, put } from 'redux-saga/effects';
import { MessageBarManager } from 'react-native-message-bar';
import { clearError } from '../actions/error';
import { ERROR } from '../constants/actionTypes';

export function* handleAlertError(action) {
  const error = action.payload;
  yield apply(MessageBarManager, MessageBarManager.hideAlert);
  yield apply(MessageBarManager, MessageBarManager.showAlert, [
    {
      message: error,
      titleNumberOfLines: 0,
      alertType: 'error',
      viewTopInset: Platform.OS === 'ios' ? 10 : 0,
    },
  ]);
  yield put(clearError());
}

export function* watchError() {
  yield takeEvery(ERROR.ADD, handleAlertError);
}
