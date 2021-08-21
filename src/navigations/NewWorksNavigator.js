import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import NewWorks from '../screens/NewWorks/NewWorks';
import { useLocalization } from '../components/Localization';
import DrawerMenuButton from '../components/DrawerMenuButton';
import {
  globalStyles,
  globalStyleVariables,
  getThemedHeaderStyle,
} from '../styles';
import config from '../common/config';
import { SCREENS } from '../common/constants';

const Stack = createNativeStackNavigator();

const NewWorksNavigator = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { i18n } = useLocalization();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: config.navigation.tab
          ? globalStyles.header
          : globalStyles.headerWithoutShadow,
        headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
        headerBackTitle: null,
        animation: 'none',
      }}
      // cardStyle={globalStyles.card}
      // headerMode="screen"
    >
      <Stack.Screen
        name={SCREENS.NewWorks}
        component={NewWorks}
        options={{
          title: i18n.newest,
          headerStyle: getThemedHeaderStyle(theme, false),
          headerLeft: () => (
            <DrawerMenuButton onPress={() => navigation.openDrawer()} />
          ),
          headerStatusBarHeight: 0,
        }}
      />
    </Stack.Navigator>
  );
};

export default NewWorksNavigator;
