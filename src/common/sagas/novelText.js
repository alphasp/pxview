import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchNovelTextSuccess,
  fetchNovelTextFailure,
} from '../actions/novelText';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import extractNovelAjaxData from '../helpers/novelAjaxParser';
import buildNovelWebviewDebugInfo from '../helpers/novelWebviewDebug';
import { extractUploadedImageCandidatesFromHtml } from '../helpers/novelWebviewImageCandidates';
import extractNovelWebviewData from '../helpers/novelWebviewParser';
import { NOVEL_TEXT } from '../constants/actionTypes';

export function* handleFetchNovelText(action) {
  const { novelId } = action.payload;
  try {
    const ajaxUrl = `https://www.pixiv.net/ajax/novel/${novelId}`;
    const ajaxOptions = {
      headers: {
        Accept: 'application/json',
        Referer: `https://www.pixiv.net/novel/show.php?id=${novelId}`,
      },
    };

    try {
      const ajaxResponse = yield apply(pixiv, pixiv.requestUrl, [
        ajaxUrl,
        ajaxOptions,
      ]);
      const response = extractNovelAjaxData(ajaxResponse);

      if (response) {
        const text = response.text || response.content || '';
        const embeddedImages =
          response.textEmbeddedImages ||
          response.embeddedImages ||
          response.illusts ||
          response.glossaryItems ||
          {};
        const debugInfo = {
          source: 'ajax',
          embeddedImageCount: Object.keys(embeddedImages).length,
          parsedKeys: Object.keys(response).sort(),
          summary: `source=ajax embeddedCount=${
            Object.keys(embeddedImages).length
          } parsedKeys=${Object.keys(response)
            .sort()
            .slice(0, 8)
            .join('|')}`,
        };

        yield put(
          fetchNovelTextSuccess(text, novelId, embeddedImages, debugInfo),
        );
        return;
      }
    } catch (ajaxError) {
      // Fall through to the legacy webview endpoint for older or restricted flows.
    }

    const rawResponse = yield apply(pixiv, pixiv.novelWebview, [novelId, true]);
    const response = extractNovelWebviewData(rawResponse, novelId) || {};
    const debugInfo = buildNovelWebviewDebugInfo(rawResponse, response);
    const text = (response && (response.text || response.content)) || '';
    const embeddedImagesFromResponse =
      (response &&
        (response.textEmbeddedImages ||
          response.embeddedImages ||
          response.illusts ||
          response.glossaryItems)) ||
      {};
    const uploadedImageCandidates = extractUploadedImageCandidatesFromHtml(
      rawResponse,
      text,
    );
    const embeddedImages = {
      ...embeddedImagesFromResponse,
      ...uploadedImageCandidates,
    };
    yield put(fetchNovelTextSuccess(text, novelId, embeddedImages, debugInfo));
  } catch (err) {
    yield put(fetchNovelTextFailure(novelId));
    yield put(addError(err));
  }
}

export function* watchFetchNovelText() {
  yield takeEvery(NOVEL_TEXT.REQUEST, handleFetchNovelText);
}
