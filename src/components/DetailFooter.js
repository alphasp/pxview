import React, { PureComponent } from 'react';
import { View, StyleSheet, Linking, SafeAreaView } from 'react-native';
import { withTheme, Text } from 'react-native-paper';
import moment from 'moment';
import HtmlView from 'react-native-htmlview';
import Icon from 'react-native-vector-icons/FontAwesome';
import RelatedIllusts from '../screens/Shared/RelatedIllusts';
import IllustComments from '../screens/Shared/IllustComments';
import NovelComments from '../screens/Shared/NovelComments';
import NovelSeries from '../screens/Shared/NovelSeries';
import FollowButtonContainer from '../containers/FollowButtonContainer';
import { connectLocalization } from './Localization';
import Tags from './Tags';
import PXTouchable from './PXTouchable';
import PXThumbnail from './PXThumbnail';
import { SCREENS } from '../common/constants';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: globalStyleVariables.WINDOW_WIDTH,
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

class DetailFooter extends PureComponent {
  handleOnPressAvatar = () => {
    const { onPressAvatar, item } = this.props;
    onPressAvatar(item.user.id);
  };

  handleOnPressLink = (url) => {
    const {
      navigation: { push },
    } = this.props;
    if (url.indexOf('pixiv://illusts/') !== -1) {
      const illustId = url.split('/').pop();
      if (parseInt(illustId, 10)) {
        push(SCREENS.Detail, { items: [], illustId, index: 0 });
      }
    } else if (url.indexOf('pixiv://novels/') !== -1) {
      const novelId = url.split('/').pop();
      if (parseInt(novelId, 10)) {
        push(SCREENS.NovelDetail, { items: [], novelId, index: 0 });
      }
    } else if (url.indexOf('pixiv://users/') !== -1) {
      const uid = url.split('/').pop();
      if (parseInt(uid, 10)) {
        push(SCREENS.UserDetail, { uid });
      }
    } else {
      Linking.canOpenURL(url)
        .then((supported) => {
          if (!supported) {
            return null;
          }
          return Linking.openURL(url);
        })
        .catch((err) => err);
    }
  };

  renderHtmlViewTextComponent = (props) => {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Text {...props} />;
  };

  render() {
    const {
      item,
      authUser,
      navigation,
      route,
      i18n,
      onLayoutView,
      onPressTag,
      onLongPressTag,
      tags,
      theme,
      isDetailPageReady,
    } = this.props;
    return (
      <SafeAreaView>
        <View
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}
          onLayout={onLayoutView}
        >
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
              {((authUser && authUser.id !== item.user.id) || !authUser) && (
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
              onPressTag={onPressTag}
              onLongPressTag={onLongPressTag}
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
                isDetailPageReady={isDetailPageReady}
                maxItems={6}
                navigation={navigation}
                route={route}
              />
            ) : (
              <IllustComments
                illustId={item.id}
                authorId={item.user.id}
                isFeatureInDetailPage
                isDetailPageReady={isDetailPageReady}
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
                isDetailPageReady={isDetailPageReady}
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
                isDetailPageReady={isDetailPageReady}
                maxItems={6}
                navigation={navigation}
                route={route}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

export default withTheme(connectLocalization(DetailFooter));
