import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchNovelTextSuccess,
  fetchNovelTextFailure,
} from '../actions/novelText';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { NOVEL_TEXT } from '../constants/actionTypes';

export function* handleFetchNovelText(action) {
  const { novelId } = action.payload;
  try {
    const response = yield apply(pixiv, pixiv.novelWebview, [novelId]);
    yield put(fetchNovelTextSuccess(response.text, novelId));
  } catch (err) {
    yield put(fetchNovelTextFailure(novelId));
    yield put(addError(err));
  }
}

export function* watchFetchNovelText() {
  yield takeEvery(NOVEL_TEXT.REQUEST, handleFetchNovelText);
}
