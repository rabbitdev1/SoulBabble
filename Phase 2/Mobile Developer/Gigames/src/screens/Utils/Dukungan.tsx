import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Linking,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {RootStackParamList} from '../../../App';
import {RootState} from '../../../store/reducers';
import '../../../utils/ignoreWarnings';
import DynamicButton from '../../components/common/DynamicButton';
import DynamicText from '../../components/common/DynamicText';
import Input from '../../components/common/Input';
import {getDarkModePreference} from '../../components/common/darkModePreference';
import {refreshControl} from '../../components/context/refreshFunctions';
import useAutoScreen from '../../components/context/useAutoScreen';
import TopBar from '../../components/ui/TopBar';

import Help_btn from '../../assets/icon/ic_help_product.svg';
import Mail_btn from '../../assets/icon/ic_email.svg';
import WA_btn from '../../assets/icon/socialmedia/whatapps.svg';

interface DukunganPagesProps {}
type DukunganPagesScreenProp = StackNavigationProp<
  RootStackParamList,
  'DrawerScreen'
>;
const DukunganPages: React.FC<DukunganPagesProps> = () => {
  const colorSystem = useSelector(
      (state: RootState) => state.todoReducer.colorSystem,
    );
  
  const navigation = useNavigation<DukunganPagesScreenProp>();
  const autoScreen = useAutoScreen();
  const dispatch = useDispatch();

  const scrollYAnimatedValue = useRef(new Animated.Value(0)).current;

  const isWebSetting = useSelector(
    (state: RootState) => state.todoReducer.isWebSetting,
  );

  const isDarkMode = getDarkModePreference();
  const [inputValues, setInputValues] = useState<any>({});

  const [refreshingPage, setrefreshingPage] = useState<boolean>(false);

  useEffect(() => {
    fetchDataApi();
  }, []);

  const fetchDataApi = async () => {};

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
          title={'Dukungan Pelanggan'}
        />
      </Animated.View>
    );
  };

  const handleInputChange = (name: any, value: any) => {
    let selectedValue = value;
    setInputValues((prevState: any) => ({
      ...prevState,
      [name]: selectedValue,
    }));
  };
  const generateWhatsAppURL = () => {
    const baseURL =
      'https://api.whatsapp.com/send/?phone=' + (isWebSetting?.cs || '0');
    const message = `
      *Formulir Laporan / Permintaan* 
      Pelapor: ${inputValues.jenis_laporan}
      Tipe Laporan: ${inputValues.tipe_laporan}
      Nama: ${inputValues.nama_pelapor}
      Nomor WhatsApp: ${inputValues.nomor_whatsapp}
      Deskripsi: ${inputValues.deskripsi}
    `;
    const encodedMessage = encodeURIComponent(message.trim());
    const finalURL = `${baseURL}&text=${encodedMessage}&type=phone_number&app_absent=0`;
    return finalURL;
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
          <TopBar
            isIconLeft={false}
            isShowLogo={false}
            title={'Dukungan Pelanggan'}
          />
          <View style={{flexDirection: 'column', gap: 16}}>
            <View
              style={{
                paddingHorizontal: 16,
                flex: 1,
                alignItems: 'flex-start',
                gap: 4,
              }}>
              <DynamicText size={16} bold numberOfLines={1}>
                Dukungan Pelanggan Gigames
              </DynamicText>
              <DynamicText size={14} numberOfLines={3}>
                Kami Siap Untuk Membantu Kamu
              </DynamicText>
            </View>
          </View>
          <View style={{flexDirection: 'column', gap: 8}}>
            {[
              {
                title: 'FAQ',
                desc: 'FAQ dapat memberikan Jabawan secara Instan yang terkait pertanyaan umum',
                color: '#f67316',
              },
              {
                title: 'Email',
                desc: 'Kami akan menghubungi Kamu 1x24 Jam \n',
                color: '#3a80f6',
              },
              {
                title: 'Whatsapp',
                color: '#21c55d',
                desc: 'Rekomendasi untuk Kamu jika mengalami kendala yang sangat penting',
              },
            ].map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    if (item.title === 'FAQ') {
                      navigation.navigate('FAQ');
                    } else if (item.title === 'Email') {
                      Linking.openURL('mailto:' + (isWebSetting?.sosmed?.email || '0'));
                    } else {
                      Linking.openURL(generateWhatsAppURL());
                    }
                  }}
                  activeOpacity={0.7}
                  key={index}
                  style={{
                    flex: 1,
                    padding: 16,
                    flexDirection: 'row',
                    borderRadius: 6,
                    gap: 8,
                    backgroundColor:  isDarkMode
              ? colorSystem.dark.card
              : colorSystem.light.card,
                    marginHorizontal: 16,
                  }}>
                  <View
                    style={{
                      height: '80%',
                      aspectRatio: 1,
                      borderRadius: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: item.color,
                    }}>
                    {item.color === '#f67316' ? (
                      <Help_btn
                        width={'50%'}
                        height={'50%'}
                        style={{color: '#ffffff'}}
                      />
                    ) : item.color === '#3a80f6' ? (
                      <Mail_btn
                        width={'50%'}
                        height={'50%'}
                        style={{color: '#ffffff'}}
                      />
                    ) : item.color === '#21c55d' ? (
                      <WA_btn
                        width={'50%'}
                        height={'50%'}
                        style={{color: '#ffffff'}}
                      />
                    ) : null}
                  </View>
                  <View style={{flexDirection: 'column', flex: 1}}>
                    <DynamicText bold size={16}>
                      {item.title}
                    </DynamicText>
                    <DynamicText size={12}>{item.desc}</DynamicText>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={{flexDirection: 'column', gap: 16}}>
            <View
              style={{
                paddingHorizontal: 16,
                flex: 1,
                alignItems: 'flex-start',
                gap: 4,
              }}>
              <DynamicText size={16} bold numberOfLines={3}>
                Mengalami masalah dengan transaksi anda atau yang lainnya?
              </DynamicText>
              <DynamicText size={14} numberOfLines={3}>
                Silakan masukkan laporan atau permintaan anda pada form yang
                tersedia
              </DynamicText>
            </View>
            <View
              style={{
                flex: 1,
                padding: 16,
                flexDirection: 'column',
                borderRadius: 6,
                gap: 8,
                backgroundColor:  isDarkMode
              ? colorSystem.dark.card
              : colorSystem.light.card,
                marginHorizontal: 16,
              }}>
              <DynamicText size={14} bold numberOfLines={3}>
                Formulir Laporan / Permintaan
              </DynamicText>
              <DynamicText size={12} numberOfLines={3}>
                Silakan masukan laporan / permintaan anda
              </DynamicText>
              {[
                {
                  name: 'jenis_laporan',
                  label: 'Jenis Laporan',
                  type: 'select',
                  options: [
                    {text: 'Individu', value: 'Individu'},
                    {text: 'Perusahaan', value: 'Perusahaan'},
                  ],
                },
                {
                  name: 'tipe_laporan',
                  label: 'Tipe Laporan',
                  type: 'select',
                  options: [
                    {value: 'Masalah_Akun', text: 'Masalah Akun'},
                    {value: 'Masalah Transaksi', text: 'Masalah Transaksi'},
                    {value: 'Daftar Reseller', text: 'Daftar Reseller'},
                    {value: 'Klaim Voucher', text: 'Klaim Voucher'},
                    {value: 'Tukar Point', text: 'Tukar Point'},
                    {value: 'Pembuatan Website', text: 'Pembuatan Website'},
                    {value: 'Penawaran Kerjasama', text: 'Penawaran Kerjasama'},
                    {value: 'Daftar Affiliator', text: 'Daftar Affiliator'},
                  ],
                },
                {
                  name: 'nama_pelapor',
                  label: 'Nama Pelapor',
                  type: 'default',
                },
                {
                  name: 'nomor_whatsapp',
                  label: 'Nomor Whatapps',
                  type: 'phone-pad',
                },
                {
                  name: 'deskripsi',
                  label: 'Deskripsi',
                  type: 'textarea',
                },
              ].map((item: any, index: number) => (
                <Input
                  key={index}
                  label={item.label}
                  colorText={isDarkMode ? '#ffffff' : '#000000'}
                  value={inputValues[item.name]}
                  type={item.type}
                  options={item.options ? JSON.stringify(item.options) : null}
                  onChange={value => handleInputChange(item.name, value)}
                  placeholder={'Masukan ' + item.label}
                />
              ))}
              <DynamicButton
                initialValue="Kirim Laporan"
                styleSelected={{
                  backgroundColor:  isDarkMode
                  ? colorSystem.dark.primary
                  : colorSystem.light.primary,
                  borderWidth: 0,
                }}
                colorText={'#ffffff'}
                onPress={() => {
                  const semuaDataKosong = Object.values(inputValues).some(
                    value => !value,
                  );
                  console.log(inputValues);
                  if (semuaDataKosong) {
                    console.log('Ada data kosong');
                  } else {
                    const finalURL = generateWhatsAppURL();
                    Linking.openURL(finalURL);
                    console.log(finalURL);
                  }
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <HeaderAnimation />
    </SafeAreaView>
  );
};
export default DukunganPages;
