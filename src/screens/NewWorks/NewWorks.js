import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FollowingUserNewWorks from './FollowingUserNewWorks';
import UserNewWorks from './UserNewWorks';
import MyPixivNewWorks from './MyPixivNewWorks';
import PXTabView from '../../components/PXTabView';
import { useLocalization } from '../../components/Localization';
import useIsMounted from '../../common/hooks/useIsMounted';

const NewWorks = () => {
  const { i18n, lang } = useLocalization();
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([
    { key: '1', title: i18n.following },
    { key: '2', title: i18n.newest },
    { key: '3', title: i18n.myPixiv },
  ]);
  const navigation = useNavigation();
  const isMounted = useIsMounted();
  useEffect(() => {
    if (isMounted) {
      setRoutes([
        { key: '1', title: i18n.following },
        { key: '2', title: i18n.newest },
        { key: '3', title: i18n.myPixiv },
      ]);
    }
  }, [lang, isMounted, i18n]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case '1':
        return (
          <FollowingUserNewWorks active={index === 0} navigation={navigation} />
        );
      case '2':
        return <UserNewWorks active={index === 1} navigation={navigation} />;
      case '3':
        return <MyPixivNewWorks active={index === 2} />;
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

export default NewWorks;
