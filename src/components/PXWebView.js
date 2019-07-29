import React, { Component } from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import ProgressBar from 'react-native-progress/Bar';
import { withTheme } from 'react-native-paper';
import { globalStyles, globalStyleVariables } from '../styles';

class PXWebView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loadedOnce: false,
    };
  }

  handleOnLoadStart = () => {
    this.setState({
      loading: true,
    });
  };

  handleOnLoadEnd = () => {
    const { loadedOnce } = this.state;
    const newState = {
      loading: false,
    };
    if (!loadedOnce) {
      newState.loadedOnce = true;
    }
    this.setState(newState);
  };

  render() {
    const { source, theme, ...otherProps } = this.props;
    const { loadedOnce, loading } = this.state;
    return (
      <View
        style={[
          globalStyles.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        {loadedOnce && loading && (
          <ProgressBar
            indeterminate
            borderRadius={0}
            width={globalStyleVariables.WINDOW_WIDTH}
            height={3}
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
