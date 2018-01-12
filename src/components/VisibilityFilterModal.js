import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import { connectLocalization } from '../components/Localization';
import PXTouchable from '../components/PXTouchable';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  innerContainer: {
    // borderRadius: 10,
    // alignItems: 'center',
    backgroundColor: '#fff',
    // padding: 20
  },
  sectionHeader: {
    backgroundColor: '#E9EBEE',
  },
  sectionHeaderTitle: {
    fontWeight: 'bold',
    // fontSize: 20,
    padding: 10,
  },
  row: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectedVisibilityContainer: {
    backgroundColor: globalStyleVariables.PRIMARY_COLOR,
  },
  selectedVisibilityText: {
    color: '#fff',
  },
});

class VisibilityFilterModal extends Component {
  render() {
    const {
      isOpen,
      onSelectVisibility,
      onPressCloseButton,
      i18n,
      visibility,
    } = this.props;
    const items = [
      {
        name: i18n.all,
        value: 'all',
      },
      {
        name: i18n.public,
        value: 'public',
      },
      {
        name: i18n.private,
        value: 'private',
      },
    ];
    return (
      <Modal
        animationType="fade"
        transparent
        visible={isOpen}
        onRequestClose={onPressCloseButton}
      >
        <TouchableWithoutFeedback onPress={onPressCloseButton}>
          <View style={styles.container}>
            <TouchableWithoutFeedback>
              <View>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionHeaderTitle}>
                    {i18n.filter}
                  </Text>
                </View>
                <View style={styles.innerContainer}>
                  {items.map(item =>
                    <PXTouchable
                      key={item.name}
                      onPress={() => onSelectVisibility(item.value)}
                    >
                      <View
                        style={[
                          styles.row,
                          item.value === visibility &&
                            styles.selectedVisibilityContainer,
                        ]}
                      >
                        {
                          <View style={styles.selectedVisibility}>
                            <Text
                              style={
                                item.value === visibility &&
                                styles.selectedVisibilityText
                              }
                            >
                              {item.name}
                            </Text>
                          </View>
                        }
                      </View>
                    </PXTouchable>,
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

export default connectLocalization(VisibilityFilterModal);
