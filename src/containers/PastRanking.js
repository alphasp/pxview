import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import DatePicker from 'react-native-datepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import IllustList from '../components/IllustList';
import PXTouchable from '../components/PXTouchable';
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
  }
});

class PastRanking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      date: new Date()
    };
  }

  // componentDidMount() {
  //   const { dispatch } = this.props;
  //   dispatch(fetchRecommendedIllustsPublic());
  // }

  // loadMoreItems = () => {
  //   const { dispatch, recommendedIllust: { nextUrl } } = this.props;
  //   console.log('load more ', nextUrl)
  //   if (nextUrl) {
  //     dispatch(fetchRecommendedIllustsPublic("", nextUrl));
  //   }
  // }

  // handleOnRefresh = () => {
  //   const { dispatch } = this.props;
  //   this.setState({
  //     refereshing: true
  //   });
  //   dispatch(clearRecommendedIllusts());
  //   dispatch(fetchRecommendedIllustsPublic()).finally(() => {
  //     this.setState({
  //       refereshing: false
  //     }); 
  //   })
  // }

  render() {
    console.log(this.props)
    const { screenProps: { openRankingModeBottomSheet } } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.filterContainer}>
          <PXTouchable 
            style={styles.rankingPickerContainer}
            onPress={openRankingModeBottomSheet}
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
      </View>
    )
    /*const { recommendedIllust, navigation } = this.props;
    const { refreshing } = this.state;
    return (
      <IllustList
        data={recommendedIllust}
        refreshing={refreshing}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
        navigation={navigation}
      />
    );*/
  }
}

export default connect(state => {
  return {
    //recommendedIllust: state.recommendedIllust,
  }
})(PastRanking);