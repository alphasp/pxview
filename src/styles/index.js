import { StyleSheet, Platform } from 'react-native';
import * as globalStyleVariables from './variables';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: globalStyleVariables.HEADER_BACKGROUND_COLOR,
    ...Platform.select({
      android: {
        paddingTop: globalStyleVariables.STATUSBAR_HEIGHT,
        height:
          globalStyleVariables.STATUSBAR_HEIGHT +
          globalStyleVariables.APPBAR_HEIGHT,
      },
    }),
  },
  headerWithoutShadow: {
    shadowOpacity: 0,
    shadowOffset: {
      height: 0,
    },
    elevation: 0,
    backgroundColor: globalStyleVariables.HEADER_BACKGROUND_COLOR,
    ...Platform.select({
      android: {
        paddingTop: globalStyleVariables.STATUSBAR_HEIGHT,
        height:
          globalStyleVariables.STATUSBAR_HEIGHT +
          globalStyleVariables.APPBAR_HEIGHT,
      },
    }),
  },
});

export { globalStyles, globalStyleVariables };
