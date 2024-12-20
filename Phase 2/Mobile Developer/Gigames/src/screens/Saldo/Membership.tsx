import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  ImageBackground,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
import {RootStackParamList} from '../../../App';
import Membership_btn from '../../assets/icon/ic_membership.svg';

import {RootState} from '../../../store/reducers';
import {apiClient} from '../../../utils/api/apiClient';
import '../../../utils/ignoreWarnings';
import RollyIcon from '../../assets/icon/ic_rolly.svg';
import DynamicButton from '../../components/common/DynamicButton';
import DynamicText from '../../components/common/DynamicText';
import {formatCurrency} from '../../components/common/formatCurrency';
import {refreshControl} from '../../components/context/refreshFunctions';
import useAutoScreen from '../../components/context/useAutoScreen';
import ConditionalRender from '../../components/ui/ConditionalRender';
import TopBar from '../../components/ui/TopBar';
import {getDarkModePreference} from '../../components/common/darkModePreference';
interface MembershipPagesProps {}
type MembershipPagesScreenProp = StackNavigationProp<
  RootStackParamList,
  'DrawerScreen'
>;
const MembershipPages: React.FC<MembershipPagesProps> = () => {
  const colorSystem = useSelector(
      (state: RootState) => state.todoReducer.colorSystem,
    );
  
  const navigation = useNavigation<MembershipPagesScreenProp>();
  const autoScreen = useAutoScreen();
  const dispatch = useDispatch();
  const isLogin = useSelector((state: RootState) => state.todoReducer.isLogin);
  const isWebSetting = useSelector(
    (state: RootState) => state.todoReducer.isWebSetting,
  );

  const scrollYAnimatedValue = useRef(new Animated.Value(0)).current;
  const isProfile = useSelector(
    (state: RootState) => state.todoReducer.isProfile,
  );
  const [listMemberData, setListMemberData] = useState([]);

  const [listMemberLoading, setListMemberLoading] = useState(true);

  const [selectedNominalItems, setselectedNominalItems] = useState({
    kategori: 'Membership',
    harga: '0',
    hargaMembership: '0',
  });
  const isDarkMode = getDarkModePreference();

  const [refreshingPage, setrefreshingPage] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      fetchDataApi();
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const fetchDataApi = async () => {
    fetchListMembership(isLogin?.apiKey, isLogin?.token);
  };

  const fetchListMembership = async (api_key: any, token: any) => {
    setListMemberLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('api_key', api_key);

      const response = await apiClient({
        baseurl: 'user/hargaMembership',
        method: 'POST',
        XGORDON: 'HARGAMEMBERSHIP',
        apiKey: api_key,
        token: token,
        body: params,
      });
      setListMemberLoading(false);
      if (response?.statusCode === 200) {
        setListMemberData(response.result.data);
      } else {
        setListMemberData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const ListItem = React.memo(({item, index}: {item: any; index: number}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          setselectedNominalItems({
            ...selectedNominalItems,
            harga: item.nama,
            hargaMembership: item.harga,
          });
        }}
        style={[
          {
            flexDirection: 'column',
            width: autoScreen / 3 - 16,
            overflow: 'hidden',
            borderRadius: 6,
            borderWidth: 1,
            gap: 8,
            alignItems: 'center',
            padding: 12,
            borderColor:
              item.nama === selectedNominalItems.harga
                ?  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary
                : isDarkMode
                ? colorSystem.dark.bordercolor
                : colorSystem.light.bordercolor,
            backgroundColor:
              item.nama === selectedNominalItems.harga
                ?colorSystem.dark.primary_opacity
                : isDarkMode
                ? '#1a1625'
                : '#ffffff',
          },
          index % 3 == 3
            ? {marginRight: 8, marginTop: 8}
            : {marginLeft: 8, marginBottom: 8},
        ]}>
        <View style={{alignItems: 'center'}}>
          <FastImage
            source={{uri: item.gambar}}
            resizeMode={FastImage.resizeMode.contain}
            style={{
              width: '60%',
              aspectRatio: 1,
            }}
          />
        </View>
        <DynamicText
          size={12}
          style={{
            textAlign: 'center',
            fontWeight:
              item.harga === selectedNominalItems.harga ? 'bold' : 'regular',
            color:
              item.harga === selectedNominalItems.harga
                ?  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary
                : isDarkMode
                ? 'white'
                : 'black',
          }}>
          {item.nama}
        </DynamicText>
        <DynamicText
          size={12}
          style={{
            textAlign: 'center',
            fontWeight:
              item.harga === selectedNominalItems.harga ? 'bold' : 'regular',
            color:
              item.harga === selectedNominalItems.harga
                ?  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary
                : isDarkMode
                ? 'white'
                : 'black',
          }}>
          {formatCurrency(item.harga)}
        </DynamicText>
      </TouchableOpacity>
    );
  });

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
        <TopBar isIconLeft={false} isShowLogo={false} title={'Membership'} />
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
        <View style={{gap: 16, flexDirection: 'column'}}>
          <TopBar isIconLeft={false} isShowLogo={false} title={'Membership'} />

          <View
            style={{
              marginHorizontal: 16,
              borderRadius: 8,
              overflow: 'hidden',
            }}>
            <ImageBackground
              source={require('../../../src/assets/images/ornament_1.png')}
              style={{padding: 12, gap: 8}}
              imageStyle={{
                resizeMode: 'cover',
                alignSelf: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View
                  style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
                  <Membership_btn
                    width={35}
                    height={50}
                    style={{color: '#ffffff'}}
                  />

                  <View style={{flexDirection: 'column'}}>
                    <DynamicText
                      size={16}
                      bold
                      style={{color: 'white'}}
                      numberOfLines={1}>
                      {isProfile?.level?.toUpperCase()}
                    </DynamicText>
                    <DynamicText
                      size={12}
                      semiBold
                      style={{color: 'white'}}
                      numberOfLines={1}>
                      {isProfile?.nama}
                    </DynamicText>
                  </View>
                </View>

                <View
                  style={{
                    width: '30%',
                    aspectRatio: 1,
                  }}>
                  <FastImage
                    resizeMode={FastImage.resizeMode.contain}
                    source={
                      isProfile?.level === 'member'
                        ? require('../../assets/images/membership/badge_member.png')
                        : isProfile?.level === 'silver'
                        ? require('../../assets/images/membership/badge_silver.png')
                        : isProfile?.level === 'pro'
                        ? require('../../assets/images/membership/badge_pro.png')
                        : isProfile?.level === 'gold'
                        ? require('../../assets/images/membership/badge_gold.png')
                        : require('../../assets/images/membership/badge_member.png')
                    }
                    style={{width: '100%', height: '100%'}}
                  />
                </View>
              </View>
            </ImageBackground>
          </View>
          <View style={{flexDirection: 'column', gap: 8}}>
            <View style={{marginHorizontal: 16}}>
              <DynamicText size={16} semiBold numberOfLines={1}>
                Upgrade Membership
              </DynamicText>
            </View>
            <ConditionalRender
              productsData={listMemberData}
              isLoading={listMemberLoading}
              model="emptyData"
              parsedSetting={isWebSetting}
              style={{height: 200, marginHorizontal: 16}}>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  padding: 8,
                }}>
                {listMemberData.map((item: any, index: number) => {
                  return <ListItem key={index} item={item} index={index} />;
                })}
              </View>
            </ConditionalRender>
          </View>
        </View>
      </ScrollView>
      <View style={{padding: 16}}>
        <DynamicButton
          initialValue="Lanjutkan Pembayaran"
          iconLeft={
            <RollyIcon
              width={18}
              style={{
                aspectRatio: 1,
                color:
                  Object.keys(selectedNominalItems.harga).length === 0
                    ? '#818994'
                    : parseInt(selectedNominalItems.harga) < 1000 ||
                      parseInt(selectedNominalItems.harga) > 5000000
                    ? '#818994'
                    : '#ffffff',
              }}
            />
          }
          styleSelected={{
            backgroundColor:
              Object.keys(selectedNominalItems.harga).length === 0
                ? undefined
                : parseInt(selectedNominalItems.harga) < 1000 ||
                  parseInt(selectedNominalItems.harga) > 5000000
                ? undefined
                :  isDarkMode
              ? colorSystem.dark.secondary
              : colorSystem.light.secondary,
            borderWidth:
              Object.keys(selectedNominalItems.harga).length === 0
                ? 1
                : parseInt(selectedNominalItems.harga) < 1000 ||
                  parseInt(selectedNominalItems.harga) > 5000000
                ? 1
                : 0,
          }}
          colorText={
            Object.keys(selectedNominalItems.harga).length === 0
              ? undefined
              : parseInt(selectedNominalItems.harga) < 1000 ||
                parseInt(selectedNominalItems.harga) > 5000000
              ? undefined
              : '#ffffff'
          }
          disabled={
            parseInt(selectedNominalItems.harga) < 1000 ||
            (parseInt(selectedNominalItems.harga) > 5000000 && true)
          }
          onPress={() => {
            navigation.navigate('Topup', {
              selectedNominalItems: selectedNominalItems,
            });
          }}
        />
      </View>
      <HeaderAnimation />
    </SafeAreaView>
  );
};
export default MembershipPages;
