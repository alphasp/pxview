import moment from 'moment';
import { login, requestRefreshToken, successRefreshToken, REFRESH_TOKEN_REQUEST, REFRESH_TOKEN_SUCCESS, REFRESH_TOKEN_DONE } from '../actions/auth';
import { REHYDRATE } from 'redux-persist/constants';

export default jwt = ({ dispatch, getState }) => next => action => {
  // console.log('action ', action, typeof action);
  if (action.type === REHYDRATE || action.type === REFRESH_TOKEN_SUCCESS || action.type === REFRESH_TOKEN_REQUEST || action.type === REFRESH_TOKEN_DONE) {
    return next(action);
  }
  if (typeof action === 'function') {
    const { auth } = getState();
    if (auth && auth.user && auth.user.accessToken) {
      // console.log('auth updatedat ', moment(auth.lastUpdated).format());
      // console.log('now ', moment(Date.now()).format())
      const datetimeNow = moment();
      const lastUpdatedDatetime = moment(auth.lastUpdated);
      const timeDiff = datetimeNow.diff(lastUpdatedDatetime, 'seconds');
      const isExpired = timeDiff > auth.user.expiresIn;
      // console.log('isExpired ', isExpired);
      // console.log(timeDiff > auth.user.expiresIn)
      if (isExpired) {
        // return next(requestRefreshToken()).finally(() => {
        //   return next(action)
        // });
        console.log('token is expired, require refresh');
        if (!auth.refreshTokenPromise) {
          return requestRefreshToken(dispatch).finally(() => next(action));
        }

        return auth.refreshTokenPromise.finally(() => next(action));
      }
    }
    return action(dispatch, getState);
  }
  return next(action);
};
