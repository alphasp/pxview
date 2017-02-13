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
    header: (props, defaultHeader) => {
      const { state, setParams, navigate, goBack, dispatch } = props;
      return {
        ...defaultHeader,
        title: (
          <PXSearchBar 
            enableBack={true} 
            onFocus={() => setParams({
              isFocusSearchBar: true
            })}
            searchType={SearchType.ILLUST}
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
    const { dispatch } = this.props;
    const placeHolderText = (i === 1) ? "Enter nickname" : "Enter keyword";
    if (i === 1) {
      dispatch(setSearchType(SearchType.USER));
    }
    else {
      dispatch(setSearchType(SearchType.ILLUST));
    }
  }

  handleOnSearchFieldFocus = (searchType) => {
    console.log('on focus ', searchType);
    // Actions.search();
    const { navigate, setParams } = this.props.navigation;
    navigate('Login');
    setParams({
      isFocusSearchBar: true
    });
  }

  handleOnSubmitSearch = (word) => {
    word = word.trim();
    if (word) {
      const { navigation: { navigate, setParams }, searchType } = this.props;
      if (searchType === SearchType.USER) {
        // Actions.searchUserResult({ word: word, type: ActionConst.REPLACE });
      }
      else {
        // Keyboard.dismiss();
        // setParams({
        //   isFocusSearchBar: false,
        //   word
        // });
        navigate('SearchResult', { word });
        setTimeout(() => {
          setParams({
            isFocusSearchBar: false,
            word
          });
        }, 0);
        // setTimeout(() => navigate('SearchResult', { word }), 0)
        //Actions.searchResult({ word: word, type: ActionConst.REPLACE });
      }
    }
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
          <Search2 navigation={navigation} onSubmitSearch={this.handleOnSubmitSearch} />
        }
      </View>
    )
        //     <ScrollableTabView 
        //   onChangeTab={this.handleOnChangeTab}
        //   locked 
        //   scrollWithoutAnimation
        // >
        //   <TrendingIllustTag tabLabel="Illust/Manga" />
        //   <RecommendedUser tabLabel="User" />
        // </ScrollableTabView>
    // return (
    //   <View>
    //     <View style={styles.container}>
    //       <Text>gg {this.props.test}</Text>
    //     </View>
    //   </View>
    // )
    // return (
    //   <View style={styles.container}>
    //     <Text style={styles.welcome}>
    //       Search page
    //     </Text>
    //     <PXTouchable onPress={ this.onPress }>
    //       <View>
    //         <Text>press me</Text>
    //       </View>
    //     </PXTouchable>
    //   </View>
    // );
    // return (
    //   <Container>
    //     <Header searchBar rounded>
    //       <InputGroup>
    //           <Icon name='ios-search' />
    //           <Input placeholder='Search' />
    //           <Icon name='ios-people' />
    //       </InputGroup>
    //       <Button transparent>
    //           Search
    //       </Button>
    //     </Header>
    //   </Container>
    // )
  }
}

export default connect()(Trending);