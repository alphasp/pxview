import React, { Component } from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import Search from '../../containers/Search';
import SearchIllustsResult from '../../containers/SearchIllustsResult';
import SearchNovelsResult from '../../containers/SearchNovelsResult';
import SearchUsersResult from '../../containers/SearchUsersResult';
import { connectLocalization } from '../../components/Localization';
import PXSearchBar from '../../components/PXSearchBar';
import HeaderFilterButton from '../../components/HeaderFilterButton';
import HeaderEncyclopediaButton from '../../components/HeaderEncyclopediaButton';
import * as searchAutoCompleteActionCreators from '../../common/actions/searchAutoComplete';
import * as searchUsersAutoCompleteActionCreators from '../../common/actions/searchUsersAutoComplete';
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
    const { word, route } = props;
    const { searchType } = route.params;
    this.state = {
      searchType,
      newSearchType: searchType,
      isFocusSearchBar: false,
      newWord: word,
      searchOptions: {},
    };
  }

  componentDidUpdate(prevProps) {
    const { route } = this.props;
    const { route: prevRoute } = prevProps;
    if (
      route?.params?.target !== prevRoute?.params.target ||
      route?.params?.period !== prevRoute?.params.period ||
      route?.params?.sort !== prevRoute?.params.sort ||
      route?.params?.startDate !== prevRoute?.params.startDate ||
      route?.params?.endDate !== prevRoute?.params.endDate ||
      route?.params?.bookmarkNumMin !== prevRoute?.params.bookmarkNumMin ||
      route?.params?.bookmarkNumMax !== prevRoute?.params.bookmarkNumMax ||
      route?.params?.bookmarkCountsTag !== prevRoute?.params.bookmarkCountsTag
    ) {
      const {
        target,
        period,
        sort,
        startDate,
        endDate,
        bookmarkNumMin,
        bookmarkNumMax,
        bookmarkCountsTag,
      } = route.params;
      this.setState({
        searchOptions: {
          search_target: target,
          period,
          sort,
          start_date: startDate,
          end_date: endDate,
          bookmark_num_min: bookmarkNumMin,
          bookmark_num_max: bookmarkNumMax,
          bookmarkCountsTag,
        },
      });
    }
  }

  handleOnFocusSearchBar = () => {
    this.setState({ isFocusSearchBar: true });
  };

  handleOnChangeSearchText = (word) => {
    this.setState({ newWord: word });
  };

  handleOnPressShowFilterModal = () => {
    const { word, navigation } = this.props;
    const { navigate } = navigation;
    const { searchOptions, newSearchType } = this.state;
    Keyboard.dismiss();
    this.setState({
      isFocusSearchBar: false,
    });
    setTimeout(() => {
      navigate(SCREENS.SearchFilterModal, {
        word,
        searchFilter: searchOptions || {},
        searchType: newSearchType,
      });
    });
  };

  handleOnPressViewEncyclopedia = () => {
    const {
      word,
      navigation: { navigate },
    } = this.props;
    navigate(SCREENS.Encyclopedia, {
      word,
    });
  };

  handleOnPressBackButton = () => {
    const {
      word,
      navigation: { goBack },
    } = this.props;
    const { isFocusSearchBar, searchType } = this.state;
    if (isFocusSearchBar) {
      Keyboard.dismiss();
      this.setState({
        isFocusSearchBar: false,
        newWord: word,
        newSearchType: searchType,
      });
    } else {
      goBack();
    }
  };

  handleOnPressHardwareBackButton = () => {
    const { word } = this.props;
    const { isFocusSearchBar, searchType } = this.state;
    if (isFocusSearchBar) {
      Keyboard.dismiss();
      this.setState({
        isFocusSearchBar: false,
        newWord: word,
        newSearchType: searchType,
      });
      return true;
    }
    return false;
  };

  handleOnSubmitSearch = (word) => {
    const { setParams } = this.props.navigation;
    const { searchType, newSearchType } = this.state;
    Keyboard.dismiss();
    const nextState = {
      isFocusSearchBar: false,
      newWord: word,
    };
    if (searchType !== newSearchType) {
      nextState.searchType = newSearchType;
      nextState.searchOptions = {};
    }
    this.setState(nextState);
    setParams({
      word,
    });
    return true;
  };

  handleOnChangePill = (index) => {
    const newState = {};
    if (index === 0) {
      newState.newSearchType = SEARCH_TYPES.ILLUST;
    } else if (index === 1) {
      newState.newSearchType = SEARCH_TYPES.NOVEL;
    } else {
      newState.newSearchType = SEARCH_TYPES.USER;
    }
    this.setState(newState);
  };

  renderContent = () => {
    const { word, navigation, navigationStateKey } = this.props;
    const { searchOptions, searchType } = this.state;
    switch (searchType) {
      case SEARCH_TYPES.ILLUST:
        return (
          <SearchIllustsResult
            word={word}
            options={searchOptions}
            navigation={navigation}
            navigationStateKey={navigationStateKey}
          />
        );
      case SEARCH_TYPES.NOVEL:
        return (
          <SearchNovelsResult
            word={word}
            options={searchOptions}
            navigation={navigation}
            navigationStateKey={navigationStateKey}
          />
        );
      case SEARCH_TYPES.USER:
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
    const { navigation } = this.props;
    const { newWord, isFocusSearchBar, searchType } = this.state;
    return (
      <AndroidBackHandler onBackPress={this.handleOnPressHardwareBackButton}>
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
              !isFocusSearchBar && searchType !== SEARCH_TYPES.USER ? (
                <View style={{ flexDirection: 'row' }}>
                  <HeaderEncyclopediaButton
                    onPress={this.handleOnPressViewEncyclopedia}
                  />
                  <HeaderFilterButton
                    onPress={this.handleOnPressShowFilterModal}
                  />
                </View>
              ) : null
            }
          />
          <View style={styles.content}>
            {this.renderContent()}
            {isFocusSearchBar && (
              <Search
                word={newWord}
                navigation={navigation}
                searchType={searchType}
                onSubmitSearch={this.handleOnSubmitSearch}
                onChangePill={this.handleOnChangePill}
              />
            )}
          </View>
        </View>
      </AndroidBackHandler>
    );
  }
}

export default connectLocalization(
  connect(
    (state, props) => ({
      word: props.route.params.word,
      navigationStateKey: props.route.key,
    }),
    {
      ...searchAutoCompleteActionCreators,
      ...searchUsersAutoCompleteActionCreators,
    },
  )(SearchResultTabs),
);
