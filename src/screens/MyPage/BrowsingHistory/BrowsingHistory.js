import React, { Component } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import BrowsingHistoryIllusts from './BrowsingHistoryIllusts';
import BrowsingHistoryNovels from './BrowsingHistoryNovels';
import { connectLocalization } from '../../../components/Localization';
import PXTabView from '../../../components/PXTabView';
import HeaderClearButton from '../../../components/HeaderClearButton';
import * as browsingHistoryIllustsActionCreators from '../../../common/actions/browsingHistoryIllusts';
import * as browsingHistoryNovelsActionCreators from '../../../common/actions/browsingHistoryNovels';

class BrowsingHistory extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      headerRight:
        params &&
        params.onPressClearBrowsingHistory &&
        <HeaderClearButton onPress={params.onPressClearBrowsingHistory} />,
    };
  };

  constructor(props) {
    super(props);
    const { i18n } = props;
    this.state = {
      index: 0,
      routes: [
        { key: '1', title: i18n.illustManga },
        { key: '2', title: i18n.novel },
      ],
    };
  }

  componentDidMount() {
    const { setParams } = this.props.navigation;
    setParams({
      onPressClearBrowsingHistory: this.handleOnPressClearBrowsingHistory,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { lang: prevLang } = this.props;
    const { lang, i18n } = nextProps;
    if (lang !== prevLang) {
      this.setState({
        routes: [
          { key: '1', title: i18n.illustManga },
          { key: '2', title: i18n.novel },
        ],
      });
    }
  }

  handleOnPressClearBrowsingHistory = () => {
    const { i18n } = this.props;
    Alert.alert(
      i18n.browsingHistoryClearConfirmation,
      null,
      [
        { text: i18n.cancel, style: 'cancel' },
        {
          text: i18n.ok,
          onPress: this.handleOnPressConfirmClearBrowsingHistory,
        },
      ],
      { cancelable: false },
    );
  };

  handleOnPressConfirmClearBrowsingHistory = () => {
    const {
      clearBrowsingHistoryIllusts,
      clearBrowsingHistoryNovels,
    } = this.props;
    const { index } = this.state;
    if (index === 0) {
      clearBrowsingHistoryIllusts();
    } else {
      clearBrowsingHistoryNovels();
    }
  };

  handleChangeTab = index => {
    this.setState({ index });
  };

  renderScene = ({ route }) => {
    const { navigation } = this.props;
    switch (route.key) {
      case '1':
        return <BrowsingHistoryIllusts navigation={navigation} />;
      case '2':
        return <BrowsingHistoryNovels navigation={navigation} />;
      default:
        return null;
    }
  };

  render() {
    return (
      <PXTabView
        navigationState={this.state}
        renderScene={this.renderScene}
        onIndexChange={this.handleChangeTab}
      />
    );
  }
}

export default connectLocalization(
  connect(null, {
    ...browsingHistoryIllustsActionCreators,
    ...browsingHistoryNovelsActionCreators,
  })(BrowsingHistory),
);
