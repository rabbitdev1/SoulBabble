import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {
  BackHandler,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
import {RootStackParamList} from '../../../App';
import {
  isLogin,
  isPending,
  isProfile,
  setDropdownAlert,
} from '../../../store/actions/todoActions';
import {apiClient} from '../../../utils/api/apiClient';
import '../../../utils/ignoreWarnings';
import DynamicButton from '../../components/common/DynamicButton';
import DynamicText from '../../components/common/DynamicText';
import {formatTime} from '../../components/common/formatTime';
import Input from '../../components/common/Input';
import useAutoScreen from '../../components/context/useAutoScreen';
import {RootState} from '../../../store/reducers';
import { getDarkModePreference } from '../../components/common/darkModePreference';
interface OtpScreenPagesProps {}
type otpScreenProp = StackNavigationProp<RootStackParamList, 'DrawerScreen'>;
const OtpScreenPages: React.FC<OtpScreenPagesProps> = () => {
  const colorSystem = useSelector(
      (state: RootState) => state.todoReducer.colorSystem,
    );
  
  const navigation = useNavigation<otpScreenProp>();
  const autoScreen = useAutoScreen();
  const dispatch = useDispatch();
  const route = useRoute();
  const {phone} = route.params as {phone: string};
  const isWebSetting = useSelector(
    (state: RootState) => state.todoReducer.isWebSetting,
  );
  const [pin, setPIN] = useState('');
  const [remainingTime, setRemainingTime] = useState(180);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | number>(0);
  const isDarkMode = getDarkModePreference();
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Login');
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    if (remainingTime === 0) {
      clearInterval(intervalId);
    }
  }, [remainingTime]);
  useEffect(() => {
    fetchDataApi();
  }, []);
  const fetchDataApi = async () => {
    handleSendOTP(phone, 'sendotp');
    const timer = setInterval(() => {
      setRemainingTime(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    setIntervalId(timer);
    return () => {
      clearInterval(timer);
    };
  };
  const handleSendOTP = async (phone: any, api: any) => {
    dispatch(isPending(true));
    try {
      const params = new URLSearchParams();
      params.append('nomor', phone);
      const response = await apiClient({
        baseurl: 'user/verifikasi',
        parameter: api,
        method: 'POST',
        XGORDON: 'VERIFIKASI',
        body: params,
      });
      dispatch(isPending(false));
      if (response?.statusCode === 200) {
        dispatch(
          dispatch(
            setDropdownAlert('success', 'Berhasil', response?.result.msg),
          ),
        );
      } else {
        if (response?.result.msg === 'Kode otentikasi sudah dikirim') {
          handleSendOTP(phone, 'resendotp');
          setRemainingTime(180);
          const timer = setInterval(() => {
            setRemainingTime(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
          }, 1000);
          setIntervalId(timer);
          return () => {
            clearInterval(timer);
          };
        } else {
          dispatch(
            dispatch(setDropdownAlert('error', 'Error', response?.result.msg)),
          );
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleVerifAccount = async (phone: any, pin: any) => {
    dispatch(isPending(true));
    try {
      const params = new URLSearchParams();
      params.append('nomor', phone);
      params.append('otp', pin);
      const response = await apiClient({
        baseurl: 'user/verifikasi',
        parameter: 'verifotp',
        method: 'POST',
        XGORDON: 'VERIFIKASI',
        body: params,
      });
      dispatch(isPending(false));
      if (response?.statusCode === 200) {
        const apiKey = response?.result.api_key;
        const token = response?.result.token;
        const apiData = {apiKey, token};
        await AsyncStorage.setItem('isLogin', JSON.stringify(apiData));
        dispatch(isLogin(apiData));
        fetchDataProfile(apiKey, token);
      } else {
        dispatch(
          dispatch(setDropdownAlert('error', 'Error', response?.result.msg)),
        );
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetchDataProfile = async (api_key: any, token: any) => {
    try {
      const params = new URLSearchParams();
      params.append('api_key', api_key);
      const response = await apiClient({
        baseurl: 'user/me',
        method: 'POST',
        XGORDON: 'ME',
        apiKey: api_key,
        token: token,
        body: params,
      });
      if (response?.statusCode === 200) {
        await AsyncStorage.setItem(
          'isProfile',
          JSON.stringify(response?.result),
        );
        dispatch(isProfile(response?.result));
        setTimeout(() => {
          navigation.navigate('Account');
        }, 500);
        dispatch(setDropdownAlert('success', 'Berhasil', response?.result.msg));
      } else {
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: isDarkMode
              ? colorSystem.dark.background
              : colorSystem.light.background}}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary}
        translucent={false}
        networkActivityIndicatorVisible={true}
      />
      <View style={{flex: 1, flexDirection: 'column', gap: 8}}>
        <ImageBackground
          style={{
            width: '100%',
            height: Dimensions.get('screen').height / 2,
            gap: 8,
          }}
          source={require('../../../src/assets/images/ornament_1.png')}
          imageStyle={{
            resizeMode: 'cover',
            alignSelf: 'center',
          }}></ImageBackground>
        <View
          style={{
            position: 'absolute',
            flex: 1,
            padding: 16,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            gap: 4,
          }}>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              padding: 16,
              flexDirection: 'column',
              overflow: 'hidden',
              backgroundColor:  isDarkMode
              ? colorSystem.dark.card
              : colorSystem.light.card,
              elevation: 1,
              borderRadius: 6,
              gap: 16,
            }}>
            <View
              style={{flexDirection: 'column', alignItems: 'center', gap: 16}}>
              {isDarkMode?
              <FastImage
              source={{uri: isWebSetting?.logo_dark || ''}}
              resizeMode={FastImage.resizeMode.contain}
              style={{
                width: autoScreen / 3,
                aspectRatio: 2.5,
              }}
            />:
            <FastImage
                source={{uri: isWebSetting?.logo || ''}}
                resizeMode={FastImage.resizeMode.contain}
                style={{
                  width: autoScreen / 3,
                  aspectRatio: 2.5,
                }}
              />}
              <FastImage
                source={require('../../assets/images/OTP_images.png')}
                resizeMode={FastImage.resizeMode.contain}
                style={{
                  width: autoScreen / 2,
                  aspectRatio: 1,
                }}
              />
              <View
                style={{flexDirection: 'column', gap: 4, alignItems: 'center'}}>
                <DynamicText bold size={16}>
                  OTP
                </DynamicText>
                <DynamicText size={12} style={{color: '#818994'}}>
                Kami telah mengirim 6 digit kode OTP ke WhatsApp Anda
                </DynamicText>
              </View>
            </View>
            <View style={{flexDirection: 'column', width: '100%', gap: 8}}>
              <Input
                label={'Nomor OTP'}
                value={pin}
                onChange={value => {
                  if (value.length <= 6) {
                    setPIN(value);
                  }
                }}
                type={'number-pad'}
                placeholder={'Masukkan Kode OTP'}
              />
              {remainingTime === 0 ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    handleSendOTP(phone, 'resendotp');
                  }}>
                  <DynamicText size={12} bold>
                    Kirim Ulang OTP
                  </DynamicText>
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    marginVertical: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <DynamicText size={12}>Kirim ulang OTP dalam </DynamicText>
                  <DynamicText size={14} bold>
                    {formatTime(remainingTime)}
                  </DynamicText>
                  <DynamicText size={12}> Detik</DynamicText>
                </View>
              )}
              <DynamicButton
                initialValue="Verifikasi"
                styleSelected={{
                  backgroundColor:  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary,
                  borderWidth: 0,
                }}
                colorText={'#ffffff'}
                onPress={() => {
                  handleVerifAccount(phone, pin);
                }}
              />
              <DynamicButton
                initialValue="Kembali"
                styleSelected={{
                  borderColor:  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary,
                  backgroundColor: isDarkMode
              ? colorSystem.dark.background
              : colorSystem.light.background,
                  borderWidth: 1,
                }}
                colorText={ isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary}
                onPress={() => {
                  navigation.goBack();
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OtpScreenPages;
