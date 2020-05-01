import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme, Menu, TextInput, TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import Color from 'color';

const styles = StyleSheet.create({
  textInput: {
    paddingHorizontal: 0,
    paddingRight: 6,
    backgroundColor: 'transparent',
  },
  chevronIcon: {
    position: 'absolute',
    top: 32,
    right: 0,
  },
  selectedMenuItem: {
    fontWeight: 'bold',
  },
});

const PXDropdown = ({
  items,
  label,
  value,
  onChange,
  textColor,
  menuItemStyle,
  selectedMenuItemStyle,
}) => {
  const theme = useTheme();
  const [isToggle, toggle] = useState(false);
  const selectedItem = items.find((item) => item.value === value);

  const handleOnPressMenuItem = (item) => {
    onChange(item.value);
    toggle(false);
  };

  return (
    <Menu
      visible={isToggle}
      onDismiss={() => toggle(false)}
      anchor={
        <TouchableRipple onPress={() => toggle(!isToggle)}>
          <View>
            <TextInput
              label={label}
              value={selectedItem ? selectedItem.label : items[0].label}
              editable={false}
              style={[
                styles.textInput,
                {
                  color:
                    textColor || Color(theme.colors.text).alpha(0.87).string(),
                },
              ]}
            />
            <Icon
              name={isToggle ? 'caret-up' : 'caret-down'}
              style={styles.chevronIcon}
              color={Color(theme.colors.text).alpha(0.7).string()}
              size={18}
            />
          </View>
        </TouchableRipple>
      }
    >
      {items.map((item) => {
        return (
          <Menu.Item
            key={item.value}
            onPress={() => handleOnPressMenuItem(item)}
            title={item.label}
            titleStyle={[
              menuItemStyle,
              item.value === value && {
                ...styles.selectedMenuItem,
                ...selectedMenuItemStyle,
              },
            ]}
          />
        );
      })}
    </Menu>
  );
};

export default PXDropdown;
