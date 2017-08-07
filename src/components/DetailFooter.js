import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import moment from 'moment';
import HtmlView from 'react-native-htmlview';
import Icon from 'react-native-vector-icons/FontAwesome';
import RelatedIllusts from '../screens/Shared/RelatedIllusts';
import IllustComments from '../screens/Shared/IllustComments';
import FollowButtonContainer from '../containers/FollowButtonContainer';
import Tags from './Tags';
import PXTouchable from './PXTouchable';
import PXThumbnail from './PXThumbnail';

const styles = StyleSheet.create({
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
  footerSpacer: {
    marginBottom: Platform.OS === 'ios' ? 120 : 60,
  },
});

class DetailFooter extends PureComponent {
  handleOnPressAvatar = () => {
    const { onPressAvatar, item } = this.props;
    onPressAvatar(item.user.id);
  };

  render() {
    const {
      item,
      authUser,
      navigation,
      i18n,
      onLayoutView,
      onPressTag,
      onPressLink,
    } = this.props;
    return (
      <View onLayout={onLayoutView}>
        <View style={styles.infoContainer}>
          <View style={styles.profileContainer}>
            <PXTouchable
              style={styles.thumnailNameContainer}
              onPress={this.handleOnPressAvatar}
            >
              <PXThumbnail uri={item.user.profile_image_urls.medium} />
              <View style={styles.nameContainer}>
                <Text>
                  {item.user.name}
                </Text>
                <Text>
                  {item.user.account}
                </Text>
              </View>
            </PXTouchable>
            {((authUser && authUser.id !== item.user.id) || !authUser) &&
              <FollowButtonContainer
                user={item.user}
                navigation={navigation}
              />}
          </View>
          <View style={styles.captionContainer}>
            <Text style={styles.title}>
              {item.title}
            </Text>
            <HtmlView value={item.caption} onLinkPress={onPressLink} />
          </View>
          <View style={styles.statContainer}>
            <Text>
              {moment(item.create_date).format('YYYY-MM-DD')}
            </Text>
            <Icon name="eye" style={{ marginLeft: 10 }} />
            <Text style={{ marginLeft: 5 }}>
              {item.total_view}
            </Text>
            <Icon name="heart" style={{ marginLeft: 10 }} />
            <Text style={{ marginLeft: 5 }}>
              {item.total_bookmarks}
            </Text>
          </View>
          {<Tags tags={item.tags} onPressTag={onPressTag} />}
        </View>
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {i18n.comments}
            </Text>
          </View>
          <IllustComments
            illustId={item.id}
            isFeatureInDetailPage
            maxItems={6}
            navigation={navigation}
          />
        </View>
        <View
          style={styles.sectionContainer}
          onLayout={this.handleOnLayoutRelatedIllusts}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {i18n.relatedWorks}
            </Text>
          </View>
          <RelatedIllusts
            illustId={item.id}
            isFeatureInDetailPage
            maxItems={6}
            navigation={navigation}
          />
        </View>
        {
          /* workaround for missing height in viewpager  */
          <View style={styles.footerSpacer} />
        }
      </View>
    );
  }
}

export default DetailFooter;
