import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocalization } from '../components/Localization';
import SingleChoiceDialog from '../components/SingleChoiceDialog';
import { closeModal } from '../common/actions/modal';
import { setSettings } from '../common/actions/readingSettings';
import { READING_DIRECTION_TYPES, WORK_TYPES } from '../common/constants';

const ReadingDirectionSettingsModal = ({ readingDirection, type }) => {
  const dispatch = useDispatch();
  const { i18n } = useLocalization();

  const directionList = [
    {
      value: READING_DIRECTION_TYPES.LEFT_TO_RIGHT,
      label: i18n.readingSettingsDirectionLeftToRight,
    },
    {
      value: READING_DIRECTION_TYPES.RIGHT_TO_LEFT,
      label: i18n.readingSettingsDirectionRightToLeft,
    },
  ];

  const handleOnCancelPickerDialog = () => {
    dispatch(closeModal());
  };

  const handleOnOkPickerDialog = (value) => {
    let payload;
    if (type === WORK_TYPES.NOVEL) {
      payload = {
        novelReadingDirection: value,
      };
    } else {
      payload = {
        imageReadingDirection: value,
      };
    }
    dispatch(setSettings(payload));
    handleOnCancelPickerDialog();
  };

  return (
    <SingleChoiceDialog
      visible
      title={i18n.readingSettingsDirectionImage}
      items={directionList}
      selectedItemValue={readingDirection}
      onPressOk={handleOnOkPickerDialog}
      onPressCancel={handleOnCancelPickerDialog}
    />
  );
};

export default ReadingDirectionSettingsModal;
