import { useCallback } from 'react';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export function useAndroidBackHandler(onBackPress) {
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [onBackPress]),
  );
}

export default function AndroidBackHandler({ onBackPress, children }) {
  useAndroidBackHandler(onBackPress);
  return children || null;
}
