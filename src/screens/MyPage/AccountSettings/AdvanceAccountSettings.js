import React from 'react';
import PXWebView from '../../../components/PXWebView';

const SETTING_URL = 'https://touch.pixiv.net/setting_user.php';

const AdvanceAccountSettings = () =>
  <PXWebView
    source={{
      uri: SETTING_URL,
    }}
  />;

export default AdvanceAccountSettings;
