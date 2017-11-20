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
    meta,
    meta: { touched, error },
    labelStyle,
    inputStyle,
    errorTextStyle,
    input,
    text,
    ...restProps
  } = props;
  return (
    <View>
      <FormLabel labelStyle={labelStyle}>
        {label}
      </FormLabel>
      <FormInput
        inputStyle={inputStyle}
        {...input}
        {...restProps}
        onChangeText={(text) => {
          input.onChange(text);
        }}
        value={props.text || (meta.dirty?undefined : input.value)}
      />
      {touched &&
        error &&
        <FormValidationMessage>
          {error}
        </FormValidationMessage>}
    </View>
  );
};

export default PXFormInput;