import React, { Component } from 'react';
import { View, FlatList, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { List, ListItem } from 'react-native-elements';
import { connectLocalization } from '../../components/Localization';
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
    const { navigate } = this.props.navigation;
    navigate(SCREENS.UserDetail, { userId });
  };

  showToast = message => {
    DeviceEventEmitter.emit('showToast', message);
  };

  renderItem = ({ item }) =>
    <ListItem
      title={item.name}
      roundAvatar
      avatar={{
        uri: item.profile_image_urls.medium,
        headers: {
          referer: 'http://www.pixiv.net',
        },
      }}
      rightIcon={{ name: 'times', type: 'font-awesome' }}
      onPress={() => this.handleOnPressUser(item.id)}
      onPressRightIcon={() => this.handleOnPressRemoveMuteUser(item.id)}
    />;

  render() {
    const { i18n, items } = this.props;
    return (
      <View style={globalStyles.container}>
        {items.length
          ? <List>
              <FlatList
                data={items}
                keyExtractor={item => item.id.toString()}
                renderItem={this.renderItem}
              />
            </List>
          : <EmptyStateView
              iconName="user-times"
              iconType="font-awesome"
              title={i18n.noMuteUser}
            />}
      </View>
    );
  }
}

export default connectLocalization(
  connect(
    state => ({
      items: getMuteUsersItems(state),
    }),
    muteUsersActionCreators,
  )(MuteUsersSettings),
);
