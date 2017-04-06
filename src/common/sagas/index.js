import { watchLoginRequest } from './auth.js'

export default function* rootSaga() {
  yield [
    watchLoginRequest()
  ]
}