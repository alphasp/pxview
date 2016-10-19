import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center',
    //justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 15,
    marginHorizontal: 5,
    ...Platform.select({
      ios: {
        //marginLeft: -7
      },
      android: {
        marginLeft: -8, 
        marginRight: -8
      }
    })
  },
  searchBarInputGroup: {
    flex: 1,
    paddingHorizontal: 5,
    position: 'relative',
    justifyContent: 'space-between',
    //justifyContent: 'center',
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        backgroundColor: '#D1EEFC',
        borderRadius: 5, // this.props.rounded ? 25 : 2,
        height: 30,
        borderColor: 'transparent',
      },
      android: {
        backgroundColor: '#fff',
        borderRadius: 2,
        borderColor: 'transparent',
        elevation: 2,
      },
    })
  },
  searchBarTextInput: {
    //height: 40,
    flex: 1,
    paddingLeft: 5,
    //alignSelf: 'center', 
    //width: 300
  },
  searchIcon: {
    alignSelf: 'center', 
    paddingLeft: 5
    //flex: 0.2
  },
  // searchBarButton: {
  //   alignItems: 'center', 
  //   justifyContent: 'center', 
  //   flexDirection: 'row',
  //   marginRight: -14
  // }
});

const SearchBar = (props) => {
  // const { tags } = props;
  //console.log('render searchbar');
  return (
    <View style={styles.container}>
      <View style={styles.searchBarInputGroup}>
        <Icon style={styles.searchIcon} name="search" size={15} color="#5cafec" />
        <TextInput style={styles.searchBarTextInput} placeholder="Enter keyword"  />
      </View>
    </View>
  );
}

export default SearchBar;
