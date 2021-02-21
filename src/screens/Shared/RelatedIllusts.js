import React, { Component } from 'react';
import { View, StyleSheet, InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import { connectLocalization } from '../../components/Localization';
import IllustList from '../../components/IllustList';
import IllustItem from '../../components/IllustItem';
import NoResult from '../../components/NoResult';
import ViewMoreButton from '../../components/ViewMoreButton';
import Loader from '../../components/Loader';
import * as relatedIllustsActionCreators from '../../common/actions/relatedIllusts';
import { makeGetRelatedIllustsItems } from '../../common/selectors';
import { globalStyles } from '../../styles';
import { SCREENS } from '../../common/constants';

const styles = StyleSheet.create({
  viewMoreButtonContainer: {
    margin: 10,
  },
  // should be same with FlatList
  listContainer: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'scroll',
  },
});

class RelatedIllusts extends Component {
  componentDidMount() {
    const {
      relatedIllusts,
      illustId,
      fetchRelatedIllusts,
      clearRelatedIllusts,
    } = this.props;
    // will render blank unless scrolled
    // https://github.com/facebook/react-native/issues/10142
    if (!relatedIllusts || !relatedIllusts.items) {
      clearRelatedIllusts(illustId);
      InteractionManager.runAfterInteractions(() => {
        fetchRelatedIllusts(illustId);
      });
    }
  }

  loadMoreItems = () => {
    const { relatedIllusts, illustId, fetchRelatedIllusts } = this.props;
    if (relatedIllusts && !relatedIllusts.loading && relatedIllusts.nextUrl) {
      fetchRelatedIllusts(illustId, null, relatedIllusts.nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { illustId, fetchRelatedIllusts, clearRelatedIllusts } = this.props;
    clearRelatedIllusts(illustId);
    fetchRelatedIllusts(illustId, null, null, true);
  };

  handleOnPressViewMoreRelatedIllusts = () => {
    const {
      illustId,
      navigation: { push },
    } = this.props;
    push(SCREENS.RelatedIllusts, {
      illustId,
    });
  };

  handleOnPressItem = (item, index) => {
    const {
      items,
      navigation: { push },
      maxItems,
    } = this.props;
    push(SCREENS.Detail, {
      items: maxItems ? items.slice(0, maxItems) : items,
      index,
    });
  };

  renderList = () => {
    const {
      relatedIllusts,
      items,
      maxItems,
      isFeatureInDetailPage,
      isDetailPageReady,
      listKey,
    } = this.props;
    if (isFeatureInDetailPage) {
      if (!isDetailPageReady) {
        return <Loader />;
      }
      if (relatedIllusts?.loaded && items?.length) {
        return (
          <View style={styles.listContainer}>
            {items.slice(0, maxItems).map((item, index) => {
              return (
                <IllustItem
                  key={item.id}
                  illustId={item.id}
                  index={index}
                  numColumns={3}
                  onPressItem={() => this.handleOnPressItem(item, index)}
                />
              );
            })}
          </View>
        );
      }
      return null;
    }
    return (
      <IllustList
        data={{ ...relatedIllusts, items }}
        listKey={listKey}
        loadMoreItems={this.loadMoreItem}
        onRefresh={this.handleOnRefresh}
      />
    );
  };

  render() {
    const {
      relatedIllusts,
      items,
      i18n,
      isFeatureInDetailPage,
      isDetailPageReady,
    } = this.props;
    return (
      <View style={globalStyles.container}>
        {this.renderList()}
        {relatedIllusts?.loaded && !items?.length && (
          <NoResult text={i18n.noRelatedWorks} />
        )}
        {isFeatureInDetailPage &&
        isDetailPageReady &&
        relatedIllusts?.loaded &&
        items?.length ? (
          <View style={styles.viewMoreButtonContainer}>
            <ViewMoreButton
              onPress={this.handleOnPressViewMoreRelatedIllusts}
            />
          </View>
        ) : null}
      </View>
    );
  }
}

export default connectLocalization(
  connect(() => {
    const getRelatedIllustsItems = makeGetRelatedIllustsItems();
    return (state, props) => {
      const { relatedIllusts } = state;
      const { listKey } = props;
      const illustId = props.illustId || props.route.params.illustId;
      return {
        relatedIllusts: relatedIllusts[illustId],
        items: getRelatedIllustsItems(state, props),
        illustId,
        listKey: listKey || `${props.route.key}-${illustId}`,
      };
    };
  }, relatedIllustsActionCreators)(RelatedIllusts),
);
