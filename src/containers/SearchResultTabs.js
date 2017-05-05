import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Keyboard,
  Platform,
  BackHandler,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Search from './Search';
import PXHeader from '../components/PXHeader';
import PXTabView from '../components/PXTabView';
import PXTouchable from '../components/PXTouchable';
import SearchResult from './SearchResult';
import SearchUsersResult from './SearchUsersResult';
import { setSearchType, SearchType } from '../common/actions/searchType';
import { clearSearchAutoComplete } from '../common/actions/searchAutoComplete';
import {
  clearSearchUserAutoComplete,
} from '../common/actions/searchUsersAutoComplete';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

class SearchResultTabs extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    const { searchType, word } = props;
    this.state = {
      // initSearchType: searchType,
      index: searchType === SearchType.USER ? 1 : 0,
      routes: [
        { key: '1', title: 'Illust/Manga' },
        { key: '2', title: 'User' },
      ],
      isFocusSearchBar: false,
      newWord: word,
      searchOptions: {},
    };
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      this.backHandlerListener = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleOnPressHardwareBackButton,
      );
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
    if (this.backHandlerListener) {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.backHandlerListener,
      );
    }
  }

  handleChangeTab = index => {
    const { setSearchType } = this.props;
    if (index === 1) {
      setSearchType(SearchType.USER);
    } else {
      setSearchType(SearchType.ILLUST);
    }
  };

  handleOnFocusSearchBar = () => {
    this.setState({ isFocusSearchBar: true });
  };

  handleOnChangeSearchText = word => {
    this.setState({ newWord: word });
  };

  handleOnPressShowFilterModal = () => {
    const { navigate, goBack } = this.props.navigation;
    const { searchOptions } = this.state;
    navigate('SearchFilterModal', {
      searchFilter: searchOptions || {},
      onPressApplyFilter: (target, duration, sort) => {
        goBack(null);
        // setTimeout(() => setParams({
        //   searchOptions: {
        //     duration,
        //     target,
        //     sort
        //   },
        // }), 0);
        this.setState({
          searchOptions: {
            duration,
            target,
            sort,
          },
        });
      },
    });
  };

  handleOnPressBackButton = () => {
    const { word, navigation: { goBack } } = this.props;
    const { isFocusSearchBar } = this.state;
    if (isFocusSearchBar) {
      Keyboard.dismiss();
      this.setState({
        isFocusSearchBar: false,
        newWord: word,
      });
    } else {
      goBack();
    }
  };

  handleOnPressHardwareBackButton = () => {
    const { word } = this.props;
    const { isFocusSearchBar } = this.state;
    if (isFocusSearchBar) {
      Keyboard.dismiss();
      this.setState({
        isFocusSearchBar: false,
        newWord: word,
      });
    }
    return true;
  };

  handleOnSubmitSearch = word => {
    const { setParams } = this.props.navigation;
    Keyboard.dismiss();
    this.setState({
      isFocusSearchBar: false,
      newWord: word,
    });
    setParams({ word });
    return true;
  };

  renderScene = ({ route }) => {
    const { word, navigation, navigationStateKey } = this.props;
    const { searchOptions } = this.state;
    switch (route.key) {
      case '1':
        return (
          <SearchResult
            word={word}
            options={searchOptions}
            navigation={navigation}
            navigationStateKey={navigationStateKey}
          />
        );
      case '2':
        return (
          <SearchUsersResult
            word={word}
            navigation={navigation}
            navigationStateKey={navigationStateKey}
          />
        );
      default:
        return null;
    }
  };

  render() {
    const { searchType, navigationStateKey, navigation } = this.props;
    const { newWord, isFocusSearchBar } = this.state;
    return (
      <View style={styles.container}>
        <PXHeader
          word={newWord}
          navigation={navigation}
          showBackButton
          onFocusSearchBar={this.handleOnFocusSearchBar}
          onChangeSearchText={this.handleOnChangeSearchText}
          onPressBackButton={this.handleOnPressBackButton}
          onSubmitSearch={this.handleOnSubmitSearch}
          headerRight={
            <PXTouchable
              disabled={searchType === SearchType.USER}
              onPress={this.handleOnPressShowFilterModal}
            >
              <Icon
                name="sliders"
                size={20}
                color={searchType === SearchType.USER ? 'grey' : '#037aff'}
                style={{ padding: 10 }}
              />
            </PXTouchable>
          }
          searchType={searchType}
        />
        <View style={styles.content}>
          <PXTabView
            navigationState={{
              ...this.state,
              navigation,
              navigationStateKey,
            }}
            renderScene={this.renderScene}
            onRequestChangeTab={this.handleChangeTab}
          />
          {isFocusSearchBar &&
            <Search
              word={newWord}
              navigation={navigation}
              searchType={searchType}
              onSubmitSearch={this.handleOnSubmitSearch}
            />}
        </View>
      </View>
    );
  }
}

export default connect(
  (state, props) => ({
    searchType: state.searchType.type,
    word: props.navigation.state.params.word,
    navigationStateKey: props.navigation.state.key,
  }),
  { clearSearchAutoComplete, clearSearchUserAutoComplete, setSearchType },
)(SearchResultTabs);
