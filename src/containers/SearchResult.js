import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  RecyclerViewBackedScrollView,
  RefreshControl,
  InteractionManager,
} from 'react-native';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';
// import { createSelector } from 'reselect'
import IllustList from '../components/IllustList';
import * as searchActionCreators from '../common/actions/search';
import { SORT_TYPES } from '../common/constants/sortTypes';
import { denormalizedData } from '../common/helpers/normalizrHelper';
import Schemas from '../common/constants/schemas';

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
      console.log('word prevWord ', word, prevWord);
      console.log('options prevOptions ', options, prevOptions);
      clearSearch(navigationStateKey);
      this.search(word, options);
    }
  }

  loadMoreItems = () => {
    const { navigationStateKey, search: { nextUrl, loading }, word, options } = this.props;
    if (!loading && nextUrl) {
      console.log('load more ', nextUrl)
      this.search(word, options, nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { clearSearch, navigationStateKey, word, options } = this.props;
    clearSearch(navigationStateKey);
    this.search(word, options, null, true);
  }

  search = (word, options, nextUrl, refreshing) => {
    const { fetchSearch, navigationStateKey, search } = this.props;
    fetchSearch(navigationStateKey, word, options, nextUrl, refreshing);
  }

  render() {
    const { search, word, options, navigation, navigationStateKey } = this.props;
    return (
      <IllustList
        data={search}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

// const makeGetSearch  = () => {
//   return createSelector(
//     [
//       state => state.entities,
//       (state, props) => state.search[props.navigationStateKey]
//     ],
//     (entities, search) => {
//       console.log('ss')
//       return {
//         ...search,
//         items: (search && search.items) ? denormalize(search.items, Schemas.ILLUST_ARRAY, entities) : []
//       }
//     }
//   )
// }

// const makeMapStateToProps = () => {
//   const getSearch = makeGetSearch();
//   const mapStateToProps = (state, props) => {
//     console.log('recompute ', getSearch.recomputations())
//     return {
//       search: getSearch(state, props)
//     }
//   }
//   return mapStateToProps
// }

// export default connect(makeMapStateToProps)(SearchResult);

export default connect((state, props) => {
  const { entities, search } = state;
  const { navigationStateKey } = props;
  return {
    search: denormalizedData(search[navigationStateKey], 'items', Schemas.ILLUST_ARRAY, entities),
  }
}, searchActionCreators)(SearchResult);