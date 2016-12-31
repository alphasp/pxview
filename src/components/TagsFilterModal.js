import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Text,
  ListView,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import PXTouchable from './PXTouchable';
import FollowButton from './FollowButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  innerContainer: {
    // borderRadius: 10,
    //alignItems: 'center',
    backgroundColor: '#fff', 
    //padding: 20
  },
  sectionHeader: {
    backgroundColor: '#E9EBEE',
  },
  sectionHeaderTitle: {
    fontWeight: "bold", 
    // fontSize: 20,
    padding: 10
  },
  row: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectedTagContainer: {
    backgroundColor: '#5cafec',
  },
  selectedTagText: {
    color: '#fff',
  },
});

const data = {
  tags: [
    {
      name: 'All', //
      value: '',
    },
    {
      name: 'Uncategorized', //未分類
      value: '未分類',
    },
    {
      name: 'C91',
      value: 'C91',
      count: 1,
    },
    {
      name: 'ポケモン',
      value: 'ポケモン',
      count: 2,
    },
    {
      name: 'Fate/GrandOrder',
      value: 'Fate/GrandOrder',
      count: 2,
    }
  ],
}

class TagsFilterModal extends Component {
  constructor(props) {
    super(props);
    //const { searchFilter: { target, duration } } = props;
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1,s2) => s1 !== s2
    })
    this.state = {
      // tag: tag || 'all',
      tag: 'all',
    };
  }

  renderRow = (item) => {
    //const { target, duration } = this.state;
    const { tag, onSelectTag } = this.props;
    const isSelected = item.name === tag;
    return (
      <PXTouchable 
        key={item.name} 
        onPress={() => onSelectTag(item.value)}
      >
        <View style={[styles.row, isSelected && styles.selectedTagContainer]}>
          {
            <View style={styles.selectedTag}>
              <Text style={isSelected && styles.selectedTagText}>{item.name}</Text>
            </View>
          }
          {
            item.count &&
            <Text style={isSelected && styles.selectedTagText}>{item.count}</Text>
          }
        </View>
      </PXTouchable>
    )
  }

  renderSectionHeader = (sectionData, sectionID) => {
    return (
      <View key={sectionID} style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderTitle}>
          Collection Tags
        </Text>
      </View>
    )
  }

  // onSwitchPrivateValue = (value) => {
  //   this.setState({ isPrivate: value });
  // }

  render() {
    // const { isOpen, selectedUserId, isFollowSelectedUser, onPressCloseButton, onPressFollowButton } = this.props;
    // const { isPrivate } = this.state;
    const { isOpen, onPressCloseButton } = this.props;
    //const { target, duration } = this.state;
    const dataSource = this.dataSource.cloneWithRowsAndSections(data);
    return (
      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={isOpen}
          onRequestClose={onPressCloseButton}
          onShow={() => console.log('on show modal')}
        >
          <PXTouchable style={styles.container} onPress={onPressCloseButton}>
            <TouchableWithoutFeedback>
              <View style={styles.innerContainer}>
                <ListView
                  dataSource={dataSource}
                  renderRow={this.renderRow}
                  renderSectionHeader={this.renderSectionHeader}
                  keyboardShouldPersistTaps
                />  
              </View>
            </TouchableWithoutFeedback>
          </PXTouchable>
        </Modal>
      </View>
    );
  }
}

export default TagsFilterModal;
