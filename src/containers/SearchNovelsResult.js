import React, { Component } from 'react';
import { View, InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import { connectLocalization } from '../components/Localization';
import NovelList from '../components/NovelList';
import NoResult from '../components/NoResult';
import * as searchNovelsActionCreators from '../common/actions/searchNovels';
import { makeGetSearchNovelsItems } from '../common/selectors';
import { globalStyles } from '../styles';

class SearchNovelsResult extends Component {
  componentDidMount() {
    const { clearSearchNovels, navigationStateKey, word, options } = this.props;
    clearSearchNovels(navigationStateKey);
    InteractionManager.runAfterInteractions(() => {
      this.search(word, options);
    });
  }

  componentDidUpdate(prevProps) {
    const { clearSearchNovels, navigationStateKey, word, options } = this.props;
    const { options: prevOptions, word: prevWord } = prevProps;
    if ((word && word !== prevWord) || (options && options !== prevOptions)) {
      clearSearchNovels(navigationStateKey);
      this.search(word, options);
    }
  }

  loadMoreItems = () => {
    const {
      searchNovels: { nextUrl, loading },
      word,
      options,
    } = this.props;
    if (!loading && nextUrl) {
      this.search(word, options, nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { clearSearchNovels, navigationStateKey, word, options } = this.props;
    clearSearchNovels(navigationStateKey);
    this.search(word, options, null, true);
  };

  search = (word, options, nextUrl, refreshing) => {
    const { fetchSearchNovels, navigationStateKey } = this.props;
    fetchSearchNovels(navigationStateKey, word, options, nextUrl, refreshing);
  };

  render() {
    const { searchNovels, items, i18n, listKey } = this.props;
    return (
      <View style={globalStyles.container}>
        <NovelList
          data={{ ...searchNovels, items }}
          listKey={listKey}
          loadMoreItems={this.loadMoreItems}
          onRefresh={this.handleOnRefresh}
        />
        {searchNovels && searchNovels.loaded && (!items || !items.length) && (
          <NoResult text={i18n.noSearchResult} />
        )}
      </View>
    );
  }
}

export default connectLocalization(
  connect(() => {
    const getSearchNovelsItems = makeGetSearchNovelsItems();
    return (state, props) => {
      const { searchNovels } = state;
      const { navigationStateKey } = props;
      return {
        searchNovels: searchNovels[navigationStateKey],
        items: getSearchNovelsItems(state, props),
        listKey: navigationStateKey,
      };
    };
  }, searchNovelsActionCreators)(SearchNovelsResult),
);
