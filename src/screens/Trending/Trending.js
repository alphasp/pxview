import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Keyboard,
  Platform,
  BackHandler,
} from 'react-native';
import { connect } from 'react-redux';
import TrendingIllustTags from './TrendingIllustTags';
import RecommendedUsers from '../Shared/RecommendedUsers';
import Search from '../../containers/Search';
import PXSearchBar from '../../components/PXSearchBar';
import PXTabView from '../../components/PXTabView';
import { connectLocalization } from '../../components/Localization';
import * as searchTypeActionCreators from '../../common/actions/searchType';
import { SEARCH_TYPES } from '../../common/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

class Trending extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      tabBarVisible: params && params.tabBarVisible != null
        ? params.tabBarVisible
        : true,
    };
  };

  constructor(props) {
    super(props);
    const { i18n } = props;
    this.state = {
      index: 0,
      routes: [
        { key: '1', title: i18n.illustManga },
        { key: '2', title: i18n.user },
      ],
      isFocusSearchBar: false,
      word: null,
    };
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      this.backHandlerListener = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleOnPressBackButton,
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    const { searchType: prevSearchType, lang: prevLang } = this.props;
    const { searchType, lang, i18n } = nextProps;
    if (searchType !== prevSearchType) {
      this.setState({ index: searchType === SEARCH_TYPES.USER ? 1 : 0 });
    }
    if (lang !== prevLang) {
      this.setState({
        routes: [
          { key: '1', title: i18n.illustManga },
          { key: '2', title: i18n.user },
        ],
      });
    }
  }

  componentWillUnmount() {
    if (this.backHandlerListener) {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.backHandlerListener,
      );
    }
  }

  handleChangeTab = index => {
    const { setSearchType } = this.props;
    if (index === 1) {
      setSearchType(SEARCH_TYPES.USER);
    } else {
      setSearchType(SEARCH_TYPES.ILLUST);
    }
  };

  handleOnFocusSearchBar = () => {
    this.setState({ isFocusSearchBar: true });
  };

  handleOnChangeSearchText = word => {
    this.setState({ word });
  };

  handleOnPressBackButton = () => {
    const { isFocusSearchBar } = this.state;
    if (isFocusSearchBar) {
      Keyboard.dismiss();
      this.setState({
        isFocusSearchBar: false,
        word: null,
      });
      return true;
    }
    return false;
  };

  renderScene = ({ route }) => {
    const { navigation } = this.props;
    switch (route.key) {
      case '1':
        return <TrendingIllustTags navigation={navigation} />;
      case '2':
        return <RecommendedUsers navigation={navigation} />;
      default:
        return null;
    }
  };

  render() {
    const { searchType, navigation } = this.props;
    const { word, isFocusSearchBar } = this.state;
    return (
      <View style={styles.container}>
        <PXSearchBar
          showSearchBar
          isPushNewSearch
          word={word}
          showBackButton={isFocusSearchBar}
          searchType={searchType}
          onFocus={this.handleOnFocusSearchBar}
          onChangeText={this.handleOnChangeSearchText}
          onPressBackButton={this.handleOnPressBackButton}
          onSubmitSearch={this.handleOnPressBackButton}
        />
        <View style={styles.content}>
          <PXTabView
            navigationState={this.state}
            renderScene={this.renderScene}
            onRequestChangeTab={this.handleChangeTab}
          />
          {isFocusSearchBar &&
            <Search
              word={word}
              navigation={navigation}
              isPushNewSearch
              searchType={searchType}
              onSubmitSearch={this.handleOnPressBackButton}
            />}
        </View>
      </View>
    );
  }
}

export default connectLocalization(
  connect(
    state => ({
      searchType: state.searchType.type,
    }),
    searchTypeActionCreators,
  )(Trending),
);
