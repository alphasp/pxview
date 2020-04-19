import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigationState, useScrollToTop } from '@react-navigation/native';
import IllustList from '../../components/IllustList';
import {
  clearNewIllusts,
  fetchNewIllusts,
} from '../../common/actions/newIllusts';
import { getNewIllustsItems } from '../../common/selectors';

const NewIllusts = (props) => {
  const { active, renderHeader } = props;
  const scrollableRef = useRef(null);
  const dummyRef = useRef(null);
  const dispatch = useDispatch();
  const allState = useSelector((state) => state);
  const newIllusts = useSelector((state) => state.newIllusts);
  const navigationState = useNavigationState((state) => state);
  const items = getNewIllustsItems(allState, props);
  const listKey = `${navigationState.key}-newIllusts`;

  // only apply scroll to top when current tab is active
  useScrollToTop(active ? scrollableRef : dummyRef);

  useEffect(() => {
    if (!newIllusts.loaded) {
      dispatch(clearNewIllusts());
      dispatch(fetchNewIllusts());
    }
  }, [dispatch, newIllusts.loaded]);

  const loadMoreItems = () => {
    if (!newIllusts.loading && newIllusts.nextUrl) {
      dispatch(fetchNewIllusts(newIllusts.nextUrl));
    }
  };

  const handleOnRefresh = () => {
    dispatch(clearNewIllusts());
    dispatch(fetchNewIllusts(null, true));
  };

  return (
    <IllustList
      ref={scrollableRef}
      data={{ ...newIllusts, items }}
      listKey={listKey}
      loadMoreItems={loadMoreItems}
      onRefresh={handleOnRefresh}
      renderHeader={renderHeader}
      onEndReachedThreshold={0.3}
    />
  );
};

export default NewIllusts;
