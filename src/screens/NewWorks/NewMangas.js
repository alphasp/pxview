import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigationState, useScrollToTop } from '@react-navigation/native';
import IllustList from '../../components/IllustList';
import { clearNewMangas, fetchNewMangas } from '../../common/actions/newMangas';
import { getNewMangasItems } from '../../common/selectors';

const NewMangas = (props) => {
  const { active, renderHeader } = props;
  const scrollableRef = useRef(null);
  const dummyRef = useRef(null);
  const dispatch = useDispatch();
  const allState = useSelector((state) => state);
  const newMangas = useSelector((state) => state.newMangas);
  const navigationState = useNavigationState((state) => state);
  const items = getNewMangasItems(allState, props);
  const listKey = `${navigationState.key}-newMangas`;

  // only apply scroll to top when current tab is active
  useScrollToTop(active ? scrollableRef : dummyRef);

  useEffect(() => {
    if (!newMangas.loaded) {
      dispatch(clearNewMangas());
      dispatch(fetchNewMangas());
    }
  }, [dispatch, newMangas.loaded]);

  const loadMoreItems = () => {
    if (!newMangas.loading && newMangas.nextUrl) {
      dispatch(fetchNewMangas(newMangas.nextUrl));
    }
  };

  const handleOnRefresh = () => {
    dispatch(clearNewMangas());
    dispatch(fetchNewMangas(null, true));
  };

  return (
    <IllustList
      ref={scrollableRef}
      data={{ ...newMangas, items }}
      listKey={listKey}
      loadMoreItems={loadMoreItems}
      onRefresh={handleOnRefresh}
      renderHeader={renderHeader}
      onEndReachedThreshold={0.3}
    />
  );
};

export default NewMangas;
