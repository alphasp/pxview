import React from 'react';
import { StyleSheet, View, Platform, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';
import DrawerMenuButton from './DrawerMenuButton';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  containerShadow: {
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
        elevation: 1,
      },
    }),
  },
  containerDark: {
    backgroundColor: globalStyleVariables.PRIMARY_COLOR,
  },
  absolutePosition: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: globalStyleVariables.APPBAR_HEIGHT,
    zIndex: 100,
    backgroundColor: 'rgba(0, 0, 0, .3)',
  },
  subContainer: {
    // ...Platform.select({
    //   ios: {
    //     paddingTop:
    //       parseInt(Platform.Version, 10) < 11
    //         ? globalStyleVariables.STATUSBAR_HEIGHT
    //         : 0,
    //   },
    //   android: {
    //     paddingTop: globalStyleVariables.STATUSBAR_HEIGHT,
    //     height:
    //       globalStyleVariables.STATUSBAR_HEIGHT +
    //       globalStyleVariables.APPBAR_HEIGHT,
    //   },
    // }),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: globalStyleVariables.APPBAR_HEIGHT,
  },
});

const PXHeader = ({
  showMenuButton,
  showBackButton,
  headerTitle,
  headerRight,
  darkTheme,
  absolutePosition,
  withShadow = true,
  onPressBackButton,
}) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const handleOnPressDrawerMenuButton = () => {
    navigation.openDrawer();
  };

  const handleOnPressBackButton = () => {
    if (onPressBackButton) {
      onPressBackButton();
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView
      style={[
        { backgroundColor: theme.colors.headerBackground },
        // darkTheme && styles.containerDark,
        absolutePosition && styles.absolutePosition,
        withShadow && styles.containerShadow,
      ]}
    >
      <View style={styles.subContainer}>
        {showMenuButton && (
          <DrawerMenuButton
            onPress={handleOnPressDrawerMenuButton}
            color={darkTheme ? '#fff' : globalStyleVariables.PRIMARY_COLOR}
          />
        )}
        {showBackButton && (
          <HeaderBackButton
            onPress={handleOnPressBackButton}
            tintColor={darkTheme && '#fff'}
          />
        )}
        {headerTitle}
        {headerRight}
      </View>
    </SafeAreaView>
  );
};

export default PXHeader;
