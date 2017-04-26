import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Keyboard,
  Platform,
  BackAndroid
} from 'react-native';
import { connect } from 'react-redux';
import { CardStack } from 'react-navigation';
//import { HeaderBackButton } from 'react-navigation';
import HeaderBackButton from 'react-navigation/src/views/HeaderBackButton';
// const { BackButton } = CardStack.Header;
import PXTabView from '../components/PXTabView';
import PXTouchable from '../components/PXTouchable';
import PXImage from '../components/PXImage';
import TrendingIllustTags from './TrendingIllustTags';
import RecommendedUsers from './RecommendedUsers';
import Header from '../components/Header';
import PXHeader from '../components/PXHeader';
import PXSearchBar from '../components/PXSearchBar';
import Search2 from './Search2';
import { setSearchType, SearchType } from '../common/actions/searchType';
import { SearchBar } from 'react-native-elements'

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1
  }
});

class Trending extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: '1', title: 'Illust/Manga' },
        { key: '2', title: 'User' },
      ],
      isFocusSearchBar: false,
      word: null
    }
  }

  componentDidMount() {
    if (Platform.OS == 'android') {
      this.backAndroidListener = BackAndroid.addEventListener('hardwareBackPress', this.handleOnPressBackButton);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { searchType: prevSearchType } = this.props;
    const { searchType } = nextProps;
    if (searchType !== prevSearchType) {
      this.setState({ index: searchType === SearchType.USER ? 1 : 0 });
    }
  }

  componentWillUnmount() {
    if (this.backAndroidListener) {
      BackAndroid.removeEventListener('hardwareBackPress', this.backAndroidListener);
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
  
  handleOnFocusSearchBar = () => {
    this.setState({ isFocusSearchBar: true });
  }

  handleOnChangeSearchText = (word, searchType) => {
    this.setState({ word });
  }

  handleOnPressBackButton = () => {
    const { goBack }  = this.props.navigation;
    const { isFocusSearchBar } = this.state;
    if (isFocusSearchBar) {
      Keyboard.dismiss();
      this.setState({
        isFocusSearchBar: false,
        word: null
      });
      //to disable goBack from react-navigation
      return true;
    }
    else {
      goBack();
    }
  }

  render() {
    const { searchType, navigation, screenProps } = this.props;
    const { word, isFocusSearchBar } = this.state;
    return (
      <View style={styles.container}>
        <PXHeader 
          word={word}
          navigation={navigation} 
          showBackButton={isFocusSearchBar}
          searchType={searchType}
          isPushNewSearch={true}
          onFocusSearchBar={this.handleOnFocusSearchBar}
          onChangeSearchText={this.handleOnChangeSearchText}
          onPressBackButton={this.handleOnPressBackButton}
          onSubmitSearch={this.handleOnPressBackButton}
        />
        <View style={styles.content}>
          <PXTabView
            navigationState={this.state}
            renderScene={this.renderScene}
            onRequestChangeTab={this.handleChangeTab}
          />
          { 
            isFocusSearchBar &&
            <Search2 
              word={word}
              navigation={navigation} 
              isPushNewSearch={true} 
              searchType={searchType} 
              onSubmitSearch={this.handleOnPressBackButton}
            />
          }
        </View>
      </View>
    );
  }
}

export default connect((state, props) => {
  return {
    searchType: state.searchType.type,
  }
}, { setSearchType })(Trending);