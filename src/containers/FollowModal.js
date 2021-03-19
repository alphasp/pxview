import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import { connect } from 'react-redux';
import { withTheme, Text, Switch } from 'react-native-paper';
import { connectLocalization } from '../components/Localization';
import PXTouchable from '../components/PXTouchable';
import FollowButton from '../components/FollowButton';
import Loader from '../components/Loader';
import * as userFollowDetailActionCreators from '../common/actions/userFollowDetail';
import * as followUserActionCreators from '../common/actions/followUser';
import * as modalActionCreators from '../common/actions/modal';
import { FOLLOWING_TYPES } from '../common/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loaderContainer: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  titleContainer: {
    padding: 10,
  },
  formContainer: {
    padding: 10,
  },
  form: {
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
  },
});

class FollowModal extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    isFollow: PropTypes.bool.isRequired,
    fetchUserFollowDetail: PropTypes.func.isRequired,
    clearUserFollowDetail: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
  };

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

  componentDidUpdate(prevProps) {
    const {
      userFollowDetail: { item },
    } = this.props;
    const {
      userFollowDetail: { item: prevItem },
    } = prevProps;
    if (item && item !== prevItem) {
      this.setState({
        isPrivate: item.restrict === 'private',
      });
    }
  }

  handleOnChangeIsPrivate = (value) => {
    this.setState({
      isPrivate: value,
    });
  };

  handleOnPressFollowButton = () => {
    const { userId } = this.props;
    const { isPrivate } = this.state;
    const followType = isPrivate
      ? FOLLOWING_TYPES.PRIVATE
      : FOLLOWING_TYPES.PUBLIC;
    this.followUser(userId, followType);
    this.handleOnModalClose();
  };

  handleOnPressRemoveButton = () => {
    const { userId } = this.props;
    this.unfollowUser(userId);
    this.handleOnModalClose();
  };

  handleOnPressModalRemoveButton = (userId) => {
    this.unfollowUser(userId);
    this.handleOnModalClose();
  };

  handleOnModalClose = () => {
    const { closeModal } = this.props;
    closeModal();
  };

  followUser = (userId, followType) => {
    const { followUser } = this.props;
    followUser(userId, followType);
  };

  unfollowUser = (userId) => {
    const { unfollowUser } = this.props;
    unfollowUser(userId);
  };

  render() {
    const {
      userFollowDetail: { loading, loaded },
      isFollow,
      i18n,
      theme,
    } = this.props;
    const { isPrivate } = this.state;
    return (
      <Modal
        animationType="fade"
        transparent
        visible
        onRequestClose={this.handleOnModalClose}
      >
        <TouchableWithoutFeedback onPress={this.handleOnModalClose}>
          <View style={styles.container}>
            <TouchableWithoutFeedback>
              <View style={{ backgroundColor: theme.colors.background }}>
                <View
                  style={[
                    styles.titleContainer,
                    { backgroundColor: theme.colors.modalTitleBackground },
                  ]}
                >
                  <Text style={styles.title}>
                    {isFollow ? i18n.followEdit : i18n.follow}
                  </Text>
                </View>
                <View style={styles.formContainer}>
                  {loading && (
                    <View style={styles.loaderContainer}>
                      <Loader />
                    </View>
                  )}
                  {loaded && (
                    <View>
                      <View style={styles.form}>
                        <Text>{i18n.private}</Text>
                        <Switch
                          onValueChange={this.handleOnChangeIsPrivate}
                          value={isPrivate}
                        />
                      </View>
                      {isFollow ? (
                        <View style={styles.actionContainer}>
                          <PXTouchable
                            hitSlop={{
                              top: 20,
                              left: 20,
                              bottom: 20,
                              right: 20,
                            }}
                            onPress={this.handleOnPressRemoveButton}
                          >
                            <Text>{i18n.followRemove}</Text>
                          </PXTouchable>
                          <PXTouchable
                            hitSlop={{
                              top: 20,
                              left: 20,
                              bottom: 20,
                              right: 20,
                            }}
                            onPress={this.handleOnPressFollowButton}
                          >
                            <Text>{i18n.follow}</Text>
                          </PXTouchable>
                        </View>
                      ) : (
                        <View style={styles.actionWithoutRemoveButtonContainer}>
                          <FollowButton
                            hitSlop={{
                              top: 10,
                              left: 10,
                              bottom: 10,
                              right: 10,
                            }}
                            isFollow={isFollow}
                            onPress={this.handleOnPressFollowButton}
                          />
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

export default withTheme(
  connectLocalization(
    connect(
      (state) => ({
        userFollowDetail: state.userFollowDetail,
      }),
      {
        ...userFollowDetailActionCreators,
        ...followUserActionCreators,
        ...modalActionCreators,
      },
    )(FollowModal),
  ),
);
