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
import { fetchSearch, clearSearch, SortType } from '../common/actions/search';
import Schemas from '../common/constants/schemas';

class SearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    const { dispatch, navigationStateKey, word, options } = this.props;
    dispatch(clearSearch(navigationStateKey));
    InteractionManager.runAfterInteractions(() => {
      this.search(word, options);
    });
  }

  componentWillReceiveProps(nextProps) {
    const { options: prevOptions, word: prevWord } = this.props;
    const { dispatch, navigationStateKey, word, options } = nextProps;
    if ((word && word !== prevWord) || (options && options !== prevOptions)) {
      console.log('word prevWord ', word, prevWord);
      console.log('options prevOptions ', options, prevOptions);
      dispatch(clearSearch(navigationStateKey));
      this.search(word, options);
    }
  }

  loadMoreItems = () => {
    const { dispatch, navigationStateKey, search, word } = this.props;
    console.log('load more ', search.nextUrl)
    if (search && search.nextUrl) {
      this.search(word, null, search.nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { dispatch, navigationStateKey, word, options } = this.props;
    this.setState({
      refereshing: true
    });
    dispatch(clearSearch(navigationStateKey));
    this.search(word, options, null).finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  search = (word, options, nextUrl) => {
    const { dispatch, navigationStateKey, search } = this.props;
    return dispatch(fetchSearch(navigationStateKey, word, options, nextUrl, search));
  }

  render() {
    const { search, word, options, navigation, navigationStateKey } = this.props;
    const { refreshing } = this.state;
    return (
      <IllustList
        data={search}
        refreshing={refreshing}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
        navigation={navigation}
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
  const { navigationStateKey } = props;
  const { entities, search } = state;
  // let denormalizedItems = [];
  // if (search[navigationStateKey]) {
  //   denormalizedItems = denormalize(search[navigationStateKey].items, Schemas.ILLUST_ARRAY, entities);
  // }
  // console.log('de ', denormalizedItems)
  return {
    search: {
      ...search[navigationStateKey],
      items: search[navigationStateKey] ? denormalize(search[navigationStateKey].items, Schemas.ILLUST_ARRAY, entities) : []
    },
  }
})(SearchResult);