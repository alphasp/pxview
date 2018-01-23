import React, { Component } from 'react';
import { connect } from 'react-redux';
import { connectLocalization } from './Localization';
import PXBottomSheet from './PXBottomSheet';
import PXBottomSheetButton from './PXBottomSheetButton';
import PXBottomSheetCancelButton from './PXBottomSheetCancelButton';
import * as highlightTagsActionCreators from '../common/actions/highlightTags';
import * as muteTagsActionCreators from '../common/actions/muteTags';
import { SCREENS } from '../common/constants';

class TagBottomSheet extends Component {
  handleOnPressOpenEncyclopedia = () => {
    const { onCancel, navigation: { navigate }, selectedTag } = this.props;
    if (selectedTag) {
      onCancel();
      navigate(SCREENS.Encyclopedia, {
        word: selectedTag,
      });
    }
  };

  handleOnPressToggleHighlightTag = () => {
    const {
      onCancel,
      isHighlight,
      addHighlightTag,
      removeHighlightTag,
      selectedTag,
    } = this.props;
    onCancel();
    if (isHighlight) {
      removeHighlightTag(selectedTag);
    } else {
      addHighlightTag(selectedTag);
    }
  };

  handleOnPressToggleMuteTag = () => {
    const {
      onCancel,
      isMute,
      addMuteTag,
      removeMuteTag,
      selectedTag,
    } = this.props;
    onCancel();
    if (isMute) {
      removeMuteTag(selectedTag);
    } else {
      addMuteTag(selectedTag);
    }
  };

  render() {
    const { visible, onCancel, i18n, isHighlight, isMute } = this.props;
    return (
      <PXBottomSheet visible={visible} onCancel={onCancel}>
        <PXBottomSheetButton
          onPress={this.handleOnPressOpenEncyclopedia}
          iconName="book"
          iconType="font-awesome"
          text={i18n.encyclopedia}
        />
        <PXBottomSheetButton
          onPress={this.handleOnPressToggleHighlightTag}
          iconName="tag"
          iconType="font-awesome"
          text={isHighlight ? i18n.tagHighlightRemove : i18n.tagHighlightAdd}
        />
        <PXBottomSheetButton
          onPress={this.handleOnPressToggleMuteTag}
          iconName="tag"
          iconType="font-awesome"
          text={isMute ? i18n.tagMuteRemove : i18n.tagMuteAdd}
        />
        <PXBottomSheetCancelButton onPress={onCancel} text={i18n.cancel} />
      </PXBottomSheet>
    );
  }
}

export default connectLocalization(
  connect(null, {
    ...highlightTagsActionCreators,
    ...muteTagsActionCreators,
  })(TagBottomSheet),
);
