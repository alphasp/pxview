import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { Snackbar } from 'react-native-paper';

const PXSnackbar = () => {
  const [isShowSnackbar, toggleSnackbar] = useState(false);
  const [message, setMessage] = useState();
  useEffect(() => {
    const showToastListener = DeviceEventEmitter.addListener(
      'showToast',
      (text) => {
        setMessage(text);
        toggleSnackbar(true);
      },
    );
    return () => {
      showToastListener.remove();
    };
  }, []);

  const handleOnDismiss = () => {
    setMessage(null);
    toggleSnackbar(false);
  };

  return (
    <Snackbar
      visible={isShowSnackbar}
      onDismiss={handleOnDismiss}
      duration={500}
      action={{
        onPress: () => {
          toggleSnackbar(false);
        },
      }}
      style={{
        position: 'absolute',
        bottom: 60, // 85,
        opacity: 0.7,
      }}
    >
      {message}
    </Snackbar>
  );
};

export default PXSnackbar;
