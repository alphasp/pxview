import { NOVEL_SETTINGS } from '../constants/actionTypes';

const initState = {
  fontSize: 14,
  lineHeight: 1.2,
};

export default function novelSettings(state = initState, action) {
  switch (action.type) {
    case NOVEL_SETTINGS.SET:
      return {
        ...state,
        fontSize:
          action.payload.fontSize !== undefined
            ? action.payload.fontSize
            : state.fontSize,
        lineHeight:
          action.payload.lineHeight !== undefined
            ? action.payload.lineHeight
            : state.lineHeight,
      };
    case NOVEL_SETTINGS.RESTORE:
      return {
        ...state,
        ...action.payload.state,
      };
    default:
      return state;
  }
}
