import React, { Component } from 'react';
import { View, StyleSheet, FlatList, DeviceEventEmitter } from 'react-native';
import { withTheme, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DURATION } from 'react-native-easy-toast';
import { connectLocalization } from '../components/Localization';
import PXTouchable from '../components/PXTouchable';
import PXListItem from '../components/PXListItem';
import PXListItemRemoveButton from '../components/PXListItemRemoveButton';
import { globalStyles, globalStyleVariables } from '../styles';

const MAX_TAGS_COUNT = 200;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 12,
  },
  textInputContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
});

class TagSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newTag: null,
    };
  }

  handleOnPressAddTag = () => {
    const { addTag, items, i18n } = this.props;
    const { newTag } = this.state;
    if (newTag) {
      if (items.length + 1 > MAX_TAGS_COUNT) {
        this.showToast(
          i18n.formatString(i18n.tagsMaxLimit, MAX_TAGS_COUNT),
          DURATION.LENGTH_LONG,
        );
        return;
      }
      addTag(newTag);
      this.textInput.clear(); // bug: not working on ios
      this.setState({
        newTag: null,
      });
    }
  };

  handleOnPressRemoveTag = (tag) => {
    const { removeTag } = this.props;
    removeTag(tag);
  };

  handleOnChangeFormInputText = (text) => {
    this.setState({ newTag: text });
  };

  showToast = (message) => {
    DeviceEventEmitter.emit('showToast', message);
  };

  renderItem = ({ item }) => (
    <PXListItem
      title={item}
      right={() => (
        <PXListItemRemoveButton
          onPress={() => this.handleOnPressRemoveTag(item)}
        />
      )}
    />
  );

  render() {
    const { items, textInputPlaceholder, theme } = this.props;
    return (
      <View
        style={[
          globalStyles.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <View style={styles.inputContainer}>
          <TextInput
            ref={(ref) => (this.textInput = ref)}
            placeholder={textInputPlaceholder}
            autoCorrect={false}
            style={[
              styles.textInputContainer,
              { backgroundColor: theme.colors.background },
            ]}
            onChangeText={this.handleOnChangeFormInputText}
          />
          <PXTouchable
            hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
            onPress={this.handleOnPressAddTag}
          >
            <Icon
              name="plus"
              size={24}
              color={globalStyleVariables.PRIMARY_COLOR}
            />
          </PXTouchable>
        </View>
        <FlatList
          data={items}
          keyExtractor={(item) => item}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

export default withTheme(connectLocalization(TagSettings));
