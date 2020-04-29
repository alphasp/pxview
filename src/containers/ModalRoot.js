import React from 'react';
import { connect } from 'react-redux';
import FollowModal from './FollowModal';
import BookmarkIllustModal from './BookmarkIllustModal';
import BookmarkNovelModal from './BookmarkNovelModal';
import NovelSettingsModal from './NovelSettingsModal';
import InitialScreenSettingsModal from './InitialScreenSettingsModal';
import LanguageSettingsModal from './LanguageSettingsModal';
import SaveImageFileNameModal from './SaveImageFileNameModal';
import LikeButtonSettingsModal from './LikeButtonSettingsModal';
import ReadingDirectionSettingsModal from './ReadingDirectionSettingsModal';
import SignUpModal from './SignUpModal';

const MODAL_COMPONENTS = {
  FOLLOW: FollowModal,
  BOOKMARK_ILLUST: BookmarkIllustModal,
  BOOKMARK_NOVEL: BookmarkNovelModal,
  NOVEL_SETTINGS: NovelSettingsModal,
  INITIAL_SCREEN_SETTINGS: InitialScreenSettingsModal,
  LANGUAGE_SETTINGS: LanguageSettingsModal,
  SAVE_IMAGE_FILE_NAME_FORMAT: SaveImageFileNameModal,
  LIKE_BUTTON_SETTINGS: LikeButtonSettingsModal,
  READING_DIRECTION_SETTINGS: ReadingDirectionSettingsModal,
  SIGNUP: SignUpModal,
};

const ModalRoot = ({ modal: { modalType, modalProps } }) => {
  if (!modalType) {
    return null;
  }
  const SpecificModal = MODAL_COMPONENTS[modalType];
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <SpecificModal {...modalProps} />;
};

export default connect((state) => ({
  modal: state.modal,
}))(ModalRoot);
