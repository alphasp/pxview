import React, { Component } from 'react';
import { ScrollView, View, StyleSheet, Modal } from 'react-native';
import {
  Subheading,
  Button,
  Dialog,
  RadioButton,
  TouchableRipple,
} from 'react-native-paper';
import { connectLocalization } from './Localization';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  dialogContentContainer: {
    paddingHorizontal: 0,
    maxHeight: globalStyleVariables.WINDOW_HEIGHT - 200,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  text: {
    paddingLeft: 8,
  },
});

class SingleChoiceDialog extends Component {
  static defaultProps = {
    enableOkButton: true,
  };

  constructor(props) {
    super(props);
    const { selectedItemValue } = props;
    this.state = {
      selectedItemValue,
    };
  }

  handleOnSelectItem = value => {
    const { enableOkButton, onSelectItem } = this.props;
    this.setState(
      {
        selectedItemValue: value,
      },
      () => {
        if (!enableOkButton && onSelectItem) {
          onSelectItem(value);
        }
      },
    );
  };

  handleOnPressOk = () => {
    const { onPressOk } = this.props;
    const { selectedItemValue } = this.state;
    onPressOk(selectedItemValue);
  };

  renderItems = () => {
    const { items } = this.props;
    const { selectedItemValue } = this.state;
    return (
      <View>
        {items.map(item =>
          <TouchableRipple
            key={item.value}
            onPress={() => this.handleOnSelectItem(item.value)}
          >
            <View style={styles.row}>
              <View pointerEvents="none">
                <RadioButton.Android
                  value={item.value}
                  status={
                    item.value === selectedItemValue ? 'checked' : 'unchecked'
                  }
                />
              </View>
              <Subheading style={styles.text}>
                {item.label}
              </Subheading>
            </View>
          </TouchableRipple>,
        )}
      </View>
    );
  };

  render() {
    const {
      visible,
      title,
      okLabel,
      cancelLabel,
      onPressCancel,
      scrollable,
      i18n,
      enableOkButton,
    } = this.props;
    return (
      <Modal
        animationType="fade"
        transparent
        visible={visible}
        onRequestClose={onPressCancel}
      >
        <Dialog dismissable={false} onDismiss={onPressCancel} visible={visible}>
          <Dialog.Title>
            {title}
          </Dialog.Title>
          {scrollable
            ? <Dialog.ScrollArea style={styles.dialogContentContainer}>
                <ScrollView>
                  {this.renderItems()}
                </ScrollView>
              </Dialog.ScrollArea>
            : <Dialog.Content style={styles.dialogContentContainer}>
                {this.renderItems()}
              </Dialog.Content>}
          <Dialog.Actions>
            <Button primary onPress={onPressCancel}>
              {cancelLabel || i18n.cancel}
            </Button>
            {enableOkButton &&
              <Button primary onPress={this.handleOnPressOk}>
                {okLabel || i18n.ok}
              </Button>}
          </Dialog.Actions>
        </Dialog>
      </Modal>
    );
  }
}

export default connectLocalization(SingleChoiceDialog);
