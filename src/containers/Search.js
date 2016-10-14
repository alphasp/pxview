import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
// import {
//   withRouter,
// } from 'react-router-native';
import { Actions } from 'react-native-router-flux';
import PXTouchable from '../components/PXTouchable';
import PXImage from '../components/PXImage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },

  cardImage: {
    //resizeMode: 'contain',
    margin: 5,
    //height: 100,
    // width: 130,
  },
});

class Search extends Component {
  onPress = () => {
    console.log("press")
    const { router } = this.props;
    //router.push('/temp/');
    Actions.temp();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Search page
        </Text>
        <PXTouchable onPress={ this.onPress }>
          <View>
            <Text>press me</Text>
          </View>
        </PXTouchable>
      </View>
    );
  }
}

export default Search;
