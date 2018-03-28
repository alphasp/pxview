import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import enhanceSaveImage from '../components/HOC/enhanceSaveImage';
import PXTouchable from '../components/PXTouchable';

const styles = StyleSheet.create({
  icon: {
    padding: 10,
    color: '#fff',
  },
});

class HeaderSaveImageButton extends PureComponent {
  handleOnPressSaveImage = () => {
    const {
      saveImage,
      imageUrls,
      imageIndex,
      workId,
      workTitle,
      workType,
      userId,
      userName,
    } = this.props;
    saveImage({
      imageUrls,
      imageIndex,
      workId,
      workTitle,
      workType,
      userId,
      userName,
    });
  };

  render() {
    const { saveAll, saveImage, ...restProps } = this.props;
    return (
      <PXTouchable onPress={this.handleOnPressSaveImage} {...restProps}>
        <Icon
          name={saveAll ? 'content-save-all' : 'content-save'}
          size={20}
          style={styles.icon}
        />
      </PXTouchable>
    );
  }
}

export default enhanceSaveImage(HeaderSaveImageButton);
