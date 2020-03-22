import React, { Component } from 'react';
import { connect } from 'react-redux';
import { connectLocalization } from '../components/Localization';
import SingleChoiceDialog from '../components/SingleChoiceDialog';
import * as modalActionCreators from '../common/actions/modal';
import * as i18nActionCreators from '../common/actions/i18n';

const languageList = [
  {
    id: 'en',
    title: 'English',
  },
  {
    id: 'ja',
    title: '日本語',
  },
  {
    id: 'zh',
    title: '中文(简体)',
  },
  {
    id: 'zh-TW',
    title: '中文(繁體)',
  },
];
class LanguageSettingsModal extends Component {
  mapItemsOptions = (items) =>
    items.map((item) => ({ value: item.id, label: item.title }));

  mapSelectedValue = (lang) => {
    if (['zh', 'zh-CN', 'zh-SG'].includes(lang)) {
      return 'zh';
    }
    if (['zh-TW', 'zh-HK', 'zh-MO'].includes(lang)) {
      return 'zh-TW';
    }
    return lang;
  };

  handleOnCancelPickerDialog = () => {
    const { closeModal } = this.props;
    closeModal();
  };

  handleOnOkPickerDialog = (value) => {
    const { setLanguage } = this.props;
    setLanguage(value);
    this.handleOnCancelPickerDialog();
  };

  render() {
    const { i18n, lang } = this.props;
    return (
      <SingleChoiceDialog
        visible
        title={i18n.lang}
        items={this.mapItemsOptions(languageList)}
        selectedItemValue={this.mapSelectedValue(lang)}
        onPressOk={this.handleOnOkPickerDialog}
        onPressCancel={this.handleOnCancelPickerDialog}
      />
    );
  }
}

export default connectLocalization(
  connect(null, {
    ...modalActionCreators,
    ...i18nActionCreators,
  })(LanguageSettingsModal),
);
