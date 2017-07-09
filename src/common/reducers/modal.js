import { MODAL } from '../constants/actionTypes';

// http://stackoverflow.com/questions/35623656/how-can-i-display-a-modal-dialog-in-redux-that-performs-asynchronous-actions/35641680

const initState = {
  modalType: null,
  modalProps: {},
};

export default function modal(state = initState, action) {
  switch (action.type) {
    case MODAL.OPEN:
      return {
        modalType: action.payload.modalType,
        modalProps: action.payload.modalProps,
      };
    case MODAL.CLOSE:
      return initState;
    default:
      return state;
  }
}
