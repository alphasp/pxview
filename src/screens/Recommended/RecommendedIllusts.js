import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigationState } from '@react-navigation/native';
import IllustList from '../../components/IllustList';
import {
  fetchRecommendedIllusts,
  clearRecommendedIllusts,
} from '../../common/actions/recommendedIllusts';
import { getRecommendedIllustsItems } from '../../common/selectors';

const RecommendedIllusts = props => {
  const dispatch = useDispatch();
  const allState = useSelector(state => state);
  const recommendedIllusts = useSelector(state => state.recommendedIllusts);
  const navigationState = useNavigationState(state => state);
  const items = getRecommendedIllustsItems(allState, props);
  const listKey = `${navigationState.key}-recommendedIllusts`;
  useEffect(() => {
    dispatch(clearRecommendedIllusts());
    dispatch(fetchRecommendedIllusts());
  }, []);

  const loadMoreItems = () => {
    const { nextUrl, loading } = recommendedIllusts;
    if (!loading && nextUrl) {
      dispatch(fetchRecommendedIllusts(null, nextUrl));
    }
  };

  const handleOnRefresh = () => {
    dispatch(clearRecommendedIllusts());
    dispatch(fetchRecommendedIllusts(null, null, true));
  };

  return (
    <IllustList
      data={{ ...recommendedIllusts, items }}
      listKey={listKey}
      loadMoreItems={loadMoreItems}
      onRefresh={handleOnRefresh}
    />
  );
};

export default RecommendedIllusts;
