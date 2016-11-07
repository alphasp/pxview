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
import Loader from './Loader';
import Separator from './Separator';

const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
  row: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
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

class SearchAutoCompleteResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      })
    };
  }
  componentWillReceiveProps(nextProps) {
    const { searchAutoComplete: { items: prevItems } } = this.props;
    const { searchAutoComplete: { items } } = nextProps;
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
        key={item} 
        onPress={() => onPressItem(item)}
      >
        <View style={styles.row}>
          <Text>{item}</Text>
        </View>
      </PXTouchable>
    )
  }

  renderSeparator = (sectionId, rowId) => {
    return (
      <Separator key={`${sectionId}-${rowId}`} />
    )
  }

  render() {
    const { searchAutoComplete: { items, loading, loaded } } = this.props;
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
          />
          :
          null
        }
      </View>
    );
  }
}

export default SearchAutoCompleteResult;
