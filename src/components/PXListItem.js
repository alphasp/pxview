import React, { Fragment } from 'react';
import { List, Divider } from 'react-native-paper';

const PXListItem = ({ withDivider = true, ...restProps }) => {
  if (withDivider) {
    return (
      <>
        <List.Item {...restProps} />
        <Divider />
      </>
    );
  }
  return <List.Item {...restProps} />;
};

export default PXListItem;
