import React, { Component } from 'react';
import { connect } from 'react-redux';
import IllustList from '../../components/IllustList';
import * as newIllustsActionCreators from '../../common/actions/newIllusts';
import { getNewIllustsItems } from '../../common/selectors';

class NewIllusts extends Component {
  componentDidMount() {
    const { fetchNewIllusts, clearNewIllusts } = this.props;
    clearNewIllusts();
    fetchNewIllusts();
  }

  loadMoreItems = () => {
    const { fetchNewIllusts, newIllusts: { nextUrl, loading } } = this.props;
    if (!loading && nextUrl) {
      fetchNewIllusts(nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { fetchNewIllusts, clearNewIllusts } = this.props;
    clearNewIllusts();
    fetchNewIllusts(null, true);
  };

  render() {
    const { newIllusts, items, listKey, renderHeader } = this.props;
    return (
      <IllustList
        data={{ ...newIllusts, items }}
        listKey={listKey}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
        renderHeader={renderHeader}
        onEndReachedThreshold={0.3}
      />
    );
  }
}

export default connect((state, props) => {
  const { newIllusts } = state;
  return {
    newIllusts,
    items: getNewIllustsItems(state),
    listKey: `${props.navigation.state.key}-newUserIllusts`,
  };
}, newIllustsActionCreators)(NewIllusts);
