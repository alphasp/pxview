import React from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Modal,
  Text,
} from 'react-native';
import { Button } from 'react-native-elements';
import OverlaySpinner from 'react-native-loading-spinner-overlay';
import { connectLocalization } from '../components/Localization';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    margin: 15,
    paddingBottom: 20,
  },
  sectionHeader: {
    backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
    padding: 10,
  },
  sectionHeaderTitle: {
    fontWeight: 'bold',
  },
  buttonsContainer: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
  },
});

const ModalForm = ({ children, title, loading, onSubmit, onClose, i18n }) =>
  <Modal animationType="fade" transparent visible onRequestClose={onClose}>
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.container}>
        <TouchableWithoutFeedback>
          <View style={styles.formContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderTitle}>
                {title}
              </Text>
            </View>
            <KeyboardAvoidingView behavior="padding">
              <View>
                {children}
                <View style={styles.buttonsContainer}>
                  <Button
                    title={i18n.cancel}
                    containerViewStyle={styles.buttonContainer}
                    raised
                    onPress={onClose}
                  />
                  <Button
                    title={i18n.ok}
                    backgroundColor={globalStyleVariables.PRIMARY_COLOR}
                    containerViewStyle={styles.buttonContainer}
                    raised
                    onPress={onSubmit}
                  />
                </View>
              </View>
            </KeyboardAvoidingView>
            <OverlaySpinner visible={loading} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>;

export default connectLocalization(ModalForm);
