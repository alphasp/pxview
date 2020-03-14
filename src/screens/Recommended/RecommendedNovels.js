import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigationState } from '@react-navigation/native';
import NovelList from '../../components/NovelList';
import {
  fetchRecommendedNovels,
  clearRecommendedNovels,
} from '../../common/actions/recommendedNovels';
import { getRecommendedNovelsItems } from '../../common/selectors';

const RecommendedNovels = props => {
  const dispatch = useDispatch();
  const allState = useSelector(state => state);
  const recommendedNovels = useSelector(state => state.recommendedNovels);
  const navigationState = useNavigationState(state => state);
  const items = getRecommendedNovelsItems(allState, props);
  const listKey = `${navigationState.key}-recommendedNovels`;
  useEffect(() => {
    dispatch(clearRecommendedNovels());
    dispatch(fetchRecommendedNovels());
  }, []);

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
      data={{ ...recommendedNovels, items }}
      listKey={listKey}
      loadMoreItems={loadMoreItems}
      onRefresh={handleOnRefresh}
    />
  );
};

export default RecommendedNovels;
