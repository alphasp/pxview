import React, { Component } from 'react';
import { View, WebView } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import Loader from '../../../components/Loader';
import { globalStyles, globalStyleVariables } from '../../../styles';

const SETTING_URL = 'https://touch.pixiv.net/setting_user.php';

class AdvanceAccountSettings extends Component {
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
          source={{
            uri: SETTING_URL,
          }}
          renderLoading={this.renderLoader}
          onLoadStart={this.handleOnLoadStart}
          onLoadEnd={this.handleOnLoadEnd}
          startInLoadingState
          javaScriptEnabled
        />
      </View>
    );
  }
}

export default AdvanceAccountSettings;
