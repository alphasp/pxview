import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import PXTabView from '../../components/PXTabView';
import RecommendedIllusts from './RecommendedIllusts';
import RecommendedMangas from './RecommendedMangas';
import RecommendedNovels from './RecommendedNovels';
import { useLocalization } from '../../components/Localization';
import useIsMounted from '../../common/hooks/useIsMounted';

const Recommended = () => {
  const { i18n, lang } = useLocalization();
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([
    { key: '1', title: i18n.illust },
    { key: '2', title: i18n.manga },
    { key: '3', title: i18n.novel },
  ]);
  const isMounted = useIsMounted();
  useEffect(() => {
    if (isMounted) {
      setRoutes([
        { key: '1', title: i18n.illust },
        { key: '2', title: i18n.manga },
        { key: '3', title: i18n.novel },
      ]);
    }
  }, [lang, isMounted, i18n]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case '1':
        return <RecommendedIllusts active={index === 0} />;
      case '2':
        return <RecommendedMangas active={index === 1} />;
      case '3':
        return <RecommendedNovels active={index === 2} />;
      default:
        return null;
    }
  };

  return (
    <PXTabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      includeStatusBarPadding={Platform.OS === 'ios'}
    />
  );
};

export default Recommended;
