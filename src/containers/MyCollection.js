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
import PXTouchable from '../components/PXTouchable';
import TagsFilterModal from './TagsFilterModal';
import MyPrivateBookmarkIllust from './MyPrivateBookmarkIllust';
import UserBookmarkIllust from './UserBookmarkIllust';
import { TagType } from '../common/actions/bookmarkTag';

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
  filterButtonContainer: {
    padding: 10,
    backgroundColor: '#fff',
  },
  filterButton: {
    backgroundColor: '#5cafec',
    padding: 10,
    alignItems: 'center',
    //margin: 10,
  },
  filterButtonText: {
    color: '#fff',
  },
});

class MyCollection extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      currentTabIndex: 0,
      isOpenFilterModal: false,
      selectedPublicTag: '',
      selectedPrivateTag: '',
    };
  }

  handleOnPressFilterButton = () => {
    this.setState({
      isOpenFilterModal: true
    });
  }

  handleOnPressCloseFilterButton = () => {
    this.setState({
      isOpenFilterModal: false
    });
  }

  handleOnSelectTag = (tag) => {
    const { currentTabIndex } = this.state;
    console.log(currentTabIndex, tag)
    newState = { 
      isOpenFilterModal: false 
    };
    if (currentTabIndex === 0) {
      newState.selectedPublicTag = tag;
    }
    else {
      newState.selectedPrivateTag = tag;
    }
    this.setState(newState);
  }

  handleOnChangeTab = ({ i, ref }) => {
    this.setState({
      currentTabIndex: i
    })
  }

  render() {
    const { userId } = this.props;
    const { currentTabIndex, isOpenFilterModal, selectedPublicTag, selectedPrivateTag } = this.state;
    return (
      <View style={styles.container}>
        <ScrollableTabView ref={(ref) => this.tabs = ref} onChangeTab={this.handleOnChangeTab}>
          <UserBookmarkIllust tabLabel="Illustrations (Public)" userId={userId} tag={selectedPublicTag} />
          <MyPrivateBookmarkIllust tabLabel="Illustrations (Private)" userId={userId} tag={selectedPrivateTag} />
        </ScrollableTabView>
        <View style={styles.filterButtonContainer}>
          <PXTouchable 
            style={styles.filterButton}
            onPress={this.handleOnPressFilterButton}
          >
            <Text style={styles.filterButtonText}>Filter Results</Text>
          </PXTouchable> 
        </View>
        {
          currentTabIndex === 0 &&
          <TagsFilterModal 
            tagType={TagType.PUBLIC}
            isOpen={isOpenFilterModal}
            onPressCloseButton={this.handleOnPressCloseFilterButton}
            onSelectTag={this.handleOnSelectTag}
            tag={selectedPublicTag}
          />
        }
        {
          currentTabIndex === 1 &&
          <TagsFilterModal 
            tagType={TagType.PRIVATE}
            isOpen={isOpenFilterModal}
            onPressCloseButton={this.handleOnPressCloseFilterButton}
            onSelectTag={this.handleOnSelectTag}
            tag={selectedPrivateTag}
          />
        }
      </View>
    );
  }
}


export default MyCollection;
