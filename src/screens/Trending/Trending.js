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
import PXHeader from '../../components/PXHeader';
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
      tabBarLabel: params && params.i18n.search,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: '1', title: 'Illust/Manga' },
        { key: '2', title: 'User' },
      ],
      isFocusSearchBar: false,
      word: null,
    };
  }

  componentDidMount() {
    const { i18n, navigation: { setParams } } = this.props;
    setParams({
      i18n,
    });
    if (Platform.OS === 'android') {
      this.backHandlerListener = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleOnPressBackButton,
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    const { searchType: prevSearchType } = this.props;
    const { searchType } = nextProps;
    if (searchType !== prevSearchType) {
      this.setState({ index: searchType === SEARCH_TYPES.USER ? 1 : 0 });
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

  render() {
    const { searchType, navigation } = this.props;
    const { word, isFocusSearchBar } = this.state;
    return (
      <View style={styles.container}>
        <PXHeader
          word={word}
          navigation={navigation}
          showBackButton={isFocusSearchBar}
          searchType={searchType}
          isPushNewSearch
          onFocusSearchBar={this.handleOnFocusSearchBar}
          onChangeSearchText={this.handleOnChangeSearchText}
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
