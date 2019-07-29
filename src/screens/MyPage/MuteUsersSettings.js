import React, { Component } from 'react';
import { View, FlatList, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-paper';
import { connectLocalization } from '../../components/Localization';
import PXListItem from '../../components/PXListItem';
import PXListItemRemoveButton from '../../components/PXListItemRemoveButton';
import PXThumbnail from '../../components/PXThumbnail';
import EmptyStateView from '../../components/EmptyStateView';
import * as muteUsersActionCreators from '../../common/actions/muteUsers';
import { getMuteUsersItems } from '../../common/selectors';
import { SCREENS } from '../../common/constants';
import { globalStyles } from '../../styles';

class MuteUsersSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      word: null,
    };
  }

  handleOnPressRemoveMuteUser = userId => {
    const { removeMuteUser } = this.props;
    removeMuteUser(userId);
  };

  handleOnPressUser = userId => {
    const { push } = this.props.navigation;
    push(SCREENS.UserDetail, { userId });
  };

  showToast = message => {
    DeviceEventEmitter.emit('showToast', message);
  };

  renderItem = ({ item }) => (
    <PXListItem
      title={item.name}
      left={() => (
        <PXThumbnail uri={item.profile_image_urls.medium} size={40} />
      )}
      right={() => (
        <PXListItemRemoveButton
          onPress={() => this.handleOnPressRemoveMuteUser(item.id)}
        />
      )}
      onPress={() => this.handleOnPressUser(item.id)}
    />
  );

  render() {
    const { i18n, items, theme } = this.props;
    return (
      <View
        style={[
          globalStyles.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        {items.length ? (
          <FlatList
            data={items}
            keyExtractor={item => item.id.toString()}
            renderItem={this.renderItem}
          />
        ) : (
          <EmptyStateView
            iconName="user-times"
            iconType="font-awesome"
            title={i18n.noMuteUser}
          />
        )}
      </View>
    );
  }
}

export default withTheme(
  connectLocalization(
    connect(
      state => ({
        items: getMuteUsersItems(state),
      }),
      muteUsersActionCreators,
    )(MuteUsersSettings),
  ),
);
