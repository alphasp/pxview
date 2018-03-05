import React, { Component } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import RankingHorizontalList from './RankingHorizontalList';
import NovelRankingPreview from './NovelRankingPreview';
import { connectLocalization } from '../../components/Localization';
import Loader from '../../components/Loader';
import { RANKING_TYPES, RANKING_FOR_UI } from '../../common/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
});

class RankingPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      // didFocus: false,
    };
  }

  // componentDidMount() {
  //   // this.willFocusListener = this.props.navigation.addListener(
  //   //   'willFocus',
  //   //   this.onWillFocus,
  //   // );
  //   this.didFocusListener = this.props.navigation.addListener(
  //     'didFocus',
  //     this.onDidFocus,
  //   );
  //   // this.willBlurListener = this.props.navigation.addListener(
  //   //   'willBlur',
  //   //   this.onWillBlur,
  //   // );
  //   // this.didBlurListerner = this.props.navigation.addListener(
  //   //   'didBlur',
  //   //   this.onDidBlur,
  //   // );
  // }

  // componentWillUnmount() {
  //   // this.willFocusListener.remove();
  //   this.didFocusListener.remove();
  //   // this.willBlurListener.remove();
  //   // this.didBlurListerner.remove();
  // }

  // // onWillFocus = a => {
  // //   console.log('willFocus ', a);
  // // };

  // onDidFocus = a => {
  //   console.log('didFocus ', a);
  //   this.setState({
  //     didFocus: true,
  //   });
  // };

  // // onWillBlur = a => {
  // //   console.log('willBlur ', a);
  // // };
  // // onDidBlur = a => {
  // //   console.log('didBlur ', a);
  // // };

  handleOnRefresh = () => {
    this.setState({
      refreshing: true,
    });
  };

  handleOnRefreshSuccess = () => {
    this.setState({
      refreshing: false,
    });
  };

  render() {
    const { navigation } = this.props;
    const { refreshing } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.handleOnRefresh}
            />
          }
        >
          <RankingHorizontalList
            rankingMode={RANKING_FOR_UI.DAILY_ILLUST}
            rankingType={RANKING_TYPES.ILLUST}
            navigation={navigation}
            refreshing={refreshing}
            onRefreshSuccess={this.handleOnRefreshSuccess}
          />
          <RankingHorizontalList
            rankingMode={RANKING_FOR_UI.DAILY_MANGA}
            rankingType={RANKING_TYPES.MANGA}
            navigation={navigation}
            refreshing={refreshing}
          />
          <NovelRankingPreview
            rankingMode={RANKING_FOR_UI.DAILY_NOVEL}
            navigation={navigation}
            refreshing={refreshing}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default connectLocalization(RankingPreview);
