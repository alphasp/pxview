import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Keyboard,
  Platform,
  BackHandler,
} from 'react-native';
import TrendingIllustTags from './TrendingIllustTags';
import RecommendedUsers from '../Shared/RecommendedUsers';
import Search from '../../containers/Search';
import PXSearchBar from '../../components/PXSearchBar';
import PXTabView from '../../components/PXTabView';
import { connectLocalization } from '../../components/Localization';
import { SEARCH_TYPES, SCREENS } from '../../common/constants';
import config from '../../common/config';

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
    const { i18n } = props;
    this.state = {
      index: 0,
      routes: [
        { key: '1', title: i18n.illustManga },
        { key: '2', title: i18n.user },
      ],
      isFocusSearchBar: false,
      word: null,
      searchType: SEARCH_TYPES.ILLUST,
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
    const { lang: prevLang } = this.props;
    const { lang, i18n } = nextProps;
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
    const newState = {
      index,
    };
    if (index === 1) {
      newState.searchType = SEARCH_TYPES.USER;
    } else {
      newState.searchType = SEARCH_TYPES.ILLUST;
    }
    this.setState(newState);
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

  handleOnSubmitSearch = word => {
    const { navigate } = this.props.navigation;
    const { searchType } = this.state;
    this.handleOnPressBackButton();
    navigate(SCREENS.SearchResult, { word, searchType });
  };

  handleOnChangeSearchTab = index => {
    const newState = {
      index,
    };
    if (index === 1) {
      newState.searchType = SEARCH_TYPES.USER;
    } else {
      newState.searchType = SEARCH_TYPES.ILLUST;
    }
    this.setState(newState);
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
    const { navigation } = this.props;
    const { word, isFocusSearchBar, searchType } = this.state;
    return (
      <View style={styles.container}>
        <PXSearchBar
          showSearchBar
          word={word}
          showBackButton={isFocusSearchBar}
          showMenuButton={!config.navigation.tab && !isFocusSearchBar}
          searchType={searchType}
          onFocus={this.handleOnFocusSearchBar}
          onChangeText={this.handleOnChangeSearchText}
          onPressBackButton={this.handleOnPressBackButton}
          onSubmitSearch={this.handleOnSubmitSearch}
          isFocus={isFocusSearchBar}
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
              searchType={searchType}
              onSubmitSearch={this.handleOnSubmitSearch}
              onChangeTab={this.handleOnChangeSearchTab}
            />}
        </View>
      </View>
    );
  }
}

export default connectLocalization(Trending);
