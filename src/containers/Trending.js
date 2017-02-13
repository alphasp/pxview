import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Keyboard
} from 'react-native';
import { connect } from 'react-redux';
import { CardStack } from 'react-navigation';
const { BackButton } = CardStack.Header;
import ScrollableTabView from 'react-native-scrollable-tab-view';
import PXTouchable from '../components/PXTouchable';
import PXImage from '../components/PXImage';
import TrendingIllustTag from './TrendingIllustTag';
import RecommendedUser from './RecommendedUser';
import Header from '../components/Header';
import PXSearchBar from '../components/PXSearchBar';
import Search2 from './Search2';
import { setSearchType, SearchType } from '../common/actions/searchType';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

class Trending extends Component {
  static navigationOptions = {
    header: (navigation, defaultHeader) => {
      const { state, setParams, navigate, goBack, dispatch } = navigation;
      return {
        ...defaultHeader,
        title: (
          <PXSearchBar 
            enableBack={true} 
            onFocus={() => setParams({
              isFocusSearchBar: true
            })}
            searchType={SearchType.ILLUST}
            navigation={navigation}
            isPushNewSearch={true}
          />
        ),
        // titleStyle: {
        //   left: 0,
        //   right: 0,
        // },
      }
    }
  }

  handleOnChangeTab = ({ i, ref }) => {
    const { setSearchType } = this.props;
    const placeHolderText = (i === 1) ? "Enter nickname" : "Enter keyword";
    if (i === 1) {
      setSearchType(SearchType.USER);
    }
    else {
      setSearchType(SearchType.ILLUST);
    }
  }

  handleOnSearchFieldFocus = (searchType) => {
    console.log('on focus ', searchType);
    // Actions.search();
    const { navigate, setParams } = this.props.navigation;
    setParams({
      isFocusSearchBar: true
    });
  }

  render() {
    const { navigation } = this.props;
    const { params } = navigation.state;
    return (
      <View style={styles.container} >
        <ScrollableTabView 
          onChangeTab={this.handleOnChangeTab}
        >
          <TrendingIllustTag tabLabel="Illust/Manga" navigation={navigation} />
          <RecommendedUser tabLabel="User" navigation={navigation} />
        </ScrollableTabView>
        { 
          params && params.isFocusSearchBar &&
          <Search2 navigation={navigation} isPushNewSearch={true} />
        }
      </View>
    );
  }
}

export default connect(null, setSearchType)(Trending);