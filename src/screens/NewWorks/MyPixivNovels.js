import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigationState, useScrollToTop } from '@react-navigation/native';
import NovelList from '../../components/NovelList';
import {
  clearMyPixivNovels,
  fetchMyPixivNovels,
} from '../../common/actions/myPixivNovels';
import { getMyPixivNovelsItems } from '../../common/selectors';

const MyPixivNovels = (props) => {
  const { active, renderHeader } = props;
  const scrollableRef = useRef(null);
  const dummyRef = useRef(null);
  const dispatch = useDispatch();
  const allState = useSelector((state) => state);
  const myPixivNovels = useSelector((state) => state.myPixivNovels);
  const navigationState = useNavigationState((state) => state);
  const items = getMyPixivNovelsItems(allState, props);
  const listKey = `${navigationState.key}-myPixivNovels`;

  // only apply scroll to top when current tab is active
  useScrollToTop(active ? scrollableRef : dummyRef);

  useEffect(() => {
    if (!myPixivNovels.loaded) {
      dispatch(clearMyPixivNovels());
      dispatch(fetchMyPixivNovels());
    }
  }, [dispatch, myPixivNovels.loaded]);

  const loadMoreItems = () => {
    if (!myPixivNovels.loading && myPixivNovels.nextUrl) {
      dispatch(fetchMyPixivNovels(myPixivNovels.nextUrl));
    }
  };

  const handleOnRefresh = () => {
    dispatch(clearMyPixivNovels());
    dispatch(fetchMyPixivNovels(null, true));
  };

  return (
    <NovelList
      ref={scrollableRef}
      data={{ ...myPixivNovels, items }}
      listKey={listKey}
      loadMoreItems={loadMoreItems}
      onRefresh={handleOnRefresh}
      renderHeader={renderHeader}
      onEndReachedThreshold={0.3}
    />
  );
};

export default MyPixivNovels;
