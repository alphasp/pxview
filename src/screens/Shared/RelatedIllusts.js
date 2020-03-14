import React, { Component } from 'react';
import { View, StyleSheet, InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import { connectLocalization } from '../../components/Localization';
import IllustList from '../../components/IllustList';
import NoResult from '../../components/NoResult';
import ViewMoreButton from '../../components/ViewMoreButton';
import * as relatedIllustsActionCreators from '../../common/actions/relatedIllusts';
import { makeGetRelatedIllustsItems } from '../../common/selectors';
import { globalStyles } from '../../styles';
import { SCREENS } from '../../common/constants';

const styles = StyleSheet.create({
  viewMoreButtonContainer: {
    margin: 10,
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

  render() {
    const {
      relatedIllusts,
      items,
      isFeatureInDetailPage,
      maxItems,
      i18n,
      listKey,
    } = this.props;
    return (
      <View style={globalStyles.container}>
        <IllustList
          data={{ ...relatedIllusts, items }}
          listKey={listKey}
          loadMoreItems={!isFeatureInDetailPage ? this.loadMoreItems : null}
          onRefresh={!isFeatureInDetailPage ? this.handleOnRefresh : null}
          maxItems={isFeatureInDetailPage && maxItems}
        />
        {relatedIllusts &&
          relatedIllusts.loaded &&
          (!items || !items.length) && <NoResult text={i18n.noRelatedWorks} />}
        {isFeatureInDetailPage &&
        relatedIllusts &&
        relatedIllusts.loaded &&
        items &&
        items.length ? (
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
  connect(
    () => {
      const getRelatedIllustsItems = makeGetRelatedIllustsItems();
      return (state, props) => {
        const { relatedIllusts } = state;
        const { listKey } = props;
        const illustId =
          props.illustId || props.route.params.illustId;
        return {
          relatedIllusts: relatedIllusts[illustId],
          items: getRelatedIllustsItems(state, props),
          illustId,
          listKey: listKey || `${props.route.key}-${illustId}`,
        };
      };
    },
    relatedIllustsActionCreators,
  )(RelatedIllusts),
);
