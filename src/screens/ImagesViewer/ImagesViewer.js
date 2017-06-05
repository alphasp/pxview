import React, { Component } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import {
  TabViewAnimated,
  TabViewPagerScroll,
  TabViewPagerPan,
} from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import PXPhotoView from '../../components/PXPhotoView';
import SaveImageBottomSheet from '../../components/SaveImageBottomSheet';
import PXTouchable from '../../components/PXTouchable';
import Loader from '../../components/Loader';
import { globalStyles } from '../../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9EBEE',
  },
  slide: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});

class ImagesViewer extends Component {
  static navigationOptions = ({ navigation }) => {
    const { openSaveImageBottomSheet } = navigation.state.params;
    return {
      headerRight: openSaveImageBottomSheet &&
        <PXTouchable onPress={openSaveImageBottomSheet}>
          <Icon
            name="ellipsis-v"
            size={20}
            style={{ paddingVertical: 10, paddingHorizontal: 20 }}
          />
        </PXTouchable>,
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
    const openImages = [images[viewerIndex]];
    navigation.setParams({
      openSaveImageBottomSheet: () =>
        this.saveImageBottomSheet.openSaveImageBottomSheet(openImages),
    });
  }

  handleOnPageSelected = index => {
    const { navigation } = this.props;
    const { images } = navigation.state.params;
    const openImages = [images[index]];
    navigation.setParams({
      viewerIndex: index,
      openSaveImageBottomSheet: () =>
        this.saveImageBottomSheet.openSaveImageBottomSheet(openImages),
    });
  };

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
        {image.loading && <Loader />}
        <PXPhotoView uri={image.url} onLoad={this.handleOnImageLoaded} />
      </View>
    );
  };

  handleChangeTab = index => {
    const { navigation } = this.props;
    const { images } = navigation.state.params;
    const openImages = [images[index]];
    this.setState({ index });
    navigation.setParams({
      openSaveImageBottomSheet: () =>
        this.saveImageBottomSheet.openSaveImageBottomSheet(openImages),
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
        <SaveImageBottomSheet
          innerRef={ref => (this.saveImageBottomSheet = ref)}
        />
      </View>
    );
  }
}

export default ImagesViewer;
