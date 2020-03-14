import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Recommended from '../screens/Recommended/Recommended';
import useLocalization from '../components/Localization/useLocalization';
import DrawerMenuButton from '../components/DrawerMenuButton';
import DrawerIcon from '../components/DrawerIcon';
import {
  globalStyles,
  globalStyleVariables,
  getThemedHeaderStyle,
} from '../styles';
import config from '../common/config';
import { SCREENS } from '../common/constants';

const Stack = createStackNavigator();

// const routeConfig = {
//   [SCREENS.Recommended]: {
//     screen: Recommended,
//     options: config.navigation.tab
//       ? { header: null }
//       : ({ navigation, screenProps: { i18n, theme } }) => ({
//           title: i18n.recommended,
//           headerStyle: getThemedHeaderStyle(theme, false),
//           headerLeft: (
//             <DrawerMenuButton onPress={() => navigation.openDrawer()} />
//           ),
//         }),
//   },
// };

// const stackConfig = {
//   screenOptions: {
//     headerStyle: config.navigation.tab
//       ? globalStyles.header
//       : globalStyles.headerWithoutShadow,
//     headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
//     headerBackTitle: null,
//   },
//   cardStyle: globalStyles.card,
//   headerMode: 'screen',
// };

// const RecommendedNavigator = createCompatNavigatorFactory(createStackNavigator)(
//   routeConfig,
//   stackConfig,
// );

// if (!config.navigation.tab) {
//   RecommendedNavigator.options = ({ screenProps: { i18n } }) => ({
//     drawerLabel: i18n.recommended,
//     drawerIcon: ({ tintColor }) => (
//       <DrawerIcon name="thumbs-up" size={24} color={tintColor} />
//     ),
//   });
// }

const RecommendedNavigator = () => {
  const theme = useTheme();
  const { i18n } = useLocalization();
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
        name={SCREENS.Recommended}
        component={Recommended}
        options={{
          title: i18n.recommended,
          headerStyle: getThemedHeaderStyle(theme, false),
          headerLeft: () => (
            <DrawerMenuButton onPress={() => navigation.openDrawer()} />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default RecommendedNavigator;
