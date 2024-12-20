import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  ImageBackground,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
import {RootStackParamList} from '../../../App';
import {RootState} from '../../../store/reducers';
import '../../../utils/ignoreWarnings';
import Add_btn from '../../assets/icon/ic_add.svg';
import ArrowLeft_btn from '../../assets/icon/ic_arrowleft.svg';
import LogSaldo_btn from '../../assets/icon/ic_balance_wallet.svg';
import GiftCard_btn from '../../assets/icon/ic_giftCard.svg';
import Password_btn from '../../assets/icon/ic_key.svg';
import Membership_btn from '../../assets/icon/ic_membership.svg';
import Notification_btn from '../../assets/icon/ic_notification.svg';
import Point_btn from '../../assets/icon/ic_point.svg';
import Profile_btn from '../../assets/icon/ic_profile.svg';
import Wallet_btn from '../../assets/icon/ic_wallet.svg';
import Email_btn from '../../assets/icon/socialmedia/ic_email.svg';
import Whatsapp_btn from '../../assets/icon/socialmedia/ic_wa.svg';
import LeaderBoard_btn from '../../assets/icon/ic_leaderboard.svg';
import SaveID_btn from '../../assets/icon/ic_saveID.svg';

import Dukungan_btn from '../../assets/icon/ic_dukungan.svg';
import FAQ_btn from '../../assets/icon/ic_faq.svg';
import Keluar_btn from '../../assets/icon/ic_keluar.svg';
import List_btn from '../../assets/icon/ic_list.svg';
import Privacy_btn from '../../assets/icon/ic_privacy.svg';
import Search_btn from '../../assets/icon/ic_search.svg';

import {TouchableOpacity} from 'react-native-gesture-handler';
import {isLogOut, isProfile} from '../../../store/actions/todoActions';
import {apiClient} from '../../../utils/api/apiClient';
import DarkModeToggle from '../../components/common/DarkModeToggle';
import DynamicButton from '../../components/common/DynamicButton';
import DynamicText from '../../components/common/DynamicText';
import {getDarkModePreference} from '../../components/common/darkModePreference';
import {formatCurrency} from '../../components/common/formatCurrency';
import {refreshControl} from '../../components/context/refreshFunctions';
import TopBar from '../../components/ui/TopBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AccountPagesProps {}
type homeScreenProp = StackNavigationProp<RootStackParamList, 'DrawerScreen'>;

const AccountPages: React.FC<AccountPagesProps> = () => {
  const colorSystem = useSelector(
    (state: RootState) => state.todoReducer.colorSystem,
  );

  const navigation = useNavigation<homeScreenProp>();
  const dispatch = useDispatch();
  const isProfileShow = useSelector(
    (state: RootState) => state.todoReducer.isProfile,
  );
  const scrollYAnimatedValue = useRef(new Animated.Value(0)).current;
  const isLogin = useSelector((state: RootState) => state.todoReducer.isLogin);
  const route = useRoute();
  const currentPath = route.name;
  const isDarkMode = getDarkModePreference();
  const [refreshingPage, setrefreshingPage] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      fetchDataApi();
    });
    return () => {
      unsubscribe();
    };
  }, [currentPath, isLogin]);

  const fetchDataApi = async () => {
    console.log(isLogin);

    if (currentPath === 'Account') {
      if (isLogin !== '') {
        fetchDataProfile(isLogin?.apiKey, isLogin?.token);
      }
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
      } else {
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleRefresh = () => {
    refreshControl(setrefreshingPage, fetchDataApi);
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
          title={'Account'}
          style={{
            backgroundColor: isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary,
          }}
          colorText="#ffffff"
        />
      </Animated.View>
    );
  };

  if (currentPath === 'Account' && isLogin !== '') {
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
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshingPage}
              onRefresh={handleRefresh}
            />
          }
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollYAnimatedValue}}}],
            {useNativeDriver: false},
          )}>
          <View style={{flex: 1, flexDirection: 'column', gap: 8}}>
            <ImageBackground
              style={{
                width: '100%',
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
                paddingBottom: 54,
              }}
              source={require('../../../src/assets/images/ornament_1.png')}
              imageStyle={{
                resizeMode: 'cover',
                alignSelf: 'center',
              }}>
              <TopBar
                isIconLeft={false}
                isShowLogo={false}
                title={'Account'}
                colorText="#ffffff"
                transparent={true}
              />
              <View style={{flexDirection: 'column', gap: 16}}>
                <View
                  style={{
                    paddingHorizontal: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                  }}>
                  <View
                    style={{
                      width: '18%',
                      aspectRatio: 1,
                      overflow: 'hidden',
                      borderRadius: 50,
                    }}>
                    <FastImage
                      resizeMode={FastImage.resizeMode.contain}
                      source={{uri: isProfileShow?.profil}}
                      style={{width: '100%', height: '100%'}}
                    />
                  </View>
                  <View style={{flexDirection: 'column', gap: 4, flex: 1}}>
                    <DynamicText
                      size={14}
                      bold
                      style={{color: 'white'}}
                      numberOfLines={1}>
                      {isProfileShow?.nama}
                    </DynamicText>
                    <DynamicText
                      size={12}
                      light
                      style={{color: 'white'}}
                      numberOfLines={1}>
                      {isProfileShow?.level?.toUpperCase()}
                    </DynamicText>
                  </View>
                  <View
                    style={{
                      width: '15%',
                      aspectRatio: 1,
                    }}>
                    <FastImage
                      resizeMode={FastImage.resizeMode.contain}
                      source={
                        isProfileShow?.level === 'member'
                          ? require('../../assets/images/membership/badge_member.png')
                          : isProfileShow?.level === 'silver'
                          ? require('../../assets/images/membership/badge_silver.png')
                          : isProfileShow?.level === 'pro'
                          ? require('../../assets/images/membership/badge_pro.png')
                          : isProfileShow?.level === 'gold'
                          ? require('../../assets/images/membership/badge_gold.png')
                          : require('../../assets/images/membership/badge_member.png')
                      }
                      style={{width: '100%', height: '100%'}}
                    />
                  </View>
                </View>

                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    flexDirection: 'row',
                    gap: 8,
                    padding: 12,
                    marginHorizontal: 16,
                    backgroundColor: isDarkMode
                      ? colorSystem.dark.card
                      : colorSystem.light.card,
                    borderRadius: 6,
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      flexDirection: 'row',
                    }}>
                    <Whatsapp_btn
                      width={18}
                      height={18}
                      style={{
                        color: isDarkMode
                          ? colorSystem.dark.primary
                          : colorSystem.light.primary,
                      }}
                    />
                    <DynamicText size={12} numberOfLines={1}>
                      {isProfileShow?.ponsel}
                    </DynamicText>
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      flexDirection: 'row',
                    }}>
                    <Email_btn
                      width={18}
                      height={18}
                      style={{
                        color: isDarkMode
                          ? colorSystem.dark.primary
                          : colorSystem.light.primary,
                      }}
                    />
                    <DynamicText size={12} numberOfLines={1}>
                      {isProfileShow?.email}
                    </DynamicText>
                  </View>
                </View>
              </View>
            </ImageBackground>

            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'space-around',
                flexDirection: 'row',
                marginHorizontal: 16,
                backgroundColor: isDarkMode
                  ? colorSystem.dark.card
                  : colorSystem.light.card,
                borderRadius: 6,
                elevation: 1,
                marginTop: -48,
                marginBottom: 10,
              }}>
              <View
                style={{
                  gap: 8,
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 12,
                  justifyContent: 'center',
                  borderEndWidth: 1,
                  borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
                }}>
                <View
                  style={{
                    gap: 8,
                    flex: 1,
                    flexDirection: 'column',
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      gap: 8,
                      flexDirection: 'row',
                    }}>
                    <Wallet_btn
                      width={18}
                      height={18}
                      style={{
                        color: isDarkMode
                          ? colorSystem.dark.primary
                          : colorSystem.light.primary,
                      }}
                    />
                    <DynamicText size={12} numberOfLines={1}>
                      Saldo Saya
                    </DynamicText>
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      gap: 8,
                      flexDirection: 'row',
                    }}>
                    <DynamicText size={16} bold numberOfLines={1}>
                      {formatCurrency(isProfileShow?.saldo)}
                    </DynamicText>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Saldo')}
                  activeOpacity={0.7}>
                  <Add_btn
                    width={24}
                    height={24}
                    style={{
                      color: isDarkMode
                        ? colorSystem.dark.primary
                        : colorSystem.light.primary,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  gap: 8,
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 12,
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    gap: 8,
                    flex: 1,
                    flexDirection: 'column',
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      gap: 8,
                      flexDirection: 'row',
                    }}>
                    <Point_btn
                      width={18}
                      height={18}
                      style={{
                        color: isDarkMode
                          ? colorSystem.dark.primary
                          : colorSystem.light.primary,
                      }}
                    />
                    <DynamicText size={12} numberOfLines={1}>
                      Points
                    </DynamicText>
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      gap: 4,
                      flexDirection: 'row',
                    }}>
                    <DynamicText size={16} bold numberOfLines={1}>
                      {isProfileShow?.point}
                    </DynamicText>
                    <DynamicText size={12} light>
                      Points
                    </DynamicText>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('TukarPoint')}
                  activeOpacity={0.7}>
                  <Add_btn
                    width={24}
                    height={24}
                    style={{
                      color: isDarkMode
                        ? colorSystem.dark.primary
                        : colorSystem.light.primary,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{flexDirection: 'column', gap: 8}}>
              <TouchableOpacity
                onPress={() => navigation.navigate('SaveID')}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  overflow: 'hidden',
                  backgroundColor: isDarkMode
                    ? colorSystem.dark.card
                    : colorSystem.light.card,
                  marginHorizontal: 16,
                  padding: 12,
                  alignItems: 'center',
                  gap: 8,
                  borderWidth: 1,
                  borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
                  borderRadius: 6,
                }}>
                <SaveID_btn
                  width={24}
                  height={24}
                  style={{
                    color: isDarkMode
                      ? colorSystem.dark.primary
                      : colorSystem.light.primary,
                  }}
                />
                <DynamicText size={12} style={{flex: 1}}>
                  Save ID
                </DynamicText>
                <ArrowLeft_btn
                  width={12}
                  height={12}
                  style={{color: '#818994'}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Membership')}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  overflow: 'hidden',
                  backgroundColor: isDarkMode
                    ? colorSystem.dark.card
                    : colorSystem.light.card,
                  marginHorizontal: 16,
                  padding: 12,
                  alignItems: 'center',
                  gap: 8,
                  borderWidth: 1,
                  borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
                  borderRadius: 6,
                }}>
                <Membership_btn
                  width={24}
                  height={24}
                  style={{
                    color: isDarkMode
                      ? colorSystem.dark.primary
                      : colorSystem.light.primary,
                  }}
                />
                <DynamicText size={12} style={{flex: 1}}>
                  Membership
                </DynamicText>
                <ArrowLeft_btn
                  width={12}
                  height={12}
                  style={{color: '#818994'}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('GiftCard')}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  overflow: 'hidden',
                  backgroundColor: isDarkMode
                    ? colorSystem.dark.card
                    : colorSystem.light.card,
                  marginHorizontal: 16,
                  padding: 12,
                  alignItems: 'center',
                  gap: 8,
                  borderWidth: 1,
                  borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
                  borderRadius: 6,
                }}>
                <GiftCard_btn
                  width={24}
                  height={24}
                  style={{
                    color: isDarkMode
                      ? colorSystem.dark.primary
                      : colorSystem.light.primary,
                  }}
                />
                <DynamicText size={12} style={{flex: 1}}>
                  Gift Card
                </DynamicText>
                <ArrowLeft_btn
                  width={12}
                  height={12}
                  style={{color: '#818994'}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('TukarPoint')}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  overflow: 'hidden',
                  backgroundColor: isDarkMode
                    ? colorSystem.dark.card
                    : colorSystem.light.card,
                  marginHorizontal: 16,
                  padding: 12,
                  alignItems: 'center',
                  gap: 8,
                  borderWidth: 1,
                  borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
                  borderRadius: 6,
                }}>
                <LogSaldo_btn
                  width={24}
                  height={24}
                  style={{
                    color: isDarkMode
                      ? colorSystem.dark.primary
                      : colorSystem.light.primary,
                  }}
                />
                <DynamicText size={12} style={{flex: 1}}>
                  Tukar Point
                </DynamicText>
                <ArrowLeft_btn
                  width={12}
                  height={12}
                  style={{color: '#818994'}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('LogSaldo')}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  overflow: 'hidden',
                  backgroundColor: isDarkMode
                    ? colorSystem.dark.card
                    : colorSystem.light.card,
                  marginHorizontal: 16,
                  padding: 12,
                  alignItems: 'center',
                  gap: 8,
                  borderWidth: 1,
                  borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
                  borderRadius: 6,
                }}>
                <Wallet_btn
                  width={24}
                  height={24}
                  style={{
                    color: isDarkMode
                      ? colorSystem.dark.primary
                      : colorSystem.light.primary,
                  }}
                />
                <DynamicText size={12} style={{flex: 1}}>
                  Log Saldo
                </DynamicText>
                <ArrowLeft_btn
                  width={12}
                  height={12}
                  style={{color: '#818994'}}
                />
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'column', gap: 8}}>
              <DynamicText
                size={16}
                bold
                style={{paddingHorizontal: 16, marginTop: 8}}>
                Pengaturan Akun
              </DynamicText>
              <TouchableOpacity
                onPress={() => navigation.navigate('EditProfle')}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  overflow: 'hidden',
                  backgroundColor: isDarkMode
                    ? colorSystem.dark.card
                    : colorSystem.light.card,
                  marginHorizontal: 16,
                  padding: 12,
                  alignItems: 'center',
                  gap: 8,
                  borderWidth: 1,
                  borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
                  borderRadius: 6,
                }}>
                <Profile_btn
                  width={24}
                  height={24}
                  style={{
                    color: isDarkMode
                      ? colorSystem.dark.primary
                      : colorSystem.light.primary,
                  }}
                />
                <DynamicText size={12} style={{flex: 1}}>
                  Edit Profile
                </DynamicText>
                <ArrowLeft_btn
                  width={12}
                  height={12}
                  style={{color: '#818994'}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('EditPassword')}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  overflow: 'hidden',
                  backgroundColor: isDarkMode
                    ? colorSystem.dark.card
                    : colorSystem.light.card,
                  marginHorizontal: 16,
                  padding: 12,
                  alignItems: 'center',
                  gap: 8,
                  borderWidth: 1,
                  borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
                  borderRadius: 6,
                }}>
                <Password_btn
                  width={24}
                  height={24}
                  style={{
                    color: isDarkMode
                      ? colorSystem.dark.primary
                      : colorSystem.light.primary,
                  }}
                />
                <DynamicText size={12} style={{flex: 1}}>
                  Ganti Password
                </DynamicText>
                <ArrowLeft_btn
                  width={12}
                  height={12}
                  style={{color: '#818994'}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('EditPin')}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  overflow: 'hidden',
                  backgroundColor: isDarkMode
                    ? colorSystem.dark.card
                    : colorSystem.light.card,
                  marginHorizontal: 16,
                  padding: 12,
                  alignItems: 'center',
                  gap: 8,
                  borderWidth: 1,
                  borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
                  borderRadius: 6,
                }}>
                <Password_btn
                  width={24}
                  height={24}
                  style={{
                    color: isDarkMode
                      ? colorSystem.dark.primary
                      : colorSystem.light.primary,
                  }}
                />
                <DynamicText size={12} style={{flex: 1}}>
                  Ganti PIN
                </DynamicText>
                <ArrowLeft_btn
                  width={12}
                  height={12}
                  style={{color: '#818994'}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('NotificationList')}
                style={{
                  flexDirection: 'row',
                  overflow: 'hidden',
                  backgroundColor: isDarkMode
                    ? colorSystem.dark.card
                    : colorSystem.light.card,
                  marginHorizontal: 16,
                  padding: 12,
                  alignItems: 'center',
                  gap: 8,
                  borderWidth: 1,
                  borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
                  borderRadius: 6,
                }}>
                <Notification_btn
                  width={24}
                  height={24}
                  style={{
                    color: isDarkMode
                      ? colorSystem.dark.primary
                      : colorSystem.light.primary,
                  }}
                />
                <DynamicText size={12} style={{flex: 1}}>
                  Notifikasi
                </DynamicText>
                <ArrowLeft_btn
                  width={12}
                  height={12}
                  style={{color: '#818994'}}
                />
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'column', gap: 8}}>
              <DynamicText
                size={16}
                bold
                style={{paddingHorizontal: 16, marginTop: 8}}>
                Navigasi
              </DynamicText>
              <DarkModeToggle type="1" />
              <TouchableOpacity
                onPress={() => navigation.navigate('CheckInvoice')}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  overflow: 'hidden',
                  backgroundColor: isDarkMode
                    ? colorSystem.dark.card
                    : colorSystem.light.card,
                  marginHorizontal: 16,
                  padding: 12,
                  alignItems: 'center',
                  gap: 8,
                  borderWidth: 1,
                  borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
                  borderRadius: 6,
                }}>
                <Search_btn
                  width={24}
                  height={24}
                  style={{
                    color: isDarkMode
                      ? colorSystem.dark.primary
                      : colorSystem.light.primary,
                  }}
                />
                <DynamicText size={12} style={{flex: 1}}>
                  Cari Transaksi
                </DynamicText>
                <ArrowLeft_btn
                  width={12}
                  height={12}
                  style={{color: '#818994'}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('LeaderBoard')}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  overflow: 'hidden',
                  backgroundColor: isDarkMode
                    ? colorSystem.dark.card
                    : colorSystem.light.card,
                  marginHorizontal: 16,
                  padding: 12,
                  alignItems: 'center',
                  gap: 8,
                  borderWidth: 1,
                  borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
                  borderRadius: 6,
                }}>
                <LeaderBoard_btn
                  width={24}
                  height={24}
                  style={{
                    color: isDarkMode
                      ? colorSystem.dark.primary
                      : colorSystem.light.primary,
                  }}
                />
                <DynamicText size={12} style={{flex: 1}}>
                  Leaderboard
                </DynamicText>
                <ArrowLeft_btn
                  width={12}
                  height={12}
                  style={{color: '#818994'}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('DaftarLayanan')}
                style={{
                  flexDirection: 'row',
                  overflow: 'hidden',
                  backgroundColor: isDarkMode
                    ? colorSystem.dark.card
                    : colorSystem.light.card,
                  marginHorizontal: 16,
                  padding: 12,
                  alignItems: 'center',
                  gap: 8,
                  borderWidth: 1,
                  borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
                  borderRadius: 6,
                }}>
                <List_btn
                  width={24}
                  height={24}
                  style={{
                    color: isDarkMode
                      ? colorSystem.dark.primary
                      : colorSystem.light.primary,
                  }}
                />
                <DynamicText size={12} style={{flex: 1}}>
                  Daftar Layanan
                </DynamicText>
                <ArrowLeft_btn
                  width={12}
                  height={12}
                  style={{color: '#818994'}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('FAQ')}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  overflow: 'hidden',
                  backgroundColor: isDarkMode
                    ? colorSystem.dark.card
                    : colorSystem.light.card,
                  marginHorizontal: 16,
                  padding: 12,
                  alignItems: 'center',
                  gap: 8,
                  borderWidth: 1,
                  borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
                  borderRadius: 6,
                }}>
                <FAQ_btn
                  width={24}
                  height={24}
                  style={{
                    color: isDarkMode
                      ? colorSystem.dark.primary
                      : colorSystem.light.primary,
                  }}
                />
                <DynamicText size={12} style={{flex: 1}}>
                  FAQ
                </DynamicText>
                <ArrowLeft_btn
                  width={12}
                  height={12}
                  style={{color: '#818994'}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('Dukungan')}
                style={{
                  flexDirection: 'row',
                  overflow: 'hidden',
                  backgroundColor: isDarkMode
                    ? colorSystem.dark.card
                    : colorSystem.light.card,
                  marginHorizontal: 16,
                  padding: 12,
                  alignItems: 'center',
                  gap: 8,
                  borderWidth: 1,
                  borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
                  borderRadius: 6,
                }}>
                <Dukungan_btn
                  width={24}
                  height={24}
                  style={{
                    color: isDarkMode
                      ? colorSystem.dark.primary
                      : colorSystem.light.primary,
                  }}
                />
                <DynamicText size={12} style={{flex: 1}}>
                  Dukungan Pelanggan
                </DynamicText>
                <ArrowLeft_btn
                  width={12}
                  height={12}
                  style={{color: '#818994'}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('TermConditional')}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  overflow: 'hidden',
                  backgroundColor: isDarkMode
                    ? colorSystem.dark.card
                    : colorSystem.light.card,
                  marginHorizontal: 16,
                  padding: 12,
                  alignItems: 'center',
                  gap: 8,
                  borderWidth: 1,
                  borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
                  borderRadius: 6,
                }}>
                <Privacy_btn
                  width={24}
                  height={24}
                  style={{
                    color: isDarkMode
                      ? colorSystem.dark.primary
                      : colorSystem.light.primary,
                  }}
                />
                <DynamicText size={12} style={{flex: 1}}>
                  Terms and Conditional
                </DynamicText>
                <ArrowLeft_btn
                  width={12}
                  height={12}
                  style={{color: '#818994'}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Privacy')}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  overflow: 'hidden',
                  backgroundColor: isDarkMode
                    ? colorSystem.dark.card
                    : colorSystem.light.card,
                  marginHorizontal: 16,
                  padding: 12,
                  alignItems: 'center',
                  gap: 8,
                  borderWidth: 1,
                  borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
                  borderRadius: 6,
                }}>
                <Privacy_btn
                  width={24}
                  height={24}
                  style={{
                    color: isDarkMode
                      ? colorSystem.dark.primary
                      : colorSystem.light.primary,
                  }}
                />
                <DynamicText size={12} style={{flex: 1}}>
                  Kebijakan Privasi
                </DynamicText>
                <ArrowLeft_btn
                  width={12}
                  height={12}
                  style={{color: '#818994'}}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                borderRadius: 8,
                gap: 4,
                marginHorizontal: 16,
                marginBottom: 16,
                marginTop: 8,
              }}>
              <DynamicButton
                initialValue={`Keluar Akun `}
                styleSelected={{
                  backgroundColor: isDarkMode
                    ? colorSystem.dark.background
                    : colorSystem.light.background,
                  borderWidth: 1,
                  borderColor: '#F44336',
                }}
                iconLeft={
                  <Keluar_btn
                    width={18}
                    height={18}
                    style={{color: '#F44336'}}
                  />
                }
                colorText={'#F44336'}
                onPress={() => {
                  dispatch(isLogOut(true));
                }}
              />
            </View>
          </View>
        </ScrollView>
        <HeaderAnimation />
      </SafeAreaView>
    );
  } else {
    navigation.navigate('Login');
    return null;
  }
};

export default AccountPages;
