import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const DetailTabBar = React.createClass({
  tabIcons: [],

  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
  },

  // componentDidMount() {
  //   this._listener = this.props.scrollValue.addListener(this.setAnimationValue);
  // },

  // setAnimationValue({ value, }) {
  //   this.tabIcons.forEach((icon, i) => {
  //     const progress = (value - i >= 0 && value - i <= 1) ? value - i : 1;
  //     icon.setNativeProps({
  //       style: {
  //         color: this.iconColor(progress),
  //       },
  //     });
  //   });
  // },

  // //color between rgb(59,89,152) and rgb(204,204,204)
  // iconColor(progress) {
  //   const red = 59 + (204 - 59) * progress;
  //   const green = 89 + (204 - 89) * progress;
  //   const blue = 152 + (204 - 152) * progress;
  //   return `rgb(${red}, ${green}, ${blue})`;
  // },

  render() {
    const { isShowActiveTabColor } = this.props;
    return (<View style={[styles.tabs, this.props.style]}>
      {this.props.tabs.map((tab, i) => <TouchableOpacity key={tab} onPress={() => this.props.goToPage(i)} style={styles.tab}>
        <Icon
          name={(this.props.activeTab === i && isShowActiveTabColor) ? tab.replace('-outline', '') : tab}
          size={30}
          color={'#fff'}
          ref={icon => {
            this.tabIcons[i] = icon;
          }}
        />
      </TouchableOpacity>)}
    </View>);
  },
});

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  tabs: {
    height: 45,
    flexDirection: 'row',
    paddingTop: 5,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
});

export default DetailTabBar;
