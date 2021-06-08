import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useScrollToTop } from '@react-navigation/native';
import UserList from '../../components/UserList';
import {
  clearRecommendedUsers,
  fetchRecommendedUsers,
} from '../../common/actions/recommendedUsers';
import SimpleUserList from '../../components/SimpleUserList';
import SearchHistory from '../../components/SearchHistory';
import { getRecommendedUsersItems } from '../../common/selectors';

const TrendingRecommendedUsers = ({ onPressSearchHistoryItem }) => {
  const ref = useRef();
  const dispatch = useDispatch();
  const allState = useSelector((state) => state);
  const recommendedUsers = useSelector((state) => state.recommendedUsers);
  const { isShowRecommendedUser, isShowRecommendedUserWork } = useSelector(
    (state) => state.trendingSearchSettings,
  );
  const items = getRecommendedUsersItems(allState);
  useScrollToTop(ref);

  useEffect(() => {
    if (!recommendedUsers.loaded) {
      dispatch(clearRecommendedUsers());
      dispatch(fetchRecommendedUsers());
    }
  }, [dispatch, recommendedUsers.loaded]);

  const loadMoreItems = () => {
    if (!recommendedUsers.loading && recommendedUsers.nextUrl) {
      dispatch(fetchRecommendedUsers(null, recommendedUsers.nextUrl));
    }
  };

  const handleOnRefresh = () => {
    dispatch(clearRecommendedUsers());
    dispatch(fetchRecommendedUsers(null, null, true));
  };

  if (!isShowRecommendedUser) {
    return <SearchHistory onPressItem={onPressSearchHistoryItem} />;
  }

  if (isShowRecommendedUserWork) {
    return (
      <UserList
        ref={ref}
        userList={{ ...recommendedUsers, items }}
        loadMoreItems={loadMoreItems}
        onRefresh={handleOnRefresh}
      />
    );
  }
  return (
    <SimpleUserList
      ref={ref}
      data={{ ...recommendedUsers, items }}
      loadMoreItems={loadMoreItems}
      onRefresh={handleOnRefresh}
    />
  );
};

export default TrendingRecommendedUsers;
