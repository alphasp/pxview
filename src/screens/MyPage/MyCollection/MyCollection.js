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
      isOpenFilterModal: false,
    };
  }

  componentDidMount() {
    this.setHeaderRight();
  }

  setHeaderRight = () => {
    const {
      navigation: { setOptions },
    } = this.props;
    setOptions({
      headerRight: () => (
        <HeaderFilterButton onPress={this.handleOnPressOpenFilterModal} />
      ),
    });
  };

  handleChangeTab = (index) => {
    this.setState({ index });
  };

  renderScene = ({ route }) => {
    const { navigation, route: navigationRoute } = this.props;
    const { userId } = navigationRoute.params;
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
            route={route}
          />
        );
      case '2':
        return (
          <MyPrivateBookmarkIllusts
            userId={userId}
            tag={selectedPrivateIllustTag}
            navigation={navigation}
            route={route}
          />
        );
      case '3':
        return (
          <UserBookmarkNovels
            userId={userId}
            tag={selectedPublicNovelTag}
            reload
            navigation={navigation}
            route={route}
          />
        );
      case '4':
        return (
          <MyPrivateBookmarkNovels
            userId={userId}
            tag={selectedPrivateNovelTag}
            navigation={navigation}
            route={route}
          />
        );
      default:
        return null;
    }
  };

  handleOnPressOpenFilterModal = () => {
    this.setState({
      isOpenFilterModal: true,
    });
  };

  handleOnPressCloseFilterButton = () => {
    this.setState({
      isOpenFilterModal: false,
    });
  };

  handleOnSelectTag = (tag) => {
    const { index } = this.state;
    const newState = {
      isOpenFilterModal: false,
    };
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
    this.setState(newState);
  };

  render() {
    const {
      isOpenFilterModal,
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
          scrollEnabled
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
