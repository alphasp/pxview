import React from 'react';
import PXWebView from '../../components/PXWebView';

const ppUrl =
  'https://github.com/alphasp/pxview/blob/master/privacy-policy/en.md';

const PrivacyPolicy = () =>
  <PXWebView
    source={{
      uri: ppUrl,
    }}
  />;

export default PrivacyPolicy;
