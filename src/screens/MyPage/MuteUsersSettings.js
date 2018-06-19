import React, { Component } from 'react';
import { View, FlatList, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { List, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connectLocalization } from '../../components/Localization';
import PXTouchable from '../../components/PXTouchable';
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
      rightIcon={
        <PXTouchable
          hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
          onPress={() => this.handleOnPressRemoveMuteUser(item.id)}
        >
          <Icon name="times" size={28} color="#bdc6cf" />
        </PXTouchable>
      }
      onPress={() => this.handleOnPressUser(item.id)}
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
