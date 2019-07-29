import React from 'react';
import { connect } from 'react-redux';
import { connectLocalization } from '../../components/Localization';
import TagSettings from '../../containers/TagsSettings';
import * as highlightTagsActionCreators from '../../common/actions/highlightTags';

const HighlightTagsSettings = ({
  highlightTags,
  i18n,
  addHighlightTag,
  removeHighlightTag,
}) => (
  <TagSettings
    items={highlightTags}
    textInputPlaceholder={i18n.tagHighlightAdd}
    addTag={addHighlightTag}
    removeTag={removeHighlightTag}
  />
);

export default connectLocalization(
  connect(
    state => ({
      highlightTags: state.highlightTags.items,
    }),
    highlightTagsActionCreators,
  )(HighlightTagsSettings),
);
