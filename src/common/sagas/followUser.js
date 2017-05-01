import { takeEvery, apply, put, select } from 'redux-saga/effects';
import {
  followUserSuccess,
  followUserFailure,
  unfollowUserSuccess,
  unfollowUserFailure
} from '../actions/followUser.js'
import { addError } from '../actions/error';
import pixiv from '../helpers/ApiClient';
import { FOLLOW_USER, UNFOLLOW_USER } from '../constants/actionTypes';
import { FOLLOWING_TYPES } from '../constants/followingTypes';

export function* handleFollowUser(action) {
  const { userId, followType, tags } = action.payload;
  try {
    const followTypeString = followType === FOLLOWING_TYPES.PRIVATE ? 'private' : 'public';
    const response = yield apply(pixiv, pixiv.followUser, [userId, followTypeString]);
    yield put(followUserSuccess(userId));
  } 
  catch(err) {
    yield put(followUserFailure(userId));
    yield put(addError(err));    
  }
}

export function* handleUnfollowUser(action) {
  const { userId, followType } = action.payload;
  try {
    const followTypeString = followType === FOLLOWING_TYPES.PRIVATE ? 'private' : 'public';
    const response = yield apply(pixiv, pixiv.unfollowUser, [userId]);
    yield put(unfollowUserSuccess(userId));
  } 
  catch(err) {
    yield put(unfollowUserFailure(userId));
    yield put(addError(err));    
  }
}

export function* watchFollowUser() {
  yield takeEvery(FOLLOW_USER.REQUEST, handleFollowUser);
}

export function* watchUnfollowUser() {
  yield takeEvery(UNFOLLOW_USER.REQUEST, handleUnfollowUser);
}
