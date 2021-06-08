import React, { Component } from 'react';
import { View, InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import { connectLocalization } from '../components/Localization';
import IllustList from '../components/IllustList';
import NoResult from '../components/NoResult';
import * as searchIllustsActionCreators from '../common/actions/searchIllusts';
import { makeGetSearchIllustsItems } from '../common/selectors';
import { globalStyles } from '../styles';

class SearchIllustsResult extends Component {
  componentDidMount() {
    const {
      clearSearchIllusts,
      navigationStateKey,
      word,
      options,
    } = this.props;
    clearSearchIllusts(navigationStateKey);
    InteractionManager.runAfterInteractions(() => {
      this.search(word, options);
    });
  }

  componentDidUpdate(prevProps) {
    const {
      clearSearchIllusts,
      navigationStateKey,
      word,
      options,
    } = this.props;
    const { options: prevOptions, word: prevWord } = prevProps;
    if ((word && word !== prevWord) || (options && options !== prevOptions)) {
      clearSearchIllusts(navigationStateKey);
      this.search(word, options);
    }
  }

  loadMoreItems = () => {
    const {
      searchIllusts: { nextUrl, loading },
      word,
      options,
    } = this.props;
    if (!loading && nextUrl) {
      this.search(word, options, nextUrl);
    }
  };

  handleOnRefresh = () => {
    const {
      clearSearchIllusts,
      navigationStateKey,
      word,
      options,
    } = this.props;
    clearSearchIllusts(navigationStateKey);
    this.search(word, options, null, true);
  };

  search = (word, options, nextUrl, refreshing) => {
    const { fetchSearchIllusts, navigationStateKey } = this.props;
    fetchSearchIllusts(navigationStateKey, word, options, nextUrl, refreshing);
  };

  render() {
    const { searchIllusts, items, i18n, listKey } = this.props;
    return (
      <View style={globalStyles.container}>
        <IllustList
          data={{ ...searchIllusts, items }}
          listKey={listKey}
          loadMoreItems={this.loadMoreItems}
          onRefresh={this.handleOnRefresh}
        />
        {searchIllusts && searchIllusts.loaded && (!items || !items.length) && (
          <NoResult text={i18n.noSearchResult} />
        )}
      </View>
    );
  }
}

export default connectLocalization(
  connect(() => {
    const getSearchIllustsItems = makeGetSearchIllustsItems();
    return (state, props) => {
      const { searchIllusts } = state;
      const { navigationStateKey } = props;
      return {
        searchIllusts: searchIllusts[navigationStateKey],
        items: getSearchIllustsItems(state, props),
        listKey: navigationStateKey,
      };
    };
  }, searchIllustsActionCreators)(SearchIllustsResult),
);
