import React, { Component } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import PXHeader from '../../components/PXHeader';
import PXTabView from '../../components/PXTabView';
import PXPhotoView from '../../components/PXPhotoView';
import HeaderTextTitle from '../../components/HeaderTextTitle';
import HeaderSaveImageButton from '../../components/HeaderSaveImageButton';
import Loader from '../../components/Loader';

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
    const { route } = props;
    const { images, viewerIndex } = route.params;
    this.state = {
      index: viewerIndex,
      images: images.map((image) => ({
        url: image,
        loading: true,
      })),
      routes: images.map((image) => ({
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
    const { routes, index, images } = this.state;
    if (Math.abs(index - routes.indexOf(route)) > 2) {
      return null;
    }
    const image = images[index];
    return (
      <View key={image.url} style={styles.slide}>
        {image.loading && (
          <Loader absolutePosition style={styles.loader} color="#fff" />
        )}
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

  render() {
    const { route } = this.props;
    const { images, item } = route.params;
    const { index, hideHeader } = this.state;
    const selectedImages = [images[index]];
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={hideHeader}
          barStyle="light-content"
          translucent
          animated
        />
        {!hideHeader && (
          <PXHeader
            darkTheme
            withShadow
            hideStatusBar
            absolutePosition
            showBackButton
            headerTitle={
              <HeaderTextTitle>
                {images.length > 1 ? `${index + 1}/${images.length}` : null}
              </HeaderTextTitle>
            }
            headerRight={
              <HeaderSaveImageButton
                imageUrls={selectedImages}
                imageIndex={index}
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
          renderTabBar={() => null}
          renderScene={this.renderScene}
          onIndexChange={this.handleChangeTab}
        />
      </View>
    );
  }
}

export default ImagesViewer;
