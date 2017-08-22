import React, { Component } from 'react';
import PXWebView from '../../components/PXWebView';

const ENCYCLOPEDIA_URL = 'https://dic.pixiv.net/a';

class Encyclopedia extends Component {
  static navigationOptions = ({ navigation }) => {
    const { word } = navigation.state.params;
    return {
      title: word,
    };
  };

  render() {
    const { word } = this.props.navigation.state.params;
    const url = `${ENCYCLOPEDIA_URL}/${encodeURIComponent(word)}`;
    return (
      <PXWebView
        source={{
          uri: url,
        }}
      />
    );
  }
}

export default Encyclopedia;
