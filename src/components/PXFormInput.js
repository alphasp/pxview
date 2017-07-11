import React from 'react';
import { View } from 'react-native';
import {
  FormLabel,
  FormInput,
  FormValidationMessage,
} from 'react-native-elements';

const PXFormInput = props => {
  const {
    label,
    meta: { touched, error },
    labelStyle,
    inputStyle,
    errorTextStyle,
    input,
    ...restProps
  } = props;
  return (
    <View>
      <FormLabel labelStyle={labelStyle}>
        {label}
      </FormLabel>
      <FormInput inputStyle={inputStyle} {...input} {...restProps} />
      {touched &&
        error &&
        <FormValidationMessage>
          {error}
        </FormValidationMessage>}
    </View>
  );
};

export default PXFormInput;
