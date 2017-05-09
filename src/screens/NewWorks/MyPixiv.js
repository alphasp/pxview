import React, { Component } from 'react';
import { connect } from 'react-redux';
import IllustList from '../../components/IllustList';
import * as myPixivActionCreators from '../../common/actions/myPixiv';
import { getMyPixivItems } from '../../common/selectors';

class MyPixiv extends Component {
  componentDidMount() {
    const { fetchMyPixiv } = this.props;
    fetchMyPixiv();
  }

  loadMoreItems = () => {
    const { fetchMyPixiv, myPixiv: { nextUrl, loading } } = this.props;
    if (!loading && nextUrl) {
      console.log('load more ', nextUrl);
      fetchMyPixiv(nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { fetchMyPixiv, clearMyPixiv } = this.props;
    clearMyPixiv();
    fetchMyPixiv(null, true);
  };

  render() {
    const { myPixiv, items } = this.props;
    return (
      <IllustList
        data={{ ...myPixiv, items }}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(state => {
  const { myPixiv } = state;
  return {
    myPixiv,
    items: getMyPixivItems(state),
  };
}, myPixivActionCreators)(MyPixiv);
