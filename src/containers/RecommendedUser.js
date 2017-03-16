import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ListView,
  RecyclerViewBackedScrollView,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from '../components/Loader';
import PXTouchable from '../components/PXTouchable';
import PXImage from '../components/PXImage';
import PXThumbnail from '../components/PXThumbnail';
import PXThumbnailTouchable from '../components/PXThumbnailTouchable';
import OverlayImagePages from '../components/OverlayImagePages';
import UserListContainer from './UserListContainer';
import { fetchRecommendedUsers, clearRecommendedUsers } from '../common/actions/recommendedUser';
import Schemas from '../common/constants/schemas';

const windowWidth = Dimensions.get('window').width; //full width
const windowHeight = Dimensions.get('window').height; //full height
const avatarSize = 50;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#E9EBEE',
  },
  imagePreviews: {
    flex: 1,
    flexDirection: 'row',
  },
  userInfoContainer: {
    //backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //margin: 5,
    marginLeft: 80,
    marginVertical: 5
    //left: 70,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'absolute',
    // backgroundColor: 'rgba(0, 0, 0, 0.3)',
    //top: 0,
    left: 10,
    right: 0,
    bottom: 10,
    flex: 1,
    width: avatarSize
    //paddingBottom: 40
  }
});

class RecommendedUser extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      refreshing: false
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchRecommendedUsers());
  }

  loadMore = () => {
    const { dispatch, recommendedUser: { nextUrl } } = this.props;
    console.log('load more ', nextUrl)
    if (nextUrl) {
      dispatch(fetchRecommendedUsers(null, nextUrl));
    }
  }

  handleOnRefresh = () => {
    const { dispatch } = this.props;
    this.setState({
      refereshing: true
    });
    dispatch(clearRecommendedUsers());
    dispatch(fetchRecommendedUsers()).finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  render() {
    const { recommendedUser, navigation, screenProps } = this.props;
    const { refreshing } = this.state;
    return (
      <UserListContainer
        userList={recommendedUser}
        refreshing={refreshing}
        loadMore={this.loadMore}
        onRefresh={this.handleOnRefresh}
        navigation={navigation}
        screenProps={screenProps}
      />
    );
  }
}

export default connect(state => {
  const { entities, recommendedUser } = state;
  const denormalizedItems = denormalize(recommendedUser.items, Schemas.USER_PREVIEW_ARRAY, entities);
  return {
    recommendedUser: {
      ...recommendedUser,
      items: denormalizedItems
    },
  }
})(RecommendedUser);