import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Animated } from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import * as bookmarkIllustActionCreators from '../common/actions/bookmarkIllust';
import * as modalActionCreators from '../common/actions/modal';
import { MODAL_TYPES, SCREENS } from '../common/constants';

const AnimatableIcon = Animatable.createAnimatableComponent(Icon);

class BookmarkButton extends Component {
  static propTypes = {
    authUser: PropTypes.object,
    item: PropTypes.object.isRequired,
    bookmarkIllust: PropTypes.func.isRequired,
    unbookmarkIllust: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    openModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    authUser: null,
  };

  constructor(props) {
    const { item } = props;
    super(props);
    this.state = {
      isBookmark: item.is_bookmarked,
      scaleAnim: new Animated.Value(0),
    };
  }

  componentWillReceiveProps(nextProps) {
    const { item: prevItem } = this.props;
    const { item } = nextProps;
    const { isBookmark } = this.state;
    if (
      item.is_bookmarked !== prevItem.is_bookmarked &&
      item.is_bookmarked !== isBookmark
    ) {
      if (item.is_bookmarked && !this.state.isBookmark) {
        this.animateBookmark();
      }
      this.setState({
        isBookmark: item.is_bookmarked,
      });
    }
  }

  handleOnPress = () => {
    const { authUser, item, navigation: { navigate } } = this.props;
    const { isBookmark } = this.state;
    if (!authUser) {
      navigate(SCREENS.Login, {
        onLoginSuccess: () => {
          this.bookmarkIllust(item.id);
        },
      });
    } else {
      this.animateBookmark();
      this.setState({
        isBookmark: !isBookmark,
      });
      if (item.is_bookmarked) {
        this.unbookmarkIllust(item.id);
      } else {
        this.bookmarkIllust(item.id);
      }
    }
  };

  handleOnLongPress = () => {
    const { authUser, item, navigation: { navigate }, openModal } = this.props;
    if (!authUser) {
      navigate(SCREENS.Login, {
        onLoginSuccess: () => {
          this.bookmarkIllust(item.id);
        },
      });
    } else {
      openModal(MODAL_TYPES.BOOKMARK, {
        illustId: item.id,
        isBookmark: item.is_bookmarked,
      });
    }
  };

  bookmarkIllust = id => {
    const { bookmarkIllust } = this.props;
    bookmarkIllust(id);
  };

  unbookmarkIllust = id => {
    const { unbookmarkIllust } = this.props;
    unbookmarkIllust(id);
  };

  animateBookmark = () => {
    const { scaleAnim } = this.state;
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start(() => {
      scaleAnim.setValue(0);
    });
  };

  render() {
    const { size } = this.props;
    const { isBookmark, scaleAnim } = this.state;
    const color = isBookmark ? 'rgb(255,102,102)' : 'rgb(210, 212, 216)';
    const scale = scaleAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0.8, 1],
    });
    // const color = this.state.colorAnim.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: ['rgb(210, 212, 216)', 'rgb(255,102,102)']
    // })
    return (
      <AnimatableIcon
        name="favorite"
        style={{
          color,
          transform: [
            {
              scale,
            },
          ],
        }}
        size={size || 24}
        onPress={this.handleOnPress}
        onLongPress={this.handleOnLongPress}
      />
    );
  }
}

export default withNavigation(
  connect(
    state => ({
      authUser: state.auth.user,
    }),
    { ...bookmarkIllustActionCreators, ...modalActionCreators },
  )(BookmarkButton),
);
