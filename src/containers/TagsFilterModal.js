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
import { connect } from 'react-redux';
import PXTouchable from '../components/PXTouchable';
//import TagsFilterModal from '../components/TagsFilterModal';
import * as bookmarkTagActionCreators from '../common/actions/bookmarkTag';
// import { TagType } from '../common/actions/bookmarkTag';

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

class TagsFilterModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1,s2) => s1 !== s2
      }),
      tag: 'all',
      refreshing: false
    };
  }

  componentDidMount() {
    const { fetchBookmarkTag, clearBookmarkTag, tagType } = this.props;
    clearBookmarkTag(tagType);
    fetchBookmarkTag(tagType);
  }

  componentWillReceiveProps(nextProps) {
    const { bookmarkTag: { items: prevItems } } = this.props;
    const { bookmarkTag: { items } } = nextProps;
    if (items && items !== prevItems) {
      const { dataSource } = this.state;
      this.setState({
        dataSource: dataSource.cloneWithRows(items)
      });
    }
  }

  renderRow = (item) => {
    //const { target, duration } = this.state;
    const { tag, onSelectTag } = this.props;
    const isSelected = item.value === tag;
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

  loadMoreItems = () => {
    const { bookmarkTag: { nextUrl }, tagType } = this.props;
    console.log('load more ', nextUrl)
    if (nextUrl) {
      fetchBookmarkTag(tagType, nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { fetchBookmarkTag, clearBookmarkTag, tagType } = this.props;
    this.setState({
      refereshing: true
    });
    clearBookmarkTag(tagType);
    fetchBookmarkTag(tagType).finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  // render() {
  //   const { bookmarkTag, tag, isOpen, onPressCloseButton, onSelectTag } = this.props;
  //   const { refreshing } = this.state;
  //   // return (
  //   //   <View></View>
  //   // )
  //   return (
  //     <TagsFilterModal
  //       data={bookmarkTag}
  //       isOpen={isOpen}
  //       onPressCloseButton={onPressCloseButton}
  //       onSelectTag={onSelectTag}
  //       tag={tag}
  //       refreshing={refreshing}
  //       loadMoreItems={this.loadMoreItems}
  //       onRefresh={this.handleOnRefresh}
  //     />
  //   );
  // }

  render() {
    // const { bookmarkTag: { items, loading, loaded}, tag, isOpen, onPressCloseButton, onSelectTag } = this.props;
    // const { refreshing } = this.state;

    const { bookmarkTag: { items, loading, loaded }, onSelectTag, loadMoreItems, isOpen, onPressCloseButton } = this.props;
    const { dataSource, refreshing } = this.state;
    // const dataSource = this.dataSource.cloneWithRowsAndSections(data);
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
                  keyboardShouldPersistTaps="always"
                />  
              </View>
            </TouchableWithoutFeedback>
          </PXTouchable>
        </Modal>
      </View>
    );
  }
}

export default connect((state, props) => {
  return {
    bookmarkTag: state.bookmarkTag[props.tagType]
  }
}, bookmarkTagActionCreators)(TagsFilterModal);
