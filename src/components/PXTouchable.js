import React from 'react';
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  View,
} from 'react-native';

const PXTouchable = (props) => {
  if (Platform.OS === 'android') {
    // return <TouchableOpacity {...props} />
    const { style, children, ...otherProps } = props;
    //console.log('children ', children)
    return (
      <TouchableNativeFeedback 
        background={ TouchableNativeFeedback.SelectableBackground() } 
        style={style}
        {...otherProps} 
      >
        {
          children ? 
          <View style={style}>
            { children }
          </View>
          :
          null
        }
      </TouchableNativeFeedback>
    )
    // return (
    //   <TouchableNativeFeedback 
    //     background={ TouchableNativeFeedback.SelectableBackground() } 
    //     { ...restProps } 
    //   >
    //     {
    //       children ? 
    //       React.cloneElement(children, {
    //         style: [children.props.style, style]
    //       })
    //       :
    //       null
    //     }
    //   </TouchableNativeFeedback>
    // )
  }
  else {
    return <TouchableOpacity {...props} />
  }
}

module.exports = PXTouchable;
