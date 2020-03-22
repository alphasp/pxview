import React, { Component } from 'react';
import { connect } from 'react-redux';
import IllustList from '../../components/IllustList';
import * as myPixivIllustsActionCreators from '../../common/actions/myPixivIllusts';
import { getMyPixivIllustsItems } from '../../common/selectors';

class MyPixivIllusts extends Component {
  componentDidMount() {
    const { fetchMyPixivIllusts, clearMyPixivIllusts } = this.props;
    clearMyPixivIllusts();
    fetchMyPixivIllusts();
  }

  loadMoreItems = () => {
    const {
      fetchMyPixivIllusts,
      myPixivIllusts: { nextUrl, loading },
    } = this.props;
    if (!loading && nextUrl) {
      fetchMyPixivIllusts(nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { fetchMyPixivIllusts, clearMyPixivIllusts } = this.props;
    clearMyPixivIllusts();
    fetchMyPixivIllusts(null, true);
  };

  render() {
    const { myPixivIllusts, items, listKey, renderHeader } = this.props;
    return (
      <IllustList
        data={{ ...myPixivIllusts, items }}
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
  const { myPixivIllusts } = state;
  return {
    myPixivIllusts,
    items: getMyPixivIllustsItems(state),
    listKey: `${props.route.key}-myPixivIllusts`,
  };
}, myPixivIllustsActionCreators)(MyPixivIllusts);
