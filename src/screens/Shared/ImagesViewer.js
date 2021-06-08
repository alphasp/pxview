import React, { Component } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import PXHeader from '../../components/PXHeader';
import PXTabView from '../../components/PXTabView';
import PXPhotoView from '../../components/PXPhotoView';
import HeaderTextTitle from '../../components/HeaderTextTitle';
import HeaderSaveImageButton from '../../components/HeaderSaveImageButton';
import Loader from '../../components/Loader';
import { READING_DIRECTION_TYPES } from '../../common/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  slide: {
    flex: 1,
  },
});

class ImagesViewer extends Component {
  constructor(props) {
    super(props);
    const { route, imageReadingDirection } = props;
    const { images, viewerIndex } = route.params;
    const imagesWithDirection =
      imageReadingDirection === READING_DIRECTION_TYPES.RIGHT_TO_LEFT
        ? images.reverse()
        : images;
    this.state = {
      index:
        imageReadingDirection === READING_DIRECTION_TYPES.RIGHT_TO_LEFT
          ? images.length - 1 - viewerIndex
          : viewerIndex,
      images: imagesWithDirection.map((image) => ({
        url: image,
        loading: true,
      })),
      routes: imagesWithDirection.map((image) => ({
        key: image.toString(),
      })),
      hideHeader: true,
    };
  }

  handleOnImageLoaded = (imageUrl) => {
    this.setState(({ images }) => ({
      images: images.map((image) =>
        image.url === imageUrl ? { ...image, loading: false } : image,
      ),
    }));
  };

  handleOnPressImage = () => {
    this.setState((prevState) => ({
      hideHeader: !prevState.hideHeader,
    }));
  };

  renderScene = ({ route }) => {
    const { routes, images } = this.state;
    const sceneIndex = routes.indexOf(route);
    const image = images[sceneIndex];
    return (
      <View key={image.url} style={styles.slide}>
        {image.loading && <Loader absolutePosition style={styles.loader} />}
        <PXPhotoView
          uri={image.url}
          onLoad={this.handleOnImageLoaded}
          onTap={this.handleOnPressImage}
          onViewTap={this.handleOnPressImage}
        />
      </View>
    );
  };

  handleChangeTab = (index) => {
    this.setState({ index });
  };

  getCurrentPageNumber = () => {
    const { route, imageReadingDirection } = this.props;
    const { images } = route.params;
    const { index } = this.state;
    if (imageReadingDirection === READING_DIRECTION_TYPES.RIGHT_TO_LEFT) {
      return images.length - index;
    }
    return index + 1;
  };

  renderTabBar = () => null;

  render() {
    const { route, imageReadingDirection } = this.props;
    const { images, item } = route.params;
    const { index, hideHeader } = this.state;
    const selectedImages = [images[index]];
    return (
      <View style={styles.container}>
        <StatusBar hidden={hideHeader} barStyle="light-content" animated />
        {!hideHeader && (
          <PXHeader
            darkTheme
            withShadow
            absolutePosition
            showBackButton
            headerTitle={
              <HeaderTextTitle>
                {images.length > 1
                  ? `${this.getCurrentPageNumber()}/${images.length}`
                  : null}
              </HeaderTextTitle>
            }
            headerRight={
              <HeaderSaveImageButton
                imageUrls={selectedImages}
                imageIndex={
                  imageReadingDirection ===
                  READING_DIRECTION_TYPES.RIGHT_TO_LEFT
                    ? images.length - index
                    : index
                }
                workId={item.id}
                workTitle={item.title}
                workType={item.type}
                userId={item.user.id}
                userName={item.user.name}
              />
            }
          />
        )}
        <PXTabView
          navigationState={this.state}
          renderTabBar={this.renderTabBar}
          renderScene={this.renderScene}
          onIndexChange={this.handleChangeTab}
          lazyPreloadDistance={3}
        />
      </View>
    );
  }
}

export default connect((state) => {
  const { imageReadingDirection } = state.readingSettings;
  return {
    imageReadingDirection,
  };
})(ImagesViewer);
