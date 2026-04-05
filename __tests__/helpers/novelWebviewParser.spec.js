const extractNovelWebviewData = require('../../src/common/helpers/novelWebviewParser').default;

describe('extractNovelWebviewData', () => {
  it('extracts the requested novel entry from meta-preload-data content', () => {
    const html = `
      <html>
        <head>
          <meta
            name="preload-data"
            id="meta-preload-data"
            content='{"novel":{"123":{"id":"123","text":"before[uploadedimage:24115550]after","textEmbeddedImages":{"24115550":{"urls":{"1200x1200":"https://i.pximg.net/novel-upload-1200.jpg"}}}}}}'
          />
        </head>
      </html>
    `;

    expect(extractNovelWebviewData(html, '123')).toEqual({
      id: '123',
      text: 'before[uploadedimage:24115550]after',
      textEmbeddedImages: {
        24115550: {
          urls: {
            '1200x1200': 'https://i.pximg.net/novel-upload-1200.jpg',
          },
        },
      },
    });
  });

  it('extracts the requested novel entry from __NEXT_DATA__ server state', () => {
    const serverState = JSON.stringify({
      novel: {
        123: {
          id: '123',
          text: 'before[uploadedimage:24115550]after',
          textEmbeddedImages: {
            24115550: {
              urls: {
                original: 'https://i.pximg.net/novel-upload-original.jpg',
              },
            },
          },
        },
      },
    });
    const html = `
      <html>
        <body>
          <script id="__NEXT_DATA__" type="application/json">
            ${JSON.stringify({
              props: {
                pageProps: {
                  serverSerializedPreloadedState: serverState,
                },
              },
            })}
          </script>
        </body>
      </html>
    `;

    expect(extractNovelWebviewData(html, '123')).toEqual({
      id: '123',
      text: 'before[uploadedimage:24115550]after',
      textEmbeddedImages: {
        24115550: {
          urls: {
            original: 'https://i.pximg.net/novel-upload-original.jpg',
          },
        },
      },
    });
  });

  it('falls back to the legacy novel object extraction', () => {
    const html = `
      <script>
        window.__STATE__ = {
          novel: {"id":"123","text":"plain text"},
          misc: {}
        };
      </script>
    `;

    expect(extractNovelWebviewData(html, '123')).toEqual({
      id: '123',
      text: 'plain text',
    });
  });

  it('prefers the legacy novel candidate with embedded images over thinner matches', () => {
    const html = `
      <script>
        window.__STATE__ = {
          novel: {"id":"123","text":"before[uploadedimage:24115550]after","caption":"preview"},
          other: {},
          novel: {"id":"123","text":"before[uploadedimage:24115550]after","textEmbeddedImages":{"24115550":{"urls":{"original":"https://i.pximg.net/novel-upload-original.jpg"}}}},
          isOwnWork: false
        };
      </script>
    `;

    expect(extractNovelWebviewData(html, '123')).toEqual({
      id: '123',
      text: 'before[uploadedimage:24115550]after',
      textEmbeddedImages: {
        24115550: {
          urls: {
            original: 'https://i.pximg.net/novel-upload-original.jpg',
          },
        },
      },
    });
  });
});
