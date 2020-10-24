import React from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme, Switch } from 'react-native-paper';
import { useLocalization } from '../../components/Localization';
import PXListItem from '../../components/PXListItem';
import { setSettings } from '../../common/actions/trendingSearchSettings';
import { globalStyles } from '../../styles';

const TrendingSearchSettings = () => {
  const theme = useTheme();
  const { i18n } = useLocalization();
  const dispatch = useDispatch();
  const {
    isShowIllustImage,
    isShowNovelImage,
    isShowTrendingIllustTag,
    isShowTrendingNovelTag,
  } = useSelector((state) => state.trendingSearchSettings);

  const handleOnSwitchIsShowIllustImage = () => {
    dispatch(
      setSettings({
        isShowIllustImage: !isShowIllustImage,
      }),
    );
  };

  const handleOnSwitchIsShowNovelImage = () => {
    dispatch(
      setSettings({
        isShowNovelImage: !isShowNovelImage,
      }),
    );
  };

  const handleOnSwitchIsShowIllustTag = () => {
    dispatch(
      setSettings({
        isShowTrendingIllustTag: !isShowTrendingIllustTag,
      }),
    );
  };

  const handleOnSwitchIsShowNoveltag = () => {
    dispatch(
      setSettings({
        isShowTrendingNovelTag: !isShowTrendingNovelTag,
      }),
    );
  };
  return (
    <View
      style={[
        globalStyles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <PXListItem
        title={i18n.trendingSearchSettingsShowTrendingIllustTag}
        description={i18n.trendingSearchSettingsShowTrendingTagDescription}
        right={() => (
          <Switch
            value={isShowTrendingIllustTag}
            onValueChange={handleOnSwitchIsShowIllustTag}
          />
        )}
      />
      <PXListItem
        title={i18n.trendingSearchSettingsShowTrendingNovelTag}
        description={i18n.trendingSearchSettingsShowTrendingTagDescription}
        right={() => (
          <Switch
            value={isShowTrendingNovelTag}
            onValueChange={handleOnSwitchIsShowNoveltag}
          />
        )}
      />
      <PXListItem
        title={i18n.trendingSearchSettingsShowIllustImage}
        right={() => (
          <Switch
            value={isShowIllustImage}
            onValueChange={handleOnSwitchIsShowIllustImage}
          />
        )}
      />
      <PXListItem
        title={i18n.trendingSearchSettingsShowNovelImage}
        right={() => (
          <Switch
            value={isShowNovelImage}
            onValueChange={handleOnSwitchIsShowNovelImage}
          />
        )}
      />
    </View>
  );
};
export default TrendingSearchSettings;
