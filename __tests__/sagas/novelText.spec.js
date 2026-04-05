import { apply, put } from 'redux-saga/effects';
import {
  fetchNovelTextSuccess,
  fetchNovelTextFailure,
} from '../../src/common/actions/novelText';
import { addError } from '../../src/common/actions/error';
import pixiv from '../../src/common/helpers/apiClient';
import { handleFetchNovelText } from '../../src/common/sagas/novelText';

describe('handleFetchNovelText', () => {
  const novelId = '123';
  const action = {
    payload: {
      novelId,
    },
  };

  test('prefers ajax novel data when it includes uploaded image metadata', () => {
    const generator = handleFetchNovelText(action);
    const ajaxUrl = `https://www.pixiv.net/ajax/novel/${novelId}`;
    const ajaxOptions = {
      headers: {
        Accept: 'application/json',
        Referer: `https://www.pixiv.net/novel/show.php?id=${novelId}`,
      },
    };
    const ajaxResponse = {
      error: false,
      body: {
        id: novelId,
        content: 'before[uploadedimage:24115550]after',
        textEmbeddedImages: {
          24115550: {
            urls: {
              original: 'https://i.pximg.net/novel-upload-original.jpg',
            },
          },
        },
      },
    };

    expect(generator.next().value).toEqual(
      apply(pixiv, pixiv.requestUrl, [ajaxUrl, ajaxOptions]),
    );
    expect(generator.next(ajaxResponse).value).toEqual(
      put({
        type: 'PIXIV/NOVEL_TEXT_SUCCESS',
        payload: expect.objectContaining({
          novelId,
          text: 'before[uploadedimage:24115550]after',
          embeddedImages: {
            24115550: {
              urls: {
                original: 'https://i.pximg.net/novel-upload-original.jpg',
              },
            },
          },
          debugInfo: {
            embeddedImageCount: 1,
            parsedKeys: ['content', 'id', 'textEmbeddedImages'],
            source: 'ajax',
            summary:
              'source=ajax embeddedCount=1 parsedKeys=content|id|textEmbeddedImages',
          },
          timestamp: expect.any(Number),
        }),
      }),
    );
    expect(generator.next().done).toBe(true);
  });

  test('falls back to webview data when ajax request fails', () => {
    const generator = handleFetchNovelText(action);
    const ajaxUrl = `https://www.pixiv.net/ajax/novel/${novelId}`;
    const ajaxOptions = {
      headers: {
        Accept: 'application/json',
        Referer: `https://www.pixiv.net/novel/show.php?id=${novelId}`,
      },
    };
    const webviewRawResponse = `
      <script>
        novel: {"id":"123","text":"plain text"}
      </script>
    `;

    expect(generator.next().value).toEqual(
      apply(pixiv, pixiv.requestUrl, [ajaxUrl, ajaxOptions]),
    );
    expect(generator.throw(new Error('ajax failed')).value).toEqual(
      apply(pixiv, pixiv.novelWebview, [novelId, true]),
    );
    expect(generator.next(webviewRawResponse).value).toEqual(
      put(fetchNovelTextSuccess('plain text', novelId, {}, expect.any(Object))),
    );
  });

  test('dispatches failure when both ajax and webview requests fail', () => {
    const generator = handleFetchNovelText(action);
    const ajaxUrl = `https://www.pixiv.net/ajax/novel/${novelId}`;
    const ajaxOptions = {
      headers: {
        Accept: 'application/json',
        Referer: `https://www.pixiv.net/novel/show.php?id=${novelId}`,
      },
    };
    const error = new Error('boom');

    expect(generator.next().value).toEqual(
      apply(pixiv, pixiv.requestUrl, [ajaxUrl, ajaxOptions]),
    );
    expect(generator.throw(error).value).toEqual(
      apply(pixiv, pixiv.novelWebview, [novelId, true]),
    );
    expect(generator.throw(error).value).toEqual(put(fetchNovelTextFailure(novelId)));
    expect(generator.next().value).toEqual(put(addError(error)));
    expect(generator.next().done).toBe(true);
  });
});
