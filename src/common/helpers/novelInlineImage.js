const INLINE_IMAGE_PATTERN = /\[loadedimage:(\d+)\]/g;

export const createInlineImageTag = (illustId) =>
  `<px-image data-illust-id='${illustId}'></px-image>`;

export const renderTextWithInlineImages = (text) => {
  if (!text) {
    return '';
  }

  let output = '';
  let lastIndex = 0;

  text.replace(INLINE_IMAGE_PATTERN, (match, illustId, offset) => {
    output += text.slice(lastIndex, offset).replace(/</g, '＜');
    output += createInlineImageTag(illustId);
    lastIndex = offset + match.length;
    return match;
  });

  output += text.slice(lastIndex).replace(/</g, '＜');

  return output;
};
