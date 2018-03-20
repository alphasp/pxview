import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import camelCase from 'lodash.camelcase';
import DatePicker from 'react-native-datepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import RankingList from './RankingList';
import NovelRankingList from './NovelRankingList';
import PXTouchable from '../../components/PXTouchable';
import PXBottomSheet from '../../components/PXBottomSheet';
import PXBottomSheetButton from '../../components/PXBottomSheetButton';
import PXBottomSheetCancelButton from '../../components/PXBottomSheetCancelButton';
import { connectLocalization } from '../../components/Localization';
import {
  RANKING_ILLUST,
  R18_RANKING_ILLUST,
  R18G_RANKING_ILLUST,
  RANKING_MANGA,
  R18_RANKING_MANGA,
  R18G_RANKING_MANGA,
  RANKING_NOVEL,
  R18_RANKING_NOVEL,
  R18G_RANKING_NOVEL,
  RANKING_TYPES,
} from '../../common/constants';
import { globalStyles } from '../../styles';

const styles = StyleSheet.create({
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
  bottomSheetListItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 48,
  },
  bottomSheetText: {
    marginLeft: 32,
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
    const { rankingType } = props;
    let mode;
    if (rankingType === RANKING_TYPES.ILLUST) {
      this.ranking = RANKING_ILLUST;
      this.r18Ranking = R18_RANKING_ILLUST;
      this.r18GRanking = R18G_RANKING_ILLUST;
      mode = 'day';
    } else if (rankingType === RANKING_TYPES.MANGA) {
      this.ranking = RANKING_MANGA;
      this.r18Ranking = R18_RANKING_MANGA;
      this.r18GRanking = R18G_RANKING_MANGA;
      mode = 'day_manga';
    } else if (rankingType === RANKING_TYPES.NOVEL) {
      this.ranking = RANKING_NOVEL;
      this.r18Ranking = R18_RANKING_NOVEL;
      this.r18GRanking = R18G_RANKING_NOVEL;
      mode = 'day';
    }
    this.state = {
      isOpenRankingModeBottomSheet: false,
      date: moment().subtract(2, 'days').format('YYYY-MM-DD'),
      mode,
    };
  }

  openRankingModeBottomSheet = () => {
    this.setState({ isOpenRankingModeBottomSheet: true });
  };

  handleOnCancelRankingModeBottomSheet = () => {
    this.setState({ isOpenRankingModeBottomSheet: false });
  };

  handleOnPressRankingMode = mode => {
    this.setState({ mode });
    this.handleOnCancelRankingModeBottomSheet();
  };

  handleOnDateChange = date => {
    this.setState({ date });
  };

  mapRankingString = ranking => {
    const { i18n } = this.props;
    return i18n[`ranking${ranking.charAt(0).toUpperCase() + ranking.slice(1)}`];
  };

  renderRankingOptions = (ranking, rankingMode) =>
    <PXBottomSheetButton
      key={ranking}
      onPress={() => this.handleOnPressRankingMode(rankingMode)}
      iconName="md-funnel"
      iconType="ionicon"
      text={this.mapRankingString(ranking)}
    />;

  render() {
    const { user, i18n, navigation, rankingMode, rankingType } = this.props;
    const { date, mode, isOpenRankingModeBottomSheet } = this.state;
    const selectedRankingMode =
      rankingType === RANKING_TYPES.MANGA ? mode.replace('_manga', '') : mode;
    return (
      <View style={globalStyles.container}>
        <View style={styles.filterContainer}>
          <PXTouchable
            style={styles.rankingPickerContainer}
            onPress={this.openRankingModeBottomSheet}
          >
            <View style={styles.rankingPicker}>
              <Text style={styles.rankingPickerText}>
                {this.mapRankingString(camelCase(selectedRankingMode))}
              </Text>
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
            confirmBtnText={i18n.ok}
            cancelBtnText={i18n.cancel}
            showIcon
            onDateChange={this.handleOnDateChange}
          />
        </View>
        {rankingType === RANKING_TYPES.NOVEL
          ? <NovelRankingList
              rankingMode={rankingMode}
              options={{ date, mode }}
              navigation={navigation}
            />
          : <RankingList
              rankingMode={rankingMode}
              options={{ date, mode }}
              navigation={navigation}
            />}

        <PXBottomSheet
          visible={isOpenRankingModeBottomSheet}
          onCancel={this.handleOnCancelRankingModeBottomSheet}
        >
          <ScrollView>
            {Object.keys(this.ranking).map(ranking =>
              this.renderRankingOptions(ranking, this.ranking[ranking]),
            )}
            {user &&
              user.x_restrict > 0 &&
              Object.keys(this.r18Ranking).map(ranking =>
                this.renderRankingOptions(ranking, this.r18Ranking[ranking]),
              )}
            {user &&
              user.x_restrict > 1 &&
              Object.keys(this.r18GRanking).map(ranking =>
                this.renderRankingOptions(ranking, this.r18GRanking[ranking]),
              )}
            <PXBottomSheetCancelButton
              onPress={this.handleOnCancelRankingModeBottomSheet}
              text={i18n.cancel}
            />
          </ScrollView>
        </PXBottomSheet>
      </View>
    );
  }
}

export default connectLocalization(
  connect(state => ({
    user: state.auth.user,
  }))(PastRanking),
);
