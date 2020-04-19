import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import MyPixivIllusts from './MyPixivIllusts';
import MyPixivNovels from './MyPixivNovels';
import { connectLocalization } from '../../components/Localization';
import Pills from '../../components/Pills';
import { globalStyles } from '../../styles';

const styles = StyleSheet.create({
  pills: {
    padding: 10,
  },
});

class MyPixivNewWorks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
  }

  handleOnPressPill = (index) => {
    this.setState({ index });
  };

  renderHeader = () => {
    const { i18n } = this.props;
    const { index } = this.state;
    return (
      <Pills
        items={[
          {
            title: i18n.illustManga,
          },
          {
            title: i18n.novel,
          },
        ]}
        onPressItem={this.handleOnPressPill}
        selectedIndex={index}
        style={styles.pills}
      />
    );
  };

  renderContent = () => {
    const { active } = this.props;
    const { index } = this.state;
    if (index === 0) {
      return (
        <MyPixivIllusts renderHeader={this.renderHeader} active={active} />
      );
    }
    if (index === 1) {
      return <MyPixivNovels renderHeader={this.renderHeader} active={active} />;
    }
    return null;
  };

  render() {
    return <View style={globalStyles.container}>{this.renderContent()}</View>;
  }
}

export default connectLocalization(MyPixivNewWorks);
