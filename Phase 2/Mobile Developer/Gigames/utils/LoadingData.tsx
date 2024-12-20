import React from 'react';
import {Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modalbox';
import {useSelector} from 'react-redux';
import useAutoScreen from '../src/components/context/useAutoScreen';
import {RootState} from '../store/reducers';
const screenHeight = Dimensions.get('window').height;
function LoadingData() {
  const pending = useSelector(
    (state: RootState) => state.todoReducer.isPending,
  );
  const autoScreen = useAutoScreen();

  return (
    <Modal
      isOpen={pending}
      swipeToClose={false}
      backdropOpacity={0.5}
      backdropPressToClose={false}
      position="bottom"
      animationDuration={0}
      style={{
        height: screenHeight,
        width: autoScreen,
        backgroundColor: 'transparent',
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <FastImage
        source={require('../src/assets/images/transaction/process.gif')}
        resizeMode={FastImage.resizeMode.contain}
        style={{width: autoScreen / 4, aspectRatio: 1}}
      />
    </Modal>
  );
}
export default LoadingData;
