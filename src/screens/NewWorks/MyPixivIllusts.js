import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigationState, useScrollToTop } from '@react-navigation/native';
import IllustList from '../../components/IllustList';
import {
  clearMyPixivIllusts,
  fetchMyPixivIllusts,
} from '../../common/actions/myPixivIllusts';
import { getMyPixivIllustsItems } from '../../common/selectors';

const MyPixivIllusts = (props) => {
  const { active, renderHeader } = props;
  const scrollableRef = useRef(null);
  const dummyRef = useRef(null);
  const dispatch = useDispatch();
  const allState = useSelector((state) => state);
  const myPixivIllusts = useSelector((state) => state.myPixivIllusts);
  const navigationState = useNavigationState((state) => state);
  const items = getMyPixivIllustsItems(allState, props);
  const listKey = `${navigationState.key}-myPixivIllusts`;

  // only apply scroll to top when current tab is active
  useScrollToTop(active ? scrollableRef : dummyRef);

  useEffect(() => {
    if (!myPixivIllusts.loaded) {
      dispatch(clearMyPixivIllusts());
      dispatch(fetchMyPixivIllusts());
    }
  }, [dispatch, myPixivIllusts.loaded]);

  const loadMoreItems = () => {
    if (!myPixivIllusts.loading && myPixivIllusts.nextUrl) {
      dispatch(fetchMyPixivIllusts(myPixivIllusts.nextUrl));
    }
  };

  const handleOnRefresh = () => {
    dispatch(clearMyPixivIllusts());
    dispatch(fetchMyPixivIllusts(null, true));
  };

  return (
    <IllustList
      ref={scrollableRef}
      data={{ ...myPixivIllusts, items }}
      listKey={listKey}
      loadMoreItems={loadMoreItems}
      onRefresh={handleOnRefresh}
      renderHeader={renderHeader}
      onEndReachedThreshold={0.3}
    />
  );
};

export default MyPixivIllusts;
