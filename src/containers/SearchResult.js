import React, { Component } from 'react';
import { View, InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import { connectLocalization } from '../components/Localization';
import IllustList from '../components/IllustList';
import NoResult from '../components/NoResult';
import * as searchActionCreators from '../common/actions/search';
import { makeGetSearchItems } from '../common/selectors';
import { globalStyles } from '../styles';

class SearchResult extends Component {
  componentDidMount() {
    const { clearSearch, navigationStateKey, word, options } = this.props;
    clearSearch(navigationStateKey);
    InteractionManager.runAfterInteractions(() => {
      this.search(word, options);
    });
  }

  componentWillReceiveProps(nextProps) {
    const { options: prevOptions, word: prevWord } = this.props;
    const { clearSearch, navigationStateKey, word, options } = nextProps;
    if ((word && word !== prevWord) || (options && options !== prevOptions)) {
      clearSearch(navigationStateKey);
      this.search(word, options);
    }
  }

  loadMoreItems = () => {
    const { search: { nextUrl, loading }, word, options } = this.props;
    if (!loading && nextUrl) {
      this.search(word, options, nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { clearSearch, navigationStateKey, word, options } = this.props;
    clearSearch(navigationStateKey);
    this.search(word, options, null, true);
  };

  search = (word, options, nextUrl, refreshing) => {
    const { fetchSearch, navigationStateKey } = this.props;
    fetchSearch(navigationStateKey, word, options, nextUrl, refreshing);
  };

  render() {
    const { search, items, i18n, listKey } = this.props;
    return (
      <View style={globalStyles.container}>
        <IllustList
          data={{ ...search, items }}
          listKey={listKey}
          loadMoreItems={this.loadMoreItems}
          onRefresh={this.handleOnRefresh}
        />
        {search &&
          search.loaded &&
          (!items || !items.length) &&
          <NoResult text={i18n.noSearchResult} />}
      </View>
    );
  }
}

export default connectLocalization(
  connect(() => {
    const getSearchItems = makeGetSearchItems();
    return (state, props) => {
      const { search } = state;
      const { navigationStateKey } = props;
      return {
        search: search[navigationStateKey],
        items: getSearchItems(state, props),
        listKey: navigationStateKey,
      };
    };
  }, searchActionCreators)(SearchResult),
);
