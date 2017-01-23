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

class OverlayLikeButton extends Component {
  constructor(props) {
    const { isLike } = props;
    super(props);
    this.state = {
      isLike,
    };
  }
  
  handleOnPress = () => {
    const { onPress } = this.props;
    const { isLike } = this.state;
    // const promise = isLike ? Promise.resolve() : this.view.rubberBand(800);
    if (!isLike) {
      this.view.rubberBand();
    }
    this.view.transitionTo({ color: isLike ? 'rgb(210, 212, 216)' : 'rgb(255,102,102)' });
    this.setState({
      isLike: !isLike
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
    const { isLike } = this.state;
    // const backgroundColor = isLike ? 'rgb(255,102,102)' : 'rgb(210, 212, 216)';
    const color = isLike ? 'rgb(255,102,102)' : 'rgb(210, 212, 216)';
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
    //         name={isLike ? "favorite" : "favorite-border"}
    //         ref={(ref) => this.view = ref} 
    //         style={{color: "rgb(210, 212, 216)"}} 
    //         size={20} 
    //         onPress={this.handleOnPress} 
    //       />
    //     </View>
    //     <View style={styles.container}>
    //       <AnimatableIcon
    //         name={isLike ? "favorite-border" : "favorite"}
    //         ref={(ref) => this.view = ref} 
    //         style={{backgroundColor: "#fff"}} 
    //         size={20} 
    //       />
    //     </View>
    //   </View>
    // );
  }
}

export default OverlayLikeButton;
