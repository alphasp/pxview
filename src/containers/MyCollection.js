import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PXTouchable from '../components/PXTouchable';
import PXTabView from '../components/PXTabView';
import TagsFilterModal from './TagsFilterModal';
import MyPrivateBookmarkIllusts from './MyPrivateBookmarkIllusts';
import UserBookmarkIllusts from './UserBookmarkIllusts';
import { TagType } from '../common/actions/bookmarkTag';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class MyCollection extends Component {
  static navigationOptions = ({ navigation }) => {
    const { setParams } = navigation;
    return {
      headerRight: (
        <Icon 
          name="sliders" 
          size={20} 
          onPress={() => setParams({isOpenFilterModal: true})}
          color="#037aff"
          style={{
            padding: 10
          }}
        />
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = { 
      index: 0,
      routes: [
        { key: '1', title: 'Illustrations (Public)' },
        { key: '2', title: 'Illustrations (Private)' },
      ],
      //isShowFilterButton: true,
      isOpenFilterModal: false,
      selectedPublicTag: '',
      selectedPrivateTag: '',
    };
  }
  
  handleChangeTab = (index) => {
    this.setState({ index });
  };

  renderScene = ({ route }) => {
    const { userId } = this.props.navigation.state.params;
    const { selectedPublicTag, selectedPrivateTag } = this.state;
    switch (route.key) {
      case '1':
        return <UserBookmarkIllusts  userId={userId} tag={selectedPublicTag} reload={true} />
      case '2':
        return <MyPrivateBookmarkIllusts  userId={userId} tag={selectedPrivateTag} />
      default:
        return null;
    };
  }


  handleOnPressCloseFilterButton = () => {
    const { navigation: { setParams } } = this.props;
    setParams({
      isOpenFilterModal: false 
    });
  }

  handleOnSelectTag = (tag) => {
    const { navigation: { setParams } } = this.props;
    const { index } = this.state;
    console.log(index, tag)
    newState = {};
    if (index === 0) {
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

  render() {
    const { userId, isOpenFilterModal} = this.props.navigation.state.params;
    const { index, isShowFilterButton, selectedPublicTag, selectedPrivateTag } = this.state;
    return (
      <View style={styles.container}>
        <PXTabView
          navigationState={this.state}
          renderScene={this.renderScene}
          onRequestChangeTab={this.handleChangeTab}
        />
        {
          index === 0 &&
          <TagsFilterModal 
            tagType={TagType.PUBLIC}
            isOpen={isOpenFilterModal || false}
            onPressCloseButton={this.handleOnPressCloseFilterButton}
            onSelectTag={this.handleOnSelectTag}
            tag={selectedPublicTag}
          />
        }
        {
          index === 1 &&
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
