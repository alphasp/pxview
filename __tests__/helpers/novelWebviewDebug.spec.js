const buildNovelWebviewDebugInfo = require('../../src/common/helpers/novelWebviewDebug').default;

describe('buildNovelWebviewDebugInfo', () => {
  it('summarizes the raw html markers and parsed embedded image count', () => {
    const html = `
      <meta id="meta-preload-data" />
      <script id="__NEXT_DATA__"></script>
      before[uploadedimage:24115550]after
      "textEmbeddedImages"
    `;

    const info = buildNovelWebviewDebugInfo(html, {
      id: '123',
      text: 'before[uploadedimage:24115550]after',
      textEmbeddedImages: {
        24115550: {
          urls: { original: 'https://example.com/uploaded.jpg' },
        },
      },
    });

    expect(info).toEqual({
      hasMetaPreloadData: true,
      hasNextData: true,
      hasUploadedImageLiteral: true,
      hasTextEmbeddedImagesLiteral: true,
      embeddedImageCount: 1,
      legacyCandidateCount: 0,
      legacyEmbeddedCounts: [],
      glossaryCount: 0,
      glossaryIds: [],
      illustCount: 0,
      illustIds: [],
      parsedKeys: ['id', 'text', 'textEmbeddedImages'],
      summary:
        'meta=Y next=Y uploaded=Y textEmbeddedImages=Y embeddedCount=1 legacyCandidates=0 legacyEmbedded=none glossaryCount=0 glossaryIds=none illustCount=0 illustIds=none parsedKeys=id|text|textEmbeddedImages',
    });
  });

  it('includes legacy candidate counts in the summary', () => {
    const html = `
      <script>
        novel: {"id":"123","text":"preview"},
        other: {},
        novel: {"id":"123","text":"before[uploadedimage:24115550]after","textEmbeddedImages":{"24115550":{"urls":{"original":"https://example.com/uploaded.jpg"}}}},
        isOwnWork: false
      </script>
    `;

    const info = buildNovelWebviewDebugInfo(html, {
      id: '123',
      text: 'before[uploadedimage:24115550]after',
    });

    expect(info.legacyCandidateCount).toBe(2);
    expect(info.legacyEmbeddedCounts).toEqual([0, 1]);
    expect(info.summary).toContain('legacyCandidates=2');
    expect(info.summary).toContain('legacyEmbedded=0|1');
  });
});
