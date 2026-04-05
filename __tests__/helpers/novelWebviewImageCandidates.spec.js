const {
  extractUploadedImageCandidatesFromHtml,
} = require('../../src/common/helpers/novelWebviewImageCandidates');

describe('extractUploadedImageCandidatesFromHtml', () => {
  it('extracts an uploaded image url from raw html near the uploaded image id', () => {
    const text = 'before[uploadedimage:24115550]after';
    const rawHtml = `
      <html>
        <body>
          <script>
            window.__SOME_STATE__ = {
              imageId: "24115550",
              originalUrl: "https://i.pximg.net/novel-cover-original/img/2026/04/05/00/00/00/24115550_p0.jpg",
              width: 1200,
              height: 800
            };
          </script>
        </body>
      </html>
    `;

    expect(extractUploadedImageCandidatesFromHtml(rawHtml, text)).toEqual({
      24115550: {
        height: 800,
        originalUrl:
          'https://i.pximg.net/novel-cover-original/img/2026/04/05/00/00/00/24115550_p0.jpg',
        width: 1200,
      },
    });
  });

  it('returns an empty object when no uploaded image ids exist in the text', () => {
    expect(
      extractUploadedImageCandidatesFromHtml(
        '<html><body>plain</body></html>',
        'plain text only',
      ),
    ).toEqual({});
  });
});
