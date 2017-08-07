import React, { Component } from 'react';
import { connect } from 'react-redux';
import IllustList from '../../components/IllustList';
import HeaderClearButton from '../../components/HeaderClearButton';
import * as browsingHistoryActionCreators from '../../common/actions/browsingHistory';
import { getBrowsingHistoryItems } from '../../common/selectors';

class BrowsingHistory extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      headerRight:
        params &&
        params.clearBrowsingHistory &&
        <HeaderClearButton onPress={params.clearBrowsingHistory} />,
    };
  };

  componentDidMount() {
    const { clearBrowsingHistory, navigation } = this.props;
    const { setParams } = navigation;
    setParams({
      clearBrowsingHistory,
    });
  }

  render() {
    const { browsingHistory, items, listKey } = this.props;
    return (
      <IllustList data={{ ...browsingHistory, items }} listKey={listKey} />
    );
  }
}

export default connect((state, props) => {
  const { browsingHistory } = state;
  return {
    browsingHistory,
    items: getBrowsingHistoryItems(state, props),
    listKey: props.navigation.state.key,
  };
}, browsingHistoryActionCreators)(BrowsingHistory);
