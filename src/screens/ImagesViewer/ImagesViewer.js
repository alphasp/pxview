import React, { Component } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import {
  TabViewAnimated,
  TabViewPagerScroll,
  TabViewPagerPan,
} from 'react-native-tab-view';
import PXPhotoView from '../../components/PXPhotoView';
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
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});

class ImagesViewer extends Component {
  static navigationOptions = ({ navigation }) => {
    const {
      selectedImages,
      totalImages,
      viewerIndex,
    } = navigation.state.params;
    return {
      title: totalImages > 1 ? `${viewerIndex + 1}/${totalImages}` : null,
      headerRight: selectedImages &&
        selectedImages.length &&
        <HeaderSaveImageButton imageUrls={selectedImages} />,
    };
  };

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

  componentDidMount() {
    const { navigation } = this.props;
    const { images, viewerIndex } = navigation.state.params;
    const selectedImages = [images[viewerIndex]];
    navigation.setParams({
      selectedImages,
      totalImages: images.length,
      viewerIndex,
    });
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
    const { navigation } = this.props;
    const { images } = navigation.state.params;
    const selectedImages = [images[index]];
    this.setState({ index });
    navigation.setParams({
      selectedImages,
      viewerIndex: index,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <TabViewAnimated
          style={globalStyles.container}
          navigationState={this.state}
          renderScene={this.renderScene}
          renderPager={this.renderPager}
          onRequestChangeTab={this.handleChangeTab}
        />
      </View>
    );
  }
}

export default ImagesViewer;
