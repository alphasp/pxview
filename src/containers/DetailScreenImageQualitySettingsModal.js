import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocalization } from '../components/Localization';
import SingleChoiceDialog from '../components/SingleChoiceDialog';
import { closeModal } from '../common/actions/modal';
import { setSettings } from '../common/actions/displaySettings';
import { IMAGE_QUALITY_LEVELS } from '../common/constants';

const DetailScreenImageQualitySettingsModal = ({
  detailScreenImageQuality,
}) => {
  const dispatch = useDispatch();
  const { i18n } = useLocalization();

  const settingsList = [
    {
      value: IMAGE_QUALITY_LEVELS.MEDIUM,
      label: i18n.displaySettingsDetailScreenImageQualityMedium,
    },
    {
      value: IMAGE_QUALITY_LEVELS.HIGH,
      label: i18n.displaySettingsDetailScreenImageQualityHigh,
    },
  ];

  const handleOnCancelPickerDialog = () => {
    dispatch(closeModal());
  };

  const handleOnOkPickerDialog = (value) => {
    const payload = {
      detailScreenImageQuality: value,
    };
    dispatch(setSettings(payload));
    handleOnCancelPickerDialog();
  };

  return (
    <SingleChoiceDialog
      visible
      title={i18n.displaySettingsDetailScreenImageQuality}
      items={settingsList}
      selectedItemValue={detailScreenImageQuality}
      onPressOk={handleOnOkPickerDialog}
      onPressCancel={handleOnCancelPickerDialog}
    />
  );
};

export default DetailScreenImageQualitySettingsModal;
