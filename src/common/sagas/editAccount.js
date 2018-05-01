import { takeEvery, take, apply, put, select } from 'redux-saga/effects';
import { editAccountSuccess, editAccountFailure } from '../actions/editAccount';
import { login, stopLogin } from '../actions/auth';
import { fetchMyAccountState } from '../actions/myAccountState';
import pixiv from '../helpers/apiClient';
import {
  EDIT_ACCOUNT,
  AUTH_LOGIN,
  MY_ACCOUNT_STATE,
} from '../constants/actionTypes';
import { getAuthUser } from '../selectors';

export function* handleEditAccount(action) {
  const { pixivId, currentPassword, newPassword, email } = action.payload;
  try {
    yield apply(pixiv, pixiv.editUserAccount, [
      {
        currentPassword,
        newPassword,
        pixivId,
        email,
      },
    ]);
    yield put(stopLogin());
    const user = yield select(getAuthUser);
    const emailOrPixivId =
      pixivId || email || user.account || user.mail_address;
    const password = newPassword || currentPassword;
    yield put(login(emailOrPixivId, password));
    yield take(AUTH_LOGIN.SUCCESS);
    yield put(fetchMyAccountState());
    yield take(MY_ACCOUNT_STATE.SUCCESS);
    yield put(editAccountSuccess());
  } catch (err) {
    const errors = err && err.body && err.body.validation_errors;
    if (errors) {
      const { old_password, password, pixiv_id, mail_address } = errors;
      const validationErrors = {
        currentPassword: old_password,
        newPassword: password,
        pixivId: pixiv_id,
        email: mail_address,
      };
      yield put(editAccountFailure(validationErrors));
    } else {
      yield put(editAccountFailure());
    }
    // {
    //   "error": false,
    //   "message": "",
    //   "body": {
    //     "is_succeed": false,
    //     "validation_errors": {
    //       "pixiv_id": "This pixiv ID is already taken.",
    //       "mail_address": "This email has already been registered"
    //     }
    //   }
    // }
    // yield put(addError(err));
  }
}

export function* watchEditAccount() {
  yield takeEvery(EDIT_ACCOUNT.REQUEST, handleEditAccount);
}
