const getCollectionLength = (value) => {
  if (!value) {
    return 0;
  }
  if (Array.isArray(value)) {
    return value.length;
  }
  if (typeof value === 'object') {
    return Object.keys(value).length;
  }
  return 0;
};

const scoreCandidate = (candidate) => {
  if (!candidate || typeof candidate !== 'object') {
    return -1;
  }
  const text = candidate.text || candidate.content || '';
  const embeddedImages =
    candidate.textEmbeddedImages || candidate.embeddedImages;
  return [
    text ? 100 : 0,
    /\[uploadedimage:/i.test(text) ? 60 : 0,
    getCollectionLength(embeddedImages)
      ? 40 + getCollectionLength(embeddedImages)
      : 0,
    getCollectionLength(candidate.illusts),
    getCollectionLength(candidate.glossaryItems),
    Object.keys(candidate).length,
  ].reduce((total, value) => total + value, 0);
};

const getBestObjectValueCandidate = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return Object.values(value).reduce((bestCandidate, candidate) => {
    if (!candidate || typeof candidate !== 'object') {
      return bestCandidate;
    }
    if (!bestCandidate) {
      return candidate;
    }
    return scoreCandidate(candidate) > scoreCandidate(bestCandidate)
      ? candidate
      : bestCandidate;
  }, null);
};

const extractNovelAjaxData = (response, novelId = null) => {
  if (!response || response.error || !response.body) {
    return null;
  }

  const { body } = response;
  const normalizedNovelId = novelId != null ? String(novelId) : null;
  const byIdInBody =
    normalizedNovelId &&
    body &&
    typeof body === 'object' &&
    body[normalizedNovelId] &&
    typeof body[normalizedNovelId] === 'object'
      ? body[normalizedNovelId]
      : null;
  const bodyNovel = body && typeof body === 'object' ? body.novel : null;
  const byIdInNovel =
    normalizedNovelId &&
    bodyNovel &&
    typeof bodyNovel === 'object' &&
    bodyNovel[normalizedNovelId] &&
    typeof bodyNovel[normalizedNovelId] === 'object'
      ? bodyNovel[normalizedNovelId]
      : null;
  const bodyData = body && typeof body === 'object' ? body.data : null;
  const bodyPayload = body && typeof body === 'object' ? body.payload : null;

  const candidates = [
    body,
    byIdInBody,
    bodyNovel,
    byIdInNovel,
    bodyData,
    bodyPayload,
    getBestObjectValueCandidate(body),
    getBestObjectValueCandidate(bodyNovel),
    getBestObjectValueCandidate(bodyData),
    getBestObjectValueCandidate(bodyPayload),
  ].filter(Boolean);

  if (!candidates.length) {
    return null;
  }

  return candidates.reduce((bestCandidate, candidate) => {
    if (!bestCandidate) {
      return candidate;
    }
    return scoreCandidate(candidate) > scoreCandidate(bestCandidate)
      ? candidate
      : bestCandidate;
  }, null);
};

export default extractNovelAjaxData;
