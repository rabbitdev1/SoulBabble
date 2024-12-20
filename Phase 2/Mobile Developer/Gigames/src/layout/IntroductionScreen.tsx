import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions, useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef} from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import DynamicText from '../components/common/DynamicText';
import useAutoScreen from '../components/context/useAutoScreen';
import DynamicButton from '../components/common/DynamicButton';
import {getDarkModePreference} from '../components/common/darkModePreference';
import {
  checkPermission,
  requestPermission,
  requestStoragePermission,
  requestStoragePermission1,
} from '../components/context/NotificationPermissions';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducers';

const IntroductionScreen: React.FC = () => {
  const navigation = useNavigation();
  const slider = useRef<any>(null);
  const autoScreen = useAutoScreen();
  const isDarkMode = getDarkModePreference();

  const colorSystem = useSelector(
    (state: RootState) => state.todoReducer.colorSystem,
  );
  const slides: any = [
    {
      key: '1',
      title: 'Top-up Game Lebih Mudah',
      image: require('../assets/images/intro/1.png'),
      desc: 'Top up game kini lebih mudah, top-up kapanpun dan dimanapun!',
      done: '0',
    },
    {
      key: '2',
      title: 'Layanan Top-up Lengkap',
      image: require('../assets/images/intro/2.png'),
      desc: 'Top-up game dan kebutuhanmu bisa dalam satu aplikasi, pilihan update selalu update!',
      done: '0',
    },
    {
      key: '2',
      title: 'Tingkatkan Status Member',
      image: require('../assets/images/intro/3.png'),
      desc: 'Tingkatkan level membermu untuk dapatkan harga terbaik disetiap pembelian!',
      done: '1',
    },
  ];

  useEffect(() => {
    checkPermission();
  }, []);

  const renderItem = ({item}: {item: any}) => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 32,
          position: 'relative',
          gap: 16,
        }}>
        <View style={{flex: 1}}></View>
        <Image
          source={item.image}
          style={{
            width: autoScreen / 2,
            height: autoScreen / 2,
            resizeMode: 'contain',
          }}
        />
        <View
          style={{
            flexDirection: 'column',
            gap: 8,
            alignItems: 'center',
            paddingHorizontal: 16,
          }}>
          <DynamicText size={16} bold>
            {item.title}
          </DynamicText>
          <DynamicText size={12} style={{textAlign: 'center'}}>
            {item.desc}
          </DynamicText>
        </View>
        <View style={{flex: 2}}></View>
      </View>
    );
  };

  const renderPagination = (activeIndex: number) => {
    return (
      <View style={{flexDirection: 'column'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {slides.length > 1 &&
            slides.map((_:any, i:any) => (
              <TouchableOpacity
                activeOpacity={0.9}
                key={i}
                style={[
                  {height: 10, borderRadius: 6, marginHorizontal: 4},
                  i === activeIndex
                    ? {
                        width: 30,
                        backgroundColor: isDarkMode
                          ? colorSystem.dark.primary
                          : colorSystem.light.primary,
                      }
                    : {width: 10, backgroundColor: 'rgba(0, 0, 0, .2)'},
                ]}
                onPress={() => slider.current?.goToSlide(i, true)}
              />
            ))}
        </View>
        <View
          style={{
            flexDirection: 'row',
            zIndex: -1,
            position: 'relative',
          }}>
          <View
            style={{
              bottom: 0,
              position: 'absolute',
              right: 0,
              left: 0,
            }}>
            <Image
              source={require('../assets/images/intro/11.png')}
              style={{
                width: '100%',
                height: undefined,
                aspectRatio: 1,
                resizeMode: 'contain',
              }}
            />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              gap: 8,
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              padding: 16,
            }}>
            <DynamicButton
              initialValue="Mulai"
              styleSelected={{
                backgroundColor: isDarkMode
                  ? colorSystem.dark.primary
                  : colorSystem.light.primary,
                borderWidth: 0,
              }}
              colorText={'#ffffff'}
              onPress={handleDone}
            />
          </View>
        </View>
      </View>
    );
  };

  const handleDone = async () => {
    // if (Platform.OS !== 'android' || Platform.Version >= 27) {
    // }
    requestPermission();

    requestStoragePermission();
    requestStoragePermission1();
    await AsyncStorage.setItem('Intro', '1');
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'DrawerScreen'}],
      }),
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
        barStyle="dark-content"
        hidden={false}
        backgroundColor="transparent"
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
      <AppIntroSlider
        renderItem={renderItem}
        data={slides}
        renderPagination={renderPagination}
        ref={slider}
      />
    </SafeAreaView>
  );
};

export default IntroductionScreen;
