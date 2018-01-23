import React, { Component } from 'react';
import { connect } from 'react-redux';
import IllustList from '../../../components/IllustList';
import { getBrowsingHistoryIllustsItems } from '../../../common/selectors';

class BrowsingHistoryIllusts extends Component {
  render() {
    const { browsingHistoryIllusts, items, listKey } = this.props;
    return (
      <IllustList
        data={{ ...browsingHistoryIllusts, items }}
        listKey={listKey}
      />
    );
  }
}

export default connect((state, props) => {
  const { browsingHistoryIllusts } = state;
  return {
    browsingHistoryIllusts,
    items: getBrowsingHistoryIllustsItems(state, props),
    listKey: `${props.navigation.state.key}-browsingHistoryIllusts`,
  };
})(BrowsingHistoryIllusts);
