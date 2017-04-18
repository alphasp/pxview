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
import PXTabView from '../components/PXTabView';
import PXTouchable from '../components/PXTouchable';
import PXImage from '../components/PXImage';
import TrendingIllustTags from './TrendingIllustTags';
import RecommendedUsers from './RecommendedUsers';
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

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: '1', title: 'Illust/Manga' },
        { key: '2', title: 'User' },
      ],
    }
  }

  handleChangeTab = (index) => {
    const { setSearchType } = this.props;
    if (index === 1) {
      setSearchType(SearchType.USER);
    }
    else {
      setSearchType(SearchType.ILLUST);
    }
    this.setState({ index });
  };

  renderScene = ({ route }) => {
    const { navigation, screenProps } = this.props;
    switch (route.key) {
      case '1':
        return <TrendingIllustTags navigation={navigation} screenProps={screenProps} />
      case '2':
        return <RecommendedUsers navigation={navigation} screenProps={screenProps} />     
      default:
        return null;
    };
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
        <PXTabView
          navigationState={this.state}
          renderScene={this.renderScene}
          onRequestChangeTab={this.handleChangeTab}
        />
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