import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ListView,
  Dimensions,
  RecyclerViewBackedScrollView,
  ScrollView
} from 'react-native';

const styles = StyleSheet.create({
  list: {
    //justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'space-between',
    // alignItems: 'flex-start',
    //alignItems: 'flex-start',
    //width: Dimensions.get('window').width //full width
  },
});

class GridView extends Component {
  render() {
    const { dataSource, renderRow } = this.props;
    return (
      <ListView 
        contentContainerStyle={styles.list}
        dataSource={dataSource}
        {...this.props}
      />
    );
  }
}

export default GridView;
