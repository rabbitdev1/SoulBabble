import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ViewStyle,
} from 'react-native';
import DynamicText from './DynamicText';
import { getDarkModePreference } from './darkModePreference';
interface ButtonProps {
  initialValue: string;
  colorText?: any;
  iconLeft?: React.ReactNode;
  styleSelected?: StyleProp<ViewStyle>;
  disabled?: boolean;
  onPress: () => void;
}
const DynamicButton: React.FC<ButtonProps> = ({
  onPress,
  colorText,
  initialValue,
  iconLeft,
  styleSelected,
  disabled = false,
}) => {
  const isDarkMode = getDarkModePreference();

  // Base button styles
  const baseButtonStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
    borderRadius: 6,
    backgroundColor: isDarkMode ? undefined : '#F7F8FC',
    borderColor: isDarkMode ? '#ffffff20' : '#818994',
    borderWidth: 1,
  };

  const buttonStyle = StyleSheet.flatten([baseButtonStyle, styleSelected]);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={buttonStyle}>
      {iconLeft}
      <DynamicText size={12} semiBold style={{color: colorText || '#818994'}}>
        {initialValue}
      </DynamicText>
    </TouchableOpacity>
  );
};
export default DynamicButton;
