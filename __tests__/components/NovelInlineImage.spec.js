import React from 'react';
import renderer, { act } from 'react-test-renderer';

const illustDetail = jest.fn();

jest.mock('../../src/common/helpers/apiClient', () => ({
  __esModule: true,
  default: {
    illustDetail: (...args) => illustDetail(...args),
  },
}));

jest.mock('../../src/components/PXImage', () => {
  const React = require('react');
  const { Image } = require('react-native');

  return function MockPXImage(props) {
    return React.createElement(Image, {
      ...props,
      testID: props.testID || `px-image-${props.uri}`,
    });
  };
});

const NovelInlineImage = require('../../src/components/NovelInlineImage').default;

const flushPromises = () => Promise.resolve();

const findHostNodeByAccessibilityLabel = (root, accessibilityLabel, type) =>
  root.find(
    (node) =>
      node.type === type &&
      node.props.accessibilityLabel === accessibilityLabel,
  );

const createDeferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe('NovelInlineImage', () => {
  beforeEach(() => {
    illustDetail.mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('shows loading while the image request is in flight', async () => {
    const deferred = createDeferred();
    illustDetail.mockReturnValueOnce(deferred.promise);

    const tree = renderer.create(<NovelInlineImage illustId="24095674" />);

    expect(tree.toJSON().type).toBe('Text');
    expect(JSON.stringify(tree.toJSON())).toContain('Loading image...');
    expect(
      findHostNodeByAccessibilityLabel(
        tree.root,
        'novel-inline-image-24095674',
        'Text',
      ).props.children,
    ).toBe('Loading image...');
  });

  it('falls back when the image request resolves without a URL', async () => {
    illustDetail.mockResolvedValueOnce({ illust: {} });

    let tree;
    await act(async () => {
      tree = renderer.create(<NovelInlineImage illustId="24095674" />);
      await flushPromises();
    });

    expect(tree.toJSON().type).toBe('Text');
    expect(JSON.stringify(tree.toJSON())).toContain('Image unavailable');
    expect(
      findHostNodeByAccessibilityLabel(
        tree.root,
        'novel-inline-image-24095674',
        'Text',
      ).props.children,
    ).toBe('Image unavailable (illust detail has no usable url)');
  });

  it('falls back when the image request rejects', async () => {
    illustDetail.mockRejectedValueOnce(new Error('request failed'));

    let tree;
    await act(async () => {
      tree = renderer.create(<NovelInlineImage illustId="24095674" />);
      await flushPromises();
    });

    expect(tree.toJSON().type).toBe('Text');
    expect(JSON.stringify(tree.toJSON())).toContain('Image unavailable');
    expect(
      findHostNodeByAccessibilityLabel(
        tree.root,
        'novel-inline-image-24095674',
        'Text',
      ).props.children,
    ).toBe('Image unavailable (illust detail request failed)');
  });

  it('forwards stable props to PXImage and falls back if the rendered image reports an error', async () => {
    illustDetail.mockResolvedValueOnce({
      illust: {
        width: 120,
        height: 60,
        image_urls: { large: 'https://example.com/image.jpg' },
      },
    });

    let tree;
    await act(async () => {
      tree = renderer.create(<NovelInlineImage illustId="24095674" />);
      await flushPromises();
    });

    const imageNode = findHostNodeByAccessibilityLabel(
      tree.root,
      'novel-inline-image-24095674',
      'Image',
    );

    expect(imageNode.props.uri).toBe('https://example.com/image.jpg');
    expect(imageNode.props.resizeMode).toBe('contain');
    expect(imageNode.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: '#f2f2f2' }),
        expect.objectContaining({ aspectRatio: 2 }),
      ]),
    );

    await act(async () => {
      imageNode.props.onError();
    });

    expect(tree.toJSON().type).toBe('Text');
    expect(JSON.stringify(tree.toJSON())).toContain('Image unavailable');
    expect(
      findHostNodeByAccessibilityLabel(
        tree.root,
        'novel-inline-image-24095674',
        'Text',
      ).props.children,
    ).toBe('Image unavailable (image request failed)');
  });

  it('renders loaded images without a block wrapper and preserves the accessibility label', async () => {
    illustDetail.mockResolvedValueOnce({
      illust: {
        width: 100,
        height: 100,
        image_urls: { large: 'https://example.com/image.jpg' },
      },
    });

    let tree;
    await act(async () => {
      tree = renderer.create(<NovelInlineImage illustId="24095674" />);
      await flushPromises();
    });

    expect(tree.toJSON().type).toBe('Image');
    const imageNode = findHostNodeByAccessibilityLabel(
      tree.root,
      'novel-inline-image-24095674',
      'Image',
    );

    expect(imageNode.props.uri).toBe('https://example.com/image.jpg');
  });

  it('renders uploaded novel images from embedded image metadata without calling illustDetail', async () => {
    let tree;

    await act(async () => {
      tree = renderer.create(
        <NovelInlineImage
          imageId="24115550"
          imageKind="uploadedimage"
          embeddedImages={{
            24115550: {
              width: 400,
              height: 200,
              urls: { original: 'https://example.com/uploaded-original.jpg' },
            },
          }}
        />,
      );
      await flushPromises();
    });

    const imageNode = findHostNodeByAccessibilityLabel(
      tree.root,
      'novel-inline-image-24115550',
      'Image',
    );

    expect(imageNode.props.uri).toBe(
      'https://example.com/uploaded-original.jpg',
    );
    expect(illustDetail).not.toHaveBeenCalled();
  });

  it('renders uploaded novel images when Pixiv only provides sized textEmbeddedImages urls', async () => {
    let tree;

    await act(async () => {
      tree = renderer.create(
        <NovelInlineImage
          imageId="24115550"
          imageKind="uploadedimage"
          embeddedImages={{
            24115550: {
              width: 600,
              height: 400,
              urls: {
                '1200x1200': 'https://example.com/uploaded-1200.jpg',
                '480mw': 'https://example.com/uploaded-480.jpg',
              },
            },
          }}
        />,
      );
      await flushPromises();
    });

    const imageNode = findHostNodeByAccessibilityLabel(
      tree.root,
      'novel-inline-image-24115550',
      'Image',
    );

    expect(imageNode.props.uri).toBe('https://example.com/uploaded-1200.jpg');
    expect(illustDetail).not.toHaveBeenCalled();
  });

  it('renders uploaded novel images when metadata is only discoverable by matching embedded image values', async () => {
    let tree;

    await act(async () => {
      tree = renderer.create(
        <NovelInlineImage
          imageId="24115550"
          imageKind="uploadedimage"
          embeddedImages={{
            preview: {
              id: '24115550',
              width: 400,
              height: 200,
              urls: { original: 'https://example.com/uploaded-by-value.jpg' },
            },
          }}
        />,
      );
      await flushPromises();
    });

    const imageNode = findHostNodeByAccessibilityLabel(
      tree.root,
      'novel-inline-image-24115550',
      'Image',
    );

    expect(imageNode.props.uri).toBe(
      'https://example.com/uploaded-by-value.jpg',
    );
    expect(illustDetail).not.toHaveBeenCalled();
  });

  it('renders uploaded novel images when embedded metadata uses illustId instead of id', async () => {
    let tree;

    await act(async () => {
      tree = renderer.create(
        <NovelInlineImage
          imageId="24115550"
          imageKind="uploadedimage"
          embeddedImages={{
            preview: {
              illustId: '24115550',
              width: 400,
              height: 200,
              urls: { original: 'https://example.com/uploaded-by-illust-id.jpg' },
            },
          }}
        />,
      );
      await flushPromises();
    });

    const imageNode = findHostNodeByAccessibilityLabel(
      tree.root,
      'novel-inline-image-24115550',
      'Image',
    );

    expect(imageNode.props.uri).toBe(
      'https://example.com/uploaded-by-illust-id.jpg',
    );
    expect(illustDetail).not.toHaveBeenCalled();
  });

  it('renders uploaded novel images when glossary-style metadata uses imageId and coverUrl', async () => {
    let tree;

    await act(async () => {
      tree = renderer.create(
        <NovelInlineImage
          imageId="24115550"
          imageKind="uploadedimage"
          embeddedImages={{
            glossaryEntry: {
              imageId: '24115550',
              width: 400,
              height: 200,
              coverUrl: 'https://example.com/uploaded-by-glossary-cover-url.jpg',
            },
          }}
        />,
      );
      await flushPromises();
    });

    const imageNode = findHostNodeByAccessibilityLabel(
      tree.root,
      'novel-inline-image-24115550',
      'Image',
    );

    expect(imageNode.props.uri).toBe(
      'https://example.com/uploaded-by-glossary-cover-url.jpg',
    );
    expect(illustDetail).not.toHaveBeenCalled();
  });

  it('shows when uploadedimage metadata is completely missing', async () => {
    let tree;

    await act(async () => {
      tree = renderer.create(
        <NovelInlineImage
          imageId="24115550"
          imageKind="uploadedimage"
          embeddedImages={{}}
        />,
      );
      await flushPromises();
    });

    expect(
      findHostNodeByAccessibilityLabel(
        tree.root,
        'novel-inline-image-24115550',
        'Text',
      ).props.children,
    ).toBe('Image unavailable (no embedded image metadata)');
  });

  it('uses the requested pixivimage page when resolving multi-page illustrations', async () => {
    illustDetail.mockResolvedValueOnce({
      illust: {
        meta_pages: [
          { image_urls: { original: 'https://example.com/page-1.jpg' } },
          { image_urls: { original: 'https://example.com/page-2.jpg' } },
        ],
      },
    });

    let tree;
    await act(async () => {
      tree = renderer.create(
        <NovelInlineImage
          imageId="24095674"
          imageKind="pixivimage"
          pageNumber={2}
        />,
      );
      await flushPromises();
    });

    const imageNode = findHostNodeByAccessibilityLabel(
      tree.root,
      'novel-inline-image-24095674',
      'Image',
    );

    expect(imageNode.props.uri).toBe('https://example.com/page-2.jpg');
  });

  it('ignores stale responses after the illust id changes', async () => {
    const first = createDeferred();
    const second = createDeferred();
    illustDetail
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);

    const tree = renderer.create(<NovelInlineImage illustId="24095674" />);

    await act(async () => {
      tree.update(<NovelInlineImage illustId="24095675" />);
      second.resolve({
        illust: {
          width: 100,
          height: 100,
          image_urls: { large: 'https://example.com/second.jpg' },
        },
      });
      await second.promise;
      await flushPromises();
    });

    await act(async () => {
      first.resolve({
        illust: {
          width: 100,
          height: 100,
          image_urls: { large: 'https://example.com/first.jpg' },
        },
      });
      await first.promise;
      await flushPromises();
    });

    expect(JSON.stringify(tree.toJSON())).toContain('px-image-https://example.com/second.jpg');
    expect(JSON.stringify(tree.toJSON())).not.toContain('px-image-https://example.com/first.jpg');
  });

  it('ignores in-flight responses after unmount', async () => {
    const deferred = createDeferred();
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    illustDetail.mockReturnValueOnce(deferred.promise);

    const tree = renderer.create(<NovelInlineImage illustId="24095674" />);

    tree.unmount();

    await act(async () => {
      deferred.resolve({
        illust: {
          width: 100,
          height: 100,
          image_urls: { large: 'https://example.com/unmounted.jpg' },
        },
      });
      await deferred.promise;
    });

    expect(consoleError).not.toHaveBeenCalled();
  });

  it('shows when a resolved uploaded image url still fails to load', async () => {
    let tree;
    await act(async () => {
      tree = renderer.create(
        <NovelInlineImage
          imageId="24115550"
          imageKind="uploadedimage"
          embeddedImages={{
            24115550: {
              width: 400,
              height: 200,
              urls: { original: 'https://example.com/uploaded-original.jpg' },
            },
          }}
        />,
      );
      await flushPromises();
    });

    const imageNode = findHostNodeByAccessibilityLabel(
      tree.root,
      'novel-inline-image-24115550',
      'Image',
    );

    await act(async () => {
      imageNode.props.onError();
    });

    expect(
      findHostNodeByAccessibilityLabel(
        tree.root,
        'novel-inline-image-24115550',
        'Text',
      ).props.children,
    ).toBe('Image unavailable (image request failed)');
  });
});
