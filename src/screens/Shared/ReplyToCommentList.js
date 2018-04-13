import React from 'react';
import { SafeAreaView } from 'react-native';
import CommentList from '../../components/CommentList';
import { globalStyles } from '../../styles';

const ReplyToCommentList = ({ navigation }) => {
  const { authorId, data } = navigation.state.params;
  return (
    <SafeAreaView style={globalStyles.container}>
      <CommentList authorId={authorId} data={data} navigation={navigation} />
    </SafeAreaView>
  );
};

export default ReplyToCommentList;
