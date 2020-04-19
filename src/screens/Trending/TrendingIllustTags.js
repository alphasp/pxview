import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useScrollToTop } from '@react-navigation/native';
import IllustTagList from '../../components/IllustTagList';
import {
  clearTrendingIllustTags,
  fetchTrendingIllustTags,
} from '../../common/actions/trendingIllustTags';
import { getTrendingIllustTagsItems } from '../../common/selectors';
import { SEARCH_TYPES } from '../../common/constants';

const TrendingIllustTags = () => {
  const ref = useRef();
  const dispatch = useDispatch();
  const allState = useSelector((state) => state);
  const trendingIllustTags = useSelector((state) => state.trendingIllustTags);
  const items = getTrendingIllustTagsItems(allState);
  useScrollToTop(ref);

  useEffect(() => {
    if (!trendingIllustTags.loaded) {
      dispatch(clearTrendingIllustTags());
      dispatch(fetchTrendingIllustTags());
    }
  }, [dispatch, trendingIllustTags.loaded]);

  const handleOnRefresh = () => {
    dispatch(clearTrendingIllustTags());
    dispatch(fetchTrendingIllustTags(null, true));
  };

  return (
    <IllustTagList
      ref={ref}
      data={{ ...trendingIllustTags, items }}
      onRefresh={handleOnRefresh}
      searchType={SEARCH_TYPES.ILLUST}
    />
  );
};

export default TrendingIllustTags;
