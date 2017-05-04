export default function createFilteredReducer(
  reducerFunction,
  reducerPredicate,
) {
  return (state = {}, action) => {
    const shouldRunWrappedReducer = reducerPredicate(action);
    return shouldRunWrappedReducer ? reducerFunction(state, action) : state;
  };
}
