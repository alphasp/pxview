import { normalize } from 'normalizr';
import { takeEvery, apply, put, select } from 'redux-saga/effects';
import {
  fetchIllustCommentsSuccess,
  fetchIllustCommentsFailure,
} from '../actions/illustComments.js'
import { addError } from '../actions/error';
import pixiv from '../helpers/ApiClient';
import { ILLUST_COMMENTS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchIllustComments(action) {
  const { illustId, options, nextUrl } = action.payload;
  try {
    console.log('payload ', action.payload)
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    }
    else {
      response = yield apply(pixiv, pixiv.illustComments, [illustId, options]);
    }
    //
    const normalized = normalize(response.comments, Schemas.ILLUST_COMMENT_ARRAY);
    yield put(fetchIllustCommentsSuccess(normalized.entities, normalized.result, illustId, response.next_url));
  } 
  catch(err) {
    yield put(fetchIllustCommentsFailure(illustId));
    yield put(addError(err));    
  }
}

export function* watchFetchIllustComments() {
  yield takeEvery(ILLUST_COMMENTS.REQUEST, handleFetchIllustComments);
}


// function fetchIllustCommentFromApi(illustId, options, nextUrl) {
//   return dispatch => {
//     const promise = nextUrl ? pixiv.requestUrl(nextUrl) : pixiv.illustComments(illustId, options);
//     const params = qs.parse(nextUrl);
//     const offset = params.offset || "0";
//     dispatch(requestIllustComment(illustId, offset));
//     return promise
//       .then(json => dispatch(receiveIllustComment(json, illustId, offset)))
//       .catch(err => {
//         dispatch(stopIllustComment(illustId, offset));
//         dispatch(addError(err));
//       });
//   };
// }