import React from 'react';
import PXWebView from '../../components/PXWebView';

const signUpUrl = 'https://accounts.pixiv.net/signup';

const SignUp = () => (
  <PXWebView
    source={{
      uri: signUpUrl,
    }}
  />
);

export default SignUp;
