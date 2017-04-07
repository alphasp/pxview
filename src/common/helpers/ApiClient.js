import PixivApi from 'pixiv-api-client';
const pixiv = new PixivApi();
// let reduxStore = null;

// import { requestRefreshToken } from '../actions/auth';
// const apiMethods = Object.getOwnPropertyNames(PixivApi.prototype).filter(propertyName => propertyName !== 'constructor');

// const api = apiMethods.reduce((cur, methodName) => {
//   cur[methodName] = (...args) => {
//     return pixiv[methodName](...args).catch(err => {
//       if (err && err.error && err.error.message.search(/invalid_grant|OAuth/)) {
//         console.log('failed with oauth, most probably due to token expire, to requestRefreshToken ');
//         return requestRefreshToken(reduxStore.dispatch).then(() => {
//           return pixiv[methodName](...args);
//         })
//       }
//       else {
//         return Promise.reject(err);
//       }
//     });
//   };
//   return cur;
// }, {});

// api.setStore = (store) =>{
//   reduxStore = store;
// }

// export default api;

export default pixiv;