import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigationState, useScrollToTop } from '@react-navigation/native';
import IllustList from '../../components/IllustList';
import {
  fetchRecommendedIllusts,
  clearRecommendedIllusts,
} from '../../common/actions/recommendedIllusts';
import { getRecommendedIllustsItems } from '../../common/selectors';

const RecommendedIllusts = (props) => {
  const { active } = props;
  const scrollableRef = useRef(null);
  const dummyRef = useRef(null);
  const dispatch = useDispatch();
  const allState = useSelector((state) => state);
  const recommendedIllusts = useSelector((state) => state.recommendedIllusts);
  const navigationState = useNavigationState((state) => state);
  const items = getRecommendedIllustsItems(allState, props);
  const listKey = `${navigationState.key}-recommendedIllusts`;

  // only apply scroll to top when current tab is active
  useScrollToTop(active ? scrollableRef : dummyRef);

  useEffect(() => {
    dispatch(clearRecommendedIllusts());
    dispatch(fetchRecommendedIllusts());
  }, [dispatch]);

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
      ref={scrollableRef}
      data={{ ...recommendedIllusts, items }}
      listKey={listKey}
      loadMoreItems={loadMoreItems}
      onRefresh={handleOnRefresh}
    />
  );
};

export default RecommendedIllusts;
