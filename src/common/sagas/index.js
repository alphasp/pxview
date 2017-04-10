import { watchLoginRequest, watchRehydrate } from './auth';

export default function* rootSaga() {
  yield [
    watchLoginRequest(),
    watchRehydrate()
  ]
}