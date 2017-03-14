import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import FollowingUserIllust from './FollowingUserIllust';
import NewIllust from './NewIllust';
import NewManga from './NewManga';
import MyPixiv from './MyPixiv';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
    ...Platform.select({
      ios: {
        marginTop: 15
      },
    }),
  },
});

class NewWork extends Component {
  render() {
    //pixiv.illustNew
    //pixiv.mangaNew
    //mypixiv?
    //pixiv.illustFollow 
    // options - object (optional)
    // restrict - one of all | public | private (default: all)
    return (
      <View style={styles.container}>
        <ScrollableTabView ref={(ref) => this.tabs = ref}>
          <FollowingUserIllust tabLabel="Following" />
          <NewIllust tabLabel="Illust" />
          <NewManga tabLabel="Manga" />
          <MyPixiv tabLabel="My Pixiv" />
        </ScrollableTabView>
      </View>
    );
  }
}


export default NewWork;
