import React, {useEffect, useState} from 'react';
import {Linking, View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modalbox';
import DynamicButton from '../common/DynamicButton';
import DynamicText from '../common/DynamicText';
import useAutoScreen from '../context/useAutoScreen';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/reducers';

interface UpdateVersionModalProps {
  update: any;
  isDarkMode: boolean;
  isWebSettingView: {
    favicon: boolean;
    logo?: string;
    logo_dark?: string;
  };
}

const UpdateVersionModal: React.FC<UpdateVersionModalProps> = ({
  update,
  isDarkMode,
  isWebSettingView,
}) => {
  const colorSystem = useSelector(
    (state: RootState) => state.todoReducer.colorSystem,
  );

  const autoScreen = useAutoScreen();
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const getVersion = async () => {
      const deviceOSVersion = DeviceInfo.getVersion();
      if (isMounted) {
        if (deviceOSVersion === update.versionApp) {
          setIsUpdated(false);
        } else {
          setIsUpdated(true);
        }
      }
    };

    const timeoutId = setTimeout(() => {
      getVersion();
    }, 10000);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [update]);

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
      isOpen={isUpdated}>
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
      <View style={{flexDirection: 'column', gap: 8}}>
        <DynamicText size={16} bold>
          Pembaruan Aplikasi Diperlukan
        </DynamicText>
        <DynamicText size={12}>
          Kami telah menambahkan fitur baru dan memperbaiki beberapa bug untuk
          membuat pengalaman Anda lancar
        </DynamicText>
      </View>
      <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
        <View style={{flex: 1}}>
          <DynamicButton
            initialValue="Perbarui Sekarang"
            styleSelected={{
              backgroundColor: '#FFCDD2',
              borderWidth: 0,
            }}
            colorText={'#F44336'}
            onPress={() => {
              Linking.openURL(update?.playstore);
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default UpdateVersionModal;
