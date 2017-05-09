import React, { Component } from 'react';
import { connect } from 'react-redux';
import IllustList from '../../components/IllustList';
import * as newIllustsActionCreators from '../../common/actions/newIllusts';
import { getNewIllustsItems } from '../../common/selectors';

class NewIllusts extends Component {
  componentDidMount() {
    const { fetchNewIllusts } = this.props;
    fetchNewIllusts();
  }

  loadMoreItems = () => {
    const { fetchNewIllusts, newIllusts: { nextUrl, loading } } = this.props;
    if (!loading && nextUrl) {
      console.log('load more ', nextUrl);
      fetchNewIllusts(nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { fetchNewIllusts, clearNewIllusts } = this.props;
    clearNewIllusts();
    fetchNewIllusts(null, true);
  };

  render() {
    const { newIllusts, items } = this.props;
    return (
      <IllustList
        data={{ ...newIllusts, items }}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(state => {
  const { newIllusts } = state;
  return {
    newIllusts,
    items: getNewIllustsItems(state),
  };
}, newIllustsActionCreators)(NewIllusts);
