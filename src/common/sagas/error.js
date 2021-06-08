import { takeEvery, call, put } from 'redux-saga/effects';
import { showMessage } from 'react-native-flash-message';
import { clearError } from '../actions/error';
import { ERROR } from '../constants/actionTypes';

// todo
export function* handleAlertError(action) {
  const error = action.payload;
  // yield call(showMessage, {
  //   message: error,
  //   type: 'danger',
  // });
  // yield put(clearError());
}

export function* watchError() {
  yield takeEvery(ERROR.ADD, handleAlertError);
}
