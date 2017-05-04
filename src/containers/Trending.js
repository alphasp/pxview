import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Keyboard,
  Platform,
  BackHandler,
} from 'react-native';
import { connect } from 'react-redux';
import PXTabView from '../components/PXTabView';
import TrendingIllustTags from './TrendingIllustTags';
import RecommendedUsers from './RecommendedUsers';
import PXHeader from '../components/PXHeader';
import Search from './Search';
import { setSearchType, SearchType } from '../common/actions/searchType';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

class Trending extends Component {
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
    if (Platform.OS == 'android') {
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
      this.setState({ index: searchType === SearchType.USER ? 1 : 0 });
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
      setSearchType(SearchType.USER);
    } else {
      setSearchType(SearchType.ILLUST);
    }
  };

  renderScene = ({ route }) => {
    const { navigation, screenProps } = this.props;
    switch (route.key) {
      case '1':
        return (
          <TrendingIllustTags
            navigation={navigation}
            screenProps={screenProps}
          />
        );
      case '2':
        return (
          <RecommendedUsers navigation={navigation} screenProps={screenProps} />
        );
      default:
        return null;
    }
  };

  handleOnFocusSearchBar = () => {
    this.setState({ isFocusSearchBar: true });
  };

  handleOnChangeSearchText = (word) => {
    this.setState({ word });
  };

  handleOnPressBackButton = () => {
    const { goBack } = this.props.navigation;
    const { isFocusSearchBar } = this.state;
    if (isFocusSearchBar) {
      Keyboard.dismiss();
      this.setState({
        isFocusSearchBar: false,
        word: null,
      });
      // to disable goBack from react-navigation
      return true;
    }
    goBack();
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

export default connect(
  (state, props) => ({
    searchType: state.searchType.type,
  }),
  { setSearchType },
)(Trending);
