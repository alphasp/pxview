import { RANKING_TYPES } from '../constants';

const mapRankingTypeString = (rankingType, i18n) => {
  switch (rankingType) {
    case RANKING_TYPES.ILLUST:
      return i18n.illustration;
    case RANKING_TYPES.MANGA:
      return i18n.manga;
    case RANKING_TYPES.NOVEL:
      return i18n.novel;
    default:
      return '';
  }
};

export default mapRankingTypeString;
