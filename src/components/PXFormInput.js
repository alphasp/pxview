import React, { Component } from 'react';
import { View } from 'react-native';
import {
  FormLabel,
  FormInput,
  FormValidationMessage,
} from 'react-native-elements';

class PXFormInput extends Component {
  handleOnChangeText = text => {
    const { onChangeText, field: { name } } = this.props;
    onChangeText(name, text);
  };

  handleOnBlur = () => {
    const { onBlur, field: { name } } = this.props;
    onBlur(name);
  };

  render() {
    const {
      label,
      field: { name, value },
      form: { touched, errors },
      labelStyle,
      inputStyle,
      errorTextStyle,
      input,
      ...restProps
    } = this.props;
    return (
      <View>
        <FormLabel labelStyle={labelStyle}>
          {label}
        </FormLabel>
        <FormInput
          inputStyle={inputStyle}
          {...restProps}
          onChangeText={this.handleOnChangeText}
          onBlur={this.handleOnBlur}
          value={value}
        />
        {touched[name] &&
          errors[name] &&
          <FormValidationMessage>
            {errors[name]}
          </FormValidationMessage>}
      </View>
    );
  }
}

// const PXFormInput = props => {
//   const {
//     label,
//     meta: { touched, dirty, error },
//     labelStyle,
//     inputStyle,
//     errorTextStyle,
//     input,
//     ...restProps
//   } = props;
//   return (
//     <View>
//       <FormLabel labelStyle={labelStyle}>
//         {label}
//       </FormLabel>
//       <FormInput
//         inputStyle={inputStyle}
//         {...input}
//         {...restProps}
//         onChangeText={text => {
//           input.onChange(text);
//         }}
//         value={props.text || (dirty ? undefined : input.value)}
//       />
//       {touched &&
//         error &&
//         <FormValidationMessage>
//           {error}
//         </FormValidationMessage>}
//     </View>
//   );
// };

export default PXFormInput;
