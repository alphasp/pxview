import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Animated
} from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import * as bookmarkIllustActionCreators from '../common/actions/bookmarkIllust';
import * as modalActionCreators from '../common/actions/modal';
import modalType from '../common/constants/modalType';

const AnimatableIcon = Animatable.createAnimatableComponent(Icon);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    bottom: 0,
    right: 0,
    position: 'absolute',
    justifyContent: 'center',
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5, 
  }
});

class OverlayBookmarkButtonContainer extends Component {
  static propTypes = {
    authUser: PropTypes.object,
    item: PropTypes.object.isRequired,
    bookmarkIllust: PropTypes.func.isRequired,
    unbookmarkIllust: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    openModal: PropTypes.func.isRequired
  }

  constructor(props) {
    const { item } = props;
    super(props);
    this.state = {
      isBookmark: item.is_bookmarked,
      scaleAnim: new Animated.Value(0)
    };
  }
  
  componentWillReceiveProps(nextProps) {
    const { item: prevItem } = this.props;
    const { item } = nextProps;
    const { isBookmark } = this.state;
    if (item.is_bookmarked !== prevItem.is_bookmarked && item.is_bookmarked !== isBookmark) {
      if (item.is_bookmarked && !this.state.isBookmark) {
        this.animateBookmark();
      }
      this.setState({
        isBookmark: item.is_bookmarked
      });
    }
  }

  handleOnPress = () => {
    const { authUser, item, navigation: { navigate } } = this.props;
    const { isBookmark } = this.state;
    if (!authUser) {
      navigate('Login', {
        onLoginSuccess: () => {
          this.bookmarkIllust(item.id);
        }
      });
    }
    else {
      this.animateBookmark();
      this.setState({
        isBookmark: !isBookmark
      });
      if (item.is_bookmarked) {
        this.unbookmarkIllust(item.id);
      }
      else {
        this.bookmarkIllust(item.id);
      }
    }
  }

  handleOnLongPress = () => {
    const { authUser, item, navigation: { navigate }, openModal } = this.props;
    if (!authUser) {
      navigate('Login', {
        onLoginSuccess: () => {
          this.bookmarkIllust(item.id);
        }
      });
    }
    else {
      openModal(modalType.BOOKMARK, { 
        illustId: item.id,
        isBookmark: item.is_bookmarked
      })
    }
  }

  bookmarkIllust = (id) => {
    const { bookmarkIllust } = this.props;
    bookmarkIllust(id);
  }

  unbookmarkIllust = (id) => {
    const { unbookmarkIllust } = this.props;
    unbookmarkIllust(id);
  }

  animateBookmark = () => {
    const { isBookmark, scaleAnim } = this.state;
    if (!isBookmark) {
      Animated.timing(scaleAnim, { 
        toValue: 1 ,
        useNativeDriver: true
      }).start(({ finished }) => {
        scaleAnim.setValue(0);
      });
    }
  }

  render() {
    const { onPress, onLongPress } = this.props;
    const { isBookmark, scaleAnim } = this.state;
    const color = isBookmark ? 'rgb(255,102,102)' : 'rgb(210, 212, 216)';
    const scale = scaleAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1.5, 1]
    });
    // const color = this.state.colorAnim.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: ['rgb(210, 212, 216)', 'rgb(255,102,102)']
    // })
    return (
      <View style={styles.container}>
        <AnimatableIcon
          name="favorite"
          ref={(ref) => this.view = ref} 
          style={{
            color,
            transform: [{
              scale: scale
            }]
          }} 
          size={25} 
          onPress={this.handleOnPress} 
          onLongPress={this.handleOnLongPress}
        />
      </View>
    );
  }
}

export default withNavigation(connect((state, props) => {
  return {
    authUser: state.auth.user
  }
}, { ...bookmarkIllustActionCreators, ...modalActionCreators })(OverlayBookmarkButtonContainer));