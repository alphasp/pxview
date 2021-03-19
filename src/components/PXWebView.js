import React, { Component } from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import ProgressBar from 'react-native-progress/Bar';
import { withTheme } from 'react-native-paper';
import { globalStyles } from '../styles';

class PXWebView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  handleOnLoadStart = () => {
    this.setState({
      loading: true,
    });
  };

  handleOnLoadEnd = () => {
    this.setState({
      loading: false,
    });
  };

  render() {
    const { source, theme, ...otherProps } = this.props;
    const { loading } = this.state;
    return (
      <View
        style={[
          globalStyles.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        {loading && (
          <ProgressBar
            indeterminate
            borderRadius={0}
            width={null}
            useNativeDriver
          />
        )}
        <WebView
          source={source}
          onLoadStart={this.handleOnLoadStart}
          onLoadEnd={this.handleOnLoadEnd}
          startInLoadingState
          {...otherProps}
        />
      </View>
    );
  }
}

export default withTheme(PXWebView);
