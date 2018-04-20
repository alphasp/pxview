import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchIllustCommentRepliesSuccess,
  fetchIllustCommentRepliesFailure,
} from '../actions/illustCommentReplies';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { ILLUST_COMMENT_REPLIES } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchIllustCommentReplies(action) {
  const { commentId, options, nextUrl } = action.payload;
  try {
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    } else {
      response = yield apply(pixiv, pixiv.illustCommentReplies, [
        commentId,
        options,
      ]);
    }
    const normalized = normalize(
      response.comments,
      Schemas.ILLUST_COMMENT_ARRAY,
    );
    yield put(
      fetchIllustCommentRepliesSuccess(
        normalized.entities,
        normalized.result,
        commentId,
        response.next_url,
      ),
    );
  } catch (err) {
    yield put(fetchIllustCommentRepliesFailure(commentId));
    yield put(addError(err));
  }
}

export function* watchFetchIllustCommentReplies() {
  yield takeEvery(
    ILLUST_COMMENT_REPLIES.REQUEST,
    handleFetchIllustCommentReplies,
  );
}
