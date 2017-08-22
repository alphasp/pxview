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
import HeaderEncyclopediaButton from '../../components/HeaderEncyclopediaButton';
import * as searchAutoCompleteActionCreators from '../../common/actions/searchAutoComplete';
import * as searchUsersAutoCompleteActionCreators from '../../common/actions/searchUsersAutoComplete';
import { navReplace } from '../../common/actions/nav';
import { SEARCH_TYPES, SCREENS } from '../../common/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

class SearchResultTabs extends Component {
  constructor(props) {
    super(props);
    const { word, i18n, navigation } = props;
    const { searchType } = navigation.state.params;
    this.state = {
      index: searchType === SEARCH_TYPES.USER ? 1 : 0,
      searchType,
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
      navigate(SCREENS.SearchFilterModal, {
        searchFilter: searchOptions || {},
        onPressApplyFilter: (target, duration, sort) => {
          goBack(null);
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

  handleOnPressViewEncyclopedia = () => {
    const { word, navigation: { navigate } } = this.props;
    navigate(SCREENS.Encyclopedia, {
      word,
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
    const { navigationStateKey, navigation } = this.props;
    const { newWord, isFocusSearchBar, searchType } = this.state;
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
            <View style={{ flexDirection: 'row' }}>
              <HeaderEncyclopediaButton
                disabled={searchType === SEARCH_TYPES.USER}
                color={searchType === SEARCH_TYPES.USER ? '#E9EBEE' : '#000'}
                onPress={this.handleOnPressViewEncyclopedia}
              />
              <HeaderFilterButton
                disabled={searchType === SEARCH_TYPES.USER}
                color={searchType === SEARCH_TYPES.USER ? '#E9EBEE' : '#000'}
                onPress={this.handleOnPressShowFilterModal}
              />
            </View>
          }
          isFocus={isFocusSearchBar}
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
              onChangeTab={this.handleOnChangeSearchTab}
            />}
        </View>
      </View>
    );
  }
}

export default connectLocalization(
  connect(
    (state, props) => ({
      word: props.navigation.state.params.word,
      navigationStateKey: props.navigation.state.key,
    }),
    {
      ...searchAutoCompleteActionCreators,
      ...searchUsersAutoCompleteActionCreators,
    },
  )(SearchResultTabs),
);
