import React, { Component } from 'react';
import { connect } from 'react-redux';
import IllustList from '../components/IllustList';
import * as myPixivActionCreators from '../common/actions/myPixiv';

class MyPixiv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    const { fetchMyPixivIllusts } = this.props;
    fetchMyPixivIllusts();
  }

  loadMoreItems = () => {
    const { fetchMyPixivIllusts, myPixiv: { nextUrl } } = this.props;
    console.log('load more ', nextUrl)
    if (nextUrl) {
      fetchMyPixivIllusts(nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { fetchMyPixivIllusts, clearMyPixivIllusts } = this.props;
    this.setState({
      refereshing: true
    });
    clearMyPixivIllusts();
    fetchMyPixivIllusts().finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  render() {
    const { myPixiv } = this.props;
    const { refreshing } = this.state;
    return (
      <IllustList
        data={myPixiv}
        refreshing={refreshing}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(state => {
  return {
    myPixiv: state.myPixiv,
  }
}, myPixivActionCreators)(MyPixiv);