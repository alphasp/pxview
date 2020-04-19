import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigationState, useScrollToTop } from '@react-navigation/native';
import NovelList from '../../components/NovelList';
import {
  fetchRecommendedNovels,
  clearRecommendedNovels,
} from '../../common/actions/recommendedNovels';
import { getRecommendedNovelsItems } from '../../common/selectors';

const RecommendedNovels = (props) => {
  const { active } = props;
  const scrollableRef = useRef(null);
  const dummyRef = useRef(null);
  const dispatch = useDispatch();
  const allState = useSelector((state) => state);
  const recommendedNovels = useSelector((state) => state.recommendedNovels);
  const navigationState = useNavigationState((state) => state);
  const items = getRecommendedNovelsItems(allState, props);
  const listKey = `${navigationState.key}-recommendedNovels`;

  // only apply scroll to top when current tab is active
  useScrollToTop(active ? scrollableRef : dummyRef);

  useEffect(() => {
    dispatch(clearRecommendedNovels());
    dispatch(fetchRecommendedNovels());
  }, [dispatch]);

  const loadMoreItems = () => {
    const { nextUrl, loading } = recommendedNovels;
    if (!loading && nextUrl) {
      dispatch(fetchRecommendedNovels(null, nextUrl));
    }
  };

  const handleOnRefresh = () => {
    dispatch(clearRecommendedNovels());
    dispatch(fetchRecommendedNovels(null, null, true));
  };

  return (
    <NovelList
      ref={scrollableRef}
      data={{ ...recommendedNovels, items }}
      listKey={listKey}
      loadMoreItems={loadMoreItems}
      onRefresh={handleOnRefresh}
    />
  );
};

export default RecommendedNovels;
