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
import Link_btn from '../../../src/assets/icon/ic_link.svg';
import Privacy_Icon from '../../../src/assets/icon/ic_privacy.svg';
import SaldoKeluar_btn from '../../../src/assets/icon/ic_saldo_keluar.svg';
import SaldoMasuk_btn from '../../../src/assets/icon/ic_saldo_masuk.svg';
import {RootState} from '../../../store/reducers';
import '../../../utils/ignoreWarnings';
import RollyIcon from '../../assets/icon/ic_rolly.svg';
import DynamicButton from '../../components/common/DynamicButton';
import DynamicText from '../../components/common/DynamicText';
import {formatCurrency} from '../../components/common/formatCurrency';
import Input from '../../components/common/Input';
import {refreshControl} from '../../components/context/refreshFunctions';
import useAutoScreen from '../../components/context/useAutoScreen';
import TopBar from '../../components/ui/TopBar';
import {getDarkModePreference} from '../../components/common/darkModePreference';
interface SaldoPagesProps {}
type SaldoPagesScreenProp = StackNavigationProp<
  RootStackParamList,
  'DrawerScreen'
>;
const SaldoPages: React.FC<SaldoPagesProps> = () => {
  const colorSystem = useSelector(
      (state: RootState) => state.todoReducer.colorSystem,
    );
  
  const navigation = useNavigation<SaldoPagesScreenProp>();
  const autoScreen = useAutoScreen();
  const dispatch = useDispatch();

  const scrollYAnimatedValue = useRef(new Animated.Value(0)).current;
  const isProfile = useSelector(
    (state: RootState) => state.todoReducer.isProfile,
  );
  const [selectedNominalItems, setselectedNominalItems] = useState({
    kategori: 'Saldo',
    harga: '0',
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

  const fetchDataApi = async () => {};

  const ListItem = React.memo(({item, index}: {item: any; index: number}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          setselectedNominalItems({
            ...selectedNominalItems,
            harga: item.nominal,
          });
        }}
        style={[
          {
            flexDirection: 'column',
            width: autoScreen / 3 - 27,
            overflow: 'hidden',
            borderRadius: 6,
            borderWidth: 1,
            padding: 12,
            borderColor:
              item.nominal === selectedNominalItems.harga
                ?  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary
                : isDarkMode
                ? colorSystem.dark.bordercolor
                : colorSystem.light.bordercolor,
            backgroundColor:
              item.nominal === selectedNominalItems.harga
                ? colorSystem.dark.primary_opacity
                :  isDarkMode
                ? colorSystem.dark.background
                : colorSystem.light.background
          },
          index % 3 == 3
            ? {marginRight: 8, marginTop: 8}
            : {marginLeft: 8, marginBottom: 8},
        ]}>
        <View style={{alignItems: 'center'}}>
          <FastImage
            source={item.gambar}
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
              item.nominal === selectedNominalItems.harga ? 'bold' : 'regular',
            color:
              item.nominal === selectedNominalItems.harga
                ?  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary
                : isDarkMode
                ? 'white'
                : 'black',
          }}>
          {formatCurrency(item.nominal)}
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
        <TopBar isIconLeft={false} isShowLogo={false} title={'Saldo Saya'} />
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
          <TopBar isIconLeft={false} isShowLogo={false} title={'Saldo Saya'} />

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
                <DynamicText
                  size={16}
                  semiBold
                  style={{color: 'white'}}
                  numberOfLines={1}>
                  Saldo Tersedia
                </DynamicText>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('LogSaldo')}>
                  <Link_btn style={{color: '#ffffff'}} width={16} height={16} />
                </TouchableOpacity>
              </View>
              <DynamicText
                size={22}
                bold
                style={{color: 'white'}}
                numberOfLines={1}>
                {formatCurrency(isProfile?.saldo)}
              </DynamicText>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  overflow: 'hidden',
                  borderRadius: 8,
                }}>
                <View
                  style={{
                    padding: 12,
                    flex: 1,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 8,
                    backgroundColor: '#C8E6C9',
                  }}>
                  <SaldoMasuk_btn
                    style={{color: '#4CAF50'}}
                    width={18}
                    height={18}
                  />
                  <DynamicText
                    size={12}
                    bold
                    style={{color: '#4CAF50'}}
                    numberOfLines={1}>
                    {formatCurrency(isProfile?.penambahan_saldo)}
                  </DynamicText>
                </View>
                <View
                  style={{
                    padding: 12,
                    flex: 1,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 8,
                    backgroundColor: '#FFCDD2',
                  }}>
                  <SaldoKeluar_btn
                    style={{color: '#F44336'}}
                    width={18}
                    height={18}
                  />
                  <DynamicText
                    size={12}
                    bold
                    style={{color: '#F44336'}}
                    numberOfLines={1}>
                    {formatCurrency(isProfile?.pengurangan_saldo)}
                  </DynamicText>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                }}>
                <Privacy_Icon
                  style={{color: '#ffffff'}}
                  width={12}
                  height="100%"
                />
                <DynamicText
                  size={10}
                  light
                  style={{color: 'white'}}
                  numberOfLines={1}>
                  Riwayat saldo direset perbulan
                </DynamicText>
              </View>
            </ImageBackground>
          </View>
          <View style={{flexDirection: 'column', gap: 8}}>
            <View style={{marginHorizontal: 16}}>
              <DynamicText size={16} semiBold numberOfLines={1}>
                Topup Saldo
              </DynamicText>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                borderRadius: 8,
                overflow: 'hidden',
                borderWidth: 1,
                gap: 4,
                marginHorizontal: 16,
                borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
              }}>
              <View style={{padding: 16, paddingBottom: 0}}>
                <DynamicText size={14} semiBold numberOfLines={1}>
                  Pilih Nominal
                </DynamicText>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  padding: 8,
                }}>
                {[
                  {
                    nominal: '10000',
                    gambar: require('../../assets/images/money/10000.png'),
                  },
                  {
                    nominal: '50000',
                    gambar: require('../../assets/images/money/50000.png'),
                  },
                  {
                    nominal: '100000',
                    gambar: require('../../assets/images/money/100000.png'),
                  },
                  {
                    nominal: '200000',
                    gambar: require('../../assets/images/money/100000.png'),
                  },
                  {
                    nominal: '1000000',
                    gambar: require('../../assets/images/money/100000.png'),
                  },
                  {
                    nominal: '5000000',
                    gambar: require('../../assets/images/money/100000.png'),
                  },
                ].map((item: any, index: number) => {
                  return <ListItem key={index} item={item} index={index} />;
                })}
              </View>
              <View style={{padding: 16, paddingTop: 0, gap: 8}}>
                <Input
                  label={'Jumlah Topup'}
                  value={selectedNominalItems.harga}
                  onChange={value => {
                    let newValue = value.replace(/\D/g, '');
                    newValue = Math.min(parseInt(newValue), 5000000).toString();
                    if (newValue === 'NaN') {
                      newValue = '0';
                    }
                    setselectedNominalItems({
                      ...selectedNominalItems,
                      harga: newValue,
                    });
                  }}
                  type={'number-pad'}
                  placeholder={'Masukan Jumlah Topup'}
                />
                {parseInt(selectedNominalItems.harga) < 1000 ||
                parseInt(selectedNominalItems.harga) > 5000000 ? (
                  <DynamicText
                    size={10}
                    style={{color: '#f44336', marginBottom: 8}}>
                    Min Rp.1.000,- s/d Max Rp.5.000.000,-
                  </DynamicText>
                ) : null}
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
            </View>
          </View>
        </View>
      </ScrollView>
      <HeaderAnimation />
    </SafeAreaView>
  );
};
export default SaldoPages;
