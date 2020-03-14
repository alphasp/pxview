import React, { Component } from 'react';
import { connect } from 'react-redux';
import NovelList from '../../components/NovelList';
import * as newNovelsActionCreators from '../../common/actions/newNovels';
import { getNewNovelsItems } from '../../common/selectors';

class NewNovels extends Component {
  componentDidMount() {
    const { fetchNewNovels, clearNewNovels } = this.props;
    clearNewNovels();
    fetchNewNovels();
  }

  loadMoreItems = () => {
    const {
      newNovels: { nextUrl, loading },
      fetchNewNovels,
    } = this.props;
    if (!loading && nextUrl) {
      fetchNewNovels(nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { clearNewNovels, fetchNewNovels } = this.props;
    clearNewNovels();
    fetchNewNovels(null, true);
  };

  render() {
    const { newNovels, items, listKey, renderHeader } = this.props;
    return (
      <NovelList
        data={{ ...newNovels, items }}
        listKey={listKey}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
        renderHeader={renderHeader}
        onEndReachedThreshold={0.3}
      />
    );
  }
}

export default connect(
  (state, props) => {
    const { newNovels, user } = state;
    return {
      newNovels,
      items: getNewNovelsItems(state, props),
      user,
      listKey: `${props.route.key}-newNovels`,
    };
  },
  newNovelsActionCreators,
)(NewNovels);
