import pixiv from '../helpers/apiClient';
import i18n from '../helpers/i18n';

export const I18N_SET_LANGUAGE = 'I18N_SET_LANGUAGE';

function mapLanguageCode(lang) {
  switch (lang) {
    case 'ja':
      return 'ja-jp';
    case 'zh':
    case 'zh-CN':
    case 'zh-SG':
      return 'zh-cn';
    case 'zh-TW':
    case 'zh-HK':
    case 'zh-MO':
      return 'zh-tw';
    case 'en':
    default:
      return 'en-us';
  }
}

export function setLanguage(lang) {
  i18n.setLanguage(lang);
  pixiv.setLanguage(mapLanguageCode(lang));
  return {
    type: I18N_SET_LANGUAGE,
    payload: {
      lang,
    },
  };
}
