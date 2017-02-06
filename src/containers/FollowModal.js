import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Text,
  TouchableWithoutFeedback,
  Modal,
  Switch,
} from 'react-native';
import { connect } from 'react-redux';
import PXTouchable from '../components/PXTouchable';
import FollowButton from '../components/FollowButton';
import * as userFollowDetailActionCreators from '../common/actions/userFollowDetail';
import { FollowType } from '../common/actions/followUser';

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
  },
  titleContainer: {
    backgroundColor: '#E9EBEE',
    padding: 10
  },
  form: {
    paddingTop: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionContainer: {
    marginTop: 20,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionWithoutRemoveButtonContainer: {
    marginTop: 20,
    padding: 10,
  }
});

class FollowModal extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    isFollow: PropTypes.bool.isRequired,
    onPressFollowButton: PropTypes.func.isRequired,
    onPressRemoveButton: PropTypes.func.isRequired,
    onPressCloseButton: PropTypes.func.isRequired,
    fetchUserFollowDetail: PropTypes.func.isRequired,
    clearUserFollowDetail: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isPrivate: false,
    };
  }

  componentDidMount() {
    const { userId, fetchUserFollowDetail, clearUserFollowDetail } = this.props;
    clearUserFollowDetail(userId);
    fetchUserFollowDetail(userId);
  }

  componentWillReceiveProps(nextProps) {
    const { userFollowDetail: { item: prevItem } } = this.props;
    const { userFollowDetail: { item } } = nextProps;
    if (item && item !== prevItem) {
      this.setState({
        isPrivate: item.restrict === 'private' ? true : false,
      });
    }
  }

  handleOnChangeIsPrivate = (value) => {
    this.setState({
      isPrivate: value
    });
  }

  handleOnPressFollowButton = () => {
    const { userId, onPressFollowButton } = this.props;
    const { isPrivate } = this.state;
    const followType = isPrivate ? FollowType.PRIVATE : FollowType.PUBLIC;
    onPressFollowButton(userId, followType);
  }

  handleOnPressRemoveButton = () => {
    const { userId, onPressRemoveButton } = this.props;
    onPressRemoveButton(userId);
  }

  render() {
    const { isOpen, isFollow, onPressCloseButton } = this.props;
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
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>
                    {isFollow ? "Edit Follow" : "Follow"}
                  </Text>
                </View>
                <View style={styles.form}>
                  <Text>Private</Text>
                  <Switch
                    onValueChange={this.handleOnChangeIsPrivate}
                    value={isPrivate} 
                  />
                </View>
                {
                  isFollow ?
                  <View style={styles.actionContainer}>
                    <PXTouchable onPress={this.handleOnPressRemoveButton}>
                      <Text>Remove</Text>
                    </PXTouchable>
                    <PXTouchable onPress={this.handleOnPressFollowButton}>
                      <Text>Follow</Text>
                    </PXTouchable>
                  </View>
                  :
                  <View style={styles.actionWithoutRemoveButtonContainer}>
                    <FollowButton 
                      isFollow={isFollow} 
                      onPress={this.handleOnPressFollowButton} 
                    />
                  </View>
                }
              </View>
            </TouchableWithoutFeedback>
          </PXTouchable>
        </Modal>
      </View>
    );
  }
}

export default connect((state, props) => {
  return {
    userFollowDetail: state.userFollowDetail
  }
}, { ...userFollowDetailActionCreators })(FollowModal);

