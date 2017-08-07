import React, { Component } from 'react';
import { connect } from 'react-redux';
import IllustList from '../../components/IllustList';
import * as myPixivActionCreators from '../../common/actions/myPixiv';
import { getMyPixivItems } from '../../common/selectors';

class MyPixiv extends Component {
  componentDidMount() {
    const { fetchMyPixiv, clearMyPixiv } = this.props;
    clearMyPixiv();
    fetchMyPixiv();
  }

  loadMoreItems = () => {
    const { fetchMyPixiv, myPixiv: { nextUrl, loading } } = this.props;
    if (!loading && nextUrl) {
      fetchMyPixiv(nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { fetchMyPixiv, clearMyPixiv } = this.props;
    clearMyPixiv();
    fetchMyPixiv(null, true);
  };

  render() {
    const { myPixiv, items, listKey } = this.props;
    return (
      <IllustList
        data={{ ...myPixiv, items }}
        listKey={listKey}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect((state, props) => {
  const { myPixiv } = state;
  return {
    myPixiv,
    items: getMyPixivItems(state),
    listKey: `${props.navigation.state.key}-myPixiv`,
  };
}, myPixivActionCreators)(MyPixiv);
