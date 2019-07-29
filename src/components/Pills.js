import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { withTheme } from 'react-native-paper';
import { Button } from 'react-native-elements';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(0, 0, 0, .3)',
      },
      android: {
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: StyleSheet.hairlineWidth,
        shadowOffset: {
          height: StyleSheet.hairlineWidth,
        },
        elevation: 4,
      },
    }),
  },
  subContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  pillButton: {
    padding: 10,
    paddingHorizontal: 10,
  },
});

const Pills = props => {
  const {
    items,
    selectedIndex,
    style,
    onPressItem,
    renderRightButton,
    theme,
  } = props;
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
        },
        style,
      ]}
    >
      <View style={styles.subContainer}>
        {items.map((item, index) => (
          <Button
            key={item.title}
            title={item.title}
            buttonStyle={styles.pillButton}
            fontSize={14}
            rounded={index === selectedIndex}
            onPress={() => onPressItem(index)}
            backgroundColor={
              index === selectedIndex
                ? theme.colors.headerBackground
                : globalStyleVariables.BACKGROUND_COLOR
            }
            color={index !== selectedIndex ? 'gray' : '#fff'}
            transparent={index !== selectedIndex}
          />
        ))}
      </View>
      {renderRightButton && renderRightButton()}
    </View>
  );
};

export default withTheme(Pills);
