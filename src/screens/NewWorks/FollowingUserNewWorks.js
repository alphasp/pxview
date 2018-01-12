import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import FollowingUserIllusts from './FollowingUserIllusts';
import FollowingUserNovels from './FollowingUserNovels';
import { connectLocalization } from '../../components/Localization';
import Pills from '../../components/Pills';
import HeaderFilterButton from '../../components/HeaderFilterButton';
import EmptyStateView from '../../components/EmptyStateView';
import { globalStyles, globalStyleVariables } from '../../styles';

const styles = StyleSheet.create({
  pills: {
    padding: 10,
  },
  pillFilterButton: {
    position: 'absolute',
    right: 0,
  },
});

class FollowingUserNewWorks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      pillFilterType: 'all',
    };
  }

  handleOnPressPill = index => {
    this.setState({ index });
  };

  renderPillFilterButton = () =>
    <View style={styles.pillFilterButton}>
      <HeaderFilterButton
        color={globalStyleVariables.PRIMARY_COLOR}
        onPress={this.handleOnPressPillFilterButton}
      />
    </View>;

  renderHeader = () => {
    const { i18n } = this.props;
    const { index } = this.state;
    return (
      <Pills
        items={[
          {
            title: i18n.illustManga,
          },
          {
            title: i18n.novel,
          },
        ]}
        renderRightButton={this.renderPillFilterButton}
        onPressItem={this.handleOnPressPill}
        selectedIndex={index}
        style={styles.pills}
      />
    );
  };

  renderEmpty = () => {
    const { i18n } = this.props;
    return (
      <EmptyStateView
        iconName="users"
        iconType="font-awesome"
        title={i18n.noFollowUser}
        description={i18n.noNewWorkFollowSuggestion}
        actionButton={
          <Button
            title={i18n.recommendedUsersFind}
            backgroundColor={globalStyleVariables.PRIMARY_COLOR}
            onPress={this.handleOnPressFindRecommendedUsers}
            raised
          />
        }
      />
    );
  };

  render() {
    const { navigation } = this.props;
    const { index } = this.state;
    return (
      <View style={globalStyles.container}>
        {index === 0
          ? <FollowingUserIllusts
              navigation={navigation}
              renderEmpty={this.renderEmpty}
              renderHeader={this.renderHeader}
            />
          : <FollowingUserNovels
              navigation={navigation}
              renderEmpty={this.renderEmpty}
              renderHeader={this.renderHeader}
            />}
      </View>
    );
  }
}

export default connectLocalization(FollowingUserNewWorks);
