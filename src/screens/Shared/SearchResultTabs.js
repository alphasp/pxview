import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Keyboard,
  Platform,
  BackHandler,
} from 'react-native';
import { connect } from 'react-redux';
import Search from '../../containers/Search';
import SearchResult from '../../containers/SearchResult';
import SearchUsersResult from '../../containers/SearchUsersResult';
import { connectLocalization } from '../../components/Localization';
import PXSearchBar from '../../components/PXSearchBar';
import PXTabView from '../../components/PXTabView';
import HeaderFilterButton from '../../components/HeaderFilterButton';
import * as searchTypeActionCreators from '../../common/actions/searchType';
import * as searchAutoCompleteActionCreators
  from '../../common/actions/searchAutoComplete';
import * as searchUsersAutoCompleteActionCreators
  from '../../common/actions/searchUsersAutoComplete';
import { navReplace } from '../../common/actions/nav';
import { SEARCH_TYPES } from '../../common/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

class SearchResultTabs extends Component {
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
    const { searchType, word, i18n } = props;
    this.state = {
      // initSearchType: searchType,
      index: searchType === SEARCH_TYPES.USER ? 1 : 0,
      routes: [
        { key: '1', title: i18n.illustManga },
        { key: '2', title: i18n.user },
      ],
      isFocusSearchBar: false,
      newWord: word,
      searchOptions: {},
    };
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      this.backHandlerListener = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleOnPressHardwareBackButton,
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
    this.setState({ newWord: word });
  };

  handleOnPressShowFilterModal = () => {
    const { navigate, goBack } = this.props.navigation;
    const { searchOptions } = this.state;
    Keyboard.dismiss();
    this.setState({
      isFocusSearchBar: false,
    });
    setTimeout(() => {
      navigate('SearchFilterModal', {
        searchFilter: searchOptions || {},
        onPressApplyFilter: (target, duration, sort) => {
          goBack(null);
          // setTimeout(() => setParams({
          //   searchOptions: {
          //     duration,
          //     target,
          //     sort
          //   },
          // }), 0);
          this.setState({
            searchOptions: {
              duration,
              target,
              sort,
            },
          });
        },
      });
    });
  };

  handleOnPressBackButton = () => {
    const { word, navigation: { goBack } } = this.props;
    const { isFocusSearchBar } = this.state;
    if (isFocusSearchBar) {
      Keyboard.dismiss();
      this.setState({
        isFocusSearchBar: false,
        newWord: word,
      });
    } else {
      goBack();
    }
  };

  handleOnPressHardwareBackButton = () => {
    const { word } = this.props;
    const { isFocusSearchBar } = this.state;
    if (isFocusSearchBar) {
      Keyboard.dismiss();
      this.setState({
        isFocusSearchBar: false,
        newWord: word,
      });
      return true;
    }
    return false;
  };

  handleOnSubmitSearch = word => {
    const { dispatch, state } = this.props.navigation;
    Keyboard.dismiss();
    this.setState({
      isFocusSearchBar: false,
      newWord: word,
    });
    dispatch(
      navReplace('SearchResult', state.key, {
        word,
      }),
    );
    return true;
  };

  renderScene = ({ route }) => {
    const { word, navigation, navigationStateKey } = this.props;
    const { searchOptions } = this.state;
    switch (route.key) {
      case '1':
        return (
          <SearchResult
            word={word}
            options={searchOptions}
            navigation={navigation}
            navigationStateKey={navigationStateKey}
          />
        );
      case '2':
        return (
          <SearchUsersResult
            word={word}
            navigation={navigation}
            navigationStateKey={navigationStateKey}
          />
        );
      default:
        return null;
    }
  };

  render() {
    const { searchType, navigationStateKey, navigation } = this.props;
    const { newWord, isFocusSearchBar } = this.state;
    return (
      <View style={styles.container}>
        <PXSearchBar
          showBackButton
          word={newWord}
          searchType={searchType}
          onFocus={this.handleOnFocusSearchBar}
          onChangeText={this.handleOnChangeSearchText}
          onPressBackButton={this.handleOnPressBackButton}
          onSubmitSearch={this.handleOnSubmitSearch}
          headerRight={
            <HeaderFilterButton
              disabled={searchType === SEARCH_TYPES.USER}
              color={searchType === SEARCH_TYPES.USER ? '#E9EBEE' : '#000'}
              onPress={this.handleOnPressShowFilterModal}
            />
          }
        />
        <View style={styles.content}>
          <PXTabView
            navigationState={{
              ...this.state,
              navigation,
              navigationStateKey,
            }}
            renderScene={this.renderScene}
            onRequestChangeTab={this.handleChangeTab}
          />
          {isFocusSearchBar &&
            <Search
              word={newWord}
              navigation={navigation}
              searchType={searchType}
              onSubmitSearch={this.handleOnSubmitSearch}
            />}
        </View>
      </View>
    );
  }
}

export default connectLocalization(
  connect(
    (state, props) => ({
      searchType: state.searchType.type,
      word: props.navigation.state.params.word,
      navigationStateKey: props.navigation.state.key,
    }),
    {
      ...searchAutoCompleteActionCreators,
      ...searchUsersAutoCompleteActionCreators,
      ...searchTypeActionCreators,
    },
  )(SearchResultTabs),
);
