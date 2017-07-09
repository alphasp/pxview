import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import Loader from './Loader';
import PXTouchable from './PXTouchable';
import PXImage from './PXImage';
import { SEARCH_TYPES, SCREENS } from '../common/constants';
import { globalStyles, globalStyleVariables } from '../styles';

const ILLUST_COLUMNS = 3;

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  tag: {
    backgroundColor: 'transparent',
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  imageContainer: {
    marginBottom: 1,
    backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
  },
  image: {
    resizeMode: 'cover',
  },
});

class IllustTagList extends Component {
  renderItem = (item, index) => {
    let imageContainerStyle = {};
    let imageStyle = {};
    let tagContainerStyle = {};
    if (index === 0) {
      const width = globalStyleVariables.WINDOW_WIDTH;
      const height = globalStyleVariables.WINDOW_WIDTH / ILLUST_COLUMNS * 2 - 1;
      imageContainerStyle = {
        width,
        height,
      };
      imageStyle = {
        width,
        height,
      };
      tagContainerStyle = {
        width,
        height,
      };
    } else {
      const width = globalStyleVariables.WINDOW_WIDTH / ILLUST_COLUMNS - 1;
      const height = globalStyleVariables.WINDOW_WIDTH / ILLUST_COLUMNS - 1;
      imageContainerStyle = {
        marginRight: index % ILLUST_COLUMNS < ILLUST_COLUMNS - 1 ? 1 : 0,
        width,
        height,
      };
      imageStyle = {
        width,
        height,
      };
      tagContainerStyle = {
        height: globalStyleVariables.WINDOW_WIDTH / 3 - 1,
        width: globalStyleVariables.WINDOW_WIDTH / 3 - 1,
      };
    }
    return (
      <PXTouchable
        style={[styles.imageContainer, imageContainerStyle]}
        key={item.tag}
        onPress={() => this.handleOnPressItem(item)}
      >
        <View>
          <PXImage
            uri={item.illust.image_urls.square_medium}
            style={[styles.image, imageStyle]}
          />
          <View style={[styles.tagContainer, tagContainerStyle]}>
            <Text style={styles.tag}>
              {item.tag}
            </Text>
          </View>
        </View>
      </PXTouchable>
    );
  };

  handleOnPressItem = item => {
    const { navigate } = this.props.navigation;
    navigate(SCREENS.SearchResult, {
      word: item.tag,
      searchType: SEARCH_TYPES.ILLUST,
    });
  };

  render() {
    const {
      data: { items, loading, loaded, refreshing },
      onRefresh,
    } = this.props;
    return (
      <View style={globalStyles.container}>
        {(!items || (!loaded && loading)) && <Loader />}
        {items && items.length
          ? <ScrollView
              contentContainerStyle={styles.contentContainer}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              {items.map(this.renderItem)}
            </ScrollView>
          : null}
      </View>
    );
  }
}

export default withNavigation(IllustTagList);
