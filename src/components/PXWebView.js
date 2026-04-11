import React, { Component } from 'react';
import { View, Linking } from 'react-native';
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

  getIntentFallbackUrl = (url) => {
    if (!url || !/^intent:\/\//i.test(url)) {
      return null;
    }

    const [intentBody, intentMeta] = url.split('#Intent;');
    if (!intentBody || !intentMeta) {
      return null;
    }

    const pathWithQuery = intentBody.replace(/^intent:\/\//i, '');
    const schemeMatch = intentMeta.match(/(?:^|;)scheme=([^;]+)/i);
    if (!schemeMatch || !schemeMatch[1] || !pathWithQuery) {
      return null;
    }

    return `${schemeMatch[1]}://${pathWithQuery}`;
  };

  openExternalUrl = async (url) => {
    try {
      await Linking.openURL(url);
      return;
    } catch (error) {
      const fallbackUrl = this.getIntentFallbackUrl(url);
      if (fallbackUrl && fallbackUrl !== url) {
        try {
          await Linking.openURL(fallbackUrl);
        } catch (fallbackError) {
          // noop: swallow to avoid breaking WebView render cycle
        }
      }
    }
  };

  handleOnShouldStartLoadWithRequest = (request) => {
    const { onShouldStartLoadWithRequest } = this.props;
    if (onShouldStartLoadWithRequest) {
      const shouldContinue = onShouldStartLoadWithRequest(request);
      if (!shouldContinue) {
        return false;
      }
    }

    const { url } = request;
    if (!url) {
      return true;
    }

    const normalizedUrl = url.toLowerCase();
    const isWebUrl =
      normalizedUrl.startsWith('http://') ||
      normalizedUrl.startsWith('https://') ||
      normalizedUrl.startsWith('about:blank') ||
      normalizedUrl.startsWith('data:');

    if (isWebUrl) {
      return true;
    }

    this.openExternalUrl(url);

    return false;
  };

  render() {
    const {
      source,
      theme,
      onShouldStartLoadWithRequest,
      ...otherProps
    } = this.props;
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
          onShouldStartLoadWithRequest={
            this.handleOnShouldStartLoadWithRequest
          }
          setSupportMultipleWindows={false}
          startInLoadingState
          {...otherProps}
        />
      </View>
    );
  }
}

export default withTheme(PXWebView);
