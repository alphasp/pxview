import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Modal,
  Switch,
} from 'react-native';
import { connect } from 'react-redux';
import { MaterialDialog } from 'react-native-material-dialog';
import { Dropdown } from 'react-native-material-dropdown';
import { connectLocalization } from '../components/Localization';
import {
  SAVE_FILE_NAME_USER_FOLDER_FORMAT,
  SAVE_FILE_NAME_FORMAT,
} from '../common/constants';
import * as modalActionCreators from '../common/actions/modal';
import * as saveImageSettingsActionCreators from '../common/actions/saveImageSettings';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  dropDownContainer: {
    flex: 1,
  },
  slashContainer: {
    marginTop: 15,
    marginRight: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  form: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

class SaveImageFileNameModal extends Component {
  constructor(props) {
    super(props);
    const { userFolderName, fileName } = props;
    this.state = {
      isCreateFolderForUser: !!userFolderName,
      selectedFileNameUserFolder:
        userFolderName || SAVE_FILE_NAME_USER_FOLDER_FORMAT.USER_ID,
      selectedFileNameWork: fileName,
    };
  }

  handleOnModalClose = () => {
    const { closeModal } = this.props;
    closeModal();
  };

  handleOnPressOkButton = () => {
    const { setSettings } = this.props;
    const {
      isCreateFolderForUser,
      selectedFileNameUserFolder,
      selectedFileNameWork,
    } = this.state;
    setSettings({
      userFolderName: isCreateFolderForUser ? selectedFileNameUserFolder : null,
      fileName: selectedFileNameWork,
    });
    this.handleOnModalClose();
  };

  handleOnChangeIsCreateFolderForUser = value => {
    this.setState({
      isCreateFolderForUser: value,
    });
  };

  mapUserFolderNameFormatLabel = value => {
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

  mapImageFileNameFormatLabel = value => {
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

  getUserFolderNameFormatList = () =>
    Object.keys(SAVE_FILE_NAME_USER_FOLDER_FORMAT).map(key => ({
      value: SAVE_FILE_NAME_USER_FOLDER_FORMAT[key],
      label: this.mapUserFolderNameFormatLabel(
        SAVE_FILE_NAME_USER_FOLDER_FORMAT[key],
      ),
    }));

  getFileNameFormatList = () =>
    Object.keys(SAVE_FILE_NAME_FORMAT).map(key => ({
      value: SAVE_FILE_NAME_FORMAT[key],
      label: this.mapImageFileNameFormatLabel(SAVE_FILE_NAME_FORMAT[key]),
    }));

  handleOnChangeUserFolderName = value => {
    this.setState({
      selectedFileNameUserFolder: value,
    });
  };

  handleOnChangeFileName = value => {
    this.setState({
      selectedFileNameWork: value,
    });
  };

  render() {
    const { i18n } = this.props;
    const {
      selectedFileNameUserFolder,
      selectedFileNameWork,
      isCreateFolderForUser,
    } = this.state;
    return (
      <MaterialDialog
        title={i18n.saveImageFileName}
        addPadding={false}
        okLabel={i18n.ok}
        cancelLabel={i18n.cancel}
        onOk={this.handleOnPressOkButton}
        onCancel={this.handleOnModalClose}
      >
        <View style={styles.container}>
          <View style={styles.row}>
            <Text>
              {i18n.saveImageCreateFolderForUser}
            </Text>
            <Switch
              value={isCreateFolderForUser}
              onValueChange={this.handleOnChangeIsCreateFolderForUser}
            />
          </View>
          <View style={styles.form}>
            {isCreateFolderForUser &&
              <View style={styles.dropDownContainer}>
                <Dropdown
                  label={i18n.saveImageUserFolderName}
                  data={this.getUserFolderNameFormatList()}
                  value={selectedFileNameUserFolder}
                  onChangeText={this.handleOnChangeUserFolderName}
                />
              </View>}
            {isCreateFolderForUser &&
              <View style={styles.slashContainer}>
                <Text>/</Text>
              </View>}
            <View style={styles.dropDownContainer}>
              <Dropdown
                label={i18n.saveImageFileName}
                data={this.getFileNameFormatList()}
                value={selectedFileNameWork}
                onChangeText={this.handleOnChangeFileName}
              />
            </View>
          </View>
        </View>
      </MaterialDialog>
    );
  }
}

export default connectLocalization(
  connect(null, {
    ...modalActionCreators,
    ...saveImageSettingsActionCreators,
  })(SaveImageFileNameModal),
);
