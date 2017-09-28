import React, { Component } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import {
  TabViewAnimated,
  TabViewPagerScroll,
  TabViewPagerPan,
} from 'react-native-tab-view';
import PXHeader from '../../components/PXHeader';
import PXPhotoView from '../../components/PXPhotoView';
import HeaderTextTitle from '../../components/HeaderTextTitle';
import HeaderSaveImageButton from '../../components/HeaderSaveImageButton';
import Loader from '../../components/Loader';
import { globalStyles, globalStyleVariables } from '../../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
  },
  slide: {
    flex: 1,
  },
});

class ImagesViewer extends Component {
  constructor(props) {
    super(props);
    const { images, viewerIndex } = this.props.navigation.state.params;
    this.state = {
      loading: true,
      index: viewerIndex,
      images: images.map(image => ({
        url: image,
        loading: true,
      })),
      routes: images.map(image => ({
        key: image.toString(),
      })),
    };
  }

  handleOnImageLoaded = imageUrl => {
    this.setState(({ images }) => ({
      images: images.map(
        image =>
          image.url === imageUrl ? { ...image, loading: false } : image,
      ),
    }));
  };

  renderPager = props =>
    Platform.OS === 'ios'
      ? <TabViewPagerScroll {...props} />
      : <TabViewPagerPan {...props} />;

  renderScene = ({ route, index }) => {
    if (Math.abs(this.state.index - this.state.routes.indexOf(route)) > 2) {
      return null;
    }
    const image = this.state.images[index];
    return (
      <View key={image.url} style={styles.slide}>
        {image.loading && <Loader absolutePosition />}
        <PXPhotoView uri={image.url} onLoad={this.handleOnImageLoaded} />
      </View>
    );
  };

  handleChangeTab = index => {
    this.setState({ index });
  };

  render() {
    const { images } = this.props.navigation.state.params;
    const { index } = this.state;
    const selectedImages = [images[index]];
    return (
      <View style={styles.container}>
        <PXHeader
          darkTheme
          showBackButton
          headerTitle={
            <HeaderTextTitle>
              {images.length > 1 ? `${index + 1}/${images.length}` : null}
            </HeaderTextTitle>
          }
          headerRight={<HeaderSaveImageButton imageUrls={selectedImages} />}
        />
        <TabViewAnimated
          style={globalStyles.container}
          navigationState={this.state}
          renderScene={this.renderScene}
          renderPager={this.renderPager}
          onIndexChange={this.handleChangeTab}
        />
      </View>
    );
  }
}

export default ImagesViewer;
