import React, { Component } from 'react';
import { connect } from 'react-redux';
import IllustList from '../../components/IllustList';
import * as recommendedMangasActionCreators from '../../common/actions/recommendedMangas';
import { getRecommendedMangasItems } from '../../common/selectors';

class RecommendedMangas extends Component {
  componentDidMount() {
    const { fetchRecommendedMangas, clearRecommendedMangas } = this.props;
    clearRecommendedMangas();
    fetchRecommendedMangas();
  }

  loadMoreItems = () => {
    const {
      recommendedMangas: { nextUrl, loading },
      fetchRecommendedMangas,
    } = this.props;
    if (!loading && nextUrl) {
      fetchRecommendedMangas('', nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { fetchRecommendedMangas, clearRecommendedMangas } = this.props;
    clearRecommendedMangas();
    fetchRecommendedMangas(null, null, true);
  };

  render() {
    const { recommendedMangas, items, listKey } = this.props;
    return (
      <IllustList
        data={{ ...recommendedMangas, items }}
        listKey={listKey}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect((state, props) => {
  const { recommendedMangas } = state;
  return {
    recommendedMangas,
    items: getRecommendedMangasItems(state, props),
    listKey: `${props.navigation.state.key}-recommendedMangas`,
  };
}, recommendedMangasActionCreators)(RecommendedMangas);
