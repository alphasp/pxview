import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useScrollToTop } from '@react-navigation/native';
import TagList from '../../components/TagList';
import SimpleTagList from '../../components/SimpleTagList';
import SearchHistory from '../../components/SearchHistory';
import {
  clearTrendingNovelTags,
  fetchTrendingNovelTags,
} from '../../common/actions/trendingNovelTags';
import { getTrendingNovelTagsItems } from '../../common/selectors';
import { SEARCH_TYPES } from '../../common/constants';

const TrendingNovelTags = ({ onPressSearchHistoryItem }) => {
  const ref = useRef();
  const dispatch = useDispatch();
  const allState = useSelector((state) => state);
  const trendingNovelTags = useSelector((state) => state.trendingNovelTags);
  const { isShowNovelImage, isShowTrendingNovelTag } = useSelector(
    (state) => state.trendingSearchSettings,
  );
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

  if (!isShowTrendingNovelTag) {
    return <SearchHistory onPressItem={onPressSearchHistoryItem} />;
  }
  const Comp = isShowNovelImage ? TagList : SimpleTagList;
  return (
    <Comp
      ref={ref}
      data={{ ...trendingNovelTags, items }}
      onRefresh={handleOnRefresh}
      searchType={SEARCH_TYPES.NOVEL}
    />
  );
};

export default TrendingNovelTags;
