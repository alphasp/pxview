import { Platform } from 'react-native';
import PixivApi from 'pixiv-api-client';
import DeviceInfo from 'react-native-device-info';

const deviceModel = DeviceInfo.getModel();
const systemVersion = DeviceInfo.getSystemVersion();

let headers;
if (Platform.OS === 'android' && systemVersion && deviceModel) {
  headers = {
    'App-OS-Version': systemVersion,
    'User-Agent': `PixivAndroidApp/5.0.166 (Android ${systemVersion}; ${deviceModel}`,
  };
}

const pixiv = new PixivApi(headers);
export default pixiv;
