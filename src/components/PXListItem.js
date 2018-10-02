import React, { Fragment } from 'react';
import { List, Divider } from 'react-native-paper';

const PXListItem = ({ withDivider = true, ...restProps }) => {
  if (withDivider) {
    return (
      <Fragment>
        <List.Item {...restProps} />
        <Divider />
      </Fragment>
    );
  }
  return <List.Item {...restProps} />;
};

export default PXListItem;
