import React, { Component } from 'react';
import { View } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';

class PXFormInput extends Component {
  handleOnChangeText = (text) => {
    const {
      onChangeText,
      field: { name },
      form: { status, setStatus },
    } = this.props;
    onChangeText(name, text);
    if (status && status[name]) {
      setStatus({
        ...status,
        [name]: null,
      });
    }
  };

  handleOnBlur = () => {
    const {
      onBlur,
      field: { name },
    } = this.props;
    onBlur(name);
  };

  render() {
    const {
      label,
      field: { name, value },
      form: { touched, errors, status },
      inputStyle,
      errorTextStyle,
      input,
      ...restProps
    } = this.props;
    const error = errors[name] || (status && status[name]);
    return (
      <View>
        <TextInput
          style={inputStyle}
          label={label}
          value={value}
          error={touched[name] && error}
          {...restProps}
          onChangeText={this.handleOnChangeText}
          onBlur={this.handleOnBlur}
        />
        <HelperText
          type="error"
          visible={touched[name] && error}
          style={errorTextStyle}
        >
          {error}
        </HelperText>
      </View>
    );
  }
}

export default PXFormInput;
