import React, { Component } from 'react';
import { connect } from 'react-redux';
import NovelList from '../../../components/NovelList';
import { getBrowsingHistoryNovelsItems } from '../../../common/selectors';

class BrowsingHistoryNovels extends Component {
  render() {
    const { browsingHistoryNovels, items, listKey } = this.props;
    return (
      <NovelList data={{ ...browsingHistoryNovels, items }} listKey={listKey} />
    );
  }
}

export default connect((state, props) => {
  const { browsingHistoryNovels } = state;
  return {
    browsingHistoryNovels,
    items: getBrowsingHistoryNovelsItems(state, props),
    listKey: `${props.navigation.state.key}-browsingHistoryNovels`,
  };
})(BrowsingHistoryNovels);
