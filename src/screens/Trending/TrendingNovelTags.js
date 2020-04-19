import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useScrollToTop } from '@react-navigation/native';
import IllustTagList from '../../components/IllustTagList';
import {
  clearTrendingNovelTags,
  fetchTrendingNovelTags,
} from '../../common/actions/trendingNovelTags';
import { getTrendingNovelTagsItems } from '../../common/selectors';
import { SEARCH_TYPES } from '../../common/constants';

const TrendingNovelTags = () => {
  const ref = useRef();
  const dispatch = useDispatch();
  const allState = useSelector((state) => state);
  const trendingNovelTags = useSelector((state) => state.trendingNovelTags);
  const items = getTrendingNovelTagsItems(allState);
  useScrollToTop(ref);

  useEffect(() => {
    if (!trendingNovelTags.loaded) {
      dispatch(clearTrendingNovelTags());
      dispatch(fetchTrendingNovelTags());
    }
  }, [dispatch, trendingNovelTags.loaded]);

  const handleOnRefresh = () => {
    dispatch(clearTrendingNovelTags());
    dispatch(fetchTrendingNovelTags(null, true));
  };

  return (
    <IllustTagList
      ref={ref}
      data={{ ...trendingNovelTags, items }}
      onRefresh={handleOnRefresh}
      searchType={SEARCH_TYPES.NOVEL}
    />
  );
};

export default TrendingNovelTags;
