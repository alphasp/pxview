import { ActionConst } from 'react-native-router-flux';

export default function routes(state = {
  scene: {}
}, action = {}) {
  switch (action.type) {
    // focus action is dispatched when a new screen comes into focus
    case ActionConst.FOCUS:
      return {
        ...state,
        scene: action.scene,
      };
    // ...other actions
    default:
      return state;
  }
}