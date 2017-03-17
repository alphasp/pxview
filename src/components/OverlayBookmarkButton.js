import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
// import HeartShape from './HeartShape';
// const AnimatableHeartShape = Animatable.createAnimatableComponent(HeartShape);
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

class OverlayBookmarkButton extends Component {
  constructor(props) {
    const { isBookmark } = props;
    super(props);
    this.state = {
      isBookmark,
    };
  }
  
  componentWillReceiveProps(nextProps) {
    const { isBookmark: prevIsBookmark } = this.props;
    const { isBookmark } = nextProps;
    if (isBookmark !== prevIsBookmark) {
      this.setState({
        isBookmark
      });
    }
  }
  
  handleOnPress = () => {
    const { onPress } = this.props;
    const { isBookmark } = this.state;
    // const promise = isBookmark ? Promise.resolve() : this.view.rubberBand(800);
    if (!isBookmark) {
      this.view.rubberBand();
    }
    this.view.transitionTo({ color: isBookmark ? 'rgb(210, 212, 216)' : 'rgb(255,102,102)' });
    this.setState({
      isBookmark: !isBookmark
    });
    if (onPress) {
      onPress();
    }
  }

  handleOnLongPress = () => {
    const { onLongPress } = this.props;
    console.log('on long press')
    if (onLongPress) {
      onLongPress();
    }
  }

  render() {
    const { onPress, onLongPress } = this.props;
    const { isBookmark } = this.state;
    // const backgroundColor = isBookmark ? 'rgb(255,102,102)' : 'rgb(210, 212, 216)';
    const color = isBookmark ? 'rgb(255,102,102)' : 'rgb(210, 212, 216)';
    // return (
    //   <TouchableWithoutFeedback onPress={this.handleOnPress}>
    //     <View style={styles.container}>
    //       <AnimatableHeartShape
    //         ref={(ref) => this.view = ref} 
    //         color={backgroundColor} 
    //         onPress={this.handleOnPress} 
    //       />
    //     </View>
    //   </TouchableWithoutFeedback>
    // );
    return (
      <View style={styles.container}>
        <AnimatableIcon
          name="favorite"
          ref={(ref) => this.view = ref} 
          style={{color}} 
          size={20} 
          onPress={this.handleOnPress} 
          onLongPress={this.handleOnLongPress}
        />
      </View>
    );
    // return (
    //   <View>
    //     <View style={styles.container}>
    //       <AnimatableIcon
    //         name={isBookmark ? "favorite" : "favorite-border"}
    //         ref={(ref) => this.view = ref} 
    //         style={{color: "rgb(210, 212, 216)"}} 
    //         size={20} 
    //         onPress={this.handleOnPress} 
    //       />
    //     </View>
    //     <View style={styles.container}>
    //       <AnimatableIcon
    //         name={isBookmark ? "favorite-border" : "favorite"}
    //         ref={(ref) => this.view = ref} 
    //         style={{backgroundColor: "#fff"}} 
    //         size={20} 
    //       />
    //     </View>
    //   </View>
    // );
  }
}

export default OverlayBookmarkButton;
