import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigationState, useScrollToTop } from '@react-navigation/native';
import IllustList from '../../components/IllustList';
import {
  fetchRecommendedMangas,
  clearRecommendedMangas,
} from '../../common/actions/recommendedMangas';
import { getRecommendedMangasItems } from '../../common/selectors';

const RecommendedMangas = (props) => {
  const { active } = props;
  const scrollableRef = useRef(null);
  const dummyRef = useRef(null);
  const dispatch = useDispatch();
  const allState = useSelector((state) => state);
  const recommendedMangas = useSelector((state) => state.recommendedMangas);
  const navigationState = useNavigationState((state) => state);
  const items = getRecommendedMangasItems(allState, props);
  const listKey = `${navigationState.key}-recommendedMangas`;

  // only apply scroll to top when current tab is active
  useScrollToTop(active ? scrollableRef : dummyRef);

  useEffect(() => {
    dispatch(clearRecommendedMangas());
    dispatch(fetchRecommendedMangas());
  }, [dispatch]);

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
      ref={scrollableRef}
      data={{ ...recommendedMangas, items }}
      listKey={listKey}
      loadMoreItems={loadMoreItems}
      onRefresh={handleOnRefresh}
    />
  );
};

export default RecommendedMangas;
