import React from 'react';
import { connectLocalization } from '../components/Localization';
import SingleChoiceDialog from '../components/SingleChoiceDialog';

const VisibilityFilterModal = ({
  isOpen,
  onSelectVisibility,
  onPressCloseButton,
  i18n,
  visibility,
}) => {
  const items = [
    {
      label: i18n.all,
      value: 'all',
    },
    {
      label: i18n.public,
      value: 'public',
    },
    {
      label: i18n.private,
      value: 'private',
    },
  ];
  return (
    <SingleChoiceDialog
      visible={isOpen}
      title={i18n.filter}
      items={items}
      enableOkButton={false}
      selectedItemValue={visibility}
      onSelectItem={onSelectVisibility}
      onPressCancel={onPressCloseButton}
    />
  );
};

export default connectLocalization(VisibilityFilterModal);
