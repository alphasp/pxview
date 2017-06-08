import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';

const styles = StyleSheet.create({
  errorText: {
    marginHorizontal: 20,
    color: '#c9302c',
  },
});

const PXFormInput = props => {
  const {
    label,
    meta: { touched, error },
    errorTextStyle,
    input,
    ...restProps
  } = props;
  return (
    <View>
      <FormLabel>{label}</FormLabel>
      <FormInput {...input} {...restProps} />
      {touched &&
        error &&
        <FormValidationMessage>{error}</FormValidationMessage>}
    </View>
  );
};

export default PXFormInput;
