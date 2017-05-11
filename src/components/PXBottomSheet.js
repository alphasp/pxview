import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  innerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
});

class PXBottomSheet extends Component {
  static defaultProps = {
    duration: 300,
    height: globalStyleVariables.WINDOW_HEIGHT -
      globalStyleVariables.APPBAR_HEIGHT -
      globalStyleVariables.STATUSBAR_HEIGHT,
  };

  constructor(props) {
    super(props);
    this.state = {
      animatedHeight: new Animated.Value(0),
      modalVisible: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { visible } = nextProps;
    const { visible: prevVisible } = this.props;
    if (visible !== null && visible !== prevVisible) {
      this.setModalVisible(visible);
    }
  }

  setModalVisible = visible => {
    const { height, duration } = this.props;
    const { modalVisible, animatedHeight } = this.state;
    if (visible && !modalVisible) {
      this.setState({ modalVisible: visible });
      // if want to support orientation
      // const newHeight = height || (Dimensions.get('window').height - APPBAR_HEIGHT - STATUSBAR_HEIGHT);
      Animated.timing(animatedHeight, {
        toValue: height,
        duration,
      }).start();
    } else if (!visible && modalVisible) {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration,
      }).start(() => {
        this.setState({ modalVisible: visible });
      });
    }
  };

  render() {
    const { children, onCancel } = this.props;
    const { animatedHeight, modalVisible } = this.state;
    return (
      <Modal
        transparent
        visible={modalVisible}
        onRequestClose={() => this.setModalVisible(false)}
        animationType="none"
        supportedOrientations={[
          'portrait',
          'portrait-upside-down',
          'landscape',
          'landscape-left',
          'landscape-right',
        ]}
      >
        <TouchableWithoutFeedback onPress={onCancel}>
          <View style={styles.container}>
            <Animated.View
              style={[styles.innerContainer, { maxHeight: animatedHeight }]}
            >
              <TouchableWithoutFeedback>
                {children}
              </TouchableWithoutFeedback>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

export default PXBottomSheet;
