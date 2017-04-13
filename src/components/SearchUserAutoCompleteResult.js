import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Platform,
  Animated,
  ListView,
} from 'react-native';
import dismissKeyboard from 'dismissKeyboard';
import Icon from 'react-native-vector-icons/FontAwesome';
import PXTouchable from './PXTouchable';
import PXThumbnailTouchable from './PXThumbnailTouchable';
import FollowButtonContainer from '../containers/FollowButtonContainer';
import Loader from './Loader';
import Separator from './Separator';
import SearchHistory from './SearchHistory';

const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
  row: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  thumnailNameContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  username: {
    marginLeft: 5,
  },
  separatorContainer: {
    paddingLeft: 10, 
    paddingRight: 10
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
});

class SearchUsersAutoCompleteResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      })
    };
  }
  componentWillReceiveProps(nextProps) {
    const { searchUsersAutoComplete: { items: prevItems } } = this.props;
    const { searchUsersAutoComplete: { items } } = nextProps;
    if (items && items !== prevItems) {
      const { dataSource } = this.state;
      this.setState({
        dataSource: dataSource.cloneWithRows(items)
      });
    }
  }

  renderRow = (item) => {
    const { onPressItem, screenProps } = this.props;
    return (
      <PXTouchable 
        key={item.user.id} 
        onPress={() => onPressItem(item.user.id)}
      >
        <View style={styles.row}>
          <View style={styles.thumnailNameContainer}>
            <PXThumbnailTouchable 
              uri={item.user.profile_image_urls.medium} 
              onPress={() => onPressItem(item.user.id)}
            />
            <Text style={styles.username}>{item.user.name}</Text>
          </View>
          <FollowButtonContainer user={item.user} screenProps={screenProps} />
        </View>
      </PXTouchable>
    )
  }

  renderSeparator = (sectionId, rowId) => {
    return (
      <Separator key={`${sectionId}-${rowId}`} />
    )
  }

  renderFooter = () => {
    const { searchUsersAutoComplete: { items, nextUrl } } = this.props;
    return (
      nextUrl ?
      <View style={{ marginBottom: 20 }}>
        <Loader />
      </View>
      :
      null
    )
  }

  render() {
    const { searchUsersAutoComplete: { items, loading, loaded }, loadMoreItems, searchHistory, onPressSearchHistoryItem, onPressRemoveSearchHistoryItem, onPressClearSearchHistory } = this.props;
    const { dataSource } = this.state;
    return (
      <View style={styles.container}>
        {
          !loaded && !loading &&
          <SearchHistory 
            items={searchHistory.items}
            onPressItem={onPressSearchHistoryItem}
            onPressRemoveSearchHistoryItem={onPressRemoveSearchHistoryItem}
            onPressClearSearchHistory={onPressClearSearchHistory}
          />
        }
        {
          !loaded && loading &&
          <Loader />
        }
        {
          (items && items.length) ?
          <ListView 
            dataSource={dataSource}
            renderRow={this.renderRow}
            renderSeparator={this.renderSeparator}
            enableEmptySections={true}
            keyboardShouldPersistTaps="always"
            onScroll={dismissKeyboard}
            onEndReached={loadMoreItems}
            renderFooter={this.renderFooter}
          />
          :
          null
        }
      </View>
    );
  }
}

export default SearchUsersAutoCompleteResult;
