import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {
  BackHandler,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
import {RootStackParamList} from '../../../App';
import {isPending, setDropdownAlert} from '../../../store/actions/todoActions';
import {RootState} from '../../../store/reducers';
import {apiClient} from '../../../utils/api/apiClient';
import '../../../utils/ignoreWarnings';
import DynamicButton from '../../components/common/DynamicButton';
import DynamicText from '../../components/common/DynamicText';
import Input from '../../components/common/Input';
import useAutoScreen from '../../components/context/useAutoScreen';
import {getDarkModePreference} from '../../components/common/darkModePreference';
interface ForgotPasswordPagesProps {}
type homeScreenProp = StackNavigationProp<RootStackParamList, 'DrawerScreen'>;
const ForgotPasswordPages: React.FC<ForgotPasswordPagesProps> = () => {
  const colorSystem = useSelector(
    (state: RootState) => state.todoReducer.colorSystem,
  );

  const navigation = useNavigation<homeScreenProp>();
  const autoScreen = useAutoScreen();
  const dispatch = useDispatch();
  const isWebSetting = useSelector(
    (state: RootState) => state.todoReducer.isWebSetting,
  );
  const isDarkMode = getDarkModePreference();
  const [phone, setPhone] = useState<string>('');
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
    fetchDataApi();
  }, []);
  const fetchDataApi = async () => {};
  const fetchForgot = async (phone: any) => {
    dispatch(isPending(true));
    try {
      const params = new URLSearchParams();
      params.append('nomor', phone?.replace('+62', '0'));
      const response = await apiClient({
        baseurl: 'user/forgot',
        XGORDON: 'FORGOT',
        method: 'POST',
        body: params,
      });
      dispatch(isPending(false));
      if (response?.statusCode === 200) {
        dispatch(
          dispatch(setDropdownAlert('error', 'Error', response?.result.msg)),
        );
        navigation.goBack();
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
        flex: 1,
        backgroundColor: isDarkMode
          ? colorSystem.dark.background
          : colorSystem.light.background,
      }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={
          isDarkMode ? colorSystem.dark.primary : colorSystem.light.primary
        }
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
              backgroundColor: isDarkMode
                ? colorSystem.dark.card
                : colorSystem.light.card,
              elevation: 1,
              borderRadius: 6,
              gap: 16,
            }}>
            <View
              style={{flexDirection: 'column', alignItems: 'center', gap: 16}}>
              {isDarkMode ? (
                <FastImage
                  source={{uri: isWebSetting?.logo_dark || ''}}
                  resizeMode={FastImage.resizeMode.contain}
                  style={{
                    width: autoScreen / 3,
                    aspectRatio: 2.5,
                  }}
                />
              ) : (
                <FastImage
                  source={{uri: isWebSetting?.logo || ''}}
                  resizeMode={FastImage.resizeMode.contain}
                  style={{
                    width: autoScreen / 3,
                    aspectRatio: 2.5,
                  }}
                />
              )}
              <FastImage
                source={require('../../assets/images/password_images.png')}
                resizeMode={FastImage.resizeMode.contain}
                style={{
                  width: autoScreen / 2,
                  aspectRatio: 1,
                }}
              />
              <View
                style={{flexDirection: 'column', gap: 4, alignItems: 'center'}}>
                <DynamicText bold size={16}>
                  Lupa Password
                </DynamicText>
                <DynamicText size={12} style={{color: '#818994'}}>
                  Masukan Nomor yang digunakan saat mendaftar
                </DynamicText>
              </View>
            </View>
            <View style={{flexDirection: 'column', width: '100%', gap: 8}}>
              <Input
                label={'Nomor WhatsApp'}
                value={phone}
                onChange={value => setPhone(value)}
                type={'phone-pad'}
                placeholder={'Masukan Nomor WhatsApp'}
              />
              <DynamicButton
                initialValue="Lupa Password"
                styleSelected={{
                  backgroundColor: isDarkMode
                    ? colorSystem.dark.primary
                    : colorSystem.light.primary,
                  borderWidth: 0,
                }}
                colorText={'#ffffff'}
                onPress={() => {
                  const phoneRegex = /^/;
                  if (!phoneRegex.test(phone)) {
                    dispatch(
                      dispatch(
                        setDropdownAlert(
                          'error',
                          'Error',
                          'Nomor telepon tidak valid. Mohon periksa masukan Anda.',
                        ),
                      ),
                    );
                    return;
                  }
                  fetchForgot(phone);
                }}
              />
              <DynamicButton
                initialValue="Kembali"
                styleSelected={{
                  borderColor: isDarkMode
                    ? colorSystem.dark.primary
                    : colorSystem.light.primary,
                  backgroundColor: isDarkMode
                    ? colorSystem.dark.background
                    : colorSystem.light.background,
                  borderWidth: 1,
                }}
                colorText={
                  isDarkMode
                    ? colorSystem.dark.primary
                    : colorSystem.light.primary
                }
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

export default ForgotPasswordPages;
