import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import PXTouchable from '../components/PXTouchable';
import PXImage from '../components/PXImage';
import TrendingIllustTag from './TrendingIllustTag';
import RecommendedUser from './RecommendedUser';
import Header from '../components/Header';
//import { Container, Header, InputGroup, Input, Icon, Button } from 'native-base';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

class Trending extends Component {
  // static renderNavigationBar(props) {
  //   return (
  //     <Header>
  //       <SearchBar />
  //     </Header>
  //   );
  // }
  // onPress = () => {
  //   console.log("press")
  //   const { router } = this.props;
  //   //router.push('/temp/');
  //   Actions.temp();
  // }

  render() {
    return (
      <View style={styles.container} >
        <ScrollableTabView locked scrollWithoutAnimation>
          <TrendingIllustTag tabLabel="Illust/Manga" />
          <RecommendedUser tabLabel="User" />
        </ScrollableTabView>
      </View>
    )
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