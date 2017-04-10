import { watchLoginRequest, watchRehydrate } from './auth';
import { watchFetchRecommendedIllusts } from './recommendedIllusts';

export default function* rootSaga() {
  yield [
    watchRehydrate(),
    watchLoginRequest(),
    watchFetchRecommendedIllusts()
  ]
}