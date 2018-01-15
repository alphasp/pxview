import React, { Component } from 'react';
import { connect } from 'react-redux';
import NovelList from '../../components/NovelList';
import * as myPixivNovelsActionCreators from '../../common/actions/myPixivNovels';
import { getMyPixivNovelsItems } from '../../common/selectors';

class MyPixivNovels extends Component {
  componentDidMount() {
    const { fetchMyPixivNovels, clearMyPixivNovels } = this.props;
    clearMyPixivNovels();
    fetchMyPixivNovels();
  }

  loadMoreItems = () => {
    const {
      myPixivNovels: { nextUrl, loading },
      fetchMyPixivNovels,
    } = this.props;
    if (!loading && nextUrl) {
      fetchMyPixivNovels(nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { clearMyPixivNovels, fetchMyPixivNovels } = this.props;
    clearMyPixivNovels();
    fetchMyPixivNovels(null, true);
  };

  render() {
    const { myPixivNovels, items, listKey, renderHeader } = this.props;
    return (
      <NovelList
        data={{ ...myPixivNovels, items }}
        listKey={listKey}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
        renderHeader={renderHeader}
      />
    );
  }
}

export default connect((state, props) => {
  const { myPixivNovels, user } = state;
  return {
    myPixivNovels,
    items: getMyPixivNovelsItems(state, props),
    user,
    listKey: `${props.navigation.state.key}-myPixivNovels`,
  };
}, myPixivNovelsActionCreators)(MyPixivNovels);
