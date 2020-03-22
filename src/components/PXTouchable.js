import React from 'react';
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  View,
} from 'react-native';

const PXTouchable = (props) => {
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    const { style, children, ...otherProps } = props;
    return (
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.SelectableBackground()}
        style={style}
        {...otherProps}
      >
        {children ? <View style={style}>{children}</View> : null}
      </TouchableNativeFeedback>
    );
  }
  return <TouchableOpacity {...props} />;
};

export default PXTouchable;
