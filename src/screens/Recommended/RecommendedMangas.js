import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigationState } from '@react-navigation/native';
import IllustList from '../../components/IllustList';
import {
  fetchRecommendedMangas,
  clearRecommendedMangas,
} from '../../common/actions/recommendedMangas';
import { getRecommendedMangasItems } from '../../common/selectors';

const RecommendedMangas = props => {
  const dispatch = useDispatch();
  const allState = useSelector(state => state);
  const recommendedMangas = useSelector(state => state.recommendedMangas);
  const navigationState = useNavigationState(state => state);
  const items = getRecommendedMangasItems(allState, props);
  const listKey = `${navigationState.key}-recommendedMangas`;
  useEffect(() => {
    dispatch(clearRecommendedMangas());
    dispatch(fetchRecommendedMangas());
  }, []);

  const loadMoreItems = () => {
    const { nextUrl, loading } = recommendedMangas;
    if (!loading && nextUrl) {
      dispatch(fetchRecommendedMangas(null, nextUrl));
    }
  };

  const handleOnRefresh = () => {
    dispatch(clearRecommendedMangas());
    dispatch(fetchRecommendedMangas(null, null, true));
  };

  return (
    <IllustList
      data={{ ...recommendedMangas, items }}
      listKey={listKey}
      loadMoreItems={loadMoreItems}
      onRefresh={handleOnRefresh}
    />
  );
};

export default RecommendedMangas;
