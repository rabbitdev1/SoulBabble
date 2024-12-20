import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';

import {
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../../App';
import { isPending, setDropdownAlert } from '../../../store/actions/todoActions';

import FastImage from 'react-native-fast-image';
import { RootState } from '../../../store/reducers';
import { apiClient } from '../../../utils/api/apiClient';
import '../../../utils/ignoreWarnings';
import { getDarkModePreference } from '../../components/common/darkModePreference';
import DynamicButton from '../../components/common/DynamicButton';
import DynamicText from '../../components/common/DynamicText';
import Input from '../../components/common/Input';
import useAutoScreen from '../../components/context/useAutoScreen';
import TopBar from '../../components/ui/TopBar';

interface EditPinProps {}
type EditPinScreenProp = StackNavigationProp<
  RootStackParamList,
  'DrawerScreen'
>;

const EditPinpages: React.FC<EditPinProps> = () => {
  const colorSystem = useSelector(
    (state: RootState) => state.todoReducer.colorSystem,
  );

  const navigation = useNavigation<EditPinScreenProp>();
  const dispatch = useDispatch();
  const autoScreen = useAutoScreen();

  const scrollYAnimatedValue = useRef(new Animated.Value(0)).current;
  const isLogin = useSelector((state: RootState) => state.todoReducer.isLogin);
  const isDarkMode = getDarkModePreference();
  const [formPIN, setformPIN] = useState([
    {
      name: 'otp',
      title: 'OTP',
      value: '',
      type: 'number-pad',
      placeholder: 'Masukan OTP',
    },
    {
      name: 'pin_baru',
      title: 'PIN Baru',
      value: '',
      type: 'password',
      placeholder: 'Masukan PIN Baru',
    },
    {
      name: 'ulangi_pin_baru',
      title: 'Konfirmasi PIN',
      value: '',
      type: 'password',
      placeholder: 'Masukan Konfirmasi PIN',
    },
  ]);
  const [isResendPIN, setIsResendPIN] = useState(false);

  const [remainingTime, setRemainingTime] = useState(0);
  const [intervalId, setIntervalId] = useState(0);

  useEffect(() => {
    if (remainingTime === 0) {
      clearInterval(intervalId);
    }
  }, [remainingTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    setIntervalId(parseInt(timer.toString()));
    return () => {
      clearInterval(timer);
    };
  }, []);

  const changeEditPin = async () => {
    try {
      const params = new URLSearchParams();
      params.append('api_key', isLogin?.apiKey);
      formPIN.forEach(item => {
        params.append(item.name, item.value);
      });

      const response = await apiClient({
        baseurl: 'user/ubah_profile?setpin',
        method: 'POST',
        XGORDON: 'UBAHPROFILE',
        body: params,
        apiKey: isLogin?.apiKey,
        token: isLogin?.token,
      });
      if (response?.statusCode === 200) {
        dispatch(setDropdownAlert('success', 'Berhasil', response?.result.msg));
        navigation.navigate('Account')
      } else {
        dispatch(setDropdownAlert('error', 'Error', response?.result.msg));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleSendOTP = async (api: any) => {
    dispatch(isPending(true));
    try {
      const params = new URLSearchParams();
      params.append('api_key', isLogin?.apiKey);

      const response = await apiClient({
        baseurl: 'user/ubah_profile',
        parameter: api,
        method: 'POST',
        XGORDON: 'UBAHPROFILE',
        body: params,
        apiKey: isLogin?.apiKey,
        token: isLogin?.token,
      });
      dispatch(isPending(false));
      setIsResendPIN(true);
      setRemainingTime(300);
      if (response?.statusCode === 200) {
        dispatch(setDropdownAlert('success', 'Berhasil', response?.result.msg));
      } else {
        dispatch(setDropdownAlert('error', 'Error', response?.result.msg));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const HeaderAnimation = () => {
    const margin = scrollYAnimatedValue.interpolate({
      inputRange: [20, 100],
      outputRange: [-90, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          marginTop: margin,
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#32323E',
          elevation: 1,
        }}>
        <TopBar
          isIconLeft={false}
          isShowLogo={false}
          title={'Ganti Password'}
        />
      </Animated.View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode
          ? colorSystem.dark.background
          : colorSystem.light.background,
      }}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={
          isDarkMode ? colorSystem.dark.card : colorSystem.light.card
        }
        translucent={false}
        networkActivityIndicatorVisible={true}
      />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollYAnimatedValue}}}],
          {useNativeDriver: false},
        )}>
        <View style={{gap: 16, flexDirection: 'column'}}>
          <TopBar
            isIconLeft={false}
            isShowLogo={false}
            title={'Ganti Password'}
          />
          <View
            style={{
              flexDirection: 'column',
              marginHorizontal: 16,
              gap: 16,
              marginBottom: 16,
            }}>
            <View style={{alignItems: 'center'}}>
              <FastImage
                source={require('../../assets/images/password_images.png')}
                resizeMode={FastImage.resizeMode.contain}
                style={{
                  width: autoScreen / 2,
                  aspectRatio: 1,
                }}
              />
            </View>
            {formPIN.map((input, index) => (
              <View key={index}>
                <Input
                  label={input.title}
                  value={input.value === undefined ? '' : input.value}
                  onChange={value => {
                    const inputValue = value;
                    if (inputValue.length <= 200) {
                      const newInputs = [...formPIN];
                      newInputs[index].value = value;
                      setformPIN(newInputs);
                    }
                  }}
                  type={input.type}
                  placeholder={'Masukan ' + input.title}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View>
        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            padding: 16,
            elevation: 1,
            backgroundColor: isDarkMode
              ? colorSystem.dark.background
              : colorSystem.light.background,
            borderTopWidth: 1,
            borderTopColor: isDarkMode
              ? colorSystem.dark.bordercolor
              : colorSystem.light.bordercolor,
          }}>
          {remainingTime === 0 ? (
            <DynamicButton
              initialValue={isResendPIN ? 'Kirim Ulang OTP' : 'Kirim OTP'}
              styleSelected={{
                flex: 1,
                backgroundColor: isDarkMode
                  ? colorSystem.dark.background
                  : colorSystem.light.background,
                borderWidth: 1,
                borderColor: isDarkMode
                  ? colorSystem.dark.bordercolor
                  : colorSystem.light.bordercolor,
              }}
              onPress={() => {
                handleSendOTP(isResendPIN ? 'resendotp' : 'sendotp');
              }}
            />
          ) : (
            <View style={{flex: 1, justifyContent: 'center'}}>
              <DynamicText size={12}>
                Kirim ulang kode unik dalam {remainingTime} detik
              </DynamicText>
            </View>
          )}
          <DynamicButton
            initialValue="Simpan Perubahan"
            styleSelected={{
              flex: 1,
              backgroundColor: isDarkMode
                ? colorSystem.dark.primary
                : colorSystem.light.primary,
            }}
            colorText={'#ffffff'}
            onPress={() => {
              changeEditPin();
            }}
          />
        </View>
      </View>
      <HeaderAnimation />
    </SafeAreaView>
  );
};

export default EditPinpages;
