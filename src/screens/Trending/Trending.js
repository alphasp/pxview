import React, { Component } from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import TrendingIllustTags from './TrendingIllustTags';
import TrendingNovelTags from './TrendingNovelTags';
import RecommendedUsers from '../Shared/RecommendedUsers';
import Search from '../../containers/Search';
import PXSearchBar from '../../components/PXSearchBar';
import Pills from '../../components/Pills';
import { connectLocalization } from '../../components/Localization';
import { SEARCH_TYPES, SCREENS } from '../../common/constants';

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
    const { navigation } = this.props;
    const { index } = this.state;
    switch (index) {
      case 0:
        return <TrendingIllustTags navigation={navigation} />;
      case 1:
        return <TrendingNovelTags navigation={navigation} />;
      case 2:
        return <RecommendedUsers navigation={navigation} />;
      default:
        return null;
    }
  };

  render() {
    const { navigation } = this.props;
    const { word, isFocusSearchBar, searchType } = this.state;
    return (
      <AndroidBackHandler onBackPress={this.handleOnPressBackButton}>
        <View style={styles.container}>
          <PXSearchBar
            showSearchBar
            word={word}
            showBackButton={isFocusSearchBar}
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

export default connectLocalization(Trending);
