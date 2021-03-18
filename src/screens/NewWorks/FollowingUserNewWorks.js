import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { withTheme, Button } from 'react-native-paper';
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
      isOpenIllustFilterModal: false,
      isOpenNovelFilterModal: false,
      illustFilterOptions: {
        restrict: 'all',
      },
      novelFilterOptions: {
        restrict: 'all',
      },
    };
  }

  handleOnPressPill = (index) => {
    this.setState({ index });
  };

  handleOnPressFilterButton = () => {
    const { index } = this.state;
    if (index === 0) {
      this.handleOnPressIllustFilterButton();
    } else {
      this.handleOnPressNovelFilterButton();
    }
  };

  handleOnPressIllustFilterButton = () => {
    this.setState({
      isOpenIllustFilterModal: true,
    });
  };

  handleOnPressCloseIllustFilterButton = () => {
    this.setState({
      isOpenIllustFilterModal: false,
    });
  };

  handleOnSelectIllustVisibility = (visibility) => {
    this.setState({
      isOpenIllustFilterModal: false,
      illustFilterOptions: {
        restrict: visibility,
      },
    });
  };

  handleOnPressNovelFilterButton = () => {
    this.setState({
      isOpenNovelFilterModal: true,
    });
  };

  handleOnPressCloseNovelFilterButton = () => {
    this.setState({
      isOpenNovelFilterModal: false,
    });
  };

  handleOnSelectNovelVisibility = (visibility) => {
    this.setState({
      isOpenNovelFilterModal: false,
      novelFilterOptions: {
        restrict: visibility,
      },
    });
  };

  handleOnPressFindRecommendedUsers = () => {
    const {
      navigation: { push },
    } = this.props;
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
            mode="contained"
            onPress={this.handleOnPressFindRecommendedUsers}
          >
            {i18n.recommendedUsersFind}
          </Button>
        }
      />
    );
  };

  render() {
    const { active, navigation } = this.props;
    const {
      index,
      isOpenIllustFilterModal,
      isOpenNovelFilterModal,
      illustFilterOptions,
      novelFilterOptions,
    } = this.state;
    return (
      <View style={globalStyles.container}>
        {index === 0 ? (
          <FollowingUserIllusts
            renderEmpty={this.renderEmpty}
            renderHeader={this.renderHeader}
            navigation={navigation}
            active={active}
            options={illustFilterOptions}
          />
        ) : (
          <FollowingUserNovels
            renderEmpty={this.renderEmpty}
            renderHeader={this.renderHeader}
            navigation={navigation}
            active={active}
            options={novelFilterOptions}
          />
        )}
        <VisibilityFilterModal
          isOpen={isOpenIllustFilterModal}
          onPressCloseButton={this.handleOnPressCloseIllustFilterButton}
          onSelectVisibility={this.handleOnSelectIllustVisibility}
          visibility={illustFilterOptions.restrict}
        />
        <VisibilityFilterModal
          isOpen={isOpenNovelFilterModal}
          onPressCloseButton={this.handleOnPressCloseNovelFilterButton}
          onSelectVisibility={this.handleOnSelectNovelVisibility}
          visibility={novelFilterOptions.restrict}
        />
      </View>
    );
  }
}

export default withTheme(connectLocalization(FollowingUserNewWorks));
