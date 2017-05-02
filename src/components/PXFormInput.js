import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Text,
} from 'react-native';
import { FormLabel, FormInput, Button } from 'react-native-elements';

const styles = StyleSheet.create({
  errorText: {
    marginHorizontal: 20,
    color: '#c9302c',
  },
});

const PXFormInput = props => {
  const { label, meta: { touched, error, warning }, errorTextStyle, input, ...restProps } = props;
  return (
    <View>
      <FormLabel>{label}</FormLabel>
      <FormInput {...input} {...restProps} />
      {
        touched && error &&
        <Text style={[styles.errorText, errorTextStyle]}>
          {error}
        </Text>
      }
    </View>
  );
};

export default PXFormInput;
