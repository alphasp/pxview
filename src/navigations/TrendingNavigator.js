import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Trending from '../screens/Trending/Trending';
import DrawerMenuButton from '../components/DrawerMenuButton';
import {
  globalStyles,
  globalStyleVariables,
  getThemedHeaderStyle,
} from '../styles';
import config from '../common/config';
import { SCREENS } from '../common/constants';

const Stack = createStackNavigator();

const TrendingNavigator = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: config.navigation.tab
          ? globalStyles.header
          : globalStyles.headerWithoutShadow,
        headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
        headerBackTitle: null,
      }}
      cardStyle={globalStyles.card}
      headerMode="screen"
    >
      <Stack.Screen
        name={SCREENS.Trending}
        component={Trending}
        options={{
          headerStyle: getThemedHeaderStyle(theme, false),
          headerLeft: () => (
            <DrawerMenuButton onPress={() => navigation.openDrawer()} />
          ),
          headerStatusBarHeight: 0,
          header: () => null,
        }}
      />
    </Stack.Navigator>
  );
};

export default TrendingNavigator;
