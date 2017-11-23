import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchIllustCommentsSuccess,
  fetchIllustCommentsFailure,
} from '../actions/illustComments';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { ILLUST_COMMENTS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchIllustComments(action) {
  const { illustId, options, nextUrl } = action.payload;
  try {
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    } else {
      response = yield apply(pixiv, pixiv.illustComments, [illustId, options]);
    }
    //
    const normalized = normalize(
      response.comments,
      Schemas.ILLUST_COMMENT_ARRAY,
    );
    yield put(
      fetchIllustCommentsSuccess(
        normalized.entities,
        normalized.result,
        illustId,
        response.next_url,
      ),
    );
  } catch (err) {
    yield put(fetchIllustCommentsFailure(illustId));
    yield put(addError(err));
  }
}

export function* watchFetchIllustComments() {
  yield takeEvery(ILLUST_COMMENTS.REQUEST, handleFetchIllustComments);
}
