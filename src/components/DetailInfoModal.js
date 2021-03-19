import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Animated,
  ScrollView,
  Linking,
} from 'react-native';
import { connect } from 'react-redux';
import { withTheme, Text } from 'react-native-paper';
import moment from 'moment';
import HtmlView from 'react-native-htmlview';
import Icon from 'react-native-vector-icons/FontAwesome';
import IllustComments from '../screens/Shared/IllustComments';
import NovelComments from '../screens/Shared/NovelComments';
import NovelSeries from '../screens/Shared/NovelSeries';
import RelatedIllusts from '../screens/Shared/RelatedIllusts';
import FollowButtonContainer from '../containers/FollowButtonContainer';
import { connectLocalization } from './Localization';
import Tags from './Tags';
import PXTouchable from './PXTouchable';
import PXThumbnail from './PXThumbnail';
import TagBottomSheet from './TagBottomSheet';
import * as searchHistoryActionCreators from '../common/actions/searchHistory';
import { makeGetTagsWithStatus } from '../common/selectors';
import { SEARCH_TYPES, SCREENS } from '../common/constants';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  backdropContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  infoContainer: {
    margin: 10,
  },
  sectionContainer: {
    marginBottom: 10,
  },
  sectionHeader: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  sectionSeriesTitle: {
    color: globalStyleVariables.PRIMARY_COLOR,
  },
  thumnailNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'column',
    marginLeft: 10,
  },
  captionContainer: {
    marginVertical: 10,
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  seriesTitle: {
    color: globalStyleVariables.PRIMARY_COLOR,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

class DetailInfoModal extends Component {
  static defaultProps = {
    duration: 300,
    height: Math.floor(
      (globalStyleVariables.WINDOW_HEIGHT -
        globalStyleVariables.APPBAR_HEIGHT -
        globalStyleVariables.STATUSBAR_HEIGHT) *
        0.6,
    ),
  };

  constructor(props) {
    super(props);
    this.state = {
      animatedHeight: new Animated.Value(0),
      modalVisible: false,
      selectedTag: null,
      isOpenTagBottomSheet: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { visible } = this.props;
    const { visible: prevVisible } = prevProps;
    if (visible !== null && visible !== prevVisible) {
      this.setModalVisible(visible);
    }
  }

  setModalVisible = (visible) => {
    const { height, duration } = this.props;
    const { modalVisible, animatedHeight } = this.state;
    if (visible && !modalVisible) {
      this.setState({ modalVisible: visible });
      Animated.timing(animatedHeight, {
        toValue: height,
        duration,
        useNativeDriver: false,
      }).start();
    } else if (!visible && modalVisible) {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration,
        useNativeDriver: false,
      }).start(() => {
        this.setState({ modalVisible: visible });
      });
    }
  };

  handleOnCloseModal = () => {
    this.setModalVisible(false);
  };

  handleOnPressAvatar = () => {
    const {
      navigation: { push },
      item,
    } = this.props;
    push(SCREENS.UserDetail, { userId: item.user.id });
  };

  handleOnPressLink = (url) => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          return null;
        }
        return Linking.openURL(url);
      })
      .catch((err) => err);
  };

  handleOnPressTag = (tag) => {
    const {
      addSearchHistory,
      navigation: { push },
    } = this.props;
    addSearchHistory(tag);
    push(SCREENS.SearchResult, {
      word: tag,
      searchType: SEARCH_TYPES.ILLUST,
    });
  };

  handleOnLongPressTag = (tag) => {
    this.setState({
      isOpenTagBottomSheet: true,
      selectedTag: tag,
    });
  };

  handleOnCancelTagBottomSheet = () => {
    this.setState({
      isOpenTagBottomSheet: false,
    });
  };

  renderHtmlViewTextComponent = (props) => {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Text {...props} />;
  };

  render() {
    const {
      onCancel,
      item,
      authUser,
      tags,
      i18n,
      navigation,
      highlightTags,
      muteTags,
      theme,
      route,
    } = this.props;
    const {
      animatedHeight,
      modalVisible,
      isOpenTagBottomSheet,
      selectedTag,
    } = this.state;
    if (!modalVisible) {
      return null;
    }
    return (
      <>
        <TouchableWithoutFeedback onPress={onCancel}>
          <View style={styles.backdropContainer} />
        </TouchableWithoutFeedback>
        <View
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Animated.View style={{ maxHeight: animatedHeight }}>
            <ScrollView>
              <View style={styles.infoContainer}>
                <View style={styles.profileContainer}>
                  <PXTouchable
                    style={styles.thumnailNameContainer}
                    onPress={this.handleOnPressAvatar}
                  >
                    <PXThumbnail uri={item.user.profile_image_urls.medium} />
                    <View style={styles.nameContainer}>
                      <Text>{item.user.name}</Text>
                      <Text>{item.user.account}</Text>
                    </View>
                  </PXTouchable>
                  {((authUser && authUser.id !== item.user.id) ||
                    !authUser) && (
                    <FollowButtonContainer userId={item.user.id} />
                  )}
                </View>
                <View style={styles.captionContainer}>
                  {item.series && item.series.id && (
                    <Text style={styles.seriesTitle} selectable>
                      {item.series.title}
                    </Text>
                  )}
                  <Text style={styles.title} selectable>
                    {item.title}
                  </Text>
                  <HtmlView
                    value={item.caption}
                    onLinkPress={this.handleOnPressLink}
                    textComponentProps={{ selectable: true }}
                    TextComponent={this.renderHtmlViewTextComponent}
                  />
                </View>
                <View style={styles.statContainer}>
                  <Text>{moment(item.create_date).format('YYYY-MM-DD')}</Text>
                  <Icon
                    name="eye"
                    style={{ marginLeft: 10 }}
                    color={theme.colors.text}
                  />
                  <Text style={{ marginLeft: 5 }}>{item.total_view}</Text>
                  <Icon
                    name="heart"
                    style={{ marginLeft: 10 }}
                    color={theme.colors.text}
                  />
                  <Text style={{ marginLeft: 5 }}>{item.total_bookmarks}</Text>
                </View>
                <Tags
                  tags={tags}
                  onPressTag={this.handleOnPressTag}
                  onLongPressTag={this.handleOnLongPressTag}
                />
              </View>
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{i18n.comments}</Text>
                </View>
                {item.text_length ? (
                  <NovelComments
                    novelId={item.id}
                    authorId={item.user.id}
                    isFeatureInDetailPage
                    isDetailPageReady
                    maxItems={6}
                    navigation={navigation}
                    route={route}
                  />
                ) : (
                  <IllustComments
                    illustId={item.id}
                    authorId={item.user.id}
                    isFeatureInDetailPage
                    isDetailPageReady
                    maxItems={6}
                    navigation={navigation}
                    route={route}
                  />
                )}
              </View>
              {!item.text_length && (
                <View style={styles.sectionContainer}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{i18n.relatedWorks}</Text>
                  </View>
                  <RelatedIllusts
                    illustId={item.id}
                    listKey={`relatedIllusts-${route.key}-${item.id}`}
                    isFeatureInDetailPage
                    isDetailPageReady
                    maxItems={6}
                    navigation={navigation}
                    route={route}
                  />
                </View>
              )}
              {item.series && item.series.id && item.text_length > 0 && (
                <View style={styles.sectionContainer}>
                  <View style={styles.sectionHeader}>
                    <Text
                      style={[styles.sectionTitle, styles.sectionSeriesTitle]}
                      selectable
                    >
                      {item.series.title}
                    </Text>
                  </View>
                  <NovelSeries
                    seriesId={item.series.id}
                    seriesTitle={item.series.title}
                    isFeatureInDetailPage
                    isDetailPageReady
                    maxItems={6}
                    navigation={navigation}
                    route={route}
                  />
                </View>
              )}
            </ScrollView>
          </Animated.View>
        </View>
        <TagBottomSheet
          visible={isOpenTagBottomSheet}
          selectedTag={selectedTag}
          isHighlight={highlightTags.includes(selectedTag)}
          isMute={muteTags.includes(selectedTag)}
          navigation={navigation}
          onCancel={this.handleOnCancelTagBottomSheet}
        />
      </>
    );
  }
}

export default withTheme(
  connectLocalization(
    connect(() => {
      const getTagsWithStatus = makeGetTagsWithStatus();
      return (state, props) => ({
        highlightTags: state.highlightTags.items,
        muteTags: state.muteTags.items,
        tags: getTagsWithStatus(state, props),
      });
    }, searchHistoryActionCreators)(DetailInfoModal),
  ),
);
