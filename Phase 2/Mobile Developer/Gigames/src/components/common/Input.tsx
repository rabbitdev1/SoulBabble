import {Picker} from '@react-native-picker/picker';
import React, {useRef, useState} from 'react';
import {
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import EyeSlashIcon from '../../assets/icon/ic_eye-slash.svg';
import EyeIcon from '../../assets/icon/ic_eye.svg';
import DynamicText from './DynamicText';
import {getDarkModePreference} from './darkModePreference';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/reducers';

interface Props {
  label?: string;
  icon?: React.ReactNode;
  value: string;
  options?: any;
  style?: TextStyle;
  colorText?: any;
  type: any;
  disabled?: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
  onSubmit?: (item: any) => void;
  onSubmit1?: (item: any) => void;
}
const Input: React.FC<Props> = ({
  label,
  icon,
  value,
  options,
  style,
  colorText,
  type,
  disabled = true,
  placeholder,
  onChange,
  onSubmit,
  onSubmit1,
}) => {
  const colorSystem = useSelector(
    (state: RootState) => state.todoReducer.colorSystem,
  );
  const isDarkMode = getDarkModePreference();
  const [isPassword, setIsPassword] = useState(false);
  const phoneInput = useRef<any>(null);

  const handlePhoneInputChange = (inputValue: string) => {
    let phoneNumber = inputValue.replace(/[^\d+]/g, ''); // Menghapus semua karakter kecuali angka dan simbol '+'

    if (phoneNumber.startsWith('+0')) {
      phoneNumber = '+62' + phoneNumber.slice(2);
    }

    onChange(phoneNumber);
  };

  let parsedOptions = [];
  try {
    parsedOptions = JSON.parse(options || '[]');
  } catch (error) {
    // Handle JSON parsing error here
  }

  return type === 'phone-pad' ? (
    <View style={{flexDirection: 'column', gap: 4, ...style}}>
      {label && (
        <DynamicText size={14} semiBold>
          {label}
        </DynamicText>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 4,
          overflow: 'hidden',
          borderWidth: 1,
          gap: 8,
          borderColor: isDarkMode
            ? colorSystem.dark.bordercolor
            : colorSystem.light.bordercolor,
        }}>
        <PhoneInput
          ref={phoneInput}
          value={value}
          defaultCode="ID"
          layout="first"
          placeholder=""
          countryPickerProps={{
            countryCodes: ['ID'],
          }}
          onChangeText={value => {
            const phoneNumber = value.replace(/[^\d+]/g, '');
            handlePhoneInputChange(phoneNumber);
          }}
          codeTextStyle={{
            fontSize: 12,
            color: isDarkMode ? '#ffffff' : '#212121',
            fontFamily: 'Gilroy-Regular',
            padding: 0,
            margin: 0,
          }}
          textInputStyle={{
            fontSize: 12,
            color: isDarkMode ? '#ffffff' : '#212121',
            fontFamily: 'Gilroy-Regular',
            padding: 0,
            margin: 0,
          }}
          flagButtonStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            height: 'auto',
            margin: 0,
          }}
          containerStyle={{
            flex: 1,
            padding: 0,
            margin: 0,
            backgroundColor: isDarkMode
              ? colorSystem.dark.background
              : colorSystem.light.background,
          }}
          textContainerStyle={{
            padding: 0,
            margin: 0,
            backgroundColor: isDarkMode
              ? colorSystem.dark.background
              : colorSystem.light.background,
          }}
        />
      </View>
    </View>
  ) : type === 'select' ? (
    <View style={{flexDirection: 'column', gap: 4, ...style}}>
      {label && (
        <DynamicText size={14} semiBold>
          {label}
        </DynamicText>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: isDarkMode
            ? colorSystem.dark.background
            : colorSystem.light.background,
          borderRadius: 6,
          gap: 8,
          borderWidth: 1,
          borderColor: isDarkMode
            ? colorSystem.dark.bordercolor
            : colorSystem.light.bordercolor,
          ...style,
        }}>
        <Picker
          style={{
            flex: 1,
            padding: 0,
            paddingVertical: 0,
            marginVertical: -6,
            fontFamily: 'Gilroy-Regular',
            color: colorText,
          }}
          onValueChange={itemValue => {
            if (itemValue !== 'placeholder') {
              onChange(itemValue);
            }
          }}
          selectedValue={value}>
          <Picker.Item
            label={placeholder}
            value="placeholder"
            style={{fontSize: 12, fontFamily: 'Gilroy-Regular'}}
          />
          {parsedOptions.map((option: any) => (
            <Picker.Item
              key={option.value}
              label={option.text}
              value={option.value}
              style={{fontSize: 12, fontFamily: 'Gilroy-Regular'}}
            />
          ))}
        </Picker>
      </View>
    </View>
  ) : type === 'promo' ? (
    <View style={{flexDirection: 'column', gap: 4, ...style}}>
      {label && (
        <DynamicText size={14} semiBold>
          {label}
        </DynamicText>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: isDarkMode
            ? colorSystem.dark.background
            : colorSystem.light.background,
          borderRadius: 6,
          gap: 8,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: isDarkMode
            ? colorSystem.dark.bordercolor
            : colorSystem.light.bordercolor,
        }}>
        {icon && icon}
        <TextInput
          style={{
            flex: 1,
            fontSize: 12,
            color: isDarkMode ? '#ffffff' : '#212121',
            fontFamily: 'Gilroy-Regular',
            height: 20,
            padding: 0,
            margin: 12,
          }}
          placeholder={placeholder}
          placeholderTextColor={isDarkMode ? '#949494' : '#818994'}
          value={value}
          onChangeText={onChange}
          keyboardType="default"
        />
        {disabled && (
          <View
            style={{
              backgroundColor: '#2b85ec',
              position: 'absolute',
              bottom: 0,
              right: 31,
              paddingVertical: 6,
              paddingHorizontal: 10,
              borderTopLeftRadius: 5,
            }}>
            <DynamicText size={10} semiBold style={{color: '#ffffff'}}>
              PROMO TERPASANG
            </DynamicText>
          </View>
        )}
        {!disabled ? (
          <TouchableOpacity
            onPress={onSubmit}
            style={{
              backgroundColor: isDarkMode
                ? colorSystem.dark.primary
                : colorSystem.light.primary,
              height: '100%',
              paddingHorizontal: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <DynamicText size={12} semiBold style={{color: '#ffffff'}}>
              Redeem
            </DynamicText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={onSubmit}
            style={{
              backgroundColor: isDarkMode
                ? colorSystem.dark.primary
                : colorSystem.light.primary,
              height: '100%',
              paddingHorizontal: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <DynamicText size={12} semiBold style={{color: '#ffffff'}}>
              X
            </DynamicText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  ) : type === 'jumlah_joki' ? (
    <View style={{flexDirection: 'column', gap: 4, ...style}}>
      {label && (
        <DynamicText size={14} semiBold>
          {label}
        </DynamicText>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: isDarkMode
            ? colorSystem.dark.background
            : colorSystem.light.background,
          borderRadius: 6,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: isDarkMode
            ? colorSystem.dark.bordercolor
            : colorSystem.light.bordercolor,
        }}>
        {icon && icon}
        <TextInput
          style={{
            flex: 1,
            fontSize: 12,
            color: isDarkMode ? '#ffffff' : '#212121',
            fontFamily: 'Gilroy-Regular',
            height: 20,
            padding: 0,
            margin: 12,
          }}
          placeholder={placeholder}
          placeholderTextColor={isDarkMode ? '#949494' : '#818994'}
          value={value.toString()}
          editable={disabled}
          onChangeText={onChange}
          keyboardType="phone-pad"
        />
        {parseInt(value) > 1 && (
          <TouchableOpacity
            onPress={onSubmit}
            style={{
              backgroundColor: isDarkMode
                ? colorSystem.dark.primary
                : colorSystem.light.primary,
              height: '100%',
              paddingHorizontal: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <DynamicText size={16} semiBold style={{color: '#ffffff'}}>
              -
            </DynamicText>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={onSubmit1}
          style={{
            backgroundColor: isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary,
            height: '100%',
            paddingHorizontal: 12,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <DynamicText size={16} semiBold style={{color: '#ffffff'}}>
            +
          </DynamicText>
        </TouchableOpacity>
      </View>
    </View>
  ) : type === 'textarea' ? (
    <View style={{flexDirection: 'column', gap: 4, ...style}}>
      {label && (
        <DynamicText size={14} semiBold>
          {label}
        </DynamicText>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: !disabled
            ? '#c4c4c470'
            : isDarkMode
            ? colorSystem.dark.background
            : colorSystem.light.background,
          padding: 8,
          gap: 8,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: isDarkMode
            ? colorSystem.dark.bordercolor
            : colorSystem.light.bordercolor,
        }}>
        {icon && icon}
        <TextInput
          style={{
            flex: 1,
            fontSize: 12,
            color: isDarkMode ? '#ffffff' : '#212121',
            minHeight: 150,
            fontFamily: 'Gilroy-Regular',
            textAlignVertical: 'top',
          }}
          placeholder={placeholder}
          placeholderTextColor={isDarkMode ? '#949494' : '#818994'}
          value={value}
          editable={disabled}
          onChangeText={onChange}
          multiline={true}
          numberOfLines={5}
          keyboardType="default"
        />
      </View>
    </View>
  ) : (
    <View style={{flexDirection: 'column', gap: 4, ...style}}>
      {label && (
        <DynamicText size={14} semiBold>
          {label}
        </DynamicText>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: !disabled
            ? '#c4c4c470'
            : isDarkMode
            ? colorSystem.dark.background
            : colorSystem.light.background,
          padding: 8,
          gap: 8,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: isDarkMode
            ? colorSystem.dark.bordercolor
            : colorSystem.light.bordercolor,
        }}>
        {icon && icon}
        <TextInput
          style={{
            flex: 1,
            fontSize: 12,
            color: isDarkMode ? '#ffffff' : '#212121',
            fontFamily: 'Gilroy-Regular',
            height: 20,
            padding: 0,
          }}
          placeholder={placeholder}
          placeholderTextColor={isDarkMode ? '#949494' : '#818994'}
          value={value}
          editable={disabled}
          keyboardType={type === 'password' ? 'default' : type}
          onChangeText={onChange}
          secureTextEntry={type === 'password' && !isPassword}
        />
        {type === 'password' && (
          <TouchableOpacity onPress={() => setIsPassword(!isPassword)}>
            {isPassword ? (
              <EyeIcon width={22} height={22} style={{color: '#818994'}} />
            ) : (
              <EyeSlashIcon width={22} height={22} style={{color: '#818994'}} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
export default Input;
