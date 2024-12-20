import React from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DynamicButton from '../common/DynamicButton';
import {
  isLogin,
  isLogOut,
  isProfile,
  isSession,
} from '../../../store/actions/todoActions';
import DynamicText from '../common/DynamicText';
import Modal from 'react-native-modalbox';
import useAutoScreen from '../context/useAutoScreen';
import {RootState} from '../../../store/reducers';

interface EndModalProps {
  session: boolean;
  isDarkMode: boolean;
  isWebSettingView: {
    favicon: boolean;
    logo?: string;
  };
}

const EndModal: React.FC<EndModalProps> = ({
  session,
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
      isOpen={session}>
      <View style={{flexDirection: 'column', gap: 8, alignItems: 'center'}}>
        <DynamicText size={16} bold>
          Session Berakhir
        </DynamicText>
        <DynamicText size={12}>
          Anda sedang masuk menggunakan akun di platform lain
        </DynamicText>
      </View>
      <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
        <View style={{flex: 1}}>
          <DynamicButton
            initialValue="Keluar Akun"
            styleSelected={{
              backgroundColor:  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary,
              borderWidth: 0,
            }}
            colorText={'#ffffff'}
            onPress={async () => {
              dispatch(isSession(false));
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

export default EndModal;
