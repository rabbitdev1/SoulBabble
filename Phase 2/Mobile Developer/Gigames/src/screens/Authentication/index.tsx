import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../../App';
import ProfileIcon from '../../../src/assets/icon/ic_profile.svg';
import MailIcon from '../../../src/assets/icon/ic_email.svg';
import PasswordIcon from '../../../src/assets/icon/ic_password.svg';
import {
  isLogin,
  isPending,
  isProfile,
  setDropdownAlert,
} from '../../../store/actions/todoActions';
import { RootState } from '../../../store/reducers';
import { apiClient } from '../../../utils/api/apiClient';
import '../../../utils/ignoreWarnings';
import CheckBox from '../../components/common/CheckBox';
import DynamicButton from '../../components/common/DynamicButton';
import DynamicText from '../../components/common/DynamicText';
import Input from '../../components/common/Input';
import useAutoScreen from '../../components/context/useAutoScreen';
import LinearGradient from 'react-native-linear-gradient';
import { getDarkModePreference } from '../../components/common/darkModePreference';
import DeviceInfo from 'react-native-device-info';
interface LoginPagesProps { }
type homeScreenProp = StackNavigationProp<RootStackParamList, 'DrawerScreen'>;

const LoginPages: React.FC<LoginPagesProps> = () => {
  const colorSystem = useSelector(
    (state: RootState) => state.todoReducer.colorSystem,
  );

  const navigation = useNavigation<homeScreenProp>();
  const autoScreen = useAutoScreen();
  const dispatch = useDispatch();
  const isWebSetting = useSelector(
    (state: RootState) => state.todoReducer.isWebSetting,
  );
  const isTokenNotify = useSelector(
    (state: RootState) => state.todoReducer.isTokenNotify,
  );
  const isDarkMode = getDarkModePreference();
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [konfirmasi_password, setKonfirmasi_password] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [isswitch, setSwitch] = useState<boolean>(true);
  const [keepLogin, setKeepLogin] = useState(false);
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Home');
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      fetchDataApi();
    });
    return () => {
      unsubscribe();
    };
  }, []);
  const fetchDataApi = async () => { };
  const fetchLogin = async (phone: any, password: any, keepLogin: any) => {
    dispatch(isPending(true));
    try {
      const params = new URLSearchParams();
      params.append('nomor', phone?.replace('+62', '0'));
      params.append('password', password);
      params.append('keeplogin', keepLogin);
      const response = await apiClient({
        baseurl: 'user/login',
        method: 'POST',
        XGORDON: 'LOGIN',
        body: params,
      });
      dispatch(isPending(false));
      if (response?.statusCode === 200) {
        if (
          response?.result.status_verifikasi === 'Sudah Terverifikasi' &&
          response?.result.status_akun === 'Aktif'
        ) {
          const apiKey = response?.result.api_key;
          const token = response?.result.token;
          const apiData = { apiKey, token };
          await AsyncStorage.setItem('isLogin', JSON.stringify(apiData));
          dispatch(isLogin(apiData));

          let getSystemName = DeviceInfo.getSystemName();
          let getModel = DeviceInfo.getModel();
          fetchSetToken(
            response?.result.api_key,
            response?.result.token,
            isTokenNotify,
            getSystemName + ' ' + getModel,
          );

          fetchDataProfile(apiKey, token);
        } else {
          navigation.navigate('OTP', { phone: phone?.replace('+62', '0') });
        }
      } else {
        dispatch(setDropdownAlert('error', 'Error', response?.result.msg));
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
  const fetchSetToken = async (
    api_key: any,
    token: any,
    tokenPush: any,
    device_id: any,
  ) => {
    try {
      const params = new URLSearchParams();
      params.append('api_key', api_key);
      params.append('token', tokenPush);
      params.append('device_id', device_id);
      const response = await apiClient({
        baseurl: 'user/tokenFirebase',
        method: 'POST',
        XGORDON: 'TOKENFIREBASE',
        apiKey: api_key,
        token: token,
        body: params,
      });
      if (response?.statusCode === 200) {
        console.log(response?.result.msg);
      } else {
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetchRegister = async (
    fullname: any,
    phone: any,
    email: any,
    password: any,
    konfirmasi_password: any,
  ) => {
    dispatch(isPending(true));
    try {
      const params = new URLSearchParams();
      params.append('full_name', fullname);
      params.append('ponsel', phone?.replace('+62', '0'));
      params.append('password', password);
      params.append('konfirmasi_password', konfirmasi_password);
      params.append('email', email);
      const response = await apiClient({
        baseurl: 'user/register',
        method: 'POST',
        XGORDON: 'REGISTER',
        body: params,
      });
      dispatch(isPending(false));
      if (response?.statusCode === 200) {
        navigation.navigate('OTP', { phone: phone?.replace('+62', '0') });
      } else {
        dispatch(
          dispatch(setDropdownAlert('error', 'Error', response?.result.msg)),
        );
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1, backgroundColor: isDarkMode
          ? colorSystem.dark.background
          : colorSystem.light.background
      }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={isDarkMode
          ? colorSystem.dark.primary
          : colorSystem.light.primary}
        translucent={false}
        networkActivityIndicatorVisible={true}
      />
      <View style={{ flex: 1, flexDirection: 'column', gap: 8 }}>
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
              backgroundColor: isDarkMode
                ? colorSystem.dark.card
                : colorSystem.light.card,
              elevation: 1,
              borderRadius: 6,
              gap: 16,
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                overflow: 'hidden',
                borderRadius: 6,
              }}>
              <LinearGradient
                colors={
                  !isswitch ? ['#C2C2C2', '#EBEBEB'] : isDarkMode
                    ? colorSystem.dark.gradient
                    : colorSystem.light.gradient
                }
                style={{
                  flex: 1,
                  height: 50,
                }}>
                <DynamicButton
                  initialValue="Masuk"
                  styleSelected={{
                    borderRadius: 0,
                    flex: 1,
                    elevation: 0,
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                  }}
                  colorText={!isswitch ? '#818994' : '#ffffff'}
                  onPress={() => {
                    setSwitch(true);
                  }}
                />
              </LinearGradient>
              <LinearGradient
                colors={
                  isswitch ? ['#C2C2C2', '#EBEBEB'] : isDarkMode
                    ? colorSystem.dark.gradient
                    : colorSystem.light.gradient
                }
                style={{
                  flex: 1,
                  height: 50,
                }}>
                <DynamicButton
                  initialValue="Daftar"
                  styleSelected={{
                    borderRadius: 0,
                    flex: 1,
                    elevation: 0,
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                  }}
                  colorText={isswitch ? '#818994' : '#ffffff'}
                  onPress={() => {
                    setSwitch(false);
                  }}
                />
              </LinearGradient>
            </View>
            <View
              style={{ flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              {isDarkMode ?
                <FastImage
                  source={{ uri: isWebSetting?.logo_dark || '' }}
                  resizeMode={FastImage.resizeMode.contain}
                  style={{
                    width: autoScreen / 3,
                    aspectRatio: 2.5,
                  }}
                /> :
                <FastImage
                  source={{ uri: isWebSetting?.logo || '' }}
                  resizeMode={FastImage.resizeMode.contain}
                  style={{
                    width: autoScreen / 3,
                    aspectRatio: 2.5,
                  }}
                />}

              <View
                style={{ flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                <DynamicText bold size={16}>
                  Selamat Datang,
                </DynamicText>
                <DynamicText size={12} style={{ color: '#818994' }}>
                  {isswitch
                    ? 'Masuk menggunakan akun yang telah terdaftar'
                    : 'Masukan data pendaftaran dengan benar'}
                </DynamicText>
              </View>
            </View>
            {isswitch ? (
              <View style={{ flexDirection: 'column', width: '100%', gap: 8 }}>
                <Input
                  label={'Nomor WhatsApp'}
                  value={phone}
                  onChange={value => setPhone(value)}
                  type={'phone-pad'}
                  placeholder={'Masukan Nomor WhatsApp'}
                />
                <Input
                  label={'Password'}
                  icon={
                    <PasswordIcon
                      width={18}
                      height={18}
                      style={{
                        color: '#818994',
                      }}
                    />
                  }
                  value={password}
                  onChange={value => setPassword(value)}
                  type={'password'}
                  placeholder={'Masukan Password'}
                />
                <View
                  style={{
                    marginVertical: 8,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <CheckBox
                    label="Ingat Saya"
                    onChange={(event: any) => {
                      setKeepLogin(event);
                    }}
                    style={{}}
                  />
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      navigation.navigate('ForgotPassword');
                    }}>
                    <DynamicText size={12}>Lupa Password?</DynamicText>
                  </TouchableOpacity>
                </View>
                <DynamicButton
                  initialValue="Login"
                  styleSelected={{
                    backgroundColor: isDarkMode
                      ? colorSystem.dark.primary
                      : colorSystem.light.primary,
                    borderWidth: 0,
                  }}
                  colorText={'#ffffff'}
                  onPress={() => {
                    fetchLogin(phone, password, keepLogin);
                  }}
                />
              </View>
            ) : (
              <View style={{ flexDirection: 'column', width: '100%', gap: 8 }}>
                <Input
                  label={'Nama Lengkap'}
                  value={fullname}
                  icon={
                    <ProfileIcon
                      width={18}
                      height={18}
                      style={{
                        color: '#818994',
                      }}
                    />
                  }
                  onChange={value => setFullname(value)}
                  type={'default'}
                  placeholder={'Masukan Nama Lengkap'}
                />
                <Input
                  label={'Nomor WhatsApp'}
                  value={phone}
                  onChange={value => setPhone(value)}
                  type={'phone-pad'}
                  placeholder={'Masukan Nomor WhatsApp'}
                />
                <Input
                  label={'Email'}
                  icon={
                    <MailIcon
                      width={18}
                      height={18}
                      style={{
                        color: '#818994',
                      }}
                    />
                  }
                  value={email}
                  onChange={value => setEmail(value)}
                  type={'email-address'}
                  placeholder={'Masukan Email'}
                />
                <Input
                  label={'Password'}
                  icon={
                    <PasswordIcon
                      width={18}
                      height={18}
                      style={{
                        color: '#818994',
                      }}
                    />
                  }
                  value={password}
                  onChange={value => setPassword(value)}
                  type={'password'}
                  placeholder={'Masukan Password'}
                />
                <Input
                  label={'Ulangi Password Password'}
                  icon={
                    <PasswordIcon
                      width={18}
                      height={18}
                      style={{
                        color: '#818994',
                      }}
                    />
                  }
                  value={konfirmasi_password}
                  onChange={value => setKonfirmasi_password(value)}
                  type={'password'}
                  placeholder={'Ulangi Password'}
                />
                <DynamicButton
                  initialValue="Daftar"
                  styleSelected={{
                    backgroundColor: isDarkMode
                      ? colorSystem.dark.primary
                      : colorSystem.light.primary,
                    borderWidth: 0,
                  }}
                  colorText={'#ffffff'}
                  onPress={() => {
                    const emailRegex =
                      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
                    if (!emailRegex.test(email)) {
                      dispatch(
                        dispatch(
                          setDropdownAlert(
                            'error',
                            'Error',
                            'Email tidak valid. Mohon periksa masukan Anda.',
                          ),
                        ),
                      );
                      return;
                    }
                    fetchRegister(
                      fullname,
                      phone,
                      email,
                      password,
                      konfirmasi_password,
                    );
                  }}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginPages;
