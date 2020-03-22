import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { withTheme, Switch } from 'react-native-paper';
import { connectLocalization } from '../../components/Localization';
import PXListItem from '../../components/PXListItem';
import * as modalActionCreators from '../../common/actions/modal';
import * as saveImageSettingsActionCreators from '../../common/actions/saveImageSettings';
import {
  MODAL_TYPES,
  SAVE_FILE_NAME_USER_FOLDER_FORMAT,
  SAVE_FILE_NAME_FORMAT,
} from '../../common/constants';
import { globalStyles } from '../../styles';

class SaveImageSettings extends Component {
  constructor(props) {
    super(props);
    const { isCreateMangaFolder } = props;
    this.state = {
      isCreateMangaFolder:
        isCreateMangaFolder === null ? false : isCreateMangaFolder,
    };
  }

  handleOnPressSaveImageFileName = () => {
    const { openModal, userFolderName, fileName } = this.props;
    openModal(MODAL_TYPES.SAVE_IMAGE_FILE_NAME_FORMAT, {
      userFolderName,
      fileName,
    });
  };

  handleOnSwitchIsCreateMangaFolder = () => {
    const { setSettings } = this.props;
    const { isCreateMangaFolder } = this.state;
    this.setState({
      isCreateMangaFolder: !isCreateMangaFolder,
    });
    setSettings({
      isCreateMangaFolder: !isCreateMangaFolder,
    });
  };

  mapUserFolderNameFormatLabel = (value) => {
    const { i18n } = this.props;
    switch (value) {
      case SAVE_FILE_NAME_USER_FOLDER_FORMAT.USER_ID:
        return i18n.saveImageFolderNameUserId;
      case SAVE_FILE_NAME_USER_FOLDER_FORMAT.USER_NAME:
        return i18n.saveImageFolderNameUserName;
      case SAVE_FILE_NAME_USER_FOLDER_FORMAT.USER_ID_USER_NAME:
        return i18n.saveImageFolderNameUserIdUserName;
      default:
        return '';
    }
  };

  mapImageFileNameFormatLabel = (value) => {
    const { i18n } = this.props;
    switch (value) {
      case SAVE_FILE_NAME_FORMAT.WORK_ID:
        return i18n.saveImageNameWorkId;
      case SAVE_FILE_NAME_FORMAT.WORK_TITLE:
        return i18n.saveImageNameWorkTitle;
      case SAVE_FILE_NAME_FORMAT.WORK_ID_WORK_TITLE:
        return i18n.saveImageNameWorkIdWorkTitle;
      default:
        return '';
    }
  };

  getFileNameFormat = () => {
    const { userFolderName, fileName } = this.props;
    if (userFolderName) {
      return `${this.mapUserFolderNameFormatLabel(
        userFolderName,
      )}/${this.mapImageFileNameFormatLabel(fileName)}`;
    }
    return this.mapImageFileNameFormatLabel(fileName);
  };

  render() {
    const { i18n, theme } = this.props;
    const { isCreateMangaFolder } = this.state;
    return (
      <View
        style={[
          globalStyles.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <PXListItem
          title={i18n.saveImageFileName}
          description={this.getFileNameFormat()}
          onPress={this.handleOnPressSaveImageFileName}
        />
        <PXListItem
          title={i18n.saveImageCreateFolderForManga}
          right={() => (
            <Switch
              value={isCreateMangaFolder}
              onValueChange={this.handleOnSwitchIsCreateMangaFolder}
            />
          )}
        />
      </View>
    );
  }
}

export default withTheme(
  connectLocalization(
    connect(
      (state) => {
        const {
          userFolderName,
          fileName,
          isCreateMangaFolder,
        } = state.saveImageSettings;
        return {
          userFolderName,
          fileName,
          isCreateMangaFolder,
        };
      },
      { ...modalActionCreators, ...saveImageSettingsActionCreators },
    )(SaveImageSettings),
  ),
);
