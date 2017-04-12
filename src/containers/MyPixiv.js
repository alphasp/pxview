import React, { Component } from 'react';
import { connect } from 'react-redux';
import IllustList from '../components/IllustList';
import * as myPixivActionCreators from '../common/actions/myPixiv';
import { denormalizedData } from '../common/helpers/normalizrHelper';
import Schemas from '../common/constants/schemas';

class MyPixiv extends Component {
  componentDidMount() {
    const { fetchMyPixiv } = this.props;
    fetchMyPixiv();
  }

  loadMoreItems = () => {
    const { fetchMyPixiv, myPixiv: { nextUrl, loading } } = this.props;
    if (!loading && nextUrl) {
      console.log('load more ', nextUrl)
      fetchMyPixiv(nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { fetchMyPixiv, clearMyPixiv } = this.props;
    clearMyPixiv();
    fetchMyPixiv(null, true);
  }

  render() {
    const { myPixiv } = this.props;
    return (
      <IllustList
        data={myPixiv}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(state => {
  const { entities, myPixiv } = state;
  return {
    myPixiv: denormalizedData(myPixiv, 'items', Schemas.ILLUST_ARRAY, entities)
  }
}, myPixivActionCreators)(MyPixiv);