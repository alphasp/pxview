import React, { Component } from 'react';
import { connect } from 'react-redux';
import { connectLocalization } from '../components/Localization';
import SingleChoiceDialog from '../components/SingleChoiceDialog';
import * as modalActionCreators from '../common/actions/modal';
import * as initialScreenSettingsActionCreators from '../common/actions/initialScreenSettings';
import { SCREENS } from '../common/constants';

const screenList = [
  {
    id: SCREENS.Recommended,
  },
  {
    id: SCREENS.RankingPreview,
  },
  {
    id: SCREENS.Trending,
  },
  {
    id: SCREENS.NewWorks,
  },
];

class InitialScreenSettingsModal extends Component {
  mapScreenName = routeId => {
    const { i18n } = this.props;
    switch (routeId) {
      case SCREENS.Recommended:
        return i18n.recommended;
      case SCREENS.RankingPreview:
      case SCREENS.Ranking:
        return i18n.ranking;
      case SCREENS.Trending:
        return i18n.search;
      case SCREENS.NewWorks:
        return i18n.newest;
      default:
        return '';
    }
  };

  mapItemsOptions = items =>
    items.map(item => ({ value: item.id, label: this.mapScreenName(item.id) }));

  handleOnCancelPickerDialog = () => {
    const { closeModal } = this.props;
    closeModal();
  };

  handleOnOkPickerDialog = value => {
    const { setInitialRoute } = this.props;
    setInitialRoute(value);
    this.handleOnCancelPickerDialog();
  };

  render() {
    const { i18n, initialScreenId } = this.props;
    return (
      <SingleChoiceDialog
        visible
        title={i18n.initialScreenSettings}
        items={this.mapItemsOptions(screenList)}
        selectedItemValue={initialScreenId}
        onPressOk={this.handleOnOkPickerDialog}
        onPressCancel={this.handleOnCancelPickerDialog}
      />
    );
  }
}

export default connectLocalization(
  connect(
    null,
    {
      ...modalActionCreators,
      ...initialScreenSettingsActionCreators,
    },
  )(InitialScreenSettingsModal),
);
