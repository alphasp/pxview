import React, { Component } from 'react';
import { Image, StyleSheet, Text } from 'react-native';
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

const getImageIdFromProps = (props) => props.imageId || props.illustId;

const getImageKindFromProps = (props) => props.imageKind || 'loadedimage';

const getEmbeddedImageCandidateIds = (embeddedImage) =>
  [
    embeddedImage && embeddedImage.id,
    embeddedImage && embeddedImage.illustId,
    embeddedImage && embeddedImage.imageId,
    embeddedImage && embeddedImage.novelImageId,
    embeddedImage && embeddedImage.illust_id,
    embeddedImage && embeddedImage.image_id,
  ]
    .filter((value) => value !== undefined && value !== null)
    .map((value) => String(value));

const findEmbeddedImageById = (embeddedImages, imageId) => {
  if (!embeddedImages || !imageId) {
    return null;
  }

  const normalizedImageId = String(imageId);
  const numericImageId = parseInt(imageId, 10);

  if (Array.isArray(embeddedImages)) {
    return (
      embeddedImages.find(
        (item) =>
          item &&
          getEmbeddedImageCandidateIds(item).includes(normalizedImageId),
      ) || null
    );
  }

  if (embeddedImages[imageId]) {
    return embeddedImages[imageId];
  }

  if (!Number.isNaN(numericImageId) && embeddedImages[numericImageId]) {
    return embeddedImages[numericImageId];
  }

  const embeddedImageValues = Object.values(embeddedImages);
  return (
    embeddedImageValues.find(
      (item) =>
        item && getEmbeddedImageCandidateIds(item).includes(normalizedImageId),
    ) || null
  );
};

const resolveEmbeddedImageUrl = (embeddedImage) => {
  if (!embeddedImage) {
    return null;
  }

  const { urls } = embeddedImage;
  if (!urls) {
    return (
      embeddedImage.originalUrl ||
      embeddedImage.url ||
      embeddedImage.coverUrl ||
      embeddedImage.thumbnailUrl ||
      null
    );
  }

  return (
    urls.original ||
    urls['1200x1200'] ||
    urls['600x600'] ||
    urls['480mw'] ||
    urls['240mw'] ||
    urls['128x128'] ||
    urls.regular ||
    urls.large ||
    urls.medium ||
    urls.small ||
    null
  );
};

const resolveEmbeddedImageAspectRatio = (embeddedImage) => {
  if (!embeddedImage) {
    return null;
  }

  const width =
    embeddedImage.width || embeddedImage.originalWidth || embeddedImage.w;
  const height =
    embeddedImage.height || embeddedImage.originalHeight || embeddedImage.h;

  return width && height ? width / height : null;
};

const resolveIllustImageUrl = (illust, pageNumber) => {
  if (!illust) {
    return null;
  }

  if (illust.meta_pages && illust.meta_pages.length) {
    const pageIndex =
      pageNumber && pageNumber > 0
        ? Math.min(pageNumber - 1, illust.meta_pages.length - 1)
        : 0;
    const page = illust.meta_pages[pageIndex];
    if (page && page.image_urls) {
      return (
        page.image_urls.original ||
        page.image_urls.large ||
        page.image_urls.medium ||
        null
      );
    }
  }

  if (illust.meta_single_page && illust.meta_single_page.original_image_url) {
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
    const imageId = getImageIdFromProps(props);
    this.state = {
      failureReason: null,
      imageUrl: null,
      isFailed: false,
      isLoading: Boolean(imageId),
      imageAspectRatio: 1,
    };
  }

  componentDidMount() {
    this.loadImage();
  }

  componentDidUpdate(prevProps) {
    const imageId = getImageIdFromProps(this.props);
    const prevImageId = getImageIdFromProps(prevProps);
    const imageKind = getImageKindFromProps(this.props);
    const prevImageKind = getImageKindFromProps(prevProps);
    if (
      imageId !== prevImageId ||
      imageKind !== prevImageKind ||
      this.props.pageNumber !== prevProps.pageNumber ||
      this.props.embeddedImages !== prevProps.embeddedImages
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(
        {
          failureReason: null,
          imageUrl: null,
          isFailed: false,
          isLoading: Boolean(imageId),
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
    const { embeddedImages, pageNumber } = this.props;
    const imageId = getImageIdFromProps(this.props);
    const imageKind = getImageKindFromProps(this.props);

    if (!imageId) {
      this.setState({
        failureReason: 'missing image id',
        isLoading: false,
        isFailed: true,
      });
      return;
    }

    const embeddedImage = findEmbeddedImageById(embeddedImages, imageId);
    const embeddedImageUrl = resolveEmbeddedImageUrl(embeddedImage);
    const embeddedImageAspectRatio = resolveEmbeddedImageAspectRatio(
      embeddedImage,
    );

    if (embeddedImageUrl) {
      if (embeddedImageAspectRatio) {
        // Metadata had real dimensions — fast path, no network needed
        this.setState({
          failureReason: null,
          imageUrl: embeddedImageUrl,
          isLoading: false,
          isFailed: false,
          imageAspectRatio: embeddedImageAspectRatio,
        });
      } else {
        // API returned URLs only — must fetch intrinsic size with Referer header
        // Keep isLoading: true so the "Loading image..." placeholder stays visible
        Image.getSizeWithHeaders(
          embeddedImageUrl,
          { referer: 'http://www.pixiv.net' },
          (width, height) => {
            if (this.unmounted || requestId !== this.requestId) {
              return;
            }
            this.setState({
              failureReason: null,
              imageUrl: embeddedImageUrl,
              isLoading: false,
              isFailed: false,
              imageAspectRatio: width && height ? width / height : 1,
            });
          },
          () => {
            if (this.unmounted || requestId !== this.requestId) {
              return;
            }
            // getSize failed — show image and measure via onLoad fallback
            this.setState({
              failureReason: null,
              imageUrl: embeddedImageUrl,
              isLoading: false,
              isFailed: false,
              imageAspectRatio: null,
            });
          },
        );
      }
      return;
    }

    if (imageKind === 'uploadedimage') {
      this.setState({
        failureReason: embeddedImage
          ? 'embedded image metadata has no usable url'
          : 'no embedded image metadata',
        isLoading: false,
        isFailed: true,
      });
      return;
    }

    try {
      const response = await pixiv.illustDetail(imageId);
      if (this.unmounted || requestId !== this.requestId) {
        return;
      }

      const illust = response && response.illust;
      const imageUrl = resolveIllustImageUrl(illust, pageNumber);
      const width = illust && illust.width;
      const height = illust && illust.height;
      const imageAspectRatio =
        width && height ? width / height : this.state.imageAspectRatio;

      this.setState({
        failureReason: imageUrl ? null : 'illust detail has no usable url',
        imageUrl,
        isLoading: false,
        isFailed: !imageUrl,
        imageAspectRatio,
      });
    } catch (err) {
      if (!this.unmounted && requestId === this.requestId) {
        this.setState({
          failureReason: 'illust detail request failed',
          isLoading: false,
          isFailed: true,
        });
      }
    }
  };

  handleImageError = () => {
    this.setState({
      failureReason: 'image request failed',
      isFailed: true,
      isLoading: false,
    });
  };

  handleImageLoad = (event) => {
    const { imageAspectRatio } = this.state;
    if (imageAspectRatio !== null) {
      return;
    }
    const source = event && event.nativeEvent && event.nativeEvent.source;
    if (source && source.width && source.height) {
      this.setState({ imageAspectRatio: source.width / source.height });
    } else {
      this.setState({ imageAspectRatio: 1 });
    }
  };

  renderContent() {
    const { debugInfo, maxWidth } = this.props;
    const imageId = getImageIdFromProps(this.props);
    const {
      failureReason,
      imageUrl,
      isFailed,
      isLoading,
      imageAspectRatio,
    } = this.state;

    if (isLoading) {
      return (
        <Text
          accessibilityLabel={`novel-inline-image-${imageId}`}
          style={styles.fallback}
        >
          Loading image...
        </Text>
      );
    }

    if (!imageUrl || isFailed) {
      const diagnosticSuffix =
        failureReason === 'no embedded image metadata' &&
        debugInfo &&
        debugInfo.summary
          ? `; ${debugInfo.summary}`
          : '';
      return (
        <Text
          accessibilityLabel={`novel-inline-image-${imageId}`}
          style={styles.fallback}
        >
          {`Image unavailable${
            failureReason ? ` (${failureReason}${diagnosticSuffix})` : ''
          }`}
        </Text>
      );
    }

    const imageWidth = maxWidth || globalStyleVariables.WINDOW_WIDTH - 20;
    const imageStyle =
      imageAspectRatio !== null
        ? { width: imageWidth, aspectRatio: imageAspectRatio }
        : { width: imageWidth, height: imageWidth };

    return (
      <PXImage
        accessibilityLabel={`novel-inline-image-${imageId}`}
        uri={imageUrl}
        resizeMode="contain"
        onError={this.handleImageError}
        onLoad={this.handleImageLoad}
        style={[styles.image, imageStyle]}
      />
    );
  }

  render() {
    return this.renderContent();
  }
}

export default NovelInlineImage;
