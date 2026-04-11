import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PXWebView from '../../components/PXWebView';
import PKCE from '../../common/helpers/pkce';
import { tokenRequest } from '../../common/actions/auth';

const Login = ({ route }) => {
  const dispatch = useDispatch();
  const { url } = route.params;

  useEffect(() => {
    let isMounted = true;

    const handleLoginCallback = async () => {
      if (!route?.params?.code) {
        return;
      }

      const { codeVerifier } = await PKCE.getPKCE();

      if (isMounted) {
        dispatch(tokenRequest(route.params?.code, codeVerifier));
      }
    };

    handleLoginCallback();

    return () => {
      isMounted = false;
    };
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
