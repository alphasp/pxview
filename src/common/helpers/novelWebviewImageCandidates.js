const UPLOADED_IMAGE_PATTERN = /\[uploadedimage:(\d+)\]/g;
const IMAGE_URL_PATTERN = /https?:\/\/[^"'\\<>\s]+(?:jpg|jpeg|png|webp)/gi;

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const parseNumericField = (snippet, fieldName) => {
  const match = snippet.match(
    new RegExp(`${escapeRegExp(fieldName)}["']?\\s*[:=]\\s*(\\d+)`, 'i'),
  );
  return match ? parseInt(match[1], 10) : undefined;
};

const extractUploadedImageIds = (text) => {
  if (!text) {
    return [];
  }

  const ids = [];
  text.replace(UPLOADED_IMAGE_PATTERN, (match, imageId) => {
    ids.push(imageId);
    return match;
  });
  return ids;
};

const extractUploadedImageCandidatesFromHtml = (rawHtml, text) => {
  if (!rawHtml || !text) {
    return {};
  }

  const uploadedImageIds = extractUploadedImageIds(text);
  return uploadedImageIds.reduce((candidates, imageId) => {
    const imageIdMatch = rawHtml.search(new RegExp(escapeRegExp(imageId)));
    if (imageIdMatch === -1) {
      return candidates;
    }

    const snippet = rawHtml.slice(
      Math.max(0, imageIdMatch - 1500),
      Math.min(rawHtml.length, imageIdMatch + 5000),
    );
    const urlMatch = snippet.match(IMAGE_URL_PATTERN);
    if (!urlMatch || !urlMatch.length) {
      return candidates;
    }

    candidates[imageId] = {
      originalUrl: urlMatch[0],
      width: parseNumericField(snippet, 'width'),
      height: parseNumericField(snippet, 'height'),
    };
    return candidates;
  }, {});
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
      // eslint-disable-next-line no-continue
      continue;
    }

    if (currentChar === '"') {
      inString = true;
      // eslint-disable-next-line no-continue
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

const extractTextEmbeddedImagesFromHtml = (rawHtml) => {
  if (!rawHtml || typeof rawHtml !== 'string') {
    return {};
  }

  // Search for textEmbeddedImages key anywhere in the HTML
  const pattern = /["']?textEmbeddedImages["']?\s*:\s*\{/g;
  let match = pattern.exec(rawHtml);

  while (match) {
    const objectStart = rawHtml.indexOf('{', match.index + match[0].indexOf(':'));
    if (objectStart === -1) {
      match = pattern.exec(rawHtml);
      // eslint-disable-next-line no-continue
      continue;
    }

    const objectValue = extractBalancedObject(rawHtml, objectStart);
    if (objectValue) {
      try {
        const parsed = JSON.parse(objectValue);
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
          return parsed;
        }
      } catch (e) {
        // try next match
      }
    }

    match = pattern.exec(rawHtml);
  }

  return {};
};

module.exports = {
  extractUploadedImageCandidatesFromHtml,
  extractTextEmbeddedImagesFromHtml,
};
