import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import DatePicker from 'react-native-datepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import RankingList from './RankingList';
import PXTouchable from '../components/PXTouchable';
import PXBottomSheet from '../components/PXBottomSheet';
import { RANKING, R18_RANKING, RANKING_FOR_UI } from '../common/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  rankingPickerContainer: {
    marginRight: 10,
  },
  rankingPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    height: 42,
  },
  rankingPickerText: {
    padding: 10,
  },
  rankingPickerIcon: {
    paddingLeft: 5,
  },
  bottomSheetText: {
    marginLeft: 32,
  },
  bottomSheetListItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 48,
  },
  bottomSheetCancelIcon: {
    marginLeft: 3,
  },
  bottomSheetCancelText: {
    marginLeft: 36,
  },
  datePicker: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
  },
  dateInput: {
    borderWidth: 0,
  },
  dateTouchBody: {
    height: null,
  },
});

class PastRanking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      isOpenRankingModeBottomSheet: false,
      date: moment().subtract(2, 'days').format('YYYY-MM-DD'),
      mode: 'day',
    };
  }

  openRankingModeBottomSheet = () => {
    this.setState({ isOpenRankingModeBottomSheet: true });
  }

  handleOnCancelRankingModeBottomSheet = () => {
    this.setState({ isOpenRankingModeBottomSheet: false });
  }

  handleOnPressRankingMode = mode => {
    this.setState({ mode });
    this.handleOnCancelRankingModeBottomSheet();
  }

  handleOnDateChange = date => {
    this.setState({ date });
  }

  render() {
    const { user, screenProps: { strings } } = this.props;
    const { refreshing, date, mode, isOpenRankingModeBottomSheet } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.filterContainer}>
          <PXTouchable
            style={styles.rankingPickerContainer}
            onPress={this.openRankingModeBottomSheet}
          >
            <View style={styles.rankingPicker}>
              <Text style={styles.rankingPickerText}>Illust {strings[`${mode}_ranking`]} Ranking</Text>
              <Icon
                name="caret-down"
                size={24}
                style={styles.rankingPickerIcon}
              />
            </View>
          </PXTouchable>
          <DatePicker
            style={styles.datePicker}
            customStyles={{
              dateInput: styles.dateInput,
              dateTouchBody: styles.dateTouchBody,
            }}
            date={date}
            mode="date"
            placeholder="select date"
            format="YYYY-MM-DD"
            minDate="2007-09-13"
            maxDate={new Date()}
            confirmBtnText={strings.ok}
            cancelBtnText={strings.cancel}
            showIcon
            onDateChange={this.handleOnDateChange}
          />
        </View>
        <RankingList
          rankingMode={RANKING_FOR_UI.PAST}
          options={{ date, mode }}
        />
        <PXBottomSheet
          visible={isOpenRankingModeBottomSheet}
          onCancel={this.handleOnCancelRankingModeBottomSheet}
        >
          <ScrollView>
            {
              Object.keys(RANKING).map(ranking => (
                <PXTouchable key={ranking} onPress={() => this.handleOnPressRankingMode(ranking)}>
                  <View style={styles.bottomSheetListItem}>
                    <IonicIcon
                      name="md-funnel"
                      size={24}
                    />
                    <Text style={styles.bottomSheetText}>
                      {strings[`${ranking}_ranking`]}
                    </Text>
                  </View>
                </PXTouchable>
                ))
            }
            {
              user &&
              Object.keys(R18_RANKING).map(ranking => (
                <PXTouchable key={ranking} onPress={() => this.handleOnPressRankingMode(ranking)}>
                  <View style={styles.bottomSheetListItem}>
                    <IonicIcon
                      name="md-funnel"
                      size={24}
                    />
                    <Text style={styles.bottomSheetText}>
                      {strings[`${ranking}_ranking`]}
                    </Text>
                  </View>
                </PXTouchable>
                ))
            }
            <PXTouchable onPress={this.handleOnCancelRankingModeBottomSheet}>
              <View style={styles.bottomSheetListItem}>
                <IonicIcon
                  name="md-close"
                  size={24}
                  style={styles.bottomSheetCancelIcon}
                />
                <Text style={[styles.bottomSheetText, styles.bottomSheetCancelText]}>
                  {strings.cancel}
                </Text>
              </View>
            </PXTouchable>
          </ScrollView>
        </PXBottomSheet>
      </View>
    );
  }
}

export default connect(state => ({
  user: state.auth.user,
}))(PastRanking);
