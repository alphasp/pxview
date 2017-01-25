export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE';
export const ADD_ERROR = 'ADD_ERROR';
export const REMOVE_ERROR = 'REMOVE_ERROR';

export function addError(error) {
  console.log('err ', error);
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      return resolve(dispatch({
        type: ADD_ERROR,
        error: true,
        payload: typeof error === 'string' ? error : 'Something bad happened'
      }));
    });
  };
}

export function resetError() {
  return {
    type: RESET_ERROR_MESSAGE,
    error: false
  };
}