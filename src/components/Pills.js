import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
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
  const { items, selectedIndex, style, onPressItem, renderRightButton } = props;
  return (
    <View style={[styles.container, style]}>
      <View style={styles.subContainer}>
        {items.map((item, index) =>
          <Button
            key={item.title}
            title={item.title}
            buttonStyle={styles.pillButton}
            fontSize={14}
            rounded={index === selectedIndex}
            onPress={() => onPressItem(index)}
            backgroundColor={
              index === selectedIndex
                ? globalStyleVariables.PRIMARY_COLOR
                : globalStyleVariables.BACKGROUND_COLOR
            }
            color={index !== selectedIndex ? 'gray' : '#fff'}
            transparent={index !== selectedIndex}
          />,
        )}
      </View>
      {renderRightButton && renderRightButton()}
    </View>
  );
};

export default Pills;
