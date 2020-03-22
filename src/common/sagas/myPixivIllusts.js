import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchMyPixivIllustsSuccess,
  fetchMyPixivIllustsFailure,
} from '../actions/myPixivIllusts';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { MY_PIXIV_ILLUSTS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchMyPixivIllusts(action) {
  const { nextUrl } = action.payload;
  try {
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    } else {
      response = yield apply(pixiv, pixiv.illustMyPixiv);
    }
    const normalized = normalize(
      response.illusts.filter((illust) => illust.visible && illust.id),
      Schemas.ILLUST_ARRAY,
    );
    yield put(
      fetchMyPixivIllustsSuccess(
        normalized.entities,
        normalized.result,
        response.next_url,
      ),
    );
  } catch (err) {
    yield put(fetchMyPixivIllustsFailure());
    yield put(addError(err));
  }
}

export function* watchFetchMyPixivIllusts() {
  yield takeEvery(MY_PIXIV_ILLUSTS.REQUEST, handleFetchMyPixivIllusts);
}
