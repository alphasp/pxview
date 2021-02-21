import React, { Component } from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import TrendingIllustTags from './TrendingIllustTags';
import TrendingNovelTags from './TrendingNovelTags';
import TrendingRecommendUsers from './TrendingRecommendedUsers';
import Search from '../../containers/Search';
import PXSearchBar from '../../components/PXSearchBar';
import Pills from '../../components/Pills';
import { connectLocalization } from '../../components/Localization';
import { SEARCH_TYPES, SCREENS } from '../../common/constants';
import { addSearchHistory } from '../../common/actions/searchHistory';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  pills: {
    padding: 10,
  },
});

class Trending extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      isFocusSearchBar: false,
      word: null,
      searchType: SEARCH_TYPES.ILLUST,
    };
  }

  handleOnFocusSearchBar = () => {
    this.setState({ isFocusSearchBar: true });
  };

  handleOnChangeSearchText = (word) => {
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

  handleOnSubmitSearch = (word) => {
    const {
      navigation: { push },
    } = this.props;
    const { searchType } = this.state;
    this.handleOnPressBackButton();
    push(SCREENS.SearchResult, { word, searchType });
  };

  handleOnPressSearchHistoryItem = (word) => {
    const { dispatch } = this.props;
    this.handleOnSubmitSearch(word);
    dispatch(addSearchHistory(word));
  };

  handleOnChangePill = (index) => {
    const newState = {
      index,
    };
    if (index === 0) {
      newState.searchType = SEARCH_TYPES.ILLUST;
    } else if (index === 1) {
      newState.searchType = SEARCH_TYPES.NOVEL;
    } else {
      newState.searchType = SEARCH_TYPES.USER;
    }
    this.setState(newState);
  };

  handleOnPressPill = (index) => {
    const newState = {
      index,
    };
    if (index === 0) {
      newState.searchType = SEARCH_TYPES.ILLUST;
    } else if (index === 1) {
      newState.searchType = SEARCH_TYPES.NOVEL;
    } else {
      newState.searchType = SEARCH_TYPES.USER;
    }
    this.setState(newState);
  };

  renderHeader = () => {
    const { i18n } = this.props;
    const { index } = this.state;
    return (
      <Pills
        items={[
          {
            title: i18n.illustManga,
          },
          {
            title: i18n.novel,
          },
          {
            title: i18n.user,
          },
        ]}
        onPressItem={this.handleOnPressPill}
        selectedIndex={index}
        style={styles.pills}
      />
    );
  };

  renderContent = () => {
    const { index } = this.state;
    switch (index) {
      case 0:
        return (
          <TrendingIllustTags
            onPressSearchHistoryItem={this.handleOnPressSearchHistoryItem}
          />
        );
      case 1:
        return (
          <TrendingNovelTags
            onPressSearchHistoryItem={this.handleOnPressSearchHistoryItem}
          />
        );
      case 2:
        return (
          <TrendingRecommendUsers
            onPressSearchHistoryItem={this.handleOnPressSearchHistoryItem}
          />
        );
      default:
        return null;
    }
  };

  render() {
    const { navigation, trendingSearchSettings } = this.props;
    const { word, isFocusSearchBar, searchType, index } = this.state;
    let showBackButton = isFocusSearchBar;
    if (!isFocusSearchBar) {
      if (index === 0 && !trendingSearchSettings.isShowTrendingIllustTag) {
        showBackButton = false;
      }
      if (index === 1 && !trendingSearchSettings.isShowTrendingNovelTag) {
        showBackButton = false;
      }
      if (index === 2 && !trendingSearchSettings.isShowRecommendedUser) {
        showBackButton = false;
      }
    }
    return (
      <AndroidBackHandler onBackPress={this.handleOnPressBackButton}>
        <View style={styles.container}>
          <PXSearchBar
            showSearchBar
            word={word}
            showBackButton={showBackButton}
            // showMenuButton={!config.navigation.tab && !isFocusSearchBar}
            searchType={searchType}
            onFocus={this.handleOnFocusSearchBar}
            onChangeText={this.handleOnChangeSearchText}
            onPressBackButton={this.handleOnPressBackButton}
            onSubmitSearch={this.handleOnSubmitSearch}
            withShadow={false}
          />
          <View style={styles.content}>
            {this.renderHeader()}
            {this.renderContent()}
            {isFocusSearchBar && (
              <Search
                word={word}
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
  connect((state) => ({
    trendingSearchSettings: state.trendingSearchSettings,
  }))(Trending),
);
