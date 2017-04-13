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
import TrendingIllustTags from './TrendingIllustTags';
import RecommendedUser from './RecommendedUser';
import Header from '../components/Header';
import PXSearchBar from '../components/PXSearchBar';
import Search2 from './Search2';
import { setSearchType, SearchType } from '../common/actions/searchType';
import { SearchBar } from 'react-native-elements'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

const onPressBackButton = (navigation) => {
  const { setParams, goBack, state }  = navigation;
  const { isFocusSearchBar } = state.params;
  if (isFocusSearchBar) {
    console.log('trending on press back button')
    Keyboard.dismiss();
    setParams({
      isFocusSearchBar: false,
      word: null
    });
  }
  else {
    goBack();
  }
}


const handleOnChangeSearchText = (setParams) => (word, searchType) => {
  setParams({ word });
}

/*const SearchBar = ({ navigation, text }) => (
  <PXSearchBar 
    ref='searchBar'
    textInputRef='email'
    enableBack={true} 
    onFocus={() => navigation.setParams({
      isFocusSearchBar: true
    })}
    onChangeText={handleOnChangeSearchText(setParams)}
    searchType={SearchType.ILLUST}
    navigation={navigation}
    isPushNewSearch={true}
  />
)
const MyConnectedTitle = connect(storeState => ({ text: storeState.title }))(MyTitle);*/

class Trending extends Component {
  static navigationOptions = {
    header: (navigation, defaultHeader) => {
      const { state, setParams, navigate } = navigation;
      const isRenderBackButton = (state.params && state.params.isFocusSearchBar);
      return {
        ...defaultHeader,
        left: isRenderBackButton ? (
          <BackButton onPress={() => onPressBackButton(navigation)} />
        ) : null,
        title: (
          <PXSearchBar 
            ref='searchBar'
            textInputRef='email'
            enableBack={true} 
            onFocus={() => setParams({
              isFocusSearchBar: true
            })}
            onChangeText={handleOnChangeSearchText(setParams)}
            searchType={SearchType.ILLUST}
            navigation={navigation}
            isPushNewSearch={true}
            word={state.params && state.params.word}
            isRenderBackButton={isRenderBackButton}
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
    const { searchType, navigation, screenProps } = this.props;
    const { params } = navigation.state;
    return (
      <View style={styles.container}>
        <ScrollableTabView 
          onChangeTab={this.handleOnChangeTab}
        >
          <TrendingIllustTags 
            tabLabel="Illust/Manga" 
            navigation={navigation} 
            screenProps={screenProps} 
          />
          <RecommendedUser 
            tabLabel="User" 
            navigation={navigation}
            screenProps={screenProps}
          />
        </ScrollableTabView>
        { 
          params && params.isFocusSearchBar &&
          <Search2 
            word={params.word}
            navigation={navigation} 
            isPushNewSearch={true} 
            searchType={searchType} 
          />
        }
      </View>
    );
  }
}

export default connect((state, props) => {
  return {
    searchType: state.searchType.type,
  }
}, { setSearchType })(Trending);