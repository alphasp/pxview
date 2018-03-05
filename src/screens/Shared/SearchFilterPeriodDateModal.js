import React, { Component } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import { List, ListItem } from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { connectLocalization } from '../../components/Localization';
import PXTouchable from '../../components/PXTouchable';
import { globalStyles, globalStyleVariables } from '../../styles';

const styles = StyleSheet.create({
  infoContainer: {
    flex: 1,
    margin: 20,
  },
  infoSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    marginLeft: 5,
  },
  searchFilterButtonContainer: {
    padding: 10,
    backgroundColor: '#fff',
  },
  searchFilterButton: {
    backgroundColor: globalStyleVariables.PRIMARY_COLOR,
    padding: 10,
    alignItems: 'center',
  },
  searchFilterButtonText: {
    color: '#fff',
  },
});

class SearchFilterPeriodDateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isStartDatePickerVisible: false,
      isEndDatePickerVisible: false,
      startDate: moment().subtract(7, 'day').format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
    };
  }

  handleOnPressStartDate = () => {
    this.setState({
      isStartDatePickerVisible: true,
    });
  };

  handleOnPressEndDate = () => {
    this.setState({
      isEndDatePickerVisible: true,
    });
  };

  handleOnConfirmStartDatePicker = date => {
    this.setState({
      startDate: moment(date).format('YYYY-MM-DD'),
      isStartDatePickerVisible: false,
    });
  };

  handleOnConfirmEndDatePicker = date => {
    this.setState({
      endDate: moment(date).format('YYYY-MM-DD'),
      isEndDatePickerVisible: false,
    });
  };

  handleOnCancelStartDatePicker = () => {
    this.setState({
      isStartDatePickerVisible: false,
    });
  };

  handleOnCancelEndDatePicker = () => {
    this.setState({
      isEndDatePickerVisible: false,
    });
  };

  handleOnPressConfirm = () => {
    const { onConfirmPeriodDate } = this.props.navigation.state.params;
    const { startDate, endDate } = this.state;
    onConfirmPeriodDate(startDate, endDate);
  };

  render() {
    const { i18n } = this.props;
    const {
      startDate,
      endDate,
      isStartDatePickerVisible,
      isEndDatePickerVisible,
    } = this.state;
    return (
      <SafeAreaView style={globalStyles.container}>
        <List>
          <ListItem
            title={i18n.searchPeriodStartDate}
            subtitle={startDate}
            onPress={this.handleOnPressStartDate}
            hideChevron
          />
          <ListItem
            title={i18n.searchPeriodEndDate}
            subtitle={endDate}
            onPress={this.handleOnPressEndDate}
            hideChevron
          />
        </List>
        <View style={styles.infoContainer}>
          <View style={styles.infoSubContainer}>
            <Icon name="info-circle" size={20} color="#000" />
            <Text style={styles.info}>
              {i18n.searchPeriodInfo}
            </Text>
          </View>
        </View>
        <View style={styles.searchFilterButtonContainer}>
          <PXTouchable
            onPress={this.handleOnPressConfirm}
            style={styles.searchFilterButton}
          >
            <Text style={styles.searchFilterButtonText}>
              {i18n.ok}
            </Text>
          </PXTouchable>
        </View>
        <DateTimePicker
          isVisible={isStartDatePickerVisible}
          onConfirm={this.handleOnConfirmStartDatePicker}
          onCancel={this.handleOnCancelStartDatePicker}
          minimumDate={new Date('2007-09-13')}
          maximumDate={moment(endDate).toDate()}
        />
        <DateTimePicker
          isVisible={isEndDatePickerVisible}
          onConfirm={this.handleOnConfirmEndDatePicker}
          onCancel={this.handleOnCancelEndDatePicker}
          minimumDate={moment(startDate).toDate()}
          maximumDate={moment().toDate()}
        />
      </SafeAreaView>
    );
  }
}

export default connectLocalization(SearchFilterPeriodDateModal);
