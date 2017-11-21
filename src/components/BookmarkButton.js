import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';

const AnimatableIcon = Animatable.createAnimatableComponent(Icon);

class BookmarkButton extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    onPress: PropTypes.func.isRequired,
    onLongPress: PropTypes.func.isRequired,
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
    const { onPress } = this.props;
    const { isBookmark } = this.state;
    this.animateBookmark();
    this.setState({
      isBookmark: !isBookmark,
    });
    onPress();
  };

  handleOnLongPress = () => {
    const { onLongPress } = this.props;
    onLongPress();
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
    const { size, onLongPress } = this.props;
    const { isBookmark, scaleAnim } = this.state;
    const color = isBookmark ? 'rgb(255,102,102)' : 'rgb(210, 212, 216)';
    const scale = scaleAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0.8, 1],
    });
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
        onLongPress={onLongPress}
      />
    );
  }
}

export default BookmarkButton;
