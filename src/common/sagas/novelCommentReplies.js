import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchNovelCommentRepliesSuccess,
  fetchNovelCommentRepliesFailure,
} from '../actions/novelCommentReplies';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { NOVEL_COMMENT_REPLIES } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchNovelCommentReplies(action) {
  const { commentId, options, nextUrl } = action.payload;
  try {
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    } else {
      response = yield apply(pixiv, pixiv.novelCommentReplies, [
        commentId,
        options,
      ]);
    }
    const normalized = normalize(
      response.comments,
      Schemas.NOVEL_COMMENT_ARRAY,
    );
    yield put(
      fetchNovelCommentRepliesSuccess(
        normalized.entities,
        normalized.result,
        commentId,
        response.next_url,
      ),
    );
  } catch (err) {
    yield put(fetchNovelCommentRepliesFailure(commentId));
    yield put(addError(err));
  }
}

export function* watchFetchNovelCommentReplies() {
  yield takeEvery(
    NOVEL_COMMENT_REPLIES.REQUEST,
    handleFetchNovelCommentReplies,
  );
}
