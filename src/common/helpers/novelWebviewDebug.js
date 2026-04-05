import { extractLegacyNovelCandidates } from './novelWebviewParser';

const stringifyFlag = (value) => (value ? 'Y' : 'N');

const getCollectionValues = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'object') {
    return Object.values(value);
  }

  return [];
};

const getCandidateIds = (item) =>
  [
    item && item.id,
    item && item.illustId,
    item && item.imageId,
    item && item.novelImageId,
    item && item.illust_id,
    item && item.image_id,
  ]
    .filter((value) => value !== undefined && value !== null)
    .map((value) => String(value));

const buildNovelWebviewDebugInfo = (rawHtml, response) => {
  const html = typeof rawHtml === 'string' ? rawHtml : '';
  const parsed = response && typeof response === 'object' ? response : {};
  const embeddedImages =
    parsed.textEmbeddedImages || parsed.embeddedImages || null;
  const legacyCandidates = extractLegacyNovelCandidates(html, parsed.id);
  const legacyEmbeddedCounts = legacyCandidates
    .map((candidate) =>
      Object.keys(
        candidate.textEmbeddedImages || candidate.embeddedImages || {},
      ).length,
    )
    .slice(0, 3);
  const illustValues = getCollectionValues(parsed.illusts);
  const illustIds = illustValues
    .flatMap((item) => getCandidateIds(item))
    .slice(0, 5);
  const glossaryValues = getCollectionValues(parsed.glossaryItems);
  const glossaryIds = glossaryValues
    .flatMap((item) => getCandidateIds(item))
    .slice(0, 5);
  const parsedKeys = Object.keys(parsed).sort();

  return {
    hasMetaPreloadData: /meta-preload-data/i.test(html),
    hasNextData: /__NEXT_DATA__/i.test(html),
    hasUploadedImageLiteral: /\[uploadedimage:/i.test(html),
    hasTextEmbeddedImagesLiteral: /textEmbeddedImages/i.test(html),
    embeddedImageCount: embeddedImages ? Object.keys(embeddedImages).length : 0,
    legacyCandidateCount: legacyCandidates.length,
    legacyEmbeddedCounts,
    glossaryCount: glossaryValues.length,
    glossaryIds,
    illustCount: illustValues.length,
    illustIds,
    parsedKeys,
    summary: [
      `meta=${stringifyFlag(/meta-preload-data/i.test(html))}`,
      `next=${stringifyFlag(/__NEXT_DATA__/i.test(html))}`,
      `uploaded=${stringifyFlag(/\[uploadedimage:/i.test(html))}`,
      `textEmbeddedImages=${stringifyFlag(/textEmbeddedImages/i.test(html))}`,
      `embeddedCount=${embeddedImages ? Object.keys(embeddedImages).length : 0}`,
      `legacyCandidates=${legacyCandidates.length}`,
      `legacyEmbedded=${
        legacyEmbeddedCounts.length ? legacyEmbeddedCounts.join('|') : 'none'
      }`,
      `glossaryCount=${glossaryValues.length}`,
      `glossaryIds=${glossaryIds.length ? glossaryIds.join('|') : 'none'}`,
      `illustCount=${illustValues.length}`,
      `illustIds=${illustIds.length ? illustIds.join('|') : 'none'}`,
      `parsedKeys=${
        parsedKeys.length ? parsedKeys.slice(0, 8).join('|') : 'none'
      }`,
    ].join(' '),
  };
};

export default buildNovelWebviewDebugInfo;
