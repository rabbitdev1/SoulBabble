import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useRef, useState} from 'react';

import {
  Animated,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import {useDispatch, useSelector} from 'react-redux';
import {RootStackParamList} from '../../../App';
import {
  isPending,
  isProfile,
  setDropdownAlert,
} from '../../../store/actions/todoActions';

import {REACT_APP_API} from '@env';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {RootState} from '../../../store/reducers';
import {apiClient} from '../../../utils/api/apiClient';
import '../../../utils/ignoreWarnings';
import DynamicButton from '../../components/common/DynamicButton';
import DynamicText from '../../components/common/DynamicText';
import Input from '../../components/common/Input';
import useAutoScreen from '../../components/context/useAutoScreen';
import TopBar from '../../components/ui/TopBar';
import {getDarkModePreference} from '../../components/common/darkModePreference';

interface EditProfileProps {}
type EditProfileScreenProp = StackNavigationProp<
  RootStackParamList,
  'DrawerScreen'
>;
/* toggle includeExtra */
const includeExtra = true;

const EditProfilepages: React.FC<EditProfileProps> = () => {
  const colorSystem = useSelector(
    (state: RootState) => state.todoReducer.colorSystem,
  );

  const navigation = useNavigation<EditProfileScreenProp>();
  const dispatch = useDispatch();
  const autoScreen = useAutoScreen();

  const isProfileDetail = useSelector(
    (state: RootState) => state.todoReducer.isProfile,
  );

  const scrollYAnimatedValue = useRef(new Animated.Value(0)).current;
  const isLogin = useSelector((state: RootState) => state.todoReducer.isLogin);

  const isDarkMode = getDarkModePreference();
  const [filePath, setFilePath] = useState<any>({});

  const [formProfile, setformProfile] = useState([
    {title: 'Nama Lengkap', value: '', disabled: false},
    {title: 'Email', value: '', disabled: true},
    {title: 'Nomor Whatsapp', value: '', disabled: true},
  ]);

  useEffect(() => {

    setformProfile([
      {title: 'Nama Lengkap', value: isProfileDetail?.nama, disabled: false},
      {title: 'Nomor Whatsapp', value: isProfileDetail?.ponsel, disabled: true},
      {title: 'Email', value: isProfileDetail?.email, disabled: true},
    ]);
  }, []);

  const changeEditProfile = async () => {
    dispatch(isPending(true));
    try {
      const params = new URLSearchParams();
      params.append('api_key', isLogin?.apiKey);
      params.append('nama', formProfile[0]?.value);

      const response = await apiClient({
        baseurl: 'user/ubah_profile?ubahnama',
        method: 'POST',
        XGORDON: 'UBAHPROFILE',
        body: params,
        apiKey: isLogin?.apiKey,
        token: isLogin?.token,
      });
      dispatch(isPending(false));
      if (response?.statusCode === 200) {
        dispatch(setDropdownAlert('success', 'Berhasil', response?.result.msg));
        fetchDataProfile(isLogin?.apiKey, isLogin?.token);
      } else {
        dispatch(setDropdownAlert('error', 'Error', response?.result.msg));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const setUploadPhoto = async () => {
    dispatch(isPending(true));
    try {
      let formdata = new FormData();
      let uploadImage = {
        uri: filePath?.assets[0].uri,
        type: filePath?.assets[0].type,
        name: filePath?.assets[0].fileName,
      };
      formdata.append('gambar', uploadImage);
      const headers = {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + isLogin?.token,
        },
        body: formdata,
      };
      const response = await fetch(
        REACT_APP_API + 'user/upload_profile?key=' + isLogin?.apiKey,
        headers,
      );
      const data = await response.json();
      if (response.status === 200) {
        if (data.msg === 'Success Upload Logo') {
          changeEditProfile();
        }
      } else {
        dispatch(setDropdownAlert('error', 'Error', data.msg));
      }
    } catch (error) {
      console.log('Error:', error);
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
        navigation.navigate('Account');
      } else {
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
        <TopBar isIconLeft={false} isShowLogo={false} title={'Edit Profil'} />
      </Animated.View>
    );
  };

  const onButtonPress = React.useCallback((type: any, options: any) => {
    if (type === 'capture') {
      ImagePicker.launchCamera(options, response => {
        console.log('Response = ', response);
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker errorCode: ', response.errorCode);
        } else if (response.errorMessage) {
          console.log('ImagePicker errorCode: ', response.errorMessage);
        } else {
          setFilePath(response);
        }
      });
    } else {
      ImagePicker.launchImageLibrary(options, response => {
        console.log('Response = ', response);
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker errorCode: ', response.errorCode);
        } else if (response.errorMessage) {
          console.log('ImagePicker errorCode: ', response.errorMessage);
        } else {
          setFilePath(response);
        }
      });
    }
  }, []);

  const requestCameraPermission = async (type: any, options: any) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission given');
        onButtonPress(type, options);
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: isDarkMode
              ? colorSystem.dark.background
              : colorSystem.light.background}}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={ isDarkMode
              ? colorSystem.dark.card
              : colorSystem.light.card}
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
          <TopBar isIconLeft={false} isShowLogo={false} title={'Edit Profil'} />
          <View
            style={{
              flexDirection: 'column',
              marginHorizontal: 16,
              gap: 16,
              marginBottom: 16,
            }}>
            <View
              style={{flexDirection: 'column', gap: 8, alignItems: 'center'}}>
              <FastImage
                source={{
                  uri:
                    typeof filePath === 'object' &&
                    Object.keys(filePath).length === 0
                      ? isProfileDetail?.profil
                      : filePath?.assets[0]?.uri,
                }}
                resizeMode={FastImage.resizeMode.cover}
                style={{
                  width: autoScreen / 4,
                  aspectRatio: 1 / 1,
                  borderRadius: 50,
                }}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  requestCameraPermission('library', {
                    saveToPhotos: true,
                    formatAsMp4: true,
                    mediaType: 'photo',
                    includeExtra,
                  });
                }}>
                <DynamicText size={12} semiBold style={{color:  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary}}>
                  Ganti Foto
                </DynamicText>
              </TouchableOpacity>
            </View>
            {formProfile.map((input, index) => (
              <View key={index}>
                <Input
                  label={input.title}
                  value={input.value === undefined ? '' : input.value}
                  onChange={value => {
                    const inputValue = value;
                    if (inputValue.length <= 200) {
                      setformProfile(prevFormProfile => {
                        const updatedFormProfile = [...prevFormProfile];
                        const namaLengkapIndex = updatedFormProfile.findIndex(
                          item => item.title === 'Nama Lengkap',
                        );
                        if (namaLengkapIndex !== -1) {
                          updatedFormProfile[namaLengkapIndex].value =
                            inputValue;
                        }
                        return updatedFormProfile;
                      });
                    }
                  }}
                  disabled={!input.disabled}
                  type={'default'}
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
            flexDirection: 'column',
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
          <DynamicButton
            initialValue="Simpan Perubahan"
            styleSelected={{
              backgroundColor:  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary,
              borderWidth: 0,
            }}
            colorText={'#ffffff'}
            onPress={() => {
              if (
                typeof filePath === 'object' &&
                Object.keys(filePath).length === 0
              ) {
                changeEditProfile();
              } else {
                setUploadPhoto();
              }
            }}
          />
        </View>
      </View>
      <HeaderAnimation />
    </SafeAreaView>
  );
};

export default EditProfilepages;
