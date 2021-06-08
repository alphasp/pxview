/* eslint-disable max-len, no-confusing-arrow */
/* eslint-env es6 */

import { createSelector, createSelectorCreator } from 'reselect';
import equals from 'shallow-equals';
import { denormalize } from 'normalizr';
import remoteConfig from '@react-native-firebase/remote-config';
import parseNovelText from '../helpers/novelTextParser';
import Schemas from '../constants/schemas';
import { READING_DIRECTION_TYPES } from '../constants';

const defaultArray = [];
const defaultObject = {};

function getNonMutedTagsAndUsersItems(isHideMute, items, muteTags, muteUsers) {
  if (!items || !items.length) {
    return defaultArray;
  }
  let filteredItems = items;

  const enableServerFiltering = remoteConfig()
    .getValue('enableServerFiltering')
    .asBoolean();
  if (enableServerFiltering) {
    const tagBlackListRaw = remoteConfig().getValue('tagBlackList').asString();
    if (tagBlackListRaw) {
      const tagBlackList = tagBlackListRaw.split(',');
      filteredItems = items.filter((item) => {
        const hasMutedTag = item.tags.some((tag) => {
          return (
            tagBlackList.includes(tag.name) ||
            tagBlackList.includes(tag.translated_name)
          );
        });
        return !hasMutedTag;
      });
    }
  }

  if (isHideMute) {
    filteredItems = filteredItems.filter((item) => {
      const hasMutedTag = item.tags.some((tag) => {
        return (
          muteTags.includes(tag.name) || muteTags.includes(tag.translated_name)
        );
      });
      const isMutedUser = muteUsers.some((m) => m.id === item.user.id);
      return !hasMutedTag && !isMutedUser;
    });
  }
  return filteredItems;
}

function getNonMutedUsersItems(isHideMute, items, muteUsers) {
  if (!items || !items.length) {
    return defaultArray;
  }
  let filteredItems = items;

  if (isHideMute) {
    filteredItems = items.filter((item) => {
      const isMutedUser = muteUsers.some((m) => m.id === item.user.id);
      return !isMutedUser;
    });
    return filteredItems;
  }
  const enableServerFiltering = remoteConfig()
    .getValue('enableServerFiltering')
    .asBoolean();
  if (enableServerFiltering) {
    const tagBlackListRaw = remoteConfig().getValue('tagBlackList').asString();
    if (tagBlackListRaw) {
      const tagBlackList = tagBlackListRaw.split(',');

      filteredItems = filteredItems.map((item) => {
        return {
          ...item,
          illusts: item.illusts.filter((illust) => {
            const hasMutedTag = illust.tags.some((tag) => {
              return (
                tagBlackList.includes(tag.name) ||
                tagBlackList.includes(tag.translated_name)
              );
            });
            return !hasMutedTag;
          }),
        };
      });
    }
  }
  return filteredItems;
}

function getNonMutedTagsItems(items, muteTags) {
  if (!items || !items.length) {
    return defaultArray;
  }
  const filteredItems = items.filter((item) => {
    const hasMutedTag =
      muteTags.includes(item.tag) || muteTags.includes(item.translated_name);
    return !hasMutedTag;
  });
  return filteredItems;
}

function defaultEqualityCheck(currentVal, previousVal) {
  return currentVal === previousVal;
}

function specialMemoize(
  func,
  resultEqCheck,
  argEqCheck = defaultEqualityCheck,
) {
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
const selectEntities = (state) => state.entities;
const selectRanking = (state) => state.ranking;
const selectWalkthroughIllusts = (state) => state.walkthroughIllusts;
const selectRecommendedIllusts = (state) => state.recommendedIllusts;
const selectRecommendedMangas = (state) => state.recommendedMangas;
const selectRecommendedNovels = (state) => state.recommendedNovels;
const selectTrendingIllustTags = (state) => state.trendingIllustTags;
const selectTrendingNovelTags = (state) => state.trendingNovelTags;
const selectSearchIllusts = (state) => state.searchIllusts;
const selectSearchNovels = (state) => state.searchNovels;
const selectRelatedIllusts = (state) => state.relatedIllusts;
const selectFollowingUserIllusts = (state) => state.followingUserIllusts;
const selectFollowingUserNovels = (state) => state.followingUserNovels;
const selectNewIllusts = (state) => state.newIllusts;
const selectNewMangas = (state) => state.newMangas;
const selectNewNovels = (state) => state.newNovels;
const selectMyPixivIllusts = (state) => state.myPixivIllusts;
const selectMyPixivNovels = (state) => state.myPixivNovels;
const selectUserBookmarkIllusts = (state) => state.userBookmarkIllusts;
const selectMyPrivateBookmarkIllusts = (state) =>
  state.myPrivateBookmarkIllusts;
const selectUserBookmarkNovels = (state) => state.userBookmarkNovels;
const selectMyPrivateBookmarkNovels = (state) => state.myPrivateBookmarkNovels;
const selectUserIllusts = (state) => state.userIllusts;
const selectUserMangas = (state) => state.userMangas;
const selectUserNovels = (state) => state.userNovels;

const selectRecommendedUsers = (state) => state.recommendedUsers;
const selectSearchUsersAutoComplete = (state) => state.searchUsersAutoComplete;
const selectUserFollowing = (state) => state.userFollowing;
const selectUserFollowers = (state) => state.userFollowers;
const selectUserMyPixiv = (state) => state.userMyPixiv;
const selectSearchUsers = (state) => state.searchUsers;

const selectUserDetail = (state) => state.userDetail;

const selectIllustComments = (state) => state.illustComments;
const selectNovelComments = (state) => state.novelComments;
const selectIllustCommentReplies = (state) => state.illustCommentReplies;
const selectNovelCommentReplies = (state) => state.novelCommentReplies;

const selectNovelSeries = (state) => state.novelSeries;
const selectNovelText = (state) => state.novelText;

const selectBrowsingHistoryIllusts = (state) => state.browsingHistoryIllusts;
const selectBrowsingHistoryNovels = (state) => state.browsingHistoryNovels;

const selectHighlightTags = (state) => state.highlightTags.items;

const selectMuteSettings = (state) => state.muteSettings;
const selectMuteTags = (state) => state.muteTags.items;
const selectMuteUsers = (state) => state.muteUsers.items;

const selectReadingSettings = (state) => state.readingSettings;

export const getAuth = (state) => state.auth;
export const getAuthUser = (state) => state.auth.user;
export const getLang = (state) => state.i18n.lang;

const createIllustItemsSelector = createSelectorCreator(
  specialMemoize,
  (prev, next) => {
    if (!prev && !next) {
      return false;
    }
    return equals(
      prev,
      next,
      (p, n) =>
        p.id === n.id &&
        p.is_bookmarked === n.is_bookmarked &&
        p.user.is_followed === n.user.is_followed,
    );
  },
);

const createIllustItemSelector = createSelectorCreator(
  specialMemoize,
  (prev, next) => {
    if (!prev || !next) {
      return false;
    }
    return (
      prev.id === next.id &&
      prev.is_bookmarked === next.is_bookmarked &&
      (prev.user && prev.user.is_followed) ===
        (next.user && next.user.is_followed)
    );
  },
);

const createNovelItemsSelector = createSelectorCreator(
  specialMemoize,
  (prev, next) => {
    if (!prev && !next) {
      return false;
    }
    return equals(
      prev,
      next,
      (p, n) =>
        p.id === n.id &&
        p.is_bookmarked === n.is_bookmarked &&
        p.user.is_followed === n.user.is_followed,
    );
  },
);

const createNovelItemSelector = createSelectorCreator(
  specialMemoize,
  (prev, next) => {
    if (!prev || !next) {
      return false;
    }
    return (
      prev.id === next.id &&
      prev.is_bookmarked === next.is_bookmarked &&
      (prev.user && prev.user.is_followed) ===
        (next.user && next.user.is_followed)
    );
  },
);

const createUserItemsSelector = createSelectorCreator(
  specialMemoize,
  (prev, next) => {
    if (!prev && !next) {
      return false;
    }
    return equals(
      prev,
      next,
      (p, n) => p.id === n.id && p.is_followed === n.is_followed,
    );
  },
);

const createUserPreviewItemsSelector = createSelectorCreator(
  specialMemoize,
  (prev, next) => {
    if (!prev && !next) {
      return false;
    }
    return equals(
      prev,
      next,
      (p, n) => p.id === n.id && p.user.is_followed === n.user.is_followed,
    );
  },
);

const createUserItemSelector = createSelectorCreator(
  specialMemoize,
  (prev, next) => {
    if (!prev || !next) {
      return false;
    }
    return prev.id === next.id && prev.is_followed === next.is_followed;
  },
);

const createUserDetailItemSelector = createSelectorCreator(
  specialMemoize,
  (prev, next) => {
    if (!prev || !next) {
      return false;
    }
    return (
      prev.id === next.id &&
      (prev.user && prev.user.is_followed) ===
        (next.user && next.user.is_followed)
    );
  },
);

const createMuteUserItemsSelector = createSelectorCreator(
  specialMemoize,
  (prev, next) => {
    if (!prev && !next) {
      return false;
    }
    return equals(
      prev,
      next,
      (p, n) => p.id === n.id && p.is_followed === n.is_followed,
    );
  },
);

const createTagItemsSelector = createSelectorCreator(
  specialMemoize,
  (prev, next) => {
    if (!prev && !next) {
      return false;
    }
    return equals(prev, next, (p, n) => p.tag === n.tag);
  },
);

const createTagsWithStatusSelector = createSelectorCreator(
  specialMemoize,
  (prev, next) => {
    if (!prev && !next) {
      return false;
    }
    return equals(
      prev,
      next,
      (p, n) =>
        p.name === n.name &&
        p.isHighlight === n.isHighlight &&
        p.isMute === n.isMute,
    );
  },
);

export const makeGetIllustRankingItems = () =>
  createIllustItemsSelector(
    [
      selectRanking,
      selectMuteSettings,
      selectMuteTags,
      selectMuteUsers,
      selectEntities,
      getProps,
    ],
    (ranking, muteSettings, muteTags, muteUsers, entities, props) => {
      const items = denormalize(
        ranking[props.rankingMode].items,
        Schemas.ILLUST_ARRAY,
        entities,
      );

      return getNonMutedTagsAndUsersItems(
        muteSettings.isHideMute,
        items,
        muteTags,
        muteUsers,
      );
    },
  );

export const makeGetSearchIllustsItems = () =>
  createIllustItemsSelector(
    [
      selectSearchIllusts,
      selectMuteSettings,
      selectMuteTags,
      selectMuteUsers,
      selectEntities,
      getProps,
    ],
    (searchIllusts, muteSettings, muteTags, muteUsers, entities, props) => {
      if (searchIllusts[props.navigationStateKey]) {
        const items = denormalize(
          searchIllusts[props.navigationStateKey].items,
          Schemas.ILLUST_ARRAY,
          entities,
        );
        return getNonMutedTagsAndUsersItems(
          muteSettings.isHideMute,
          items,
          muteTags,
          muteUsers,
        );
      }
      return defaultArray;
    },
  );

export const makeGetSearchNovelsItems = () =>
  createNovelItemsSelector(
    [
      selectSearchNovels,
      selectMuteSettings,
      selectMuteTags,
      selectMuteUsers,
      selectEntities,
      getProps,
    ],
    (searchNovels, muteSettings, muteTags, muteUsers, entities, props) => {
      if (searchNovels[props.navigationStateKey]) {
        const items = denormalize(
          searchNovels[props.navigationStateKey].items,
          Schemas.NOVEL_ARRAY,
          entities,
        );
        return getNonMutedTagsAndUsersItems(
          muteSettings.isHideMute,
          items,
          muteTags,
          muteUsers,
        );
      }
      return defaultArray;
    },
  );

export const makeGetRelatedIllustsItems = () =>
  createIllustItemsSelector(
    [
      selectRelatedIllusts,
      selectMuteSettings,
      selectMuteTags,
      selectMuteUsers,
      selectEntities,
      getProps,
    ],
    (relatedIllusts, muteSettings, muteTags, muteUsers, entities, props) => {
      const illustId = props.illustId || props.route.params.illustId;
      if (relatedIllusts[illustId]) {
        const items = denormalize(
          relatedIllusts[illustId].items,
          Schemas.ILLUST_ARRAY,
          entities,
        );
        return getNonMutedTagsAndUsersItems(
          muteSettings.isHideMute,
          items,
          muteTags,
          muteUsers,
        );
      }
      return defaultArray;
    },
  );

export const makeGetUserBookmarkIllustsItems = () =>
  createIllustItemsSelector(
    [
      selectUserBookmarkIllusts,
      selectMuteSettings,
      selectMuteTags,
      selectMuteUsers,
      selectEntities,
      getProps,
    ],
    (
      userBookmarkIllusts,
      muteSettings,
      muteTags,
      muteUsers,
      entities,
      props,
    ) => {
      const userId =
        props.userId ||
        props.route.params.userId ||
        parseInt(props.route.params.id, 10) ||
        parseInt(props.route.params.uid, 10);
      if (userBookmarkIllusts[userId]) {
        const items = denormalize(
          userBookmarkIllusts[userId].items,
          Schemas.ILLUST_ARRAY,
          entities,
        );
        return getNonMutedTagsAndUsersItems(
          muteSettings.isHideMute,
          items,
          muteTags,
          muteUsers,
        );
      }
      return defaultArray;
    },
  );

export const makeGetUserIllustsItems = () =>
  createIllustItemsSelector(
    [
      selectUserIllusts,
      selectMuteSettings,
      selectMuteTags,
      selectMuteUsers,
      selectEntities,
      getProps,
    ],
    (userIllusts, muteSettings, muteTags, muteUsers, entities, props) => {
      const userId =
        props.userId ||
        props.route.params.userId ||
        parseInt(props.route.params.id, 10) ||
        parseInt(props.route.params.uid, 10);
      if (userIllusts[userId]) {
        const items = denormalize(
          userIllusts[userId].items,
          Schemas.ILLUST_ARRAY,
          entities,
        );
        return getNonMutedTagsAndUsersItems(
          muteSettings.isHideMute,
          items,
          muteTags,
          muteUsers,
        );
      }
      return defaultArray;
    },
  );

export const makeGetUserMangasItems = () =>
  createIllustItemsSelector(
    [
      selectUserMangas,
      selectMuteSettings,
      selectMuteTags,
      selectMuteUsers,
      selectEntities,
      getProps,
    ],
    (userMangas, muteSettings, muteTags, muteUsers, entities, props) => {
      const userId =
        props.userId ||
        props.route.params.userId ||
        parseInt(props.route.params.id, 10) ||
        parseInt(props.route.params.uid, 10);
      if (userMangas[userId]) {
        const items = denormalize(
          userMangas[userId].items,
          Schemas.ILLUST_ARRAY,
          entities,
        );
        return getNonMutedTagsAndUsersItems(
          muteSettings.isHideMute,
          items,
          muteTags,
          muteUsers,
        );
      }
      return defaultArray;
    },
  );

export const makeGetUserNovelsItems = () =>
  createNovelItemsSelector(
    [
      selectUserNovels,
      selectMuteSettings,
      selectMuteTags,
      selectMuteUsers,
      selectEntities,
      getProps,
    ],
    (userNovels, muteSettings, muteTags, muteUsers, entities, props) => {
      const userId =
        props.userId ||
        props.route.params.userId ||
        parseInt(props.route.params.id, 10) ||
        parseInt(props.route.params.uid, 10);
      if (userNovels[userId]) {
        const items = denormalize(
          userNovels[userId].items,
          Schemas.NOVEL_ARRAY,
          entities,
        );
        return getNonMutedTagsAndUsersItems(
          muteSettings.isHideMute,
          items,
          muteTags,
          muteUsers,
        );
      }
      return defaultArray;
    },
  );

export const makeGetUserFollowingItems = () =>
  createUserPreviewItemsSelector(
    [
      selectUserFollowing,
      selectMuteSettings,
      selectMuteUsers,
      selectEntities,
      getProps,
    ],
    (userFollowing, muteSettings, muteUsers, entities, props) => {
      const userId = props.userId || props.route.params.userId;
      const followingType =
        props.followingType || props.route.params.followingType;
      if (userFollowing[followingType][userId]) {
        const items = denormalize(
          userFollowing[followingType][userId].items,
          Schemas.USER_PREVIEW_ARRAY,
          entities,
        );
        return getNonMutedUsersItems(muteSettings.isHideMute, items, muteUsers);
      }
      return defaultArray;
    },
  );

export const makeGetUserFollowersItems = () =>
  createUserPreviewItemsSelector(
    [
      selectUserFollowers,
      selectMuteSettings,
      selectMuteUsers,
      selectEntities,
      getProps,
    ],
    (userFollowers, muteSettings, muteUsers, entities, props) => {
      const userId = props.userId || props.route.params.userId;
      if (userFollowers[userId]) {
        const items = denormalize(
          userFollowers[userId].items,
          Schemas.USER_PREVIEW_ARRAY,
          entities,
        );
        return getNonMutedUsersItems(muteSettings.isHideMute, items, muteUsers);
      }
      return defaultArray;
    },
  );

export const makeGetUserMyPixivItems = () =>
  createUserPreviewItemsSelector(
    [
      selectUserMyPixiv,
      selectMuteSettings,
      selectMuteUsers,
      selectEntities,
      getProps,
    ],
    (userMyPixiv, muteSettings, muteUsers, entities, props) => {
      const userId = props.userId || props.route.params.userId;
      if (userMyPixiv[userId]) {
        const items = denormalize(
          userMyPixiv[userId].items,
          Schemas.USER_PREVIEW_ARRAY,
          entities,
        );
        return getNonMutedUsersItems(muteSettings.isHideMute, items, muteUsers);
      }
      return defaultArray;
    },
  );

export const makeGetSearchUsersItems = () =>
  createUserPreviewItemsSelector(
    [
      selectSearchUsers,
      selectMuteSettings,
      selectMuteUsers,
      selectEntities,
      getProps,
    ],
    (searchUsers, muteSettings, muteUsers, entities, props) => {
      if (searchUsers[props.navigationStateKey]) {
        const items = denormalize(
          searchUsers[props.navigationStateKey].items,
          Schemas.USER_PREVIEW_ARRAY,
          entities,
        );
        return getNonMutedUsersItems(muteSettings.isHideMute, items, muteUsers);
      }
      return defaultArray;
    },
  );

export const makeGetIllustCommentsItems = () =>
  createUserItemsSelector(
    [selectIllustComments, selectEntities, getProps],
    (illustComments, entities, props) => {
      const illustId = props.illustId || props.route.params.illustId;
      return illustComments[illustId]
        ? denormalize(
            illustComments[illustId].items,
            Schemas.ILLUST_COMMENT_ARRAY,
            entities,
          )
        : defaultArray;
    },
  );

export const makeGetNovelRankingItems = () =>
  createNovelItemsSelector(
    [
      selectRanking,
      selectMuteSettings,
      selectMuteTags,
      selectMuteUsers,
      selectEntities,
      getProps,
    ],
    (ranking, muteSettings, muteTags, muteUsers, entities, props) => {
      const items = denormalize(
        ranking[props.rankingMode].items,
        Schemas.NOVEL_ARRAY,
        entities,
      );
      return getNonMutedTagsAndUsersItems(
        muteSettings.isHideMute,
        items,
        muteTags,
        muteUsers,
      );
    },
  );

export const makeGetIllustCommentRepliesItems = () =>
  createUserItemsSelector(
    [selectIllustCommentReplies, selectEntities, getProps],
    (illustCommentReplies, entities, props) => {
      const { commentId } = props;
      return illustCommentReplies[commentId]
        ? denormalize(
            illustCommentReplies[commentId].items,
            Schemas.ILLUST_COMMENT_ARRAY,
            entities,
          )
        : defaultArray;
    },
  );

export const makeGetUserBookmarkNovelsItems = () =>
  createNovelItemsSelector(
    [
      selectUserBookmarkNovels,
      selectMuteSettings,
      selectMuteTags,
      selectMuteUsers,
      selectEntities,
      getProps,
    ],
    (
      userBookmarkNovels,
      muteSettings,
      muteTags,
      muteUsers,
      entities,
      props,
    ) => {
      const userId =
        props.userId ||
        props.route.params.userId ||
        parseInt(props.route.params.id, 10) ||
        parseInt(props.route.params.uid, 10);
      if (userBookmarkNovels[userId]) {
        const items = denormalize(
          userBookmarkNovels[userId].items,
          Schemas.NOVEL_ARRAY,
          entities,
        );
        return getNonMutedTagsAndUsersItems(
          muteSettings.isHideMute,
          items,
          muteTags,
          muteUsers,
        );
      }
      return defaultArray;
    },
  );

export const makeGetNovelCommentsItems = () =>
  createUserItemsSelector(
    [selectNovelComments, selectEntities, getProps],
    (novelComments, entities, props) => {
      const novelId = props.novelId || props.route.params.novelId;
      return novelComments[novelId]
        ? denormalize(
            novelComments[novelId].items,
            Schemas.NOVEL_COMMENT_ARRAY,
            entities,
          )
        : defaultArray;
    },
  );

export const makeGetNovelCommentRepliesItems = () =>
  createUserItemsSelector(
    [selectNovelCommentReplies, selectEntities, getProps],
    (novelCommentReplies, entities, props) => {
      const { commentId } = props;
      return novelCommentReplies[commentId]
        ? denormalize(
            novelCommentReplies[commentId].items,
            Schemas.NOVEL_COMMENT_ARRAY,
            entities,
          )
        : defaultArray;
    },
  );

export const makeGetNovelSeriesItems = () =>
  createNovelItemsSelector(
    [selectNovelSeries, selectEntities, getProps],
    (novelSeries, entities, props) => {
      const seriesId = props.seriesId || props.route.params.seriesId;
      return novelSeries[seriesId]
        ? denormalize(
            novelSeries[seriesId].items,
            Schemas.NOVEL_ARRAY,
            entities,
          )
        : defaultArray;
    },
  );

export const makeGetParsedNovelText = () =>
  createSelector(
    [selectNovelText, selectReadingSettings, getProps],
    (novelText, readingSettings, props) => {
      const novelId = props.novelId || props.route.params.novelId;
      if (novelText[novelId] && novelText[novelId].text) {
        if (
          readingSettings.novelReadingDirection ===
          READING_DIRECTION_TYPES.RIGHT_TO_LEFT
        ) {
          return parseNovelText(novelText[novelId].text).reverse();
        }
        return parseNovelText(novelText[novelId].text);
      }
      return null;
    },
  );

export const makeGetUserItem = () =>
  createUserItemSelector([selectEntities, getProps], (entities, props) => {
    const userId = props.userId || props.route.params.userId;
    return (
      denormalize(userId, Schemas.USER, entities) ||
      denormalize(userId, Schemas.USER_PROFILE, entities)
    );
  });

const makeGetUserDetailItem = () =>
  createUserDetailItemSelector(
    [selectUserDetail, selectEntities, getProps],
    (userDetail, entities, props) => {
      const userId =
        props.userId ||
        props.route.params.userId ||
        parseInt(props.route.params.id, 10) ||
        parseInt(props.route.params.uid, 10);
      return userDetail[userId]
        ? denormalize(userDetail[userId].item, Schemas.USER_PROFILE, entities)
        : defaultObject;
    },
  );

export const makeGetUserDetailPageItems = () => {
  const getUserDetailItem = makeGetUserDetailItem();
  const getUserIllustsItems = makeGetUserIllustsItems();
  const getUserMangasItems = makeGetUserMangasItems();
  const getUserNovelsItems = makeGetUserNovelsItems();
  const getUserBookmarkIllustsItems = makeGetUserBookmarkIllustsItems();
  const getUserBookmarkNovelsItems = makeGetUserBookmarkNovelsItems();

  return createSelector(
    [
      getUserDetailItem,
      getUserIllustsItems,
      getUserMangasItems,
      getUserNovelsItems,
      getUserBookmarkIllustsItems,
      getUserBookmarkNovelsItems,
      getProps,
    ],
    (
      userDetailItem,
      userIllustsItems,
      userMangasItems,
      userNovelsItems,
      userBookmarkIllustsItems,
      userBookmarkNovelsItems,
    ) => ({
      userDetailItem,
      userIllustsItems,
      userMangasItems,
      userNovelsItems,
      userBookmarkIllustsItems,
      userBookmarkNovelsItems,
    }),
  );
};

export const makeGetDetailItem = () =>
  createIllustItemSelector([selectEntities, getProps], (entities, props) => {
    const {
      illust_id: illustIdFromQS, // from deep link query string
      illustId, // from deep link params
      items,
      index,
    } = props.route.params;
    let id;
    if (illustIdFromQS) {
      id = parseInt(illustIdFromQS, 10);
    } else if (illustId) {
      id = parseInt(illustId, 10);
    } else {
      id = items[index].id;
    }
    return denormalize(id, Schemas.ILLUST, entities);
  });

export const makeGetDetailNovelItem = () =>
  createNovelItemSelector([selectEntities, getProps], (entities, props) => {
    const {
      id: novelIdFromQS, // from deep link query string
      novelId, // from deep link params
      items,
      index,
    } = props.route.params;
    let id;
    if (novelIdFromQS) {
      id = parseInt(novelIdFromQS, 10);
    } else if (novelId) {
      id = parseInt(novelId, 10);
    } else {
      id = items[index].id;
    }
    return denormalize(id, Schemas.NOVEL, entities);
  });

export const makeGetIllustItem = () =>
  createIllustItemSelector([selectEntities, getProps], (entities, props) => {
    const { illustId } = props;
    return denormalize(illustId, Schemas.ILLUST, entities);
  });

export const makeGetNovelItem = () =>
  createNovelItemSelector([selectEntities, getProps], (entities, props) => {
    const { novelId } = props;
    return denormalize(novelId, Schemas.NOVEL, entities);
  });

export const makeGetTagsWithStatus = () =>
  createTagsWithStatusSelector(
    [selectHighlightTags, selectMuteTags, getProps],
    (highlightTags, muteTags, { item }) => {
      if (item && item.tags && item.tags.length) {
        return item.tags.map((tag) => ({
          ...tag,
          isHighlight: highlightTags.includes(tag.name),
          isMute: muteTags.includes(tag.name),
        }));
      }
      return defaultArray;
    },
  );

export const getWalkthroughIllustsItems = createIllustItemsSelector(
  [selectWalkthroughIllusts, selectEntities],
  (walkthroughIllusts, entities) =>
    denormalize(walkthroughIllusts.items, Schemas.ILLUST_ARRAY, entities),
);

export const getRecommendedIllustsItems = createIllustItemsSelector(
  [
    selectRecommendedIllusts,
    selectMuteSettings,
    selectMuteTags,
    selectMuteUsers,
    selectEntities,
  ],
  (recommendedIllusts, muteSettings, muteTags, muteUsers, entities) => {
    const items = denormalize(
      recommendedIllusts.items,
      Schemas.ILLUST_ARRAY,
      entities,
    );
    return getNonMutedTagsAndUsersItems(
      muteSettings.isHideMute,
      items,
      muteTags,
      muteUsers,
    );
  },
);

export const getRecommendedMangasItems = createIllustItemsSelector(
  [
    selectRecommendedMangas,
    selectMuteSettings,
    selectMuteTags,
    selectMuteUsers,
    selectEntities,
  ],
  (recommendedMangas, muteSettings, muteTags, muteUsers, entities) => {
    const items = denormalize(
      recommendedMangas.items,
      Schemas.ILLUST_ARRAY,
      entities,
    );
    return getNonMutedTagsAndUsersItems(
      muteSettings.isHideMute,
      items,
      muteTags,
      muteUsers,
    );
  },
);

export const getRecommendedNovelsItems = createIllustItemsSelector(
  [
    selectRecommendedNovels,
    selectMuteSettings,
    selectMuteTags,
    selectMuteUsers,
    selectEntities,
  ],
  (recommendedNovels, muteSettings, muteTags, muteUsers, entities) => {
    const items = denormalize(
      recommendedNovels.items,
      Schemas.NOVEL_ARRAY,
      entities,
    );
    return getNonMutedTagsAndUsersItems(
      muteSettings.isHideMute,
      items,
      muteTags,
      muteUsers,
    );
  },
);

export const getFollowingUserIllustsItems = createIllustItemsSelector(
  [
    selectFollowingUserIllusts,
    selectMuteSettings,
    selectMuteTags,
    selectMuteUsers,
    selectEntities,
  ],
  (followingUserIllusts, muteSettings, muteTags, muteUsers, entities) => {
    const items = denormalize(
      followingUserIllusts.items,
      Schemas.ILLUST_ARRAY,
      entities,
    );
    return getNonMutedTagsAndUsersItems(
      muteSettings.isHideMute,
      items,
      muteTags,
      muteUsers,
    );
  },
);

export const getFollowingUserNovelsItems = createIllustItemsSelector(
  [
    selectFollowingUserNovels,
    selectMuteSettings,
    selectMuteTags,
    selectMuteUsers,
    selectEntities,
  ],
  (followingUserNovels, muteSettings, muteTags, muteUsers, entities) => {
    const items = denormalize(
      followingUserNovels.items,
      Schemas.NOVEL_ARRAY,
      entities,
    );
    return getNonMutedTagsAndUsersItems(
      muteSettings.isHideMute,
      items,
      muteTags,
      muteUsers,
    );
  },
);

export const getNewIllustsItems = createIllustItemsSelector(
  [
    selectNewIllusts,
    selectMuteSettings,
    selectMuteTags,
    selectMuteUsers,
    selectEntities,
  ],
  (newIllusts, muteSettings, muteTags, muteUsers, entities) => {
    const items = denormalize(newIllusts.items, Schemas.ILLUST_ARRAY, entities);
    return getNonMutedTagsAndUsersItems(
      muteSettings.isHideMute,
      items,
      muteTags,
      muteUsers,
    );
  },
);

export const getNewMangasItems = createIllustItemsSelector(
  [
    selectNewMangas,
    selectMuteSettings,
    selectMuteTags,
    selectMuteUsers,
    selectEntities,
  ],
  (newMangas, muteSettings, muteTags, muteUsers, entities) => {
    const items = denormalize(newMangas.items, Schemas.ILLUST_ARRAY, entities);
    return getNonMutedTagsAndUsersItems(
      muteSettings.isHideMute,
      items,
      muteTags,
      muteUsers,
    );
  },
);

export const getNewNovelsItems = createIllustItemsSelector(
  [
    selectNewNovels,
    selectMuteSettings,
    selectMuteTags,
    selectMuteUsers,
    selectEntities,
  ],
  (newNovels, muteSettings, muteTags, muteUsers, entities) => {
    const items = denormalize(newNovels.items, Schemas.NOVEL_ARRAY, entities);
    return getNonMutedTagsAndUsersItems(
      muteSettings.isHideMute,
      items,
      muteTags,
      muteUsers,
    );
  },
);

export const getMyPixivIllustsItems = createIllustItemsSelector(
  [
    selectMyPixivIllusts,
    selectMuteSettings,
    selectMuteTags,
    selectMuteUsers,
    selectEntities,
  ],
  (myPixivIllusts, muteSettings, muteTags, muteUsers, entities) => {
    const items = denormalize(
      myPixivIllusts.items,
      Schemas.ILLUST_ARRAY,
      entities,
    );
    return getNonMutedTagsAndUsersItems(
      muteSettings.isHideMute,
      items,
      muteTags,
      muteUsers,
    );
  },
);

export const getMyPixivNovelsItems = createIllustItemsSelector(
  [
    selectMyPixivNovels,
    selectMuteSettings,
    selectMuteTags,
    selectMuteUsers,
    selectEntities,
  ],
  (myPixivNovels, muteSettings, muteTags, muteUsers, entities) => {
    const items = denormalize(
      myPixivNovels.items,
      Schemas.NOVEL_ARRAY,
      entities,
    );
    return getNonMutedTagsAndUsersItems(
      muteSettings.isHideMute,
      items,
      muteTags,
      muteUsers,
    );
  },
);

export const getMyPrivateBookmarkIllustsItems = createIllustItemsSelector(
  [
    selectMyPrivateBookmarkIllusts,
    selectMuteSettings,
    selectMuteTags,
    selectMuteUsers,
    selectEntities,
  ],
  (myPrivateBookmarkIllusts, muteSettings, muteTags, muteUsers, entities) => {
    const items = denormalize(
      myPrivateBookmarkIllusts.items,
      Schemas.ILLUST_ARRAY,
      entities,
    );
    return getNonMutedTagsAndUsersItems(
      muteSettings.isHideMute,
      items,
      muteTags,
      muteUsers,
    );
  },
);

export const getMyPrivateBookmarkNovelsItems = createIllustItemsSelector(
  [
    selectMyPrivateBookmarkNovels,
    selectMuteSettings,
    selectMuteTags,
    selectMuteUsers,
    selectEntities,
  ],
  (myPrivateBookmarkNovels, muteSettings, muteTags, muteUsers, entities) => {
    const items = denormalize(
      myPrivateBookmarkNovels.items,
      Schemas.NOVEL_ARRAY,
      entities,
    );
    return getNonMutedTagsAndUsersItems(
      muteSettings.isHideMute,
      items,
      muteTags,
      muteUsers,
    );
  },
);

export const getTrendingIllustTagsItems = createTagItemsSelector(
  [
    selectTrendingIllustTags,
    selectMuteSettings,
    selectMuteTags,
    selectEntities,
  ],
  (trendingIllustTags, muteSettings, muteTags, entities) => {
    const items = denormalize(
      trendingIllustTags.items,
      Schemas.ILLUST_TAG_ARRAY,
      entities,
    );
    if (muteSettings.isHideMute) {
      return getNonMutedTagsItems(items, muteTags);
    }
    return items;
  },
);

export const getTrendingNovelTagsItems = createTagItemsSelector(
  [selectTrendingNovelTags, selectMuteSettings, selectMuteTags, selectEntities],
  (trendingNovelTags, muteSettings, muteTags, entities) => {
    const items = denormalize(
      trendingNovelTags.items,
      Schemas.ILLUST_TAG_ARRAY,
      entities,
    );
    if (muteSettings.isHideMute) {
      return getNonMutedTagsItems(items, muteTags);
    }
    return items;
  },
);

export const getRecommendedUsersItems = createUserPreviewItemsSelector(
  [selectRecommendedUsers, selectMuteSettings, selectMuteUsers, selectEntities],
  (recommendedUsers, muteSettings, muteUsers, entities) => {
    const items = denormalize(
      recommendedUsers.items,
      Schemas.USER_PREVIEW_ARRAY,
      entities,
    );
    return getNonMutedUsersItems(muteSettings.isHideMute, items, muteUsers);
  },
);

export const getSearchUsersAutoCompleteItems = createUserPreviewItemsSelector(
  [
    selectSearchUsersAutoComplete,
    selectMuteSettings,
    selectMuteUsers,
    selectEntities,
  ],
  (searchUsersAutoComplete, muteSettings, muteUsers, entities) => {
    const items = denormalize(
      searchUsersAutoComplete.items,
      Schemas.USER_PREVIEW_ARRAY,
      entities,
    );
    return getNonMutedUsersItems(muteSettings.isHideMute, items, muteUsers);
  },
);

export const getBrowsingHistoryIllustsItems = createIllustItemsSelector(
  [selectBrowsingHistoryIllusts, selectEntities],
  (browsingHistoryIllusts, entities) =>
    denormalize(browsingHistoryIllusts.items, Schemas.ILLUST_ARRAY, entities),
);

export const getBrowsingHistoryNovelsItems = createNovelItemsSelector(
  [selectBrowsingHistoryNovels, selectEntities],
  (browsingHistoryNovels, entities) =>
    denormalize(browsingHistoryNovels.items, Schemas.NOVEL_ARRAY, entities),
);

export const getMuteUsersItems = createMuteUserItemsSelector(
  [selectMuteUsers, selectEntities],
  (muteUsers, entities) => denormalize(muteUsers, Schemas.USER_ARRAY, entities),
);
