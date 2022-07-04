import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { withTheme } from 'react-native-paper';
import { Button } from 'react-native-elements';

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
    margin: 10,
    borderRadius: 20,
  },
});

const Pills = (props) => {
  const { items, selectedIndex, style, onPressItem, renderRightButton, theme } =
    props;
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
            containerStyle={styles.pillButton}
            titleStyle={{
              fontSize: 14,
              color: index !== selectedIndex ? 'gray' : '#fff',
            }}
            buttonStyle={[
              {
                paddingHorizontal: 10,
                backgroundColor:
                  index === selectedIndex
                    ? theme.colors.headerBackground
                    : 'transparent',
              },
            ]}
            onPress={() => onPressItem(index)}
          />
        ))}
      </View>
      {renderRightButton && renderRightButton()}
    </View>
  );
};

export default withTheme(Pills);
