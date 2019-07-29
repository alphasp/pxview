import React from 'react';
import { connect } from 'react-redux';
import { connectLocalization } from '../../components/Localization';
import TagSettings from '../../containers/TagsSettings';
import * as muteTagsActionCreators from '../../common/actions/muteTags';

const MuteTagSettings = ({ muteTags, i18n, addMuteTag, removeMuteTag }) => (
  <TagSettings
    items={muteTags}
    textInputPlaceholder={i18n.tagMuteAdd}
    addTag={addMuteTag}
    removeTag={removeMuteTag}
  />
);

export default connectLocalization(
  connect(
    state => ({
      muteTags: state.muteTags.items,
    }),
    muteTagsActionCreators,
  )(MuteTagSettings),
);
