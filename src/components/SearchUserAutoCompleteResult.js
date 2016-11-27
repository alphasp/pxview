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
import Loader from './Loader';
import Separator from './Separator';

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

class SearchUserAutoCompleteResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      })
    };
  }
  componentWillReceiveProps(nextProps) {
    const { searchUserAutoComplete: { items: prevItems } } = this.props;
    const { searchUserAutoComplete: { items } } = nextProps;
    if (items && items !== prevItems) {
      const { dataSource } = this.state;
      this.setState({
        dataSource: dataSource.cloneWithRows(items)
      });
    }
  }

  renderRow = (item) => {
    const { onPressItem } = this.props;
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
            <Text>{item.user.name}</Text>
          </View>
          <PXTouchable>
            <Text>Follow</Text>
          </PXTouchable>    
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
    const { searchUserAutoComplete: { nextUrl } } = this.props;
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
    const { searchUserAutoComplete: { items, loading, loaded }, loadMoreItems } = this.props;
    const { dataSource } = this.state;
    return (
      <View style={styles.container}>
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
            keyboardShouldPersistTaps={true}
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

export default SearchUserAutoCompleteResult;
