import React from 'react';
import { withTheme } from 'react-native-paper';
import { Dropdown } from 'react-native-material-dropdown';
import Color from 'color';

const PXDropdown = (props) => {
  const { theme } = props;
  return (
    <Dropdown
      containerStyle={{ backgroundColor: theme.colors.surface }}
      pickerStyle={{ backgroundColor: theme.colors.surface }}
      baseColor={Color(theme.colors.text).alpha(0.38).string()}
      textColor={Color(theme.colors.text).alpha(0.87).string()}
      itemColor={Color(theme.colors.text).alpha(0.54).string()}
      selectedItemColor={Color(theme.colors.text).alpha(0.87).string()}
      disabledItemColor={Color(theme.colors.text).alpha(0.38).string()}
      {...props}
    />
  );
};

export default withTheme(PXDropdown);
