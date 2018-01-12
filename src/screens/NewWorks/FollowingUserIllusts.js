import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { connectLocalization } from '../../components/Localization';
import IllustList from '../../components/IllustList';
import * as followingUserIllustsActionCreators from '../../common/actions/followingUserIllusts';
import { getFollowingUserIllustsItems } from '../../common/selectors';
import { SCREENS } from '../../common/constants';

class FollowingUserIllusts extends Component {
  componentDidMount() {
    const {
      fetchFollowingUserIllusts,
      clearFollowingUserIllusts,
      options,
    } = this.props;
    clearFollowingUserIllusts();
    fetchFollowingUserIllusts(options);
  }

  componentWillReceiveProps(nextProps) {
    const { options: prevOptions } = this.props;
    const {
      options,
      fetchFollowingUserIllusts,
      clearFollowingUserIllusts,
    } = nextProps;
    if (options !== prevOptions) {
      clearFollowingUserIllusts();
      fetchFollowingUserIllusts(options);
    }
  }

  loadMoreItems = () => {
    const {
      fetchFollowingUserIllusts,
      followingUserIllusts: { loading, nextUrl },
    } = this.props;
    if (!loading && nextUrl) {
      fetchFollowingUserIllusts(null, nextUrl);
    }
  };

  handleOnRefresh = () => {
    const {
      fetchFollowingUserIllusts,
      clearFollowingUserIllusts,
      options,
    } = this.props;
    clearFollowingUserIllusts();
    fetchFollowingUserIllusts(options, null, true);
  };

  handleOnPressFindRecommendedUsers = () => {
    const { navigate } = this.props.navigation;
    navigate(SCREENS.RecommendedUsers);
  };

  render() {
    const {
      followingUserIllusts,
      items,
      listKey,
      renderEmpty,
      renderHeader,
    } = this.props;
    return (
      <IllustList
        data={{ ...followingUserIllusts, items }}
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
      const { followingUserIllusts } = state;
      return {
        followingUserIllusts,
        items: getFollowingUserIllustsItems(state),
        listKey: `${props.navigation.state.key}-followingUserIllusts`,
      };
    }, followingUserIllustsActionCreators)(FollowingUserIllusts),
  ),
);
