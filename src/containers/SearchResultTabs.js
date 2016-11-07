import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  RecyclerViewBackedScrollView,
  RefreshControl,
  InteractionManager,
} from 'react-native';
import { connect } from 'react-redux';
import { Actions, ActionConst } from 'react-native-router-flux';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import SearchResult from './SearchResult';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class SearchResultTabs extends Component {
  render() {
    const { word } = this.props;
    return (
      <View style={styles.container} >
        <ScrollableTabView locked scrollWithoutAnimation>
          <SearchResult 
            tabLabel="Newest" 
            word={word}
          />
          <SearchResult 
            tabLabel="Oldest"
            word={word}
            options={{sort: "date_asc"}}
          />
          <SearchResult 
            tabLabel="All Time"
            word={word}
          />
        </ScrollableTabView>
      </View>
    );
  }
}

export default connect((state, props) => {
  return {
    search: state.search
  }
})(SearchResultTabs);