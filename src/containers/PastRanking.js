import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Dimensions,
  RecyclerViewBackedScrollView,
  RefreshControl,
  Picker
} from 'react-native';
import { connect } from 'react-redux';
import DatePicker from 'react-native-datepicker';
import IllustList from '../components/IllustList';
//import { fetchRecommendedIllusts, fetchRecommendedIllustsPublic, clearRecommendedIllusts } from '../common/actions/recommendedIllust';

class PastRanking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      date: "2016-05-15"
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
    return (
      <View>
        <TextInput 
          style={{height: 40, borderColor: 'gray', borderWidth: 1}} 
          value="placeholder"
        />
        <Picker
          selectedValue={this.state.language}
          onValueChange={(lang) => this.setState({language: lang})}>
          <Picker.Item label="Java" value="java" />
          <Picker.Item label="JavaScript" value="js" />
        </Picker>
        <DatePicker
          style={{width: 200}}
          date={this.state.date}
          mode="date"
          placeholder="select date"
          format="YYYY-MM-DD"
          minDate="2016-05-01"
          maxDate="2016-06-01"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          
          onDateChange={(date) => {this.setState({date: date})}}
        />

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