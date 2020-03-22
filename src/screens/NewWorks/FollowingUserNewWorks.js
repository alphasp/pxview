import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { withTheme } from 'react-native-paper';
import { Button } from 'react-native-elements';
import FollowingUserIllusts from './FollowingUserIllusts';
import FollowingUserNovels from './FollowingUserNovels';
import { connectLocalization } from '../../components/Localization';
import Pills from '../../components/Pills';
import HeaderFilterButton from '../../components/HeaderFilterButton';
import VisibilityFilterModal from '../../components/VisibilityFilterModal';
import EmptyStateView from '../../components/EmptyStateView';
import { SCREENS } from '../../common/constants';
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
      isOpenFilterModal: false,
      options: {
        restrict: 'all',
      },
    };
  }

  handleOnPressPill = (index) => {
    this.setState({ index });
  };

  handleOnPressFilterButton = () => {
    this.setState({
      isOpenFilterModal: true,
    });
  };

  handleOnPressCloseFilterButton = () => {
    this.setState({
      isOpenFilterModal: false,
    });
  };

  handleOnSelectVisibility = (visibility) => {
    this.setState({
      isOpenFilterModal: false,
      options: {
        restrict: visibility,
      },
    });
  };

  handleOnPressFindRecommendedUsers = () => {
    const { push } = this.props.navigation;
    push(SCREENS.RecommendedUsers);
  };

  renderPillFilterButton = () => {
    const { theme } = this.props;
    return (
      <View style={styles.pillFilterButton}>
        <HeaderFilterButton
          color={theme.dark ? '#fff' : globalStyleVariables.PRIMARY_COLOR}
          onPress={this.handleOnPressFilterButton}
        />
      </View>
    );
  };

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
    const { navigation, route } = this.props;
    const { index, isOpenFilterModal, options } = this.state;
    return (
      <View style={globalStyles.container}>
        {index === 0 ? (
          <FollowingUserIllusts
            navigation={navigation}
            route={route}
            renderEmpty={this.renderEmpty}
            renderHeader={this.renderHeader}
            options={options}
          />
        ) : (
          <FollowingUserNovels
            navigation={navigation}
            route={route}
            renderEmpty={this.renderEmpty}
            renderHeader={this.renderHeader}
            options={options}
          />
        )}
        <VisibilityFilterModal
          isOpen={isOpenFilterModal}
          onPressCloseButton={this.handleOnPressCloseFilterButton}
          onSelectVisibility={this.handleOnSelectVisibility}
          visibility={options.restrict}
        />
      </View>
    );
  }
}

export default withTheme(connectLocalization(FollowingUserNewWorks));
