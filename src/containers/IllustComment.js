import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  RecyclerViewBackedScrollView,
  RefreshControl,
  InteractionManager,
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import Loader from '../components/Loader';
import PXTouchable from '../components/PXTouchable';
import PXImage from '../components/PXImage';
import PXThumbnail from '../components/PXThumbnail';
import PXThumbnailTouchable from '../components/PXThumbnailTouchable';
import OverlayImagePages from '../components/OverlayImagePages';
import { 
  fetchIllustComments, 
  clearIllustComments, 
} from '../common/actions/illustComment';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commentContainer: {
    flexDirection: 'row',
    margin: 10
  },
  nameCommentContainer: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  date: {
    marginLeft: 10,
    fontSize: 10
  },
  comment: {
    marginTop: 5
  }
});

class IllustComment extends Component {
  constructor(props) {
    super(props);
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    })
    this.state = { 
      refreshing: false
    };
  }

  componentDidMount() {
    const { dispatch, illustId } = this.props;
    dispatch(clearIllustComments(illustId));
    InteractionManager.runAfterInteractions(() => {
      dispatch(fetchIllustComments(illustId));
    });
  }

  renderRow = (item) => {
    return (
      <View
        key={item.id}
        style={styles.commentContainer}
      >
        <PXThumbnailTouchable
          uri={item.user.profile_image_urls.medium}
        />
        <View style={styles.nameCommentContainer}>
          <View style={styles.nameContainer}>
            <Text>{item.user.name}</Text>
            <Text style={styles.date}>{moment(item.date).format('YYYY-MM-DD HH:mm')}</Text>
          </View>
          <View style={styles.comment}>
            <Text>{item.comment}</Text>
          </View>
        </View>
      </View>
    );
  }

  loadMoreComments = () => {
    const { dispatch, illustComment, illustId } = this.props;
    if (illustComment[illustId] && illustComment[illustId].nextUrl) {
      dispatch(fetchIllustComments(illustId, null, illustComment[illustId].nextUrl));
    }
  }

  handleOnRefresh = () => {
    const { dispatch, illustId } = this.props;
    this.setState({
      refereshing: true
    });
    dispatch(clearIllustComments(illustId));
    dispatch(fetchIllustComments(illustId)).finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  renderFooter = () => {
    const { illustComment, illustId } = this.props;
    const { nextUrl } = illustComment[illustId];
    return (
      nextUrl ?
      <View style={{ marginBottom: 20 }}>
        <Loader />
      </View>
      :
      null
    )
  }

  render() {
    const { illustComment, illustId } = this.props;
    const { refreshing } = this.state;
    if (illustComment[illustId]) {
      const { items, loading, loaded } = illustComment[illustId];
      console.log('comment ', illustComment[illustId])
      const dataSource = this.dataSource.cloneWithRows(items || []);
      return (
        <View style={styles.container}>
          {
            !loaded && loading &&
            <Loader />
          }
          {
            (items && items.length) ?
            <ListView
              dataSource={dataSource}
              renderRow={this.renderRow}
              enableEmptySections={ true }
              renderScrollComponent={ props => <RecyclerViewBackedScrollView {...props} />}
              renderFooter={this.renderFooter}
              onEndReached={this.loadMoreComments}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={this.handleOnRefresh}
                />
              }
            />
            :
            null
          }
        </View>
      );
    }
    else {
      return null;
    }
  }
}

export default connect(state => {
  return {
    illustComment: state.illustComment
  }
})(IllustComment);