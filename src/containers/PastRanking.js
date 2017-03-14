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
import DatePicker from 'react-native-datepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import IllustList from '../components/IllustList';
import PXTouchable from '../components/PXTouchable';
import PXBottomSheet from '../components/PXBottomSheet';
import { RANKING, R18_RANKING } from '../common/constants/illustRanking';
//import { fetchRecommendedIllusts, fetchRecommendedIllustsPublic, clearRecommendedIllusts } from '../common/actions/recommendedIllust';


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
    height: 42
  },
  rankingPickerText: {
    padding: 10
  },
  rankingPickerIcon: {
    paddingLeft: 5
  },
  bottomSheetText: {
    marginLeft: 32
  },
  bottomSheetListItem: {
    flexDirection: "row", 
    justifyContent: "flex-start", 
    alignItems: "center",
    height: 48
  },
  bottomSheetCancelIcon: {
    marginLeft: 3
  },
  bottomSheetCancelText: {
    marginLeft: 36
  }
});

class PastRanking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      isOpenRankingModeBottomSheet: false,
      date: new Date()
    };
  }

  openRankingModeBottomSheet = () => {
    this.setState({ isOpenRankingModeBottomSheet: true });
  }

  handleOnCancelRankingModeBottomSheet = () => {
    this.setState({ isOpenRankingModeBottomSheet: false });
  }

  handleOnPressRankingMode = (ranking) => {
    console.log('selected ', ranking)
    this.handleOnCancelRankingModeBottomSheet();
  }
  
  render() {
    //const { screenProps: { openRankingModeBottomSheet } } = this.props;
    const { user } = this.props;
    const { isOpenRankingModeBottomSheet } = this.state;
    // onPress={openRankingModeBottomSheet}
    return (
      <View style={styles.container}>
        <View style={styles.filterContainer}>
          <PXTouchable 
            style={styles.rankingPickerContainer}
            onPress={this.openRankingModeBottomSheet}
          >
            <View style={styles.rankingPicker}>
              <Text style={styles.rankingPickerText}>Illust Daily Ranking</Text>
              <Icon 
                name="caret-down" 
                size={24} 
                style={styles.rankingPickerIcon}
              />
            </View>
          </PXTouchable>
          <DatePicker
            style={{flex: 1, borderColor: 'gray', borderWidth: 1}}
            customStyles={{
              dateInput: {
                borderWidth: 0
              },
              dateTouchBody: {
                height: null
              }
            }}
            date={this.state.date}
            mode="date"
            placeholder="select date"
            format="YYYY-MM-DD"
            minDate="2007-09-13"
            maxDate={new Date()}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            showIcon={true}
            onDateChange={(date) => {this.setState({date: date})}}
          />
        </View>
        <PXBottomSheet 
          visible={isOpenRankingModeBottomSheet} 
          onCancel={this.handleOnCancelRankingModeBottomSheet}
        >
          <ScrollView>
            {
              Object.keys(RANKING).map(ranking => {
                return (
                  <PXTouchable key={ranking} onPress={() => this.handleOnPressRankingMode(ranking)}>
                    <View style={styles.bottomSheetListItem}>
                      <IonicIcon 
                        name="md-funnel" 
                        size={24} 
                      />
                      <Text style={styles.bottomSheetText}>
                        {RANKING[ranking].en}
                      </Text>
                    </View>
                  </PXTouchable>
                )
              })
            }
            {
              user &&
              Object.keys(R18_RANKING).map(ranking => {
                return (
                  <PXTouchable key={ranking} onPress={() => this.handleOnPressRankingMode(ranking)}>
                    <View style={styles.bottomSheetListItem}>
                      <IonicIcon 
                        name="md-funnel" 
                        size={24} 
                      />
                      <Text style={styles.bottomSheetText}>
                        {R18_RANKING[ranking].en}
                      </Text>
                    </View>
                  </PXTouchable>
                )
              })
            }
            <PXTouchable onPress={this.handleOnCancelRankingModeBottomSheet}>
              <View style={styles.bottomSheetListItem}>
                <IonicIcon 
                  name="md-close" 
                  size={24} 
                  style={styles.bottomSheetCancelIcon}
                />
                <Text style={[styles.bottomSheetText, styles.bottomSheetCancelText]}>
                  Cancel
                </Text>
              </View>
            </PXTouchable>
          </ScrollView>
        </PXBottomSheet>
      </View>
    )
  }
}

export default connect(state => {
  return {
    user: state.auth.user
  }
})(PastRanking);