import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigationState, useScrollToTop } from '@react-navigation/native';
import IllustList from '../../components/IllustList';
import {
  clearFollowingUserIllusts,
  fetchFollowingUserIllusts,
} from '../../common/actions/followingUserIllusts';
import { getFollowingUserIllustsItems } from '../../common/selectors';
import usePrevious from '../../common/hooks/usePrevious';

const FollowingUserIllusts = (props) => {
  const { active, options, renderEmpty, renderHeader } = props;
  const scrollableRef = useRef(null);
  const dummyRef = useRef(null);
  const dispatch = useDispatch();
  const allState = useSelector((state) => state);
  const followingUserIllusts = useSelector(
    (state) => state.followingUserIllusts,
  );
  const navigationState = useNavigationState((state) => state);
  const prevOptions = usePrevious(options);
  const items = getFollowingUserIllustsItems(allState, props);
  const listKey = `${navigationState.key}-followingUserIllusts`;

  // only apply scroll to top when current tab is active
  useScrollToTop(active ? scrollableRef : dummyRef);

  useEffect(() => {
    if (
      !followingUserIllusts.loaded ||
      (followingUserIllusts.loaded &&
        prevOptions !== undefined &&
        prevOptions !== options)
    ) {
      dispatch(clearFollowingUserIllusts());
      dispatch(fetchFollowingUserIllusts(options));
    }
  }, [dispatch, followingUserIllusts.loaded, options, prevOptions]);

  const loadMoreItems = () => {
    if (!followingUserIllusts.loading && followingUserIllusts.nextUrl) {
      dispatch(fetchFollowingUserIllusts(null, followingUserIllusts.nextUrl));
    }
  };

  const handleOnRefresh = () => {
    dispatch(clearFollowingUserIllusts());
    dispatch(fetchFollowingUserIllusts(options, null, true));
  };

  return (
    <IllustList
      ref={scrollableRef}
      data={{ ...followingUserIllusts, items }}
      listKey={listKey}
      loadMoreItems={loadMoreItems}
      onRefresh={handleOnRefresh}
      renderEmpty={renderEmpty}
      renderHeader={renderHeader}
      onEndReachedThreshold={0.3}
    />
  );
};

export default FollowingUserIllusts;
