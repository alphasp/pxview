import { watchLoginRequest } from './auth';
import { watchApiRequest } from './api';


export default function* rootSaga() {
  yield [
    watchLoginRequest(),
    watchApiRequest()
  ]
}