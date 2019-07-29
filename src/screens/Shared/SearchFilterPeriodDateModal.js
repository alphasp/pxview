import React, { Component } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import { withTheme, Text, Button } from 'react-native-paper';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { connectLocalization } from '../../components/Localization';
import PXListItem from '../../components/PXListItem';
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
    const { startDate, endDate } = props.navigation.state.params;
    this.state = {
      isStartDatePickerVisible: false,
      isEndDatePickerVisible: false,
      startDate:
        startDate ||
        moment()
          .subtract(7, 'day')
          .format('YYYY-MM-DD'),
      endDate: endDate || moment().format('YYYY-MM-DD'),
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
    const { endDate } = this.state;
    const sd = moment(date);
    const ed = moment(endDate);
    const newState = {
      startDate: sd.format('YYYY-MM-DD'),
      isStartDatePickerVisible: false,
    };
    if (ed.diff(sd, 'years', true) > 1) {
      newState.endDate = sd
        .clone()
        .add(1, 'years')
        .format('YYYY-MM-DD');
    }
    this.setState(newState);
  };

  handleOnConfirmEndDatePicker = date => {
    const { startDate } = this.state;
    const ed = moment(date);
    const sd = moment(startDate);
    const newState = {
      endDate: ed.format('YYYY-MM-DD'),
      isEndDatePickerVisible: false,
    };
    if (ed.diff(sd, 'years', true) > 1) {
      newState.startDate = ed
        .clone()
        .subtract(1, 'years')
        .format('YYYY-MM-DD');
    }
    this.setState(newState);
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
    const { i18n, theme } = this.props;
    const {
      startDate,
      endDate,
      isStartDatePickerVisible,
      isEndDatePickerVisible,
    } = this.state;
    return (
      <SafeAreaView
        style={[
          globalStyles.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <View>
          <PXListItem
            title={i18n.searchPeriodStartDate}
            description={startDate}
            onPress={this.handleOnPressStartDate}
          />
          <PXListItem
            title={i18n.searchPeriodEndDate}
            description={endDate}
            onPress={this.handleOnPressEndDate}
          />
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoSubContainer}>
            <Icon name="info-circle" size={20} color={theme.colors.text} />
            <Text style={styles.info}>{i18n.searchPeriodInfo}</Text>
          </View>
        </View>
        <View style={styles.searchFilterButtonContainer}>
          <Button mode="contained" onPress={this.handleOnPressConfirm}>
            {i18n.ok}
          </Button>
        </View>
        <DateTimePicker
          isVisible={isStartDatePickerVisible}
          cancelTextIOS={i18n.cancel}
          confirmTextIOS={i18n.ok}
          customTitleContainerIOS={<View />}
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

export default withTheme(connectLocalization(SearchFilterPeriodDateModal));
