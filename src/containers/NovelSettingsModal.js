import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { connect } from 'react-redux';
import { withTheme, Text } from 'react-native-paper';
import Slider from 'react-native-slider';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connectLocalization } from '../components/Localization';
import * as modalActionCreators from '../common/actions/modal';
import * as novelSettingsActionCreators from '../common/actions/novelSettings';
import * as readingSettingsActionCreators from '../common/actions/readingSettings';
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
  toggleButton: {
    flex: 1,
    marginLeft: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  toggleValue: {
    fontWeight: '500',
  },
});

export class NovelSettingsModal extends Component {
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

  handleOnToggleSliderSide = () => {
    const {
      readingSettings: { sliderSide },
      setReadingSettings,
    } = this.props;
    setReadingSettings({
      sliderSide: sliderSide === 'left' ? 'right' : 'left',
    });
  };

  handleOnToggleSliderPercentageSide = () => {
    const {
      readingSettings: { sliderPercentageSide },
      setReadingSettings,
    } = this.props;
    setReadingSettings({
      sliderPercentageSide:
        sliderPercentageSide === 'left' ? 'right' : 'left',
    });
  };

  mapSliderSideName = (sliderSide) => {
    const { i18n } = this.props;
    return sliderSide === 'left'
      ? i18n.readingSettingsSliderSideLeft
      : i18n.readingSettingsSliderSideRight;
  };

  render() {
    const {
      novelSettings: { fontSize, lineHeight },
      readingSettings: { sliderSide, sliderPercentageSide },
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
                <View style={styles.form}>
                  <Icon name="exchange" size={14} color={theme.colors.text} />
                  <TouchableOpacity
                    accessibilityLabel="novel-settings-slider-side-toggle"
                    activeOpacity={0.7}
                    onPress={this.handleOnToggleSliderSide}
                    style={styles.toggleButton}
                  >
                    <Text>{i18n.readingSettingsSliderSide}</Text>
                    <Text style={styles.toggleValue}>
                      {this.mapSliderSideName(sliderSide)}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.form}>
                  <Icon name="percent" size={14} color={theme.colors.text} />
                  <TouchableOpacity
                    accessibilityLabel="novel-settings-slider-percentage-side-toggle"
                    activeOpacity={0.7}
                    onPress={this.handleOnToggleSliderPercentageSide}
                    style={styles.toggleButton}
                  >
                    <Text>{i18n.readingSettingsSliderPercentageSide}</Text>
                    <Text style={styles.toggleValue}>
                      {this.mapSliderSideName(sliderPercentageSide)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

NovelSettingsModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  i18n: PropTypes.object.isRequired,
  novelSettings: PropTypes.object.isRequired,
  readingSettings: PropTypes.object.isRequired,
  setReadingSettings: PropTypes.func.isRequired,
  setProperties: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withTheme(
  connectLocalization(
    connect(
      (state) => {
        const { novelSettings, readingSettings } = state;
        return {
          novelSettings,
          readingSettings,
        };
      },
      {
        ...modalActionCreators,
        ...novelSettingsActionCreators,
        setReadingSettings: readingSettingsActionCreators.setSettings,
      },
    )(NovelSettingsModal),
  ),
);
