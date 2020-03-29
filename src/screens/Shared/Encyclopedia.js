import React, { useLayoutEffect } from 'react';
import PXWebView from '../../components/PXWebView';

const ENCYCLOPEDIA_URL = 'https://dic.pixiv.net/a';

const Encyclopedia = ({ navigation, route }) => {
  const { word } = route.params;
  const url = `${ENCYCLOPEDIA_URL}/${encodeURIComponent(word)}`;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: word,
    });
  }, [navigation, word]);

  return (
    <PXWebView
      source={{
        uri: url,
      }}
    />
  );
};

export default Encyclopedia;
