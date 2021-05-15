import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import { connect } from 'react-redux';
import { withTheme, Text } from 'react-native-paper';
import Slider from 'react-native-slider';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connectLocalization } from '../components/Localization';
import * as modalActionCreators from '../common/actions/modal';
import * as novelSettingsActionCreators from '../common/actions/novelSettings';
import { globalStyleVariables } from '../styles/index';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  titleContainer: {
    padding: 10,
  },
  form: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    marginLeft: 5,
  },
});

class NovelSettingsModal extends Component {
  static propTypes = {
    // userId: PropTypes.number.isRequired,
    // isFollow: PropTypes.bool.isRequired,
    // fetchUserFollowDetail: PropTypes.func.isRequired,
    // clearUserFollowDetail: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    setProperties: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleOnModalClose = () => {
    const { closeModal } = this.props;
    closeModal();
  };

  handleOnFontSizeSlidingComplete = (value) => {
    const { setProperties } = this.props;
    setProperties({ fontSize: value });
  };

  handleOnLineHeightSlidingComplete = (value) => {
    const { setProperties } = this.props;
    setProperties({ lineHeight: value });
  };

  render() {
    const {
      novelSettings: { fontSize, lineHeight },
      i18n,
      theme,
    } = this.props;
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
                  <Text style={styles.title}>{i18n.novelSettings}</Text>
                </View>
                <View style={styles.form}>
                  <Icon name="font" size={14} color={theme.colors.text} />
                  <Slider
                    style={styles.slider}
                    value={fontSize}
                    minimumValue={10}
                    maximumValue={18}
                    step={2}
                    minimumTrackTintColor={globalStyleVariables.PRIMARY_COLOR}
                    thumbTintColor={globalStyleVariables.PRIMARY_COLOR}
                    onSlidingComplete={this.handleOnFontSizeSlidingComplete}
                  />
                </View>
                <View style={styles.form}>
                  <Icon name="align-left" size={14} color={theme.colors.text} />
                  <Slider
                    style={styles.slider}
                    value={lineHeight}
                    minimumValue={1.2}
                    maximumValue={2}
                    step={0.2}
                    minimumTrackTintColor={globalStyleVariables.PRIMARY_COLOR}
                    thumbTintColor={globalStyleVariables.PRIMARY_COLOR}
                    onSlidingComplete={this.handleOnLineHeightSlidingComplete}
                  />
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
      (state) => {
        const { novelSettings } = state;
        return {
          novelSettings,
        };
      },
      { ...modalActionCreators, ...novelSettingsActionCreators },
    )(NovelSettingsModal),
  ),
);
