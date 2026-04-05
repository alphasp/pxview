import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';
import PXImage from './PXImage';
import pixiv from '../common/helpers/apiClient';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  image: {
    backgroundColor: '#f2f2f2',
  },
  fallback: {
    color: '#666',
    fontStyle: 'italic',
  },
});

const resolveIllustImageUrl = (illust) => {
  if (!illust) {
    return null;
  }

  if (illust.meta_pages && illust.meta_pages.length) {
    const firstPage = illust.meta_pages[0];
    if (firstPage && firstPage.image_urls && firstPage.image_urls.original) {
      return firstPage.image_urls.original;
    }
  }

  if (
    illust.meta_single_page &&
    illust.meta_single_page.original_image_url
  ) {
    return illust.meta_single_page.original_image_url;
  }

  if (illust.image_urls && illust.image_urls.large) {
    return illust.image_urls.large;
  }

  return null;
};

class NovelInlineImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: null,
      isFailed: false,
      isLoading: Boolean(props.illustId),
      imageAspectRatio: 1,
    };
  }

  componentDidMount() {
    this.loadImage();
  }

  componentDidUpdate(prevProps) {
    const { illustId } = this.props;
    if (illustId !== prevProps.illustId) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(
        {
          imageUrl: null,
          isFailed: false,
          isLoading: Boolean(illustId),
          imageAspectRatio: 1,
        },
        this.loadImage,
      );
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  loadImage = async () => {
    const requestId = (this.requestId || 0) + 1;
    this.requestId = requestId;
    const { illustId } = this.props;
    if (!illustId) {
      this.setState({
        isLoading: false,
        isFailed: true,
      });
      return;
    }

    try {
      const response = await pixiv.illustDetail(illustId);
      if (this.unmounted || requestId !== this.requestId) {
        return;
      }

      const illust = response && response.illust;
      const imageUrl = resolveIllustImageUrl(illust);
      const width = illust && illust.width;
      const height = illust && illust.height;
      const imageAspectRatio =
        width && height ? width / height : this.state.imageAspectRatio;

      this.setState({
        imageUrl,
        isLoading: false,
        isFailed: !imageUrl,
        imageAspectRatio,
      });
    } catch (err) {
      if (!this.unmounted && requestId === this.requestId) {
        this.setState({
          isLoading: false,
          isFailed: true,
        });
      }
    }
  };

  handleImageError = () => {
    this.setState({
      isFailed: true,
      isLoading: false,
    });
  };

  renderContent() {
    const { illustId, maxWidth } = this.props;
    const { imageUrl, isFailed, isLoading, imageAspectRatio } = this.state;

    if (isLoading) {
      return (
        <Text
          accessibilityLabel={`novel-inline-image-${illustId}`}
          style={styles.fallback}
        >
          Loading image...
        </Text>
      );
    }

    if (!imageUrl || isFailed) {
      return (
        <Text
          accessibilityLabel={`novel-inline-image-${illustId}`}
          style={styles.fallback}
        >
          Image unavailable
        </Text>
      );
    }

    return (
      <PXImage
        accessibilityLabel={`novel-inline-image-${illustId}`}
        uri={imageUrl}
        resizeMode="contain"
        onError={this.handleImageError}
        style={[
          styles.image,
          {
            width: maxWidth || globalStyleVariables.WINDOW_WIDTH - 20,
            aspectRatio: imageAspectRatio,
          },
        ]}
      />
    );
  }

  render() {
    return this.renderContent();
  }
}

export default NovelInlineImage;
