import React, { Component } from 'react';
import { View, WebView } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import Loader from './Loader';
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

  renderLoader = () => <Loader />;

  render() {
    const { source, ...otherProps } = this.props;
    const { loadedOnce, loading } = this.state;
    return (
      <View style={globalStyles.container}>
        {loadedOnce &&
          loading &&
          <ProgressBar
            indeterminate
            borderRadius={0}
            width={globalStyleVariables.WINDOW_WIDTH}
            height={3}
          />}
        <WebView
          source={source}
          renderLoading={this.renderLoader}
          onLoadStart={this.handleOnLoadStart}
          onLoadEnd={this.handleOnLoadEnd}
          startInLoadingState
          {...otherProps}
        />
      </View>
    );
  }
}

export default PXWebView;
