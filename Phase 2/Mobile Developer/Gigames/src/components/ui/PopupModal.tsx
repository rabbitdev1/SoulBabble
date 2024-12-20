import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {Text, View} from 'react-native';
import Modal from 'react-native-modalbox';
import {useDispatch, useSelector} from 'react-redux';
import {isLogin, isPopup, isProfile} from '../../../store/actions/todoActions';
import DynamicButton from '../common/DynamicButton';
import DynamicText from '../common/DynamicText';
import useAutoScreen from '../context/useAutoScreen';
import FastImage from 'react-native-fast-image';
import {RootState} from '../../../store/reducers';

interface PopupModalProps {
  popop: boolean;
  isDarkMode: boolean;
  isWebSettingView: any;
}

const PopupModal: React.FC<PopupModalProps> = ({
  popop,
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
      swipeToClose={true}
      backdropOpacity={0.5}
      backdropPressToClose={true}
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
      isOpen={popop}>
      <View style={{flexDirection: 'column', gap: 8, alignItems: 'center'}}>
        {/* <Text style={{color:'red'}}>{JSON.stringify(isWebSettingView.popup_image)}</Text> */}
        <FastImage
          source={{uri: isWebSettingView.popup_image}}
          resizeMode={FastImage.resizeMode.cover}
          style={{
            width: '100%',
            aspectRatio: 2 / 3,
            backgroundColor:  isDarkMode
            ? colorSystem.dark.card
            : colorSystem.light.card,
            borderRadius: 7,
          }}
        />
      </View>
    </Modal>
  );
};

export default PopupModal;
