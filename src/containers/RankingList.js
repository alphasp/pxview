import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  RecyclerViewBackedScrollView,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import IllustList from '../components/IllustList';
import { fetchRanking, clearRanking, RankingMode } from '../common/actions/ranking';

class RankingList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    const { dispatch, rankingMode } = this.props;
    dispatch(fetchRanking(rankingMode));
  }

  loadMoreItems = () => {
    const { dispatch, ranking: { nextUrl }, rankingMode } = this.props;
    console.log('load more ', nextUrl)
    if (nextUrl) {
      dispatch(fetchRanking(rankingMode, null, nextUrl));
    }
  }

  handleOnRefresh = () => {
    const { dispatch, rankingMode } = this.props;
    this.setState({
      refereshing: true
    });
    dispatch(clearRanking(rankingMode));
    dispatch(fetchRanking(rankingMode)).finally(() => {
      this.setState({
        refereshing: false
      }); 
    });
  }

  render() {
    const { ranking } = this.props;
    const { refreshing } = this.state;
    return (
      <IllustList
        data={ranking}
        refreshing={refreshing}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect((state, props) => {
  return {
    ranking: state.ranking[props.rankingMode]
  }
})(RankingList);