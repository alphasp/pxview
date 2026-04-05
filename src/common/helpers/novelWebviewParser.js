import entities from 'entities';

const safeJsonParse = (value) => {
  if (!value || typeof value !== 'string') {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (err) {
    return null;
  }
};

const selectNovelEntry = (novelState, novelId) => {
  if (!novelState) {
    return null;
  }

  if (novelState.text || novelState.content) {
    return novelState;
  }

  const normalizedNovelId = novelId != null ? String(novelId) : null;
  if (normalizedNovelId && novelState[normalizedNovelId]) {
    return novelState[normalizedNovelId];
  }

  if (
    normalizedNovelId &&
    novelState[parseInt(normalizedNovelId, 10)] &&
    !Number.isNaN(parseInt(normalizedNovelId, 10))
  ) {
    return novelState[parseInt(normalizedNovelId, 10)];
  }

  const firstNovelKey = Object.keys(novelState)[0];
  return firstNovelKey ? novelState[firstNovelKey] : null;
};

const extractMetaTagContent = (rawHtml) => {
  const metaTagMatch = rawHtml.match(
    /<meta[^>]*id=(['"])meta-preload-data\1[^>]*>/i,
  );
  if (!metaTagMatch) {
    return null;
  }

  const contentMatch = metaTagMatch[0].match(/content=(['"])([\s\S]*?)\1/i);
  return contentMatch ? entities.decodeHTML(contentMatch[2]) : null;
};

const extractNovelFromMetaPreloadData = (rawHtml, novelId) => {
  const preloadData = safeJsonParse(extractMetaTagContent(rawHtml));
  if (!preloadData) {
    return null;
  }

  return selectNovelEntry(preloadData.novel || preloadData, novelId);
};

const extractNovelFromNextData = (rawHtml, novelId) => {
  const nextDataMatch = rawHtml.match(
    /<script[^>]*id=(['"])__NEXT_DATA__\1[^>]*>([\s\S]*?)<\/script>/i,
  );
  if (!nextDataMatch) {
    return null;
  }

  const nextData = safeJsonParse(entities.decodeHTML(nextDataMatch[2]));
  if (!nextData) {
    return null;
  }

  const serverState =
    nextData.props &&
    nextData.props.pageProps &&
    nextData.props.pageProps.serverSerializedPreloadedState;

  const parsedServerState =
    typeof serverState === 'string' ? safeJsonParse(serverState) : serverState;

  if (!parsedServerState) {
    return null;
  }

  return selectNovelEntry(parsedServerState.novel || parsedServerState, novelId);
};

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

const extractBalancedObject = (value, startIndex) => {
  if (!value || value[startIndex] !== '{') {
    return null;
  }

  let depth = 0;
  let inString = false;
  let isEscaped = false;

  for (let index = startIndex; index < value.length; index += 1) {
    const currentChar = value[index];

    if (inString) {
      if (isEscaped) {
        isEscaped = false;
      } else if (currentChar === '\\') {
        isEscaped = true;
      } else if (currentChar === '"') {
        inString = false;
      }
      continue;
    }

    if (currentChar === '"') {
      inString = true;
      continue;
    }

    if (currentChar === '{') {
      depth += 1;
    } else if (currentChar === '}') {
      depth -= 1;
      if (depth === 0) {
        return value.slice(startIndex, index + 1);
      }
    }
  }

  return null;
};

const scoreLegacyCandidate = (candidate, requestedNovelId) => {
  if (!candidate || typeof candidate !== 'object') {
    return -1;
  }

  const normalizedRequestedId =
    requestedNovelId != null ? String(requestedNovelId) : null;
  const normalizedCandidateId =
    candidate.id != null ? String(candidate.id) : null;
  const embeddedImages =
    candidate.textEmbeddedImages || candidate.embeddedImages || null;
  const embeddedCount = getCollectionLength(embeddedImages);
  const illustCount = getCollectionLength(candidate.illusts);
  const glossaryCount = getCollectionLength(candidate.glossaryItems);
  const text = candidate.text || candidate.content || '';

  return [
    normalizedRequestedId &&
    normalizedCandidateId === normalizedRequestedId
      ? 100
      : 0,
    text ? 25 : 0,
    /\[uploadedimage:/i.test(text) ? 50 : 0,
    embeddedCount ? 80 + embeddedCount : 0,
    illustCount ? 10 + illustCount : 0,
    glossaryCount ? 10 + glossaryCount : 0,
    Object.keys(candidate).length,
  ].reduce((total, value) => total + value, 0);
};

export const extractLegacyNovelCandidates = (rawHtml, novelId) => {
  if (!rawHtml || typeof rawHtml !== 'string') {
    return [];
  }

  const candidates = [];
  const legacyPattern = /novel\s*:\s*{/g;
  let match = legacyPattern.exec(rawHtml);

  while (match) {
    const objectStartIndex = rawHtml.indexOf('{', match.index);
    const objectValue = extractBalancedObject(rawHtml, objectStartIndex);
    const parsedValue = safeJsonParse(objectValue);
    const selectedEntry = selectNovelEntry(parsedValue, novelId);

    if (selectedEntry) {
      candidates.push(selectedEntry);
    }

    legacyPattern.lastIndex =
      objectStartIndex >= 0 ? objectStartIndex + 1 : legacyPattern.lastIndex;
    match = legacyPattern.exec(rawHtml);
  }

  return candidates;
};

const extractNovelFromLegacyState = (rawHtml, novelId) => {
  const legacyCandidates = extractLegacyNovelCandidates(rawHtml, novelId);
  if (!legacyCandidates.length) {
    return null;
  }

  return legacyCandidates.reduce((bestCandidate, candidate) => {
    if (!bestCandidate) {
      return candidate;
    }

    return scoreLegacyCandidate(candidate, novelId) >
      scoreLegacyCandidate(bestCandidate, novelId)
      ? candidate
      : bestCandidate;
  }, null);
};

const extractNovelWebviewData = (rawHtml, novelId) => {
  if (!rawHtml || typeof rawHtml !== 'string') {
    return null;
  }

  return (
    extractNovelFromMetaPreloadData(rawHtml, novelId) ||
    extractNovelFromNextData(rawHtml, novelId) ||
    extractNovelFromLegacyState(rawHtml, novelId)
  );
};

export default extractNovelWebviewData;
