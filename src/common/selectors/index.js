import { createSelector, createSelectorCreator } from 'reselect';
import equals from 'shallow-equals';
import { denormalize } from 'normalizr';
import Schemas from '../constants/schemas';

function defaultEqualityCheck(currentVal, previousVal) {
  return currentVal === previousVal;
}

// function resultCheckMemoize (func, resultCheck = defaultEqualityCheck, argsCheck = defaultEqualityCheck) {
//   let lastArgs = null
//   let lastResult = null
//   return (...args) => {
//     if (lastArgs !== null &&
//       lastArgs.length === args.length &&
//       args.every((value, index) => argsCheck(value, lastArgs[index]))) {
//       return lastResult
//     }
//     lastArgs = args
//     let result = func(...args)
//     return resultCheck(lastResult, result) ? lastResult : (lastResult = result)
//   }
// }

function specialMemoize(func, resultEqCheck, argEqCheck = defaultEqualityCheck) {
  let lastArgs = null;
  let lastResult = null;
  const isEqualToLastArg = (value, index) => argEqCheck(value, lastArgs[index]);
  return (...args) => {
    if (
      lastArgs === null ||
      lastArgs.length !== args.length ||
      !args.every(isEqualToLastArg)
    ) {
      // Only update result if it has changed according to resultEqCheck
      const nextResult = func(...args);
      if (!resultEqCheck(lastResult, nextResult)) {
        lastResult = nextResult;
      }
    }
    lastArgs = args;
    return lastResult;
  };
}

const getProps = (state, props) => props;
const selectEntities = state => state.entities;
const selectRanking = state => state.ranking;
const selectRecommendedIllusts = state => state.recommendedIllusts;
const selectRecommendedMangas = state => state.recommendedMangas;
const selectTrendingIllustTags = state => state.trendingIllustTags;
const selectSearch = state => state.search;
const selectRelatedIllusts = state => state.relatedIllusts;
const selectFollowingUserIllusts = state => state.followingUserIllusts;
const selectNewIllusts = state => state.newIllusts;
const selectNewMangas = state => state.newMangas;
const selectMyPixiv = state => state.myPixiv;
const selectUserBookmarkIllusts = state => state.userBookmarkIllusts;
const selectMyPrivateBookmarkIllusts = state => state.myPrivateBookmarkIllusts;
const selectUserIllusts = state => state.userIllusts;
const selectUserMangas = state => state.userMangas;

const selectRecommendedUsers = state => state.recommendedUsers;
const selectSearchUsersAutoComplete = state => state.searchUsersAutoComplete;
const selectUserFollowing = state => state.userFollowing;
const selectUserFollowers = state => state.userFollowers;
const selectUserMyPixiv = state => state.userMyPixiv;
const selectSearchUsers = state => state.searchUsers;

const selectUserDetail = state => state.userDetail;

const selectIllustComments = state => state.illustComments;

const defaultArray = [];
const defaultObject = {};

export const getAuthUser = state => state.auth.user;

const createIllustItemsSelector = createSelectorCreator(specialMemoize, (prev, next) => {
  if (!prev && !next) {
    return false;
  }
  // console.log(equals(prev, next, (p, n) => {
  //   return (p.id === n.id) && (p.is_bookmarked === n.is_bookmarked) && (p.user.is_followed === n.user.is_followed)
  // }));
  return equals(prev, next, (p, n) => (p.id === n.id) && (p.is_bookmarked === n.is_bookmarked) && (p.user.is_followed === n.user.is_followed));
});

const createUserItemsSelector = createSelectorCreator(specialMemoize, (prev, next) => {
  if (!prev && !next) {
    return false;
  }
  // console.log('user preview selector ', equals(prev, next, (p, n) => {
  //   return (p.id === n.id) && (p.user.is_followed === n.user.is_followed)
  // }));
  return equals(prev, next, (p, n) => (p.id === n.id) && (p.user.is_followed === n.user.is_followed));
});

const createUserItemSelector = createSelectorCreator(specialMemoize, (prev, next) => {
  if (!prev && !next) {
    return false;
  }
  return equals(prev, next, (p, n) => (p.id === n.id) && (p.is_followed === n.is_followed));
});

export const makeGetRankingItems = () => createIllustItemsSelector([selectRanking, selectEntities, getProps], (ranking, entities, props) => denormalize(ranking[props.rankingMode].items, Schemas.ILLUST_ARRAY, entities));

export const makeGetSearchItems = () => createIllustItemsSelector([selectSearch, selectEntities, getProps], (search, entities, props) => search[props.navigationStateKey] ?
      denormalize(search[props.navigationStateKey].items, Schemas.ILLUST_ARRAY, entities)
      :
      defaultArray);

export const makeGetRelatedIllustsItems = () => createIllustItemsSelector([selectRelatedIllusts, selectEntities, getProps], (relatedIllusts, entities, props) => {
  const illustId = props.illustId || props.navigation.state.params.illustId;
  return relatedIllusts[illustId] ?
      denormalize(relatedIllusts[illustId].items, Schemas.ILLUST_ARRAY, entities)
      :
      defaultArray;
});

export const makeGetUserBookmarkIllustsItems = () => createIllustItemsSelector([selectUserBookmarkIllusts, selectEntities, getProps], (userBookmarkIllusts, entities, props) => {
  const userId = props.userId || props.navigation.state.params.userId;
  return userBookmarkIllusts[userId] ?
      denormalize(userBookmarkIllusts[userId].items, Schemas.ILLUST_ARRAY, entities)
      :
      defaultArray;
});

export const makeGetUserIllustsItems = () => createIllustItemsSelector([selectUserIllusts, selectEntities, getProps], (userIllusts, entities, props) => {
  const userId = props.userId || props.navigation.state.params.userId;
  return userIllusts[userId] ?
      denormalize(userIllusts[userId].items, Schemas.ILLUST_ARRAY, entities)
      :
      defaultArray;
});

export const makeGetUserMangasItems = () => createIllustItemsSelector([selectUserMangas, selectEntities, getProps], (userMangas, entities, props) => {
  const userId = props.userId || props.navigation.state.params.userId;
  return userMangas[userId] ?
      denormalize(userMangas[userId].items, Schemas.ILLUST_ARRAY, entities)
      :
      defaultArray;
});

export const makeGetUserFollowingItems = () => createUserItemsSelector([selectUserFollowing, selectEntities, getProps], (userFollowing, entities, props) => {
  const userId = props.userId || props.navigation.state.params.userId;
  const { followingType } = props;
  return userFollowing[followingType][userId] ?
      denormalize(userFollowing[followingType][userId].items, Schemas.USER_PREVIEW_ARRAY, entities)
      :
      defaultArray;
});

export const makeGetUserFollowersItems = () => createUserItemsSelector([selectUserFollowers, selectEntities, getProps], (userFollowers, entities, props) => {
  const userId = props.userId || props.navigation.state.params.userId;
  return userFollowers[userId] ?
      denormalize(userFollowers[userId].items, Schemas.USER_PREVIEW_ARRAY, entities)
      :
      defaultArray;
});

export const makeGetUserMyPixivItems = () => createUserItemsSelector([selectUserMyPixiv, selectEntities, getProps], (userMyPixiv, entities, props) => {
  const userId = props.userId || props.navigation.state.params.userId;
  return userMyPixiv[userId] ?
      denormalize(userMyPixiv[userId].items, Schemas.USER_PREVIEW_ARRAY, entities)
      :
      defaultArray;
});

export const makeGetSearchUsersItems = () => createUserItemsSelector([selectSearchUsers, selectEntities, getProps], (searchUsers, entities, props) => searchUsers[props.navigationStateKey] ?
      denormalize(searchUsers[props.navigationStateKey].items, Schemas.USER_PREVIEW_ARRAY, entities)
      :
      defaultArray);

export const makeGetIllustCommentsItems = () => createUserItemsSelector([selectIllustComments, selectEntities, getProps], (illustComments, entities, props) => {
  const illustId = props.illustId || props.navigation.state.params.illustId;
  return illustComments[illustId] ?
      denormalize(illustComments[illustId].items, Schemas.ILLUST_COMMENT_ARRAY, entities)
      :
      defaultArray;
});

const makeGetUserDetailItem = () => createUserItemSelector([selectUserDetail, selectEntities, getProps], (userDetail, entities, props) => {
  const userId = props.userId || props.navigation.state.params.userId;
  return userDetail[userId] ?
      denormalize(userDetail[userId].item, Schemas.USER_PROFILE, entities)
      :
      defaultObject;
});

export const makeGetUserDetailPageItems = () => {
  const getUserDetailItem = makeGetUserDetailItem();
  const getUserIllustItems = makeGetUserIllustsItems();
  const getUserMangaItems = makeGetUserMangasItems();
  const getUserBookmarkIllustItems = makeGetUserBookmarkIllustsItems();

  return createSelector([getUserDetailItem, getUserIllustItems, getUserMangaItems, getUserBookmarkIllustItems, getProps], (userDetailItem, userIllustsItems, userMangasItems, userBookmarkIllustsItems) => ({
    userDetailItem,
    userIllustsItems,
    userMangasItems,
    userBookmarkIllustsItems,
  }));
};

// export const makeGetDetailItem = () => {
//   return createSelector([selectEntities, getProps], (entities, props) => {
//     const id = props.navigation.state.params.item.id;
//     console.log('gg ', denormalize(id, Schemas.ILLUST, entities))
//     return denormalize(id, Schemas.ILLUST, entities);
//   });
// }

export const getRecommendedIllustsItems = createIllustItemsSelector([selectRecommendedIllusts, selectEntities], (recommendedIllusts, entities) => denormalize(recommendedIllusts.items, Schemas.ILLUST_ARRAY, entities));

export const getRecommendedMangasItems = createIllustItemsSelector([selectRecommendedMangas, selectEntities], (recommendedMangas, entities) => denormalize(recommendedMangas.items, Schemas.ILLUST_ARRAY, entities));

export const getFollowingUserIllustsItems = createIllustItemsSelector([selectFollowingUserIllusts, selectEntities], (followingUserIllusts, entities) => denormalize(followingUserIllusts.items, Schemas.ILLUST_ARRAY, entities));

export const getNewIllustsItems = createIllustItemsSelector([selectNewIllusts, selectEntities], (newIllusts, entities) => denormalize(newIllusts.items, Schemas.ILLUST_ARRAY, entities));

export const getNewMangasItems = createIllustItemsSelector([selectNewMangas, selectEntities], (newMangas, entities) => denormalize(newMangas.items, Schemas.ILLUST_ARRAY, entities));

export const getMyPixivItems = createIllustItemsSelector([selectMyPixiv, selectEntities], (myPixiv, entities) => denormalize(myPixiv.items, Schemas.ILLUST_ARRAY, entities));

export const getMyPrivateBookmarkIllustsItems = createIllustItemsSelector([selectMyPrivateBookmarkIllusts, selectEntities], (myPrivateBookmarkIllusts, entities) => denormalize(myPrivateBookmarkIllusts.items, Schemas.ILLUST_ARRAY, entities));

export const getTrendingIllustTagsItems = createSelector([selectTrendingIllustTags, selectEntities], (trendingIllustTags, entities) => denormalize(trendingIllustTags.items, Schemas.ILLUST_TAG_ARRAY, entities));

export const getRecommendedUsersItems = createSelector([selectRecommendedUsers, selectEntities], (recommendedUsers, entities) => denormalize(recommendedUsers.items, Schemas.USER_PREVIEW_ARRAY, entities));

export const getSearchUsersAutoCompleteItems = createSelector([selectSearchUsersAutoComplete, selectEntities], (searchUsersAutoComplete, entities) => denormalize(searchUsersAutoComplete.items, Schemas.USER_PREVIEW_ARRAY, entities));
