const UPLOADED_IMAGE_PATTERN = /\[uploadedimage:(\d+)\]/g;
const IMAGE_URL_PATTERN = /https?:\/\/[^"'\\<>\s]+(?:jpg|jpeg|png|webp)/gi;

const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

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

module.exports = {
  extractUploadedImageCandidatesFromHtml,
};
