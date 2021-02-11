import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PXWebView from '../../components/PXWebView';
import PKCE from '../../common/helpers/pkce';
import { tokenRequest } from '../../common/actions/auth';

const Login = ({ route }) => {
  const dispatch = useDispatch();
  const { url } = route.params;

  useEffect(() => {
    if (route?.params?.code) {
      if (route.params?.code) {
        const { codeVerifier } = PKCE.getPKCE();
        dispatch(tokenRequest(route.params?.code, codeVerifier));
      }
    }
  }, [dispatch, route]);

  return (
    <PXWebView
      source={{
        uri: url,
      }}
    />
  );
};

export default Login;
