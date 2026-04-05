const INLINE_IMAGE_PATTERN = /\[(loadedimage|uploadedimage):([\d-]+)\]/g;

export const createInlineImageTag = (
  illustId,
  imageKind = 'loadedimage',
  pageNumber = null,
) => {
  const attributes = [`data-illust-id='${illustId}'`];

  if (imageKind) {
    attributes.push(`data-image-kind='${imageKind}'`);
  }

  if (pageNumber !== null && pageNumber !== undefined) {
    attributes.push(`data-page-number='${pageNumber}'`);
  }

  return `<px-image ${attributes.join(' ')}></px-image>`;
};

export const renderTextWithInlineImages = (text) => {
  if (!text) {
    return '';
  }

  let output = '';
  let lastIndex = 0;

  text.replace(INLINE_IMAGE_PATTERN, (match, imageKind, illustId, offset) => {
    output += text.slice(lastIndex, offset).replace(/</g, '＜');
    output += createInlineImageTag(illustId, imageKind);
    lastIndex = offset + match.length;
    return match;
  });

  output += text.slice(lastIndex).replace(/</g, '＜');

  return output;
};
