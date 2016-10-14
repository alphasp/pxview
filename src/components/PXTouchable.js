import React from 'react';
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';

const PXTouchable = (props) => {
  if (Platform.OS === 'android') {
    const { style, children, ...restProps } = props;
    return (
      <TouchableNativeFeedback 
        background={ TouchableNativeFeedback.SelectableBackground() } 
        { ...restProps } 
      >
        {
          children ? 
          React.cloneElement(children, {
            style: [children.props.style, style]
          })
          :
          null
        }
      </TouchableNativeFeedback>
    )
  }
  else {
    return <TouchableOpacity {...props} />
  }
}

module.exports = PXTouchable;
