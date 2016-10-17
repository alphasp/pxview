import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  RecyclerViewBackedScrollView,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import GridView from 'react-native-grid-view';
// import Image from 'react-native-image-progress';
import Loader from '../components/Loader';
import PXTouchable from '../components/PXTouchable';
import PXImage from '../components/PXImage';

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  cardImage: {
    resizeMode: 'cover',
    //margin: 5,
    height: Dimensions.get('window').width / 2, //require for <Image />
    // width: 130,
  },
});

class RecommendedUser extends Component {
  render() {
    return (
      <View>
        <Text>users</Text>
      </View>
    );
  }
}

export default RecommendedUser;