import { localizedStrings } from '../helpers/i18n';
import { I18N_SET_LANGUAGE } from '../actions/i18n';

export default function i18n(state = {
  lang: localizedStrings.getLanguage() || 'en'
}, action = {}) {
  switch (action.type) {
    case I18N_SET_LANGUAGE:
      return {
        ...state,
        lang: action.payload.lang,
      };
    default:
      return state;
  }
}