import { READING_SETTINGS } from '../constants/actionTypes';
import { READING_DIRECTION_TYPES } from '../constants';

const initState = {
  imageReadingDirection: READING_DIRECTION_TYPES.LEFT_TO_RIGHT,
  novelReadingDirection: READING_DIRECTION_TYPES.LEFT_TO_RIGHT,
  sliderSide: 'right',
  sliderPercentageSide: 'right',
};

export default function readingSettings(state = initState, action) {
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
        sliderSide:
          action.payload.sliderSide !== undefined
            ? action.payload.sliderSide
            : state.sliderSide,
        sliderPercentageSide:
          action.payload.sliderPercentageSide !== undefined
            ? action.payload.sliderPercentageSide
            : state.sliderPercentageSide,
      };
    case READING_SETTINGS.RESTORE:
      {
        const nextState = {
          ...state,
          ...action.payload.state,
        };
        if (
          nextState.sliderPercentageSide === undefined &&
          nextState.sliderSide !== undefined
        ) {
          nextState.sliderPercentageSide = nextState.sliderSide;
        }
        return nextState;
      }
    default:
      return state;
  }
}
