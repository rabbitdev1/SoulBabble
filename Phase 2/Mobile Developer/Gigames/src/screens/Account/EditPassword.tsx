import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useRef, useState} from 'react';

import {
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootStackParamList} from '../../../App';
import {isPending, setDropdownAlert} from '../../../store/actions/todoActions';

import {RootState} from '../../../store/reducers';
import {apiClient} from '../../../utils/api/apiClient';
import '../../../utils/ignoreWarnings';
import DynamicButton from '../../components/common/DynamicButton';
import Input from '../../components/common/Input';
import useAutoScreen from '../../components/context/useAutoScreen';
import TopBar from '../../components/ui/TopBar';
import FastImage from 'react-native-fast-image';
import { getDarkModePreference } from '../../components/common/darkModePreference';

interface EditPasswordProps {}
type EditPasswordScreenProp = StackNavigationProp<
  RootStackParamList,
  'DrawerScreen'
>;
/* toggle includeExtra */

const EditPasswordpages: React.FC<EditPasswordProps> = () => {
  const colorSystem = useSelector(
      (state: RootState) => state.todoReducer.colorSystem,
    );
  
  const navigation = useNavigation<EditPasswordScreenProp>();
  const dispatch = useDispatch();
  const autoScreen = useAutoScreen();

  const scrollYAnimatedValue = useRef(new Animated.Value(0)).current;
  const isLogin = useSelector((state: RootState) => state.todoReducer.isLogin);
  const isDarkMode = getDarkModePreference();
  const [formProfile, setformProfile] = useState([
    {
      name: 'password',
      title: 'Password Lama',
      value: '',
      type: 'password',
      placeholder: 'Masukan Password Lama',
    },
    {
      name: 'password_baru',
      title: 'Password Baru',
      value: '',
      type: 'password',
      placeholder: 'Masukan Password Baru',
    },
    {
      name: 'ulangi_password_baru',
      title: 'Konfirmasi Password',
      value: '',
      type: 'password',
      placeholder: 'Konfirmasi Password Baru',
    },
  ]);

  const changeEditPassword = async () => {
    dispatch(isPending(true));
    try {
      const params = new URLSearchParams();
      params.append('api_key', isLogin?.apiKey);
      formProfile.forEach(item => {
        params.append(item.name, item.value);
      });

      const response = await apiClient({
        baseurl: 'user/ubah_profile?password',
        method: 'POST',
        XGORDON: 'UBAHPROFILE',
        body: params,
        apiKey: isLogin?.apiKey,
        token: isLogin?.token,
      });
      dispatch(isPending(false));
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
          <TopBar
            isIconLeft={false}
            isShowLogo={false}
            title={'Ganti Password'}
          />
          <View style={{flexDirection: 'column', marginHorizontal: 16, gap: 16,marginBottom:16}}>
         <View style={{alignItems:'center'}}>
         <FastImage
                source={require('../../assets/images/password_images.png')}
                resizeMode={FastImage.resizeMode.contain}
                style={{
                  width: autoScreen / 2,
                  aspectRatio: 1,
                }}
              />
         </View>
            {formProfile.map((input, index) => (
              <View key={index}>
                <Input
                  label={input.title}
                  value={input.value === undefined ? '' : input.value}
                  onChange={value => {
                    const inputValue = value;
                    if (inputValue.length <= 200) {
                      const newInputs = [...formProfile];
                      newInputs[index].value = value;
                      setformProfile(newInputs);
                    }
                  }}
                  type={'password'}
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
            }}
            colorText={'#ffffff'}
            onPress={() => {
              changeEditPassword();
            }}
          />
        </View>
      </View>
      <HeaderAnimation />
    </SafeAreaView>
  );
};

export default EditPasswordpages;
