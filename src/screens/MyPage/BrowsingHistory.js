import React, { Component } from 'react';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import IllustList from '../../components/IllustList';
import PXTouchable from '../../components/PXTouchable';
import * as browsingHistoryActionCreators
  from '../../common/actions/browsingHistory';
import { getBrowsingHistoryItems } from '../../common/selectors';

class BrowsingHistory extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      headerRight: params &&
        params.clearBrowsingHistory &&
        <PXTouchable onPress={params.clearBrowsingHistory}>
          <Icon
            name="trash"
            size={20}
            style={{ paddingVertical: 10, paddingHorizontal: 20 }}
          />
        </PXTouchable>,
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
    const { browsingHistory, items } = this.props;
    return <IllustList data={{ ...browsingHistory, items }} />;
  }
}

export default connect((state, props) => {
  const { browsingHistory } = state;
  return {
    browsingHistory,
    items: getBrowsingHistoryItems(state, props),
  };
}, browsingHistoryActionCreators)(BrowsingHistory);
