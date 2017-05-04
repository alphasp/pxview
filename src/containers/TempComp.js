import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
    backgroundColor: 'red',
  },
  tabs: {},
});

class TempComp extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text>test test temp</Text>
        </View>
        <View style={styles.tabs}>
          <ScrollableTabView
            tabBarPosition="bottom"
            locked
            scrollWithoutAnimation
            onChangeTab={() => console.log('change tab')}
          >
            <View tabLabel="abc" style={styles.container}>
              <Text>a</Text>
            </View>
            <View tabLabel="def" />
          </ScrollableTabView>
        </View>
      </View>
    );
  }
}

export default TempComp;
