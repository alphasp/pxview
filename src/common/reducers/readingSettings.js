import { READING_SETTINGS } from '../constants/actionTypes';
import { READING_DIRECTION_TYPES } from '../constants';

const initState = {
  imageReadingDirection: READING_DIRECTION_TYPES.LEFT_TO_RIGHT,
  novelReadingDirection: READING_DIRECTION_TYPES.LEFT_TO_RIGHT,
};

export default function novelSettings(state = initState, action) {
  switch (action.type) {
    case READING_SETTINGS.SET:
      return {
        ...state,
        imageReadingDirection:
          action.payload.imageReadingDirection !== undefined
            ? action.payload.imageReadingDirection
            : state.imageReadingDirection,
        novelReadingDirection:
          action.payload.novelReadingDirection !== undefined
            ? action.payload.novelReadingDirection
            : state.novelReadingDirection,
      };
    default:
      return state;
  }
}
