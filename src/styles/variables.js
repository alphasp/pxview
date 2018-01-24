import { Dimensions, Platform, StatusBar } from 'react-native';

export const HEADER_BACKGROUND_COLOR = '#2e97d8';
export const HEADER_TINT_COLOR = '#fff';
export const CARD_BACKGROUND_COLOR = '#fff';
export const PRIMARY_COLOR = '#2e97d8';
export const SECONDARY_COLOR = 'red';
export const BACKGROUND_COLOR = '#E9EBEE';
export const HIGHLIGHT_COLOR = 'green';
export const MUTE_COLOR = 'red';

export const WINDOW_WIDTH = Math.floor(Dimensions.get('window').width);
export const WINDOW_HEIGHT = Math.floor(Dimensions.get('window').height);

// https://material.io/guidelines/layout/structure.html#structure-app-bar
export const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
// todo handle iphone x
export const STATUSBAR_HEIGHT =
  Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
export const DRAWER_WIDTH =
  WINDOW_WIDTH - (Platform.OS === 'android' ? 56 : 64);
