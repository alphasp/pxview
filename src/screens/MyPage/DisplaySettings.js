import React from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from 'react-native-paper';
import { useLocalization } from '../../components/Localization';
import PXListItem from '../../components/PXListItem';
import { openModal } from '../../common/actions/modal';
import {
  MODAL_TYPES,
  IMAGE_QUALITY_LEVELS,
  WORK_TYPES,
} from '../../common/constants';
import { globalStyles } from '../../styles';

const DisplaySettings = () => {
  const dispatch = useDispatch();
  const { illustListColumns, detailScreenImageQuality } = useSelector(
    (state) => state.displaySettings,
  );
  const theme = useTheme();
  const { i18n } = useLocalization();

  const handleOnPressOpenIllustListColumnsSettingsModal = () => {
    dispatch(
      openModal(MODAL_TYPES.ILLUST_LIST_COLUMNS_SETTINGS, {
        illustListColumns,
        type: WORK_TYPES.IMAGE,
      }),
    );
  };

  const handleOnPressOpenDetailScreenImageQualitySettingsModal = () => {
    dispatch(
      openModal(MODAL_TYPES.DETAIL_SCREEN_IMAGE_QUALITY_SETTINGS, {
        detailScreenImageQuality,
        type: WORK_TYPES.NOVEL,
      }),
    );
  };

  const mapDetailScreenImageQualityName = (imageQuality) => {
    switch (imageQuality) {
      case IMAGE_QUALITY_LEVELS.MEDIUM:
        return i18n.displaySettingsDetailScreenImageQualityMedium;
      case IMAGE_QUALITY_LEVELS.HIGH:
        return i18n.displaySettingsDetailScreenImageQualityHigh;
      default:
        return '';
    }
  };

  return (
    <View
      style={[
        globalStyles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <PXListItem
        title={i18n.displaySettingsIllustListColumns}
        description={illustListColumns.toString()}
        onPress={handleOnPressOpenIllustListColumnsSettingsModal}
      />
      <PXListItem
        title={i18n.displaySettingsDetailScreenImageQuality}
        description={mapDetailScreenImageQualityName(detailScreenImageQuality)}
        onPress={handleOnPressOpenDetailScreenImageQualitySettingsModal}
      />
    </View>
  );
};

export default DisplaySettings;
