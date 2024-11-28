import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocalization } from '../components/Localization';
import SingleChoiceDialog from '../components/SingleChoiceDialog';
import { closeModal } from '../common/actions/modal';
import { setSettings } from '../common/actions/displaySettings';
import { ILLUST_LIST_COLUMNS } from '../common/constants';

const IllustListColumnsSettingsModal = ({ illustListColumns }) => {
  const dispatch = useDispatch();
  const { i18n } = useLocalization();

  const settingsList = [];
  Object.keys(ILLUST_LIST_COLUMNS).forEach((key) =>
    settingsList.push({
      value: ILLUST_LIST_COLUMNS[key],
      label: key.toString(),
    }),
  );

  const handleOnCancelPickerDialog = () => {
    dispatch(closeModal());
  };

  const handleOnOkPickerDialog = (value) => {
    const payload = {
      illustListColumns: value,
    };
    dispatch(setSettings(payload));
    handleOnCancelPickerDialog();
  };

  return (
    <SingleChoiceDialog
      visible
      title={i18n.displaySettingsIllustListColumns}
      items={settingsList}
      selectedItemValue={illustListColumns}
      onPressOk={handleOnOkPickerDialog}
      onPressCancel={handleOnCancelPickerDialog}
    />
  );
};

export default IllustListColumnsSettingsModal;
