import qs from "qs";
import { normalize } from 'normalizr';
import { addError } from './error';
import pixiv from '../helpers/ApiClient';
import Schemas from '../constants/schemas';
import { RECOMMENDED_ILLUSTS } from '../constants/actionTypes';

export function fetchRecommendedIllustsSuccess(entities, items, nextUrl) {
  return {
    type: RECOMMENDED_ILLUSTS.SUCCESS,
    payload: {
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    }
  };
}

export function fetchRecommendedIllustsFailure() {
  return {
    type: RECOMMENDED_ILLUSTS.FAILURE,
  };
}

// export function shouldFetchRecommended(state) {
//   const results = state.recommendedIllust;
//   if (results && results.loading) {
//     return false;
//   } else {
//     return true;
//   }
// }

// function fetchRecommendedFromApi(options, nextUrl) {
//   return dispatch => {
//     const promise = nextUrl ? pixiv.requestUrl(nextUrl) : pixiv.illustRecommended(options);
//     const params = qs.parse(nextUrl);
//     const offset = params.offset || "0";
//     dispatch(requestRecommended(false, offset, nextUrl));
//     return promise
//       .then(json => {
//         const normalized = normalize(json.illusts, Schemas.ILLUST_ARRAY);
//         dispatch(receiveRecommended(normalized, json.next_url, false, offset, nextUrl));
//       })
//       .catch(err => {
//         dispatch(stopRecommended());
//         dispatch(addError(err));
//       });
//   };
// }

// function fetchRecommendedPublicFromApi(options, nextUrl) {
//   return dispatch => {
//     const promise = nextUrl ? pixiv.requestUrl(nextUrl) : pixiv.illustRecommendedPublic(options);
//     const params = qs.parse(nextUrl);
//     const offset = params.offset || "0";
//     dispatch(requestRecommended(true, offset, nextUrl));
//     return promise
//       .then(json => {
//         const normalized = normalize(json.illusts, Schemas.ILLUST_ARRAY);
//         dispatch(receiveRecommended(normalized, json.next_url, true, offset, nextUrl));
//       })
//       .catch(err => {
//         dispatch(stopRecommended());
//         dispatch(addError(err));
//       });
//   };
// }

// export function fetchRecommendedIllusts(options, nextUrl) {
//   return (dispatch, getState) => {
//     const state = getState();
//     if (shouldFetchRecommended(state)) {
//       const { auth: { user } } = state;
//       if (user) {
//         return dispatch(fetchRecommendedFromApi(options, nextUrl));
//       }
//       else {
//         return dispatch(fetchRecommendedPublicFromApi(options, nextUrl));
//       }
//     }
//   };
// }

export function fetchRecommendedIllusts(options, nextUrl, refreshing = false) {
  const params = qs.parse(nextUrl);
  const offset = params.offset || "0";
  return {
    type: RECOMMENDED_ILLUSTS.REQUEST,
    payload: {
      offset,
      nextUrl,
      refreshing
    }
  };
}

export function clearRecommendedIllusts() {
  return {
    type: RECOMMENDED_ILLUSTS.CLEAR
  };
}