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
import Icon from 'react-native-vector-icons/FontAwesome';
import PXTouchable from '../components/PXTouchable';
import TagsFilterModal from './TagsFilterModal';
import MyPrivateBookmarkIllusts from './MyPrivateBookmarkIllusts';
import UserBookmarkIllusts from './UserBookmarkIllusts';
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
});

class MyCollection extends Component {
  static navigationOptions = {
    header: ({ state, setParams }, defaultHeader) => {
      return {
        ...defaultHeader,
        backTitle: null,
        right: (
          <Icon 
            name="sliders" 
            size={20} 
            onPress={() => setParams({isOpenFilterModal: true})}
            color="#037aff"
            style={{
              padding: 10
            }}
          />
        ),
      }
    }
  }
  constructor(props) {
    super(props);
    //this.offset = 0;
    this.state = { 
      currentTabIndex: 0,
      //isShowFilterButton: true,
      isOpenFilterModal: false,
      selectedPublicTag: '',
      selectedPrivateTag: '',
    };
  }

  // handleOnPressFilterButton = () => {
  //   const { navigation: { setParams } } = this.props;
  //   setParams({
  //     isOpenFilterModal: true 
  //   });
  // }

  handleOnPressCloseFilterButton = () => {
    const { navigation: { setParams } } = this.props;
    setParams({
      isOpenFilterModal: false 
    });
  }

  handleOnSelectTag = (tag) => {
    const { navigation: { setParams } } = this.props;
    const { currentTabIndex } = this.state;
    console.log(currentTabIndex, tag)
    newState = {};
    if (currentTabIndex === 0) {
      newState.selectedPublicTag = tag;
    }
    else {
      newState.selectedPrivateTag = tag;
    }
    setParams({
      isOpenFilterModal: false 
    });
    this.setState(newState);
  }

  handleOnChangeTab = ({ i, ref }) => {
    this.setState({
      currentTabIndex: i
    })
  }

  // handleOnScroll = (e) => {
  //   console.log('e ', e.nativeEvent.contentOffset.y);
  //   const currentOffset = e.nativeEvent.contentOffset.y;
  //   if (currentOffset > this.offset) {
  //     this.setState({
  //       isShowFilterButton: false
  //     });
  //   }
  //   else {
  //     this.setState({
  //       isShowFilterButton: true
  //     });
  //   }
  //   this.offset = currentOffset;
  // }

  render() {
    const { userId, isOpenFilterModal} = this.props.navigation.state.params;
    console.log('open ', isOpenFilterModal)
    const { currentTabIndex, isShowFilterButton, selectedPublicTag, selectedPrivateTag } = this.state;
    return (
      <View style={styles.container}>
        <ScrollableTabView ref={(ref) => this.tabs = ref} onChangeTab={this.handleOnChangeTab}>
          <UserBookmarkIllusts tabLabel="Illustrations (Public)" userId={userId} tag={selectedPublicTag} />
          <MyPrivateBookmarkIllusts tabLabel="Illustrations (Private)" userId={userId} tag={selectedPrivateTag} />
        </ScrollableTabView>
        {
          currentTabIndex === 0 &&
          <TagsFilterModal 
            tagType={TagType.PUBLIC}
            isOpen={isOpenFilterModal || false}
            onPressCloseButton={this.handleOnPressCloseFilterButton}
            onSelectTag={this.handleOnSelectTag}
            tag={selectedPublicTag}
          />
        }
        {
          currentTabIndex === 1 &&
          <TagsFilterModal 
            tagType={TagType.PRIVATE}
            isOpen={isOpenFilterModal || false}
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
