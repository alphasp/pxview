import React, { useState, useLayoutEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import BrowsingHistoryIllusts from './BrowsingHistoryIllusts';
import BrowsingHistoryNovels from './BrowsingHistoryNovels';
import PXTabView from '../../../components/PXTabView';
import HeaderClearButton from '../../../components/HeaderClearButton';
import { clearBrowsingHistoryIllusts } from '../../../common/actions/browsingHistoryIllusts';
import { clearBrowsingHistoryNovels } from '../../../common/actions/browsingHistoryNovels';
import useLocalization from '../../../components/Localization/useLocalization';

const BrowsingHistory = (props) => {
  const { navigation, route: navigationRoute } = props;
  const dispatch = useDispatch();
  const { i18n } = useLocalization();
  const [tabsNavigationState, setTabsNavigationState] = useState({
    index: 0,
    routes: [
      { key: '1', title: i18n.illustManga },
      { key: '2', title: i18n.novel },
    ],
  });

  const handleOnPressConfirmClearBrowsingHistory = useCallback(() => {
    if (tabsNavigationState.index === 0) {
      dispatch(clearBrowsingHistoryIllusts());
    } else {
      dispatch(clearBrowsingHistoryNovels());
    }
  }, [dispatch, tabsNavigationState.index]);

  const handleOnPressClearBrowsingHistory = useCallback(() => {
    Alert.alert(
      i18n.browsingHistoryClearConfirmation,
      null,
      [
        { text: i18n.cancel, style: 'cancel' },
        {
          text: i18n.ok,
          onPress: handleOnPressConfirmClearBrowsingHistory,
        },
      ],
      { cancelable: false },
    );
  }, [
    handleOnPressConfirmClearBrowsingHistory,
    i18n.browsingHistoryClearConfirmation,
    i18n.cancel,
    i18n.ok,
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderClearButton onPress={handleOnPressClearBrowsingHistory} />
      ),
    });
  }, [handleOnPressClearBrowsingHistory, navigation]);

  const handleChangeTab = (index) => {
    setTabsNavigationState({
      ...tabsNavigationState,
      index,
    });
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case '1':
        return <BrowsingHistoryIllusts route={navigationRoute} />;
      case '2':
        return <BrowsingHistoryNovels route={navigationRoute} />;
      default:
        return null;
    }
  };

  return (
    <PXTabView
      navigationState={tabsNavigationState}
      renderScene={renderScene}
      onIndexChange={handleChangeTab}
    />
  );
};

export default BrowsingHistory;
