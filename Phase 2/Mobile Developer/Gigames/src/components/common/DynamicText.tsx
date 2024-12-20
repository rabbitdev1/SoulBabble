import React from 'react';
import {Platform, StyleSheet, Text, useColorScheme} from 'react-native';
import { getDarkModePreference } from './darkModePreference';
const IS_IOS = Platform.OS === 'ios';
interface DynamicTextProps {
  children: React.ReactNode;
  size?: number;
  regular?: boolean;
  semiBold?: boolean;
  bold?: boolean;
  light?: boolean;
  style?: any;
  numberOfLines?: number;
}
const DynamicText: React.FC<DynamicTextProps> = ({
  children,
  size,
  regular,
  semiBold,
  bold,
  light,
  style,
  numberOfLines,
}) => {
  const isDarkMode = getDarkModePreference();

  const styles = StyleSheet.create({
    text: {
      fontSize: size || 16,
      fontFamily: regular
        ? 'Gilroy-Regular'
        : semiBold
        ? 'Gilroy-SemiBold'
        : bold
        ? 'Gilroy-Bold'
        : light
        ? 'Gilroy-Light'
        : 'Gilroy-Regular',
      color: isDarkMode ? '#ffffff' : '#212121',
      textAlign: 'left',
      letterSpacing: IS_IOS ? 0.4 : 0,
      ...style,
    },
  });

  return (
    <Text style={styles.text} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
};
export default DynamicText;
