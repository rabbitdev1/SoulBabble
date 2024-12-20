import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';
import Modal from 'react-native-modalbox';
import {useDispatch, useSelector} from 'react-redux';
import {RootStackParamList} from '../../../App';
import RollyIcon from '../../../src/assets/icon/ic_rolly_rounded.svg';
import {isPending, setDropdownAlert} from '../../../store/actions/todoActions';
import {RootState} from '../../../store/reducers';
import {apiClient} from '../../../utils/api/apiClient';
import '../../../utils/ignoreWarnings';
import ShieldIcon from '../../assets/icon/ic_shield.svg';
import DynamicButton from '../../components/common/DynamicButton';
import DynamicText from '../../components/common/DynamicText';
import {formatCurrency} from '../../components/common/formatCurrency';
import {refreshControl} from '../../components/context/refreshFunctions';
import useAutoScreen from '../../components/context/useAutoScreen';
import TopBar from '../../components/ui/TopBar';
import DataPemesanSelection from './DataPemesanSelection';
import JumlahSelection from './JumlahSelection';
import OrderConfirmationModal from './OrderConfirmationModal';
import PaymentMethodComponent from './PaymentMethodComponent';
import ProductBanner from './ProductBanner';
import PromoSelection from './PromoSelection';
import {getDarkModePreference} from '../../components/common/darkModePreference';
type screenProp = StackNavigationProp<RootStackParamList, 'NextStep'>;
export default function NextStepPages() {
  const dispatch = useDispatch();
  const colorSystem = useSelector(
      (state: RootState) => state.todoReducer.colorSystem,
    );
  

  const navigation = useNavigation<screenProp>();
  const isDarkMode = getDarkModePreference();
  const route = useRoute();
  const {slug, selectedNominalItems, inputForms} = route.params as {
    slug: string;
    selectedNominalItems: any;
    inputForms: any;
  };

  const scrollYAnimatedValue = useRef(new Animated.Value(0)).current;
  const isWebSetting = useSelector(
    (state: RootState) => state.todoReducer.isWebSetting,
  );
  const isProfile = useSelector(
    (state: RootState) => state.todoReducer.isProfile,
  );
  const isLogin = useSelector((state: RootState) => state.todoReducer.isLogin);
  const isTokenNotify = useSelector(
    (state: RootState) => state.todoReducer.isTokenNotify,
  );
  const [productData, setProductData] = useState<any>([]);
  const [paymentData, setPaymentData] = useState([]);
  const [orderConfirm, setOrderConfirm] = useState<any>([]);

  const [paymentLoading, setPaymentLoading] = useState(true);
  const [isModalCekPromo, setisModalCekPromo] = useState(false);

  const [selectedrekPayment, setselectedrekPayment] = useState<any>([]);
  const [selectedPaymentItems, setSelectedPaymentItems] = useState<any>([]);

  const [jumlahJoki, setJumlahJoki] = useState(1);
  const [inputPromo, setInputPromo] = useState('');
  const [fixPromo, setFixPromo] = useState('');
  const [msgPromo, setMsgPromor] = useState('');
  const [hargaFix, setHargaFix] = useState({harga: 0, logo: ''});
  const [invoice, setInvoice] = useState('');
  const [phone, setPhone] = useState('');

  const [isModalOrderConfirm, setIsModalOrderConfirm] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [refreshingPage, setrefreshingPage] = useState(false);
  const [isModalSuccess, setIsModalSuccess] = useState(false);
  const autoScreen = useAutoScreen();

  useEffect(() => {
    fetchDataApi();

    console.log(isProfile);

    if (isProfile) {
      setPhone(isProfile.ponsel);
    }
  }, [slug]);

  const fetchDataApi = async () => {
    fetchDataProduct(slug);
    fetchDataPayment();
  };

  const fetchDataProduct = async (slug: any) => {
    try {
      const formattedPath = slug.replace('/beli/', '');
      const params = new URLSearchParams();
      params.append('slug', formattedPath);

      const response = await apiClient({
        baseurl: 'user/produk',
        method: 'POST',
        XGORDON: 'PRODUK',
        body: params,
      });
      if (response?.statusCode === 200) {
        setProductData(response.result.data);
      } else {
        setProductData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchDataPayment = async () => {
    setPaymentLoading(true);
    console.log(isLogin);

    try {
      const params = new URLSearchParams();
      params.append('api_key', isLogin?.apiKey);

      const response = await apiClient({
        baseurl: 'user/pembayaran',
        parameter: isLogin ? 'auth' : '',
        method: 'POST',
        XGORDON: 'PEMBAYARAN',
        body: params,
        apiKey: isLogin?.apiKey,
        token: isLogin?.token,
      });
      setPaymentLoading(false);
      if (response?.statusCode === 200) {
        setPaymentData(response.result.data);
      } else {
        setPaymentData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchchekPromo = async () => {
    dispatch(isPending(true));
    try {
      const params = new URLSearchParams();
      params.append('id_kategori', productData.id);
      params.append('kode_promo', inputPromo);

      const response = await apiClient({
        baseurl: 'user/cek_promo',
        method: 'POST',
        XGORDON: 'CEKPROMO',
        body: params,
      });
      dispatch(isPending(false));
      if (response?.statusCode === 200) {
        setisModalCekPromo(true);
        setMsgPromor(response?.result.msg);
      } else {
        dispatch(setDropdownAlert('error', 'Error', response?.result.msg));
        setFixPromo('');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getOrderConfirm = async () => {
    dispatch(isPending(true));
    const transformedDatalayanan = {layanan: selectedNominalItems.id};
    const transformedDataPayment = {metode: selectedPaymentItems?.id};
    const transformedDatainput = inputForms.reduce((result: any, item: any) => {
      result[item.name] = item.value;
      return result;
    }, {});
    const transformedDataJumlah = productData.is_joki === '1' && {
      jumlah: jumlahJoki,
    };
    const transformedDataVoucher =
      fixPromo === '' ? null : {promo_voucher: fixPromo};
    const transformedDataKontak = {kontak: phone.replace('+62', '0')};
    const transformedDataphonePayment =
      selectedrekPayment?.length === 0
        ? null
        : selectedrekPayment[0].nama === 'Saldo'
        ? {pintrx: selectedrekPayment[0].value}
        : {rek: selectedrekPayment[0].value.replace('+62', '0')};
    // Menggabungkan semua objek menjadi satu objek tunggal
    const combinedData = {
      ...transformedDatalayanan,
      ...transformedDataPayment,
      ...transformedDatainput,
      ...transformedDataJumlah,
      ...transformedDataVoucher,
      ...transformedDataKontak,
      ...transformedDataphonePayment,
    };
    try {
      const params = new URLSearchParams();
      for (const key in combinedData) {
        params.append(key, combinedData[key]);
      }
      params.append('api_key', isLogin?.apiKey);

      const response = await apiClient({
        baseurl: 'user/' + (isLogin ? 'orderConfirm' : 'orderConfirmGuest'),
        method: 'POST',
        XGORDON: isLogin ? 'ORDERCONFIRM' : 'ORDERCONFIRMGUEST',
        body: params,
        apiKey: isLogin?.apiKey,
        token: isLogin?.token,
      });
      dispatch(isPending(false));
      if (response?.statusCode === 200) {
        setOrderConfirm(response.result.data);
        setIsModalOrderConfirm(true);
      } else {
        dispatch(setDropdownAlert('error', 'Error', response?.result.msg));
        setOrderConfirm([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const setOrderFix = async (tokenSHA: any) => {
    dispatch(isPending(true));
    const transformedDatalayanan = {layanan: selectedNominalItems.id};
    const transformedDataPayment = {metode: selectedPaymentItems.id};
    const transformedDatainput = inputForms.reduce((result: any, item: any) => {
      result[item.name] = item.value;
      return result;
    }, {});
    const transformedDataJumlah = productData.is_joki === '1' && {
      jumlah: jumlahJoki,
    };
    const transformedDataVoucher =
      fixPromo === '' ? null : {promo_voucher: fixPromo};
    const transformedDataKontak = {kontak: phone.replace('+62', '0')};
    const transformedDataphonePayment =
      selectedrekPayment?.length === 0
        ? null
        : selectedrekPayment[0].nama === 'Saldo'
        ? {pintrx: selectedrekPayment[0].value}
        : {rek: selectedrekPayment[0].value.replace('+62', '0')};
    const transformedDataTokenNotify = isLogin ? null : {token: isTokenNotify};

    // Menggabungkan semua objek menjadi satu objek tunggal
    const combinedData = {
      ...transformedDatalayanan,
      ...transformedDataPayment,
      ...transformedDatainput,
      ...transformedDataJumlah,
      ...transformedDataVoucher,
      ...transformedDataKontak,
      ...transformedDataphonePayment,
      ...transformedDataTokenNotify,
    };
    try {
      const params = new URLSearchParams();
      for (const key in combinedData) {
        params.append(key, combinedData[key]);
      }
      params.append('api_key', isLogin?.apiKey);

      const response = await apiClient({
        baseurl: 'user/' + (isLogin ? 'order' : 'orderGuest'),
        method: 'POST',
        customHeaders: {'x-gorgon': tokenSHA},
        body: params,
        apiKey: isLogin?.apiKey,
        token: isLogin?.token,
      });
      dispatch(isPending(false));

      if (response?.statusCode === 200) {
        setIsModalSuccess(true);
        setIsModalOrderConfirm(false);
        setInvoice(response?.result.invoice);
        console.log(response?.result.invoice);
      } else if (response?.statusCode === 400) {
        dispatch(setDropdownAlert('error', 'Error', response?.result.msg));
      } else {
        dispatch(setDropdownAlert('error', 'Error', response?.result.msg));
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
          title={selectedNominalItems?.layanan}
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
        <TopBar
          isIconLeft={false}
          isShowLogo={true}
          title={selectedNominalItems?.layanan}
        />
        <View
          style={{flex: 1, flexDirection: 'column', gap: 16, marginBottom: 20}}>
          <ProductBanner
            productData={productData}
            type={2}
            title={selectedNominalItems?.layanan}
          />
          <PaymentMethodComponent
            item={paymentData}
            isWebSetting={isWebSetting}
            loading={paymentLoading}
            parsedProfile={isProfile}
            selectedNominalItems={selectedNominalItems}
            selectedPaymentItems={selectedPaymentItems}
            selectedrekPayment={selectedrekPayment}
            type_payment={'product'}
            setselectedrekPayment={setselectedrekPayment}
            hargaFix={setHargaFix}
            setSelectedPaymentItems={a => {
              setSelectedPaymentItems(a);
            }}
          />
          <PromoSelection
            inputPromo={inputPromo}
            fixPromo={fixPromo}
            setFixPromo={setFixPromo}
            setInputPromo={setInputPromo}
            fetchchekPromo={fetchchekPromo}
          />
          {productData.is_joki === '1' && (
            <JumlahSelection
              jumlahJoki={jumlahJoki}
              setJumlahJoki={setJumlahJoki}
            />
          )}
          <DataPemesanSelection
            phone={phone}
            productData={productData}
            setPhone={setPhone}
          />

          <View
            style={{
              flexDirection: 'row',
              gap: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ShieldIcon
              height={15}
              style={{
                aspectRatio: 1,
                color: isDarkMode ? '#ffffff' : '#212121',
              }}
            />
            <DynamicText size={12}>Pembayaran anda terjamin aman</DynamicText>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
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
        <View style={{flexDirection: 'column', flex: 1, gap: 4}}>
          <DynamicText size={12} numberOfLines={2}>
            {selectedNominalItems?.layanan}
          </DynamicText>
          <DynamicText
            size={16}
            bold
            numberOfLines={1}
            style={{color:  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary}}>
            {productData.is_joki === '1'
              ? formatCurrency(selectedNominalItems?.harga * jumlahJoki)
              : formatCurrency(hargaFix?.harga)}
          </DynamicText>
        </View>
        <View style={{flexDirection: 'column', flex: 1}}>
          <DynamicButton
            disabled={isDisabled}
            initialValue="Lanjutkan Pembayaran"
            styleSelected={{
              backgroundColor:
                Object.keys(selectedNominalItems).length === 0
                  ? isDarkMode
                    ? undefined
                    : '#F7F8FC'
                  :  isDarkMode
              ? colorSystem.dark.secondary
              : colorSystem.light.secondary,
              borderWidth:
                Object.keys(selectedNominalItems).length === 0 ? 1 : 0,
            }}
            colorText={
              Object.keys(selectedNominalItems).length === 0
                ? undefined
                : '#ffffff'
            }
            onPress={() => {
              const phoneRegex = /^/;
              if (selectedNominalItems.length === 0) {
                dispatch(
                  setDropdownAlert('error', 'Error', 'Layanan Belum Dipilih'),
                );
              } else if (selectedPaymentItems.length === 0) {
                dispatch(
                  setDropdownAlert(
                    'error',
                    'Error',
                    'Metode Pembayaran Belum Dipilih',
                  ),
                );
              } else if (!phoneRegex.test(phone)) {
                dispatch(
                  setDropdownAlert(
                    'error',
                    'Error',
                    'Nomor telepon tidak valid. Mohon periksa masukan Anda.',
                  ),
                );
              } else if (selectedPaymentItems.pake_rek === '1') {
                if (selectedrekPayment[0].nama === 'Saldo') {
                  if (selectedrekPayment[0].value.length < 6) {
                    dispatch(
                      setDropdownAlert(
                        'error',
                        'Error',
                        `PIN pada Pembayaran ${selectedrekPayment[0].nama} tidak valid. Mohon periksa masukan Anda.`,
                      ),
                    );
                  } else {
                    const transformedDatainput = inputForms.reduce(
                      (result: any, item: any) => {
                        result[item.name] = item.value;
                        return result;
                      },
                      {},
                    );
                    if (transformedDatainput.id === undefined) {
                      dispatch(
                        setDropdownAlert(
                          'error',
                          'Error',
                          `Input Belum Dimasukan`,
                        ),
                      );
                    } else {
                      getOrderConfirm();
                    }
                  }
                } else {
                  if (!phoneRegex.test(selectedrekPayment[0].value)) {
                    dispatch(
                      setDropdownAlert(
                        'error',
                        'Error',
                        `Nomor WhatsApp pada Pembayaran ${selectedrekPayment[0].nama} tidak valid. Mohon periksa masukan Anda.`,
                      ),
                    );
                  } else {
                    const transformedDatainput = inputForms.reduce(
                      (result: any, item: any) => {
                        result[item.name] = item.value;
                        return result;
                      },
                      {},
                    );
                    if (transformedDatainput.id === undefined) {
                      dispatch(
                        setDropdownAlert(
                          'error',
                          'Error',
                          'Input Belum Dimasukan',
                        ),
                      );
                    } else {
                      getOrderConfirm();
                    }
                  }
                }
              } else {
                const transformedDatainput = inputForms.reduce(
                  (result: any, item: any) => {
                    result[item.name] = item.value;
                    return result;
                  },
                  {},
                );
                if (transformedDatainput.id === undefined) {
                  dispatch(
                    setDropdownAlert('error', 'Error', 'Input Belum Dimasukan'),
                  );
                } else {
                  getOrderConfirm();
                }
              }
              setIsDisabled(true);
              setTimeout(() => {
                setIsDisabled(false);
              }, 5000);
            }}
          />
        </View>
      </View>
      <HeaderAnimation />
      <OrderConfirmationModal
        isModalOrderConfirm={isModalOrderConfirm}
        setIsModalOrderConfirm={setIsModalOrderConfirm}
        orderConfirm={orderConfirm}
        isDarkMode={isDarkMode}
        type_order={'product'}
        setOrderFix={setOrderFix}
        invoice={invoice}
        isModalSuccess={isModalSuccess}
      />
      <Modal
        animationDuration={1000}
        swipeToClose={false}
        backdropOpacity={0.5}
        backdropPressToClose={false}
        style={{
          width: autoScreen - 32,
          height: 'auto',
          elevation: 1,
          backgroundColor: isDarkMode
              ? colorSystem.dark.background
              : colorSystem.light.background,
          borderRadius: 8,
          padding: 16,
          justifyContent: 'center',
        }}
        isOpen={isModalCekPromo}>
        <View style={{flexDirection: 'column', gap: 16}}>
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <RollyIcon
              style={{
                aspectRatio: 1,
              }}
              height={autoScreen / 5}
            />
          </View>
          <View style={{flexDirection: 'column', gap: 4}}>
            <DynamicText size={16} bold>
              Selamat, Kode Gift Kamu Verified
            </DynamicText>
            <DynamicText size={12}>
              Silahkan klik Konfirmasi Redeem untuk mengambil reward giftmu
            </DynamicText>
          </View>
          <View
            style={{
              flexDirection: 'column',
              backgroundColor: '#F7F8FC',
              elevation: 1,
              gap: 8,
              borderRadius: 8,
              padding: 16,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <DynamicText size={12} style={{flex: 1}} numberOfLines={2}>
                Kode Redeem
              </DynamicText>
              <DynamicText
                size={12}
                bold
                style={{flex: 1, textAlign: 'right'}}
                numberOfLines={1}>
                {inputPromo}
              </DynamicText>
            </View>
            <View style={{flexDirection: 'column', gap: 4}}>
              <DynamicText size={12}>Pesan</DynamicText>
              <DynamicText size={14} bold>
                {msgPromo}
              </DynamicText>
            </View>
          </View>
          <View style={{flexDirection: 'row', gap: 8}}>
            <View style={{flex: 1}}>
              <DynamicButton
                initialValue="Batal"
                onPress={() => setisModalCekPromo(false)}
              />
            </View>
            <View style={{flex: 1}}>
              <DynamicButton
                initialValue="Konfirmasi Redeem"
                styleSelected={{
                  backgroundColor:  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary,
                }}
                colorText={'#ffffff'}
                onPress={() => {
                  setisModalCekPromo(false);
                  setFixPromo(inputPromo);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
