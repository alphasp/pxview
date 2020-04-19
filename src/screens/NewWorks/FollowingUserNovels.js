import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigationState, useScrollToTop } from '@react-navigation/native';
import NovelList from '../../components/NovelList';
import {
  clearFollowingUserNovels,
  fetchFollowingUserNovels,
} from '../../common/actions/followingUserNovels';
import { getFollowingUserNovelsItems } from '../../common/selectors';
import usePrevious from '../../common/hooks/usePrevious';

const FollowingUserNovels = (props) => {
  const { active, options, renderEmpty, renderHeader } = props;
  const scrollableRef = useRef(null);
  const dummyRef = useRef(null);
  const dispatch = useDispatch();
  const allState = useSelector((state) => state);
  const followingUserNovels = useSelector((state) => state.followingUserNovels);
  const navigationState = useNavigationState((state) => state);
  const prevOptions = usePrevious(options);
  const items = getFollowingUserNovelsItems(allState, props);
  const listKey = `${navigationState.key}-followingUserNovels`;

  // only apply scroll to top when current tab is active
  useScrollToTop(active ? scrollableRef : dummyRef);

  useEffect(() => {
    if (
      !followingUserNovels.loaded ||
      (followingUserNovels.loaded &&
        prevOptions !== undefined &&
        prevOptions !== options)
    ) {
      dispatch(clearFollowingUserNovels());
      dispatch(fetchFollowingUserNovels(options));
    }
  }, [dispatch, followingUserNovels.loaded, options, prevOptions]);

  // useEffect(() => {

  // }, [dispatch, options, prevOptions])

  const loadMoreItems = () => {
    if (!followingUserNovels.loading && followingUserNovels.nextUrl) {
      dispatch(fetchFollowingUserNovels(null, followingUserNovels.nextUrl));
    }
  };

  const handleOnRefresh = () => {
    dispatch(clearFollowingUserNovels());
    dispatch(fetchFollowingUserNovels(options, null, true));
  };

  return (
    <NovelList
      ref={scrollableRef}
      data={{ ...followingUserNovels, items }}
      listKey={listKey}
      loadMoreItems={loadMoreItems}
      onRefresh={handleOnRefresh}
      renderEmpty={renderEmpty}
      renderHeader={renderHeader}
      onEndReachedThreshold={0.3}
    />
  );
};

export default FollowingUserNovels;
