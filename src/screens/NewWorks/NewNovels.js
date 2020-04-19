import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigationState, useScrollToTop } from '@react-navigation/native';
import NovelList from '../../components/NovelList';
import { clearNewNovels, fetchNewNovels } from '../../common/actions/newNovels';
import { getNewNovelsItems } from '../../common/selectors';

const NewNovels = (props) => {
  const { active, renderHeader } = props;
  const scrollableRef = useRef(null);
  const dummyRef = useRef(null);
  const dispatch = useDispatch();
  const allState = useSelector((state) => state);
  const newNovels = useSelector((state) => state.newNovels);
  const navigationState = useNavigationState((state) => state);
  const items = getNewNovelsItems(allState, props);
  const listKey = `${navigationState.key}-newNovels`;

  // only apply scroll to top when current tab is active
  useScrollToTop(active ? scrollableRef : dummyRef);

  useEffect(() => {
    if (!newNovels.loaded) {
      dispatch(clearNewNovels());
      dispatch(fetchNewNovels());
    }
  }, [dispatch, newNovels.loaded]);

  const loadMoreItems = () => {
    if (!newNovels.loading && newNovels.nextUrl) {
      dispatch(fetchNewNovels(newNovels.nextUrl));
    }
  };

  const handleOnRefresh = () => {
    dispatch(clearNewNovels());
    dispatch(fetchNewNovels(null, true));
  };

  return (
    <NovelList
      ref={scrollableRef}
      data={{ ...newNovels, items }}
      listKey={listKey}
      loadMoreItems={loadMoreItems}
      onRefresh={handleOnRefresh}
      renderHeader={renderHeader}
      onEndReachedThreshold={0.3}
    />
  );
};

export default NewNovels;
