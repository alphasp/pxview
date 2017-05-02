import { localizedStrings } from '../helpers/i18n';
export const I18N_SET_LANGUAGE = 'I18N_SET_LANGUAGE';

export function setLanguage(lang) {
  localizedStrings.setLanguage(lang);
  return {
    type: I18N_SET_LANGUAGE,
    payload: {
      lang,
    },
  };
}
