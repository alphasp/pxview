import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  addNovelCommentSuccess,
  addNovelCommentFailure,
} from '../actions/addNovelComment';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { ADD_NOVEL_COMMENT } from '../constants/actionTypes';

export function* handleAddNovelComment(action) {
  const { novelId, comment, replyToCommentId } = action.payload;
  try {
    yield apply(pixiv, pixiv.novelAddComment, [
      novelId,
      comment,
      replyToCommentId,
    ]);
    yield put(addNovelCommentSuccess(novelId, replyToCommentId));
  } catch (err) {
    yield put(addNovelCommentFailure(novelId, replyToCommentId));
    yield put(addError(err));
  }
}

export function* watchAddNovelComment() {
  yield takeEvery(ADD_NOVEL_COMMENT.ADD, handleAddNovelComment);
}
