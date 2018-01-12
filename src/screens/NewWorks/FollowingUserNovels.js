import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { connectLocalization } from '../../components/Localization';
import NovelList from '../../components/NovelList';
import * as followingUserNovelsActionCreators from '../../common/actions/followingUserNovels';
import { getFollowingUserNovelsItems } from '../../common/selectors';
import { SCREENS } from '../../common/constants';

class FollowingUserNovels extends Component {
  componentDidMount() {
    const { fetchFollowingUserNovels, clearFollowingUserNovels } = this.props;
    clearFollowingUserNovels();
    fetchFollowingUserNovels();
  }

  loadMoreItems = () => {
    const {
      fetchFollowingUserNovels,
      followingUserNovels: { loading, nextUrl },
    } = this.props;
    if (!loading && nextUrl) {
      fetchFollowingUserNovels(nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { fetchFollowingUserNovels, clearFollowingUserNovels } = this.props;
    clearFollowingUserNovels();
    fetchFollowingUserNovels(null, true);
  };

  handleOnPressFindRecommendedUsers = () => {
    const { navigate } = this.props.navigation;
    navigate(SCREENS.RecommendedUsers);
  };

  render() {
    const {
      followingUserNovels,
      items,
      listKey,
      renderEmpty,
      renderHeader,
    } = this.props;
    return (
      <NovelList
        data={{ ...followingUserNovels, items }}
        listKey={listKey}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
        renderEmpty={renderEmpty}
        renderHeader={renderHeader}
      />
    );
  }
}

export default connectLocalization(
  withNavigation(
    connect((state, props) => {
      const { followingUserNovels } = state;
      return {
        followingUserNovels,
        items: getFollowingUserNovelsItems(state),
        listKey: `${props.navigation.state.key}-followingUserNovels`,
      };
    }, followingUserNovelsActionCreators)(FollowingUserNovels),
  ),
);
