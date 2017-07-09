import i18n from '../helpers/i18n';

export const I18N_SET_LANGUAGE = 'I18N_SET_LANGUAGE';

export function setLanguage(lang) {
  i18n.setLanguage(lang);
  return {
    type: I18N_SET_LANGUAGE,
    payload: {
      lang,
    },
  };
}
