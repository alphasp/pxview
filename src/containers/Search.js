import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  ListView,
  RecyclerViewBackedScrollView,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import GridView from '../components/GridView';
import Loader from '../components/Loader';
import PXTouchable from '../components/PXTouchable';
import PXImage from '../components/PXImage';

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class Search extends Component {
  render() {
    return (
      <View style={styles.container} >
        <ScrollableTabView locked scrollWithoutAnimation>
          <View tabLabel="Illust/Manga" />
          <View tabLabel="User" />
        </ScrollableTabView>
      </View>
    );
  }
}

export default connect(state => {
  return {
    //trendingIllustTag: state.trendingIllustTag
  }
})(Search);