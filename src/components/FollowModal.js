import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Text,
  TouchableWithoutFeedback,
  Modal,
  Switch,
} from 'react-native';
import PXTouchable from './PXTouchable';
import FollowButton from './FollowButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  innerContainer: {
    // borderRadius: 10,
    //alignItems: 'center',
    backgroundColor: '#fff', 
    padding: 20
  },
  form: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});

class FollowModal extends Component {
  constructor(props) {
    super(props);
    this.state = { isPrivate: false };
    console.log('gg')
  }

  onSwitchPrivateValue = (value) => {
    this.setState({ isPrivate: value });
  }

  render() {
    const { isOpen, selectedUserId, isFollowSelectedUser, onPressCloseButton, onPressFollowButton } = this.props;
    const { isPrivate } = this.state;
    return (
      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={isOpen}
          onRequestClose={onPressCloseButton}
          onShow={() => console.log('on show modal')}
        >
          <PXTouchable style={styles.container} onPress={onPressCloseButton}>
            <TouchableWithoutFeedback>
              <View style={styles.innerContainer}>
                <View style={styles.form}>
                  <Text>Private</Text>
                  <Switch
                    onValueChange={this.onSwitchPrivateValue}
                    value={isPrivate} 
                  />
                </View>
                <FollowButton onPress={() => onPressFollowButton(isPrivate)} />
              </View>
            </TouchableWithoutFeedback>
          </PXTouchable>
        </Modal>
      </View>
    );
  }
}

export default FollowModal;
