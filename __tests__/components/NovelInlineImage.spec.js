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
    ).toBe('Image unavailable');
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
    ).toBe('Image unavailable');
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
    ).toBe('Image unavailable');
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
});
