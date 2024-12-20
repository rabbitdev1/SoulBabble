import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, useColorScheme, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Back_btn from '../../../src/assets/icon/ic_arrow_back.svg';
import DynamicText from '../common/DynamicText';
import useAutoScreen from '../context/useAutoScreen';
import {getDarkModePreference} from '../common/darkModePreference';
import { RootState } from '../../../store/reducers';
import { useSelector } from 'react-redux';
interface TopBarProps {
  isIconLeft?: React.ReactNode;
  isShowLogo: boolean;
  title: string;
  transparent?: boolean;
  colorText?: string;
  style?: any;
  onClickIconLeft?: () => void;
}
const TopBar: React.FC<TopBarProps> = ({
  isIconLeft,
  isShowLogo,
  title,
  colorText,
  transparent = false,
  style,
  onClickIconLeft,
}) => {
  const colorSystem = useSelector(
      (state: RootState) => state.todoReducer.colorSystem,
    );
  const navigation = useNavigation();
  const autoScreen = useAutoScreen();
  const isDarkMode = getDarkModePreference();

  const [parsedSetting, setParsedSetting] = useState<any>('');
  useEffect(() => {
    fetchParsed();
  }, []);
  const fetchParsed = async () => {
    const parsedSetting = await AsyncStorage.getItem('isWebSetting');
    if (parsedSetting !== null) {
      const parsedResponse = JSON.parse(parsedSetting);
      setParsedSetting(parsedResponse);
    } else {
      // Handle the case where parsedSetting is null
    }
  };

  return (
    <View
      style={[
        {
          backgroundColor:
            transparent === true
              ? 'transparent'
              : isDarkMode
              ? colorSystem.dark.card
              : colorSystem.light.card,
          width: autoScreen,
          gap: 8,
          padding: 16,
          ...style,
        },
      ]}>
      <View
        style={{flexDirection: 'row', justifyContent: 'space-between', gap: 8}}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={{width: 32, height: 37, padding: 3}}>
          <Back_btn
            style={{
              color:
                transparent === true
                  ? '#ffffff'
                  : colorText
                  ? colorText
                  : isDarkMode
                  ? '#ffffff'
                  : '#212121',
            }}
            width={'100%'}
            height={'100%'}
          />
        </TouchableOpacity>
        {isShowLogo ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              flexDirection: 'row',
              padding: 3,
              gap: 8,
            }}>
            {parsedSetting && parsedSetting.logo && (
              isDarkMode ?
              <FastImage
                source={{uri: parsedSetting?.logo_dark || ''}}
                resizeMode={FastImage.resizeMode.contain}
                style={{
                  width: '100%',
                  height: '100%',
                  alignSelf: 'flex-start',
                }}
              />:
              <FastImage
                source={{uri: parsedSetting?.logo || ''}}
                resizeMode={FastImage.resizeMode.contain}
                style={{
                  width: '100%',
                  height: '100%',
                  alignSelf: 'flex-start',
                }}
              />
            )}
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              flexDirection: 'row',
              padding: 3,
              gap: 8,
            }}>
            <DynamicText
              bold
              size={14}
              style={{
                color:
                  transparent === true
                    ? '#ffffff'
                    : colorText
                    ? colorText
                    : isDarkMode
                    ? '#ffffff'
                    : '#212121',
              }}>
              {title}
            </DynamicText>
          </View>
        )}
        {isIconLeft ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onClickIconLeft}
            style={{
              width: 32,
              height: 37,
              padding: 3,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {isIconLeft && isIconLeft}
          </TouchableOpacity>
        ) : (
          <View style={{width: 32, height: 37}} />
        )}
      </View>
    </View>
  );
};
export default TopBar;
