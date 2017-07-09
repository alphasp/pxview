import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Icon } from 'react-native-elements';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
  },
  description: {
    marginVertical: 10,
  },
  titleContainer: {
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const EmptyState = props => {
  const {
    iconName,
    iconType,
    iconSize,
    iconStyle,
    title,
    description,
    actionButton,
  } = props;
  return (
    <View style={styles.container}>
      <Icon
        name={iconName}
        type={iconType}
        size={iconSize || 40}
        style={[styles.icon, iconStyle]}
      />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {title}
        </Text>
        {description &&
          <Text style={styles.description}>
            {description}
          </Text>}
      </View>
      {actionButton}
    </View>
  );
};

export default EmptyState;
