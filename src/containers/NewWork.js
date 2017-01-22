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
import Setting from './Setting';

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
          <Setting tabLabel="Newest Illust" />
          <Setting tabLabel="Newest Manga" />
          <Setting tabLabel="My Pixiv" />
        </ScrollableTabView>
      </View>
    );
  }
}


export default NewWork;
