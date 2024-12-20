import React from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DynamicButton from '../common/DynamicButton';
import {isLogin, isLogOut, isProfile} from '../../../store/actions/todoActions';
import DynamicText from '../common/DynamicText';
import Modal from 'react-native-modalbox';
import useAutoScreen from '../context/useAutoScreen';
import {RootState} from '../../../store/reducers';

interface LogoutModalProps {
  isOpen: boolean;
  isDarkMode: boolean;
  isWebSettingView: {
    favicon: boolean;
    logo?: string;
    logo_dark?: string;
  };
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  isDarkMode,
  isWebSettingView,
}) => {
  const colorSystem = useSelector(
    (state: RootState) => state.todoReducer.colorSystem,
  );

  const dispatch = useDispatch();
  const autoScreen = useAutoScreen();

  return (
    <Modal
      animationDuration={1000}
      swipeToClose={false}
      backdropOpacity={0.5}
      backdropPressToClose={false}
      style={{
        width: autoScreen - 64,
        height: 'auto',
        elevation: 1,
        backgroundColor: isDarkMode
          ? colorSystem.dark.background
          : colorSystem.light.background,
        borderRadius: 8,
        padding: 16,
        gap: 16,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      isOpen={isOpen}>
      <View
        style={{
          flexDirection: 'column',
          gap: 8,
          width: '100%',
          paddingBottom: 8,
          borderColor: isDarkMode
            ? colorSystem.dark.bordercolor
            : colorSystem.light.bordercolor,
          borderBottomWidth: 1,
        }}>
        <View style={{width: 130, height: 32}}>
          {isWebSettingView && isWebSettingView.logo && ( 
            isDarkMode ?
            <FastImage
              source={{uri: isWebSettingView?.logo_dark || ''}}
              resizeMode={FastImage.resizeMode.contain}
              style={{
                width: '100%',
                height: '100%',
                alignSelf: 'flex-start',
              }}
            />:
            <FastImage
              source={{uri: isWebSettingView?.logo || ''}}
              resizeMode={FastImage.resizeMode.contain}
              style={{
                width: '100%',
                height: '100%',
                alignSelf: 'flex-start',
              }}
            />
          )}
        </View>
      </View>
      <View style={{flexDirection: 'column', gap: 8, alignItems: 'center'}}>
        <DynamicText size={16} bold>
          Keluar Akun ?
        </DynamicText>
        <DynamicText size={12}>Apakah kamu yakin ingin keluar?</DynamicText>
      </View>
      <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
        <View style={{flex: 1}}>
          <DynamicButton
            initialValue="Batal"
            styleSelected={{
              backgroundColor: '#FFCDD2',
              borderWidth: 0,
            }}
            colorText={'#F44336'}
            onPress={() => {
              dispatch(isLogOut(false));
            }}
          />
        </View>
        <View style={{flex: 1}}>
          <DynamicButton
            initialValue="Iya"
            styleSelected={{
              backgroundColor: '#C8E6C9',
              borderWidth: 0,
            }}
            colorText={'#4CAF50'}
            onPress={async () => {
              dispatch(isLogOut(false));
              await AsyncStorage.removeItem('isProfile');
              dispatch(isProfile(''));
              await AsyncStorage.removeItem('isLogin');
              dispatch(isLogin(''));
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;
