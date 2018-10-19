import React from 'react';
import {
  View,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';
import { Dialog, Button } from 'react-native-paper';
import OverlaySpinner from 'react-native-loading-spinner-overlay';
import { connectLocalization } from './Localization';

const ModalForm = ({ children, title, loading, onSubmit, onClose, i18n }) =>
  <Modal animationType="fade" transparent visible onRequestClose={onClose}>
    <TouchableWithoutFeedback onPress={onClose}>
      <Dialog visible onDismiss={onClose}>
        <Dialog.Title>
          {title}
        </Dialog.Title>
        <Dialog.Content>
          <KeyboardAvoidingView behavior="padding">
            <View>
              {children}
            </View>
          </KeyboardAvoidingView>
          <OverlaySpinner visible={loading} />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onClose}>
            {i18n.cancel}
          </Button>
          <Button onPress={onSubmit}>
            {i18n.ok}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </TouchableWithoutFeedback>
  </Modal>;

export default connectLocalization(ModalForm);
