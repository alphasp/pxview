import React, { Component } from 'react';
import { Platform, StyleSheet, View, StatusBar } from 'react-native';
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
import { globalStyles } from '../../styles';

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
      hideHeader: true,
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

  handleOnPressImage = () => {
    this.setState(prevState => ({
      hideHeader: !prevState.hideHeader,
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
        {image.loading &&
          <Loader absolutePosition style={styles.loader} color="#fff" />}
        <PXPhotoView
          uri={image.url}
          onLoad={this.handleOnImageLoaded}
          onTap={this.handleOnPressImage}
          onViewTap={this.handleOnPressImage}
        />
      </View>
    );
  };

  handleChangeTab = index => {
    this.setState({ index });
  };

  render() {
    const { images, item } = this.props.navigation.state.params;
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
        {!hideHeader &&
          <PXHeader
            darkTheme
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
          />}
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
