import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchNovelCommentsSuccess,
  fetchNovelCommentsFailure,
} from '../actions/novelComments';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { NOVEL_COMMENTS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchNovelComments(action) {
  const { novelId, options, nextUrl } = action.payload;
  try {
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    } else {
      response = yield apply(pixiv, pixiv.novelCommentsV3, [novelId, options]);
    }
    const normalized = normalize(
      response.comments,
      Schemas.NOVEL_COMMENT_ARRAY,
    );
    yield put(
      fetchNovelCommentsSuccess(
        normalized.entities,
        normalized.result,
        novelId,
        response.next_url,
      ),
    );
  } catch (err) {
    yield put(fetchNovelCommentsFailure(novelId));
    yield put(addError(err));
  }
}

export function* watchFetchNovelComments() {
  yield takeEvery(NOVEL_COMMENTS.REQUEST, handleFetchNovelComments);
}
