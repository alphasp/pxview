import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import NewIllusts from './NewIllusts';
import NewMangas from './NewMangas';
import NewNovels from './NewNovels';
import { connectLocalization } from '../../components/Localization';
import Pills from '../../components/Pills';
import { globalStyles } from '../../styles';

const styles = StyleSheet.create({
  pills: {
    padding: 10,
  },
});

class UserNewWorks extends Component {
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
            title: i18n.illust,
          },
          {
            title: i18n.manga,
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
    switch (index) {
      case 0:
        return <NewIllusts renderHeader={this.renderHeader} active={active} />;
      case 1:
        return <NewMangas renderHeader={this.renderHeader} active={active} />;
      case 2:
        return <NewNovels renderHeader={this.renderHeader} active={active} />;
      default:
        return null;
    }
  };

  render() {
    return <View style={globalStyles.container}>{this.renderContent()}</View>;
  }
}

export default connectLocalization(UserNewWorks);
