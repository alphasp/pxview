import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Linking } from 'react-native';

const illustDetail = jest.fn();

jest.mock('../../src/common/helpers/apiClient', () => ({
  __esModule: true,
  default: {
    illustDetail: (...args) => illustDetail(...args),
  },
}));

jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  default: {},
}));
jest.mock('react-native-tab-view', () => {
  const React = require('react');
  const MockTabView = ({ navigationState, renderScene }) =>
    renderScene({
      route: navigationState.routes[navigationState.index],
    });

  return {
    __esModule: true,
    TabView: MockTabView,
    TabBar: () => null,
    ScrollPager: MockTabView,
  };
});
jest.mock('react-native-tab-view-viewpager-adapter', () => 'ViewPagerAdapter');
jest.mock('../../src/components/PXTabView', () => {
  const MockPXTabView = (props) => {
    const { navigationState, renderScene } = props;
    return renderScene({
      route: navigationState.routes[navigationState.index],
    });
  };

  return MockPXTabView;
});
jest.mock('../../src/components/PXImage', () => {
  const React = require('react');
  const { Image } = require('react-native');

  return function MockPXImage(props) {
    return React.createElement(Image, props);
  };
});
const {
  default: NovelViewer,
  chunkHtmlPreservingTags,
} = require('../../src/components/NovelViewer');

const flushPromises = () => Promise.resolve();

const flattenStyle = (style) => (Array.isArray(style) ? style : [style]).filter(Boolean);

const hasStyleEntry = (style, expectedStyle) =>
  flattenStyle(style).some((entry) =>
    Object.entries(expectedStyle).every(([key, value]) => entry[key] === value),
  );

const findTextNode = (root, text) =>
  root.find((node) => node.type === 'Text' && node.props.children === text);

const findPressTarget = (node) => {
  let current = node;
  while (current) {
    if (typeof current.props.onPress === 'function') {
      return current;
    }
    current = current.parent;
  }

  return null;
};

const findNodeWithTextProps = (node, expectedStyle) => {
  let current = node;
  while (current) {
    if (
      current.props.selectable === true &&
      hasStyleEntry(current.props.style, expectedStyle)
    ) {
      return current;
    }
    current = current.parent;
  }

  return null;
};

const findAncestor = (node, predicate) => {
  let current = node;
  while (current) {
    if (predicate(current)) {
      return current;
    }
    current = current.parent;
  }

  return null;
};

const findHostNodeByAccessibilityLabel = (root, accessibilityLabel, type) =>
  root.find(
    (node) =>
      node.type === type &&
      node.props.accessibilityLabel === accessibilityLabel,
  );

const subtreeContainsText = (node, text) => {
  if (!node) {
    return false;
  }

  if (node.props && node.props.children === text) {
    return true;
  }

  return React.Children.toArray(node.props && node.props.children).some(
    (child) => {
      if (child === text) {
        return true;
      }

      if (!React.isValidElement(child)) {
        return false;
      }

      return subtreeContainsText(child, text);
    },
  );
};

const hasTextWithViewDescendant = (node) => {
  if (!node || !node.children) {
    return false;
  }

  if (
    node.type === 'Text' &&
    node.children.some(
      (child) =>
        child &&
        typeof child === 'object' &&
        (child.type === 'View' || hasTextWithViewDescendant(child)),
    )
  ) {
    return true;
  }

  return node.children.some(
    (child) =>
      child && typeof child === 'object' && hasTextWithViewDescendant(child),
  );
};

describe('NovelViewer inline images', () => {
  beforeEach(() => {
    illustDetail.mockReset();
    illustDetail.mockResolvedValue({ illust: {} });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the real inline image component for px-image nodes in the page flow', async () => {
    illustDetail.mockResolvedValueOnce({
      illust: {
        width: 120,
        height: 60,
        image_urls: { large: 'https://example.com/inline.jpg' },
      },
    });

    let instance;
    await act(async () => {
      instance = renderer.create(
        <NovelViewer
          novelId={1}
          items={["before<px-image data-illust-id='24095674'></px-image>after"]}
          index={0}
          fontSize={16}
          lineHeight={1.6}
          onIndexChange={() => {}}
          onPressPageLink={() => {}}
          openModal={() => {}}
        />,
      );
      await flushPromises();
    });

    const inlineImage = findHostNodeByAccessibilityLabel(
      instance.root,
      'novel-inline-image-24095674',
      'Image',
    );

    expect(inlineImage.props.uri).toBe('https://example.com/inline.jpg');
    expect(inlineImage.props.resizeMode).toBe('contain');
  });

  it('keeps px-image tags intact when chunking long HTML pages', async () => {
    const prefix = 'a'.repeat(2998);
    const page = `${prefix}<px-image data-illust-id='24095674'></px-image>tail`;
    let instance;

    await act(async () => {
      instance = renderer.create(
        <NovelViewer
          novelId={1}
          items={[page]}
          index={0}
          fontSize={16}
          lineHeight={1.6}
          onIndexChange={() => {}}
          onPressPageLink={() => {}}
          openModal={() => {}}
        />,
      );
      await flushPromises();
    });

    expect(JSON.stringify(instance.toJSON())).toContain('novel-inline-image-24095674');
  });

  it('keeps px-image regions intact across chunk boundaries', () => {
    const prefix = 'a'.repeat(2950);
    const imageText = `${prefix}<px-image data-illust-id='24095674'></px-image>tail`;
    const chunks = chunkHtmlPreservingTags(imageText);

    expect(
      chunks.some(
        (chunk) =>
          chunk.includes("<px-image data-illust-id='24095674'>") &&
          chunk.includes('</px-image>'),
      ),
    ).toBe(true);
  });

  it('keeps protected-region chunks within the htmlview safety bound', () => {
    const chapterText = `<chapter>${'b'.repeat(4000)}</chapter>`;
    const chunks = chunkHtmlPreservingTags(chapterText);

    expect(chunks.every((chunk) => chunk.length <= 3000)).toBe(true);
    expect(
      chunks.every(
        (chunk) => chunk.includes('<chapter>') && chunk.includes('</chapter>'),
      ),
    ).toBe(true);
  });

  it('keeps chapter regions intact across chunk boundaries', () => {
    const prefix = 'a'.repeat(2950);
    const chapterText = `${prefix}<chapter>Chapter heading ${'b'.repeat(
      80,
    )}</chapter>`;
    const chunks = chunkHtmlPreservingTags(chapterText);

    expect(chunks.some((chunk) => chunk.includes('<chapter>') && chunk.includes('</chapter>'))).toBe(
      true,
    );
  });

  it('keeps jump regions intact across chunk boundaries', () => {
    const prefix = 'a'.repeat(2950);
    const jumpText = `${prefix}<jump page='2'>Jump label ${'c'.repeat(
      80,
    )}</jump>`;
    const chunks = chunkHtmlPreservingTags(jumpText);

    expect(chunks.some((chunk) => chunk.includes('<jump page=')
      && chunk.includes('</jump>'))).toBe(true);
  });

  it('keeps anchor-wrapped px-image regions intact across chunk boundaries', () => {
    const prefix = 'a'.repeat(2950);
    const anchorText = `${prefix}<a href='https://example.com'>before<px-image data-illust-id='24095674'></px-image>after</a>`;
    const chunks = chunkHtmlPreservingTags(anchorText);

    expect(chunks.every((chunk) => chunk.length <= 3000)).toBe(true);
    expect(
      chunks.some(
        (chunk) =>
          chunk.includes("<a href='https://example.com'>") &&
          chunk.includes("<px-image data-illust-id='24095674'>") &&
          chunk.includes('</px-image>') &&
          chunk.includes('</a>'),
      ),
    ).toBe(true);
  });

  it('keeps long anchor regions within the htmlview safety bound', () => {
    const anchorText = `<a href='https://example.com'>${'b'.repeat(
      4000,
    )}<px-image data-illust-id='24095674'></px-image>end</a>`;
    const chunks = chunkHtmlPreservingTags(anchorText);

    expect(chunks.every((chunk) => chunk.length <= 3000)).toBe(true);
    expect(
      chunks.every(
        (chunk) =>
          chunk.includes("<a href='https://example.com'>") &&
          chunk.includes('</a>'),
      ),
    ).toBe(true);
  });

  it('does not nest inline image views inside chapter text nodes', async () => {
    let instance;

    await act(async () => {
      instance = renderer.create(
        <NovelViewer
          novelId={1}
          items={[
            "<chapter>before<px-image data-illust-id='24095674'></px-image>after</chapter>",
          ]}
          index={0}
          fontSize={16}
          lineHeight={1.6}
          onIndexChange={() => {}}
          onPressPageLink={() => {}}
          openModal={() => {}}
        />,
      );
      await flushPromises();
    });

    const tree = instance.toJSON();

    expect(JSON.stringify(tree)).toContain('novel-inline-image-24095674');
    expect(hasTextWithViewDescendant(tree)).toBe(false);
  });

  it('does not nest inline image views inside anchor text containers', async () => {
    let instance;

    await act(async () => {
      instance = renderer.create(
        <NovelViewer
          novelId={1}
          items={[
            "<a href='https://example.com'>before<px-image data-illust-id='24095674'></px-image>after</a>",
          ]}
          index={0}
          fontSize={16}
          lineHeight={1.6}
          onIndexChange={() => {}}
          onPressPageLink={() => {}}
          openModal={() => {}}
        />,
      );
      await flushPromises();
    });

    const tree = instance.toJSON();

    expect(JSON.stringify(tree)).toContain('novel-inline-image-24095674');
    expect(hasTextWithViewDescendant(tree)).toBe(false);
  });

  it('renders inline image fallbacks from the real inline image component when loading fails', async () => {
    illustDetail.mockResolvedValueOnce({ illust: {} });

    let instance;
    await act(async () => {
      instance = renderer.create(
        <NovelViewer
          novelId={1}
          items={["before<px-image data-illust-id='24095674'></px-image>after"]}
          index={0}
          fontSize={16}
          lineHeight={1.6}
          onIndexChange={() => {}}
          onPressPageLink={() => {}}
          openModal={() => {}}
        />,
      );
      await flushPromises();
    });

    const fallback = findHostNodeByAccessibilityLabel(
      instance.root,
      'novel-inline-image-24095674',
      'Text',
    );

    expect(fallback.props.children).toBe(
      'Image unavailable (illust detail has no usable url)',
    );
  });

  it('renders uploaded novel images from embedded image metadata in the page flow', async () => {
    let instance;
    await act(async () => {
      instance = renderer.create(
        <NovelViewer
          novelId={1}
          items={[
            "before<px-image data-illust-id='24115550' data-image-kind='uploadedimage'></px-image>after",
          ]}
          embeddedImages={{
            24115550: {
              width: 400,
              height: 200,
              urls: { original: 'https://example.com/uploaded-inline.jpg' },
            },
          }}
          index={0}
          fontSize={16}
          lineHeight={1.6}
          onIndexChange={() => {}}
          onPressPageLink={() => {}}
          openModal={() => {}}
        />,
      );
      await flushPromises();
    });

    const inlineImage = findHostNodeByAccessibilityLabel(
      instance.root,
      'novel-inline-image-24115550',
      'Image',
    );

    expect(inlineImage.props.uri).toBe('https://example.com/uploaded-inline.jpg');
    expect(illustDetail).not.toHaveBeenCalled();
  });

  it('renders chapter text after the custom chapter renderer rewrite', () => {
    const tree = renderer
      .create(
        <NovelViewer
          novelId={1}
          items={['<chapter>Chapter title</chapter>body']}
          index={0}
          fontSize={16}
          lineHeight={1.6}
          onIndexChange={() => {}}
          onPressPageLink={() => {}}
          openModal={() => {}}
        />,
      )
      .toJSON();

    const json = JSON.stringify(tree);
    expect(json).toContain('Chapter title');
    expect(json).not.toContain('<chapter>');
  });

  it('keeps jump-link behavior after the custom chapter renderer rewrite', () => {
    const onPressPageLink = jest.fn();
    const instance = renderer.create(
      <NovelViewer
        novelId={1}
        items={["<jump page='2'>2ページへ</jump>"]}
        index={0}
        fontSize={16}
        lineHeight={1.6}
        onIndexChange={() => {}}
        onPressPageLink={onPressPageLink}
        openModal={() => {}}
      />,
    );

    const jumpNode = instance.root.find(
      (node) => typeof node.props.onPress === 'function',
    );

    act(() => {
      jumpNode.props.onPress();
    });

    expect(onPressPageLink).toHaveBeenCalledWith('2');
  });

  it('preserves inherited text props for plain anchor text', () => {
    const openURL = jest
      .spyOn(Linking, 'openURL')
      .mockResolvedValue(undefined);
    const instance = renderer.create(
      <NovelViewer
        novelId={1}
        items={["<a href='https://example.com'>Example link</a>"]}
        index={0}
        fontSize={18}
        lineHeight={1.8}
        onIndexChange={() => {}}
        onPressPageLink={() => {}}
        openModal={() => {}}
      />,
    );

    const linkText = findTextNode(instance.root, 'Example link');
    const linkPressTarget = findPressTarget(linkText);
    const linkTextPropsTarget = findNodeWithTextProps(linkText, {
      fontSize: 18,
      lineHeight: 32.4,
    });

    expect(linkPressTarget).not.toBeNull();
    expect(linkTextPropsTarget).not.toBeNull();

    act(() => {
      linkPressTarget.props.onPress();
    });

    expect(openURL).toHaveBeenCalledWith('https://example.com');
  });

  it('preserves inherited text props for plain jump text', () => {
    const onPressPageLink = jest.fn();
    const instance = renderer.create(
      <NovelViewer
        novelId={1}
        items={["<jump page='2'>Next page</jump>"]}
        index={0}
        fontSize={18}
        lineHeight={1.8}
        onIndexChange={() => {}}
        onPressPageLink={onPressPageLink}
        openModal={() => {}}
      />,
    );

    const jumpText = findTextNode(instance.root, 'Next page');
    const jumpPressTarget = findPressTarget(jumpText);
    const jumpTextPropsTarget = findNodeWithTextProps(jumpText, {
      fontSize: 18,
      lineHeight: 32.4,
    });

    expect(jumpPressTarget).not.toBeNull();
    expect(jumpTextPropsTarget).not.toBeNull();

    act(() => {
      jumpPressTarget.props.onPress();
    });

    expect(onPressPageLink).toHaveBeenCalledWith('2');
  });

  it('preserves anchor press behavior for nested markup inside anchor content', () => {
    const openURL = jest
      .spyOn(Linking, 'openURL')
      .mockResolvedValue(undefined);
    const instance = renderer.create(
      <NovelViewer
        novelId={1}
        items={["<a href='https://example.com'><b>Bold link</b></a>"]}
        index={0}
        fontSize={16}
        lineHeight={1.6}
        onIndexChange={() => {}}
        onPressPageLink={() => {}}
        openModal={() => {}}
      />,
    );

    const linkText = findTextNode(instance.root, 'Bold link');
    const linkPressTarget = findPressTarget(linkText);

    expect(linkPressTarget).not.toBeNull();

    act(() => {
      linkPressTarget.props.onPress();
    });

    expect(openURL).toHaveBeenCalledWith('https://example.com');
  });

  it('preserves jump press behavior for nested markup inside jump content', () => {
    const onPressPageLink = jest.fn();
    const instance = renderer.create(
      <NovelViewer
        novelId={1}
        items={["<jump page='2'><b>Next page</b></jump>"]}
        index={0}
        fontSize={16}
        lineHeight={1.6}
        onIndexChange={() => {}}
        onPressPageLink={onPressPageLink}
        openModal={() => {}}
      />,
    );

    const jumpText = findTextNode(instance.root, 'Next page');
    const jumpPressTarget = findPressTarget(jumpText);

    expect(jumpPressTarget).not.toBeNull();

    act(() => {
      jumpPressTarget.props.onPress();
    });

    expect(onPressPageLink).toHaveBeenCalledWith('2');
  });

  it('preserves chapter styling for nested markup inside chapter content', () => {
    const instance = renderer.create(
      <NovelViewer
        novelId={1}
        items={['<chapter><b>Chapter title</b></chapter>']}
        index={0}
        fontSize={16}
        lineHeight={1.6}
        onIndexChange={() => {}}
        onPressPageLink={() => {}}
        openModal={() => {}}
      />,
    );

    const chapterText = findTextNode(instance.root, 'Chapter title');
    const chapterTextPropsTarget = findNodeWithTextProps(chapterText, {
      fontSize: 20,
      fontWeight: 'bold',
    });

    expect(chapterTextPropsTarget).not.toBeNull();
  });

  it('decodes html entities in custom chapter text rendering', () => {
    const instance = renderer.create(
      <NovelViewer
        novelId={1}
        items={['<chapter>Fish &amp; Chips</chapter>']}
        index={0}
        fontSize={16}
        lineHeight={1.6}
        onIndexChange={() => {}}
        onPressPageLink={() => {}}
        openModal={() => {}}
      />,
    );

    expect(findTextNode(instance.root, 'Fish & Chips')).toBeDefined();
  });

  it('decodes html entities in custom jump text rendering', () => {
    const instance = renderer.create(
      <NovelViewer
        novelId={1}
        items={["<jump page='2'>Tom &amp; Jerry</jump>"]}
        index={0}
        fontSize={16}
        lineHeight={1.6}
        onIndexChange={() => {}}
        onPressPageLink={() => {}}
        openModal={() => {}}
      />,
    );

    expect(findTextNode(instance.root, 'Tom & Jerry')).toBeDefined();
  });

  it('decodes html entities in custom anchor text and href rendering', () => {
    const openURL = jest
      .spyOn(Linking, 'openURL')
      .mockResolvedValue(undefined);
    const instance = renderer.create(
      <NovelViewer
        novelId={1}
        items={[
          "<a href='https://example.com?first=1&amp;second=2'>A &amp; B</a>",
        ]}
        index={0}
        fontSize={16}
        lineHeight={1.6}
        onIndexChange={() => {}}
        onPressPageLink={() => {}}
        openModal={() => {}}
      />,
    );

    const linkText = findTextNode(instance.root, 'A & B');
    const linkPressTarget = findPressTarget(linkText);

    expect(linkPressTarget).not.toBeNull();

    act(() => {
      linkPressTarget.props.onPress();
    });

    expect(openURL).toHaveBeenCalledWith(
      'https://example.com?first=1&second=2',
    );
  });

  it('keeps anchor text and inline images in the same text flow container', async () => {
    illustDetail.mockResolvedValueOnce({
      illust: {
        width: 100,
        height: 100,
        image_urls: { large: 'https://example.com/anchor-inline.jpg' },
      },
    });
    const openURL = jest
      .spyOn(Linking, 'openURL')
      .mockResolvedValue(undefined);
    let instance;
    await act(async () => {
      instance = renderer.create(
        <NovelViewer
          novelId={1}
          items={[
            "<a href='https://example.com'>before<px-image data-illust-id='24095674'></px-image>after</a>",
          ]}
          index={0}
          fontSize={16}
          lineHeight={1.6}
          onIndexChange={() => {}}
          onPressPageLink={() => {}}
          openModal={() => {}}
        />,
      );
      await flushPromises();
    });

    const inlineImage = findHostNodeByAccessibilityLabel(
      instance.root,
      'novel-inline-image-24095674',
      'Image',
    );
    const inlineTextContainer = findAncestor(
      inlineImage,
      (node) =>
        node.type === 'Text' &&
        subtreeContainsText(node, 'before') &&
        subtreeContainsText(node, 'after'),
    );

    expect(inlineTextContainer).not.toBeNull();

    act(() => {
      inlineTextContainer.props.onPress();
    });

    expect(openURL).toHaveBeenCalledWith('https://example.com');
  });

  it('preserves anchor presses when the tap starts from the inline image node itself', async () => {
    illustDetail.mockResolvedValueOnce({
      illust: {
        width: 100,
        height: 100,
        image_urls: { large: 'https://example.com/anchor-direct.jpg' },
      },
    });
    const openURL = jest
      .spyOn(Linking, 'openURL')
      .mockResolvedValue(undefined);
    let instance;

    await act(async () => {
      instance = renderer.create(
        <NovelViewer
          novelId={1}
          items={[
            "<a href='https://example.com'><px-image data-illust-id='24095674'></px-image></a>",
          ]}
          index={0}
          fontSize={16}
          lineHeight={1.6}
          onIndexChange={() => {}}
          onPressPageLink={() => {}}
          openModal={() => {}}
        />,
      );
      await flushPromises();
    });

    const inlineImage = findHostNodeByAccessibilityLabel(
      instance.root,
      'novel-inline-image-24095674',
      'Image',
    );
    const linkPressTarget = findPressTarget(inlineImage);

    expect(linkPressTarget).not.toBeNull();

    act(() => {
      linkPressTarget.props.onPress();
    });

    expect(openURL).toHaveBeenCalledWith('https://example.com');
  });

  it('preserves jump presses when the tap starts from the inline image fallback itself', async () => {
    illustDetail.mockResolvedValueOnce({ illust: {} });
    const onPressPageLink = jest.fn();
    let instance;

    await act(async () => {
      instance = renderer.create(
        <NovelViewer
          novelId={1}
          items={[
            "<jump page='2'><px-image data-illust-id='24095674'></px-image></jump>",
          ]}
          index={0}
          fontSize={16}
          lineHeight={1.6}
          onIndexChange={() => {}}
          onPressPageLink={onPressPageLink}
          openModal={() => {}}
        />,
      );
      await flushPromises();
    });

    const fallback = findHostNodeByAccessibilityLabel(
      instance.root,
      'novel-inline-image-24095674',
      'Text',
    );
    const jumpPressTarget = findPressTarget(fallback);

    expect(fallback.props.children).toBe(
      'Image unavailable (illust detail has no usable url)',
    );
    expect(jumpPressTarget).not.toBeNull();

    act(() => {
      jumpPressTarget.props.onPress();
    });

    expect(onPressPageLink).toHaveBeenCalledWith('2');
  });

  it('keeps chapter text and inline images in the same text flow container', async () => {
    let instance;

    await act(async () => {
      instance = renderer.create(
        <NovelViewer
          novelId={1}
          items={[
            "<chapter>before<px-image data-illust-id='24095674'></px-image>after</chapter>",
          ]}
          index={0}
          fontSize={16}
          lineHeight={1.6}
          onIndexChange={() => {}}
          onPressPageLink={() => {}}
          openModal={() => {}}
        />,
      );
      await flushPromises();
    });

    const inlineImage = findHostNodeByAccessibilityLabel(
      instance.root,
      'novel-inline-image-24095674',
      'Text',
    );
    const inlineTextContainer = findAncestor(
      inlineImage,
      (node) =>
        node.type === 'Text' &&
        subtreeContainsText(node, 'before') &&
        subtreeContainsText(node, 'after'),
    );

    expect(inlineTextContainer).not.toBeNull();
  });
});
