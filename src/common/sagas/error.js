import { Platform } from 'react-native';
import { takeEvery, apply, put } from 'redux-saga/effects';
import { MessageBarManager } from 'react-native-message-bar';
import { clearError } from '../actions/error';
import { ERROR } from '../constants/actionTypes';
import { globalStyleVariables } from '../../styles';

function getAlertBarTopInset() {
  if (Platform.OS === 'ios') {
    if (parseInt(Platform.Version, 10) < 11) {
      return 10;
    }
    return 0;
  }
  return globalStyleVariables.STATUSBAR_HEIGHT;
}

export function* handleAlertError(action) {
  const error = action.payload;
  yield apply(MessageBarManager, MessageBarManager.hideAlert);
  yield apply(MessageBarManager, MessageBarManager.showAlert, [
    {
      message: error,
      titleNumberOfLines: 0,
      alertType: 'error',
      viewTopInset: getAlertBarTopInset(),
    },
  ]);
  yield put(clearError());
}

export function* watchError() {
  yield takeEvery(ERROR.ADD, handleAlertError);
}
