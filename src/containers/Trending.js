import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { DefaultRenderer, Actions } from 'react-native-router-flux';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import PXTouchable from '../components/PXTouchable';
import PXImage from '../components/PXImage';
import TrendingIllustTag from './TrendingIllustTag';
import RecommendedUser from './RecommendedUser';
import Header from '../components/Header';
import { setSearchType, SearchType } from '../common/actions/searchType';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

class Trending extends Component {
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
  render() {
    return (
      <View style={styles.container} >
        <ScrollableTabView 
          onChangeTab={this.handleOnChangeTab}
          locked 
          scrollWithoutAnimation
        >
          <TrendingIllustTag tabLabel="Illust/Manga" />
          <RecommendedUser tabLabel="User" />
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

export default Trending