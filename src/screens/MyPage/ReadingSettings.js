import React from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from 'react-native-paper';
import { useLocalization } from '../../components/Localization';
import PXListItem from '../../components/PXListItem';
import { openModal } from '../../common/actions/modal';
import { setSettings } from '../../common/actions/readingSettings';
import {
  MODAL_TYPES,
  READING_DIRECTION_TYPES,
  WORK_TYPES,
} from '../../common/constants';
import { globalStyles } from '../../styles';

const ReadingSettings = () => {
  const dispatch = useDispatch();
  const {
    imageReadingDirection,
    novelReadingDirection,
    sliderSide,
    sliderPercentageSide,
  } = useSelector((state) => state.readingSettings);
  const theme = useTheme();
  const { i18n } = useLocalization();

  const handleOnPressOpenImageReadingDirectionSettingsModal = () => {
    dispatch(
      openModal(MODAL_TYPES.READING_DIRECTION_SETTINGS, {
        readingDirection: imageReadingDirection,
        type: WORK_TYPES.IMAGE,
      }),
    );
  };

  const handleOnPressOpenNovelReadingDirectionSettingsModal = () => {
    dispatch(
      openModal(MODAL_TYPES.READING_DIRECTION_SETTINGS, {
        readingDirection: novelReadingDirection,
        type: WORK_TYPES.NOVEL,
      }),
    );
  };

  const mapReadingDirectionName = (readingDirection) => {
    switch (readingDirection) {
      case READING_DIRECTION_TYPES.LEFT_TO_RIGHT:
        return i18n.readingSettingsDirectionLeftToRight;
      case READING_DIRECTION_TYPES.RIGHT_TO_LEFT:
        return i18n.readingSettingsDirectionRightToLeft;
      default:
        return '';
    }
  };

  const mapSliderSideName = (side) =>
    side === 'left'
      ? i18n.readingSettingsSliderSideLeft
      : i18n.readingSettingsSliderSideRight;

  return (
    <View
      style={[
        globalStyles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <PXListItem
        title={i18n.readingSettingsDirectionImage}
        description={mapReadingDirectionName(imageReadingDirection)}
        onPress={handleOnPressOpenImageReadingDirectionSettingsModal}
      />
      <PXListItem
        title={i18n.readingSettingsDirectionNovel}
        description={mapReadingDirectionName(novelReadingDirection)}
        onPress={handleOnPressOpenNovelReadingDirectionSettingsModal}
      />
      <PXListItem
        title={i18n.readingSettingsSliderSide}
        description={mapSliderSideName(sliderSide)}
        onPress={() =>
          dispatch(
            setSettings({
              sliderSide: sliderSide === 'left' ? 'right' : 'left',
            }),
          )
        }
      />
      <PXListItem
        title={i18n.readingSettingsSliderPercentageSide}
        description={mapSliderSideName(sliderPercentageSide)}
        onPress={() =>
          dispatch(
            setSettings({
              sliderPercentageSide:
                sliderPercentageSide === 'left' ? 'right' : 'left',
            }),
          )
        }
      />
    </View>
  );
};

export default ReadingSettings;
