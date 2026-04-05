const extractNovelAjaxData = require('../../src/common/helpers/novelAjaxParser')
  .default;

describe('extractNovelAjaxData', () => {
  it('extracts content and embedded images from ajax novel response body', () => {
    expect(
      extractNovelAjaxData({
        error: false,
        body: {
          id: '123',
          content: 'before[uploadedimage:24115550]after',
          textEmbeddedImages: {
            24115550: {
              urls: {
                original: 'https://i.pximg.net/novel-upload-original.jpg',
              },
            },
          },
        },
      }),
    ).toEqual({
      id: '123',
      content: 'before[uploadedimage:24115550]after',
      textEmbeddedImages: {
        24115550: {
          urls: {
            original: 'https://i.pximg.net/novel-upload-original.jpg',
          },
        },
      },
    });
  });

  it('returns null when ajax response does not contain a usable body', () => {
    expect(extractNovelAjaxData({ error: true, body: null })).toBe(null);
    expect(extractNovelAjaxData(null)).toBe(null);
  });
});
