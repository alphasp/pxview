import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { DefaultRenderer, Actions } from 'react-native-router-flux';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import PXTouchable from '../components/PXTouchable';
import PXImage from '../components/PXImage';
import TrendingIllustTag from './TrendingIllustTag';
import RecommendedUser from './RecommendedUser';
import Header from '../components/Header';
import PXSearchBar from '../components/PXSearchBar';
import { setSearchType, SearchType } from '../common/actions/searchType';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

class Trending extends Component {
  // <SearchBar 
  //   onFocus={this.handleOnSearchFieldFocus}  
  //   isRenderPlaceHolder={true}
  // />

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
    const { navigate } = this.props.navigation;
    navigate('Login');
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container} >
        <PXSearchBar 
          onFocus={this.handleOnSearchFieldFocus}  
          isRenderFullHeader={true} 
        />
        <ScrollableTabView 
          onChangeTab={this.handleOnChangeTab}
        >
          <TrendingIllustTag tabLabel="Illust/Manga" navigation={navigation} />
          <RecommendedUser tabLabel="User" navigation={navigation} />
        </ScrollableTabView>
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