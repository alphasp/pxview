import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import MyPrivateBookmarkIllusts from './MyPrivateBookmarkIllusts';
import UserBookmarkIllusts from '../../Shared/UserBookmarkIllusts';
import TagsFilterModal from '../../../containers/TagsFilterModal';
import { connectLocalization } from '../../../components/Localization';
import PXTabView from '../../../components/PXTabView';
import HeaderFilterButton from '../../../components/HeaderFilterButton';
import { TAG_TYPES } from '../../../common/constants';

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
        <HeaderFilterButton
          onPress={() => setParams({ isOpenFilterModal: true })}
        />
      ),
    };
  };

  constructor(props) {
    super(props);
    const { i18n } = props;
    this.state = {
      index: 0,
      routes: [
        { key: '1', title: i18n.illustrationPublic },
        { key: '2', title: i18n.illustrationPrivate },
      ],
      selectedPublicTag: '',
      selectedPrivateTag: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { lang: prevLang } = this.props;
    const { lang, i18n } = nextProps;
    if (lang !== prevLang) {
      this.setState({
        routes: [
          { key: '1', title: i18n.illustrationPublic },
          { key: '2', title: i18n.illustrationPrivate },
        ],
      });
    }
  }

  handleChangeTab = index => {
    this.setState({ index });
  };

  renderScene = ({ route }) => {
    const { userId } = this.props.navigation.state.params;
    const { selectedPublicTag, selectedPrivateTag } = this.state;
    switch (route.key) {
      case '1':
        return (
          <UserBookmarkIllusts userId={userId} tag={selectedPublicTag} reload />
        );
      case '2':
        return (
          <MyPrivateBookmarkIllusts userId={userId} tag={selectedPrivateTag} />
        );
      default:
        return null;
    }
  };

  handleOnPressCloseFilterButton = () => {
    const { navigation: { setParams } } = this.props;
    setParams({
      isOpenFilterModal: false,
    });
  };

  handleOnSelectTag = tag => {
    const { navigation: { setParams } } = this.props;
    const { index } = this.state;
    const newState = {};
    if (index === 0) {
      newState.selectedPublicTag = tag;
    } else {
      newState.selectedPrivateTag = tag;
    }
    setParams({
      isOpenFilterModal: false,
    });
    this.setState(newState);
  };

  render() {
    const { isOpenFilterModal } = this.props.navigation.state.params;
    const { index, selectedPublicTag, selectedPrivateTag } = this.state;
    return (
      <View style={styles.container}>
        <PXTabView
          navigationState={this.state}
          renderScene={this.renderScene}
          onRequestChangeTab={this.handleChangeTab}
        />
        {index === 0 &&
          <TagsFilterModal
            tagType={TAG_TYPES.PUBLIC}
            isOpen={isOpenFilterModal || false}
            onPressCloseButton={this.handleOnPressCloseFilterButton}
            onSelectTag={this.handleOnSelectTag}
            tag={selectedPublicTag}
          />}
        {index === 1 &&
          <TagsFilterModal
            tagType={TAG_TYPES.PRIVATE}
            isOpen={isOpenFilterModal || false}
            onPressCloseButton={this.handleOnPressCloseFilterButton}
            onSelectTag={this.handleOnSelectTag}
            tag={selectedPrivateTag}
          />}
      </View>
    );
  }
}

export default connectLocalization(MyCollection);
