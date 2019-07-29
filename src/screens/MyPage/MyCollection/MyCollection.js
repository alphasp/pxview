import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import UserBookmarkIllusts from '../../Shared/UserBookmarkIllusts';
import MyPrivateBookmarkIllusts from './MyPrivateBookmarkIllusts';
import UserBookmarkNovels from '../../Shared/UserBookmarkNovels';
import MyPrivateBookmarkNovels from './MyPrivateBookmarkNovels';
import IllustTagsFilterModal from '../../../containers/IllustTagsFilterModal';
import NovelTagsFilterModal from '../../../containers/NovelTagsFilterModal';
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
        { key: '3', title: i18n.novelPublic },
        { key: '4', title: i18n.novelPrivate },
      ],
      selectedPublicIllustTag: '',
      selectedPrivateIllustTag: '',
      selectedPublicNovelTag: '',
      selectedPrivateNovelTag: '',
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
          { key: '3', title: i18n.novelPublic },
          { key: '4', title: i18n.novelPrivate },
        ],
      });
    }
  }

  handleChangeTab = index => {
    this.setState({ index });
  };

  renderScene = ({ route }) => {
    const { navigation } = this.props;
    const { userId } = navigation.state.params;
    const {
      selectedPublicIllustTag,
      selectedPrivateIllustTag,
      selectedPublicNovelTag,
      selectedPrivateNovelTag,
    } = this.state;
    switch (route.key) {
      case '1':
        return (
          <UserBookmarkIllusts
            userId={userId}
            tag={selectedPublicIllustTag}
            reload
            navigation={navigation}
          />
        );
      case '2':
        return (
          <MyPrivateBookmarkIllusts
            userId={userId}
            tag={selectedPrivateIllustTag}
            navigation={navigation}
          />
        );
      case '3':
        return (
          <UserBookmarkNovels
            userId={userId}
            tag={selectedPublicNovelTag}
            reload
            navigation={navigation}
          />
        );
      case '4':
        return (
          <MyPrivateBookmarkNovels
            userId={userId}
            tag={selectedPrivateNovelTag}
            navigation={navigation}
          />
        );
      default:
        return null;
    }
  };

  handleOnPressCloseFilterButton = () => {
    const {
      navigation: { setParams },
    } = this.props;
    setParams({
      isOpenFilterModal: false,
    });
  };

  handleOnSelectTag = tag => {
    const {
      navigation: { setParams },
    } = this.props;
    const { index } = this.state;
    const newState = {};
    switch (index) {
      case 0:
        newState.selectedPublicIllustTag = tag;
        break;
      case 1:
        newState.selectedPrivateIllustTag = tag;
        break;
      case 2:
        newState.selectedPublicNovelTag = tag;
        break;
      case 3:
        newState.selectedPrivateNovelTag = tag;
        break;
      default:
        break;
    }
    setParams({
      isOpenFilterModal: false,
    });
    this.setState(newState);
  };

  render() {
    const isOpenFilterModal =
      this.props.navigation.state.params.isOpenFilterModal || false;
    const {
      index,
      selectedPublicIllustTag,
      selectedPrivateIllustTag,
      selectedPublicNovelTag,
      selectedPrivateNovelTag,
    } = this.state;
    return (
      <View style={styles.container}>
        <PXTabView
          navigationState={this.state}
          renderScene={this.renderScene}
          onIndexChange={this.handleChangeTab}
          tabBarProps={{
            scrollEnabled: true,
          }}
        />
        {index === 0 && (
          <IllustTagsFilterModal
            tagType={TAG_TYPES.PUBLIC}
            isOpen={isOpenFilterModal}
            onPressCloseButton={this.handleOnPressCloseFilterButton}
            onSelectTag={this.handleOnSelectTag}
            tag={selectedPublicIllustTag}
          />
        )}
        {index === 1 && (
          <IllustTagsFilterModal
            tagType={TAG_TYPES.PRIVATE}
            isOpen={isOpenFilterModal}
            onPressCloseButton={this.handleOnPressCloseFilterButton}
            onSelectTag={this.handleOnSelectTag}
            tag={selectedPrivateIllustTag}
          />
        )}
        {index === 2 && (
          <NovelTagsFilterModal
            tagType={TAG_TYPES.PUBLIC}
            isOpen={isOpenFilterModal}
            onPressCloseButton={this.handleOnPressCloseFilterButton}
            onSelectTag={this.handleOnSelectTag}
            tag={selectedPublicNovelTag}
          />
        )}
        {index === 3 && (
          <NovelTagsFilterModal
            tagType={TAG_TYPES.PRIVATE}
            isOpen={isOpenFilterModal}
            onPressCloseButton={this.handleOnPressCloseFilterButton}
            onSelectTag={this.handleOnSelectTag}
            tag={selectedPrivateNovelTag}
          />
        )}
      </View>
    );
  }
}

export default connectLocalization(MyCollection);
