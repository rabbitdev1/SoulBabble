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
import {useDispatch, useSelector} from 'react-redux';
import {RootStackParamList} from '../../../App';
import {isPending, setDropdownAlert} from '../../../store/actions/todoActions';
import {RootState} from '../../../store/reducers';
import {apiClient} from '../../../utils/api/apiClient';
import '../../../utils/ignoreWarnings';
import DynamicButton from '../../components/common/DynamicButton';
import DynamicText from '../../components/common/DynamicText';
import {formatCurrency} from '../../components/common/formatCurrency';
import {refreshControl} from '../../components/context/refreshFunctions';
import useAutoScreen from '../../components/context/useAutoScreen';
import TopBar from '../../components/ui/TopBar';
import OrderConfirmationModal from '../DetailProducts/OrderConfirmationModal';
import PaymentMethodComponent from '../DetailProducts/PaymentMethodComponent';
import { getDarkModePreference } from '../../components/common/darkModePreference';
interface TopupPagesProps {}
type TopupPagesScreenProp = StackNavigationProp<
  RootStackParamList,
  'DrawerScreen'
>;
const TopupPages: React.FC<TopupPagesProps> = () => {
  const colorSystem = useSelector(
      (state: RootState) => state.todoReducer.colorSystem,
    );
  
  const navigation = useNavigation<TopupPagesScreenProp>();
  const autoScreen = useAutoScreen();
  const isWebSetting = useSelector(
    (state: RootState) => state.todoReducer.isWebSetting,
  );
  const isProfile = useSelector(
    (state: RootState) => state.todoReducer.isProfile,
  );
  const isLogin = useSelector((state: RootState) => state.todoReducer.isLogin);

  const dispatch = useDispatch();
  const route = useRoute();
  const {selectedNominalItems} = route.params as {
    selectedNominalItems: any;
  };

  const scrollYAnimatedValue = useRef(new Animated.Value(0)).current;
  const isDarkMode = getDarkModePreference();

  const [paymentData, setPaymentData] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [selectedPaymentItems, setSelectedPaymentItems] = useState<any>([]);
  const [selectedrekPayment, setselectedrekPayment] = useState<any>([]);
  const [hargaFix, setHargaFix] = useState({harga: 0, logo: ''});
  const [invoice, setInvoice] = useState('');

  const [isModalOrderConfirm, setIsModalOrderConfirm] = useState(false);
  const [isModalSuccess, setIsModalSuccess] = useState(false);
  const [orderConfirm, setOrderConfirm] = useState<any>([]);
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
    fetchDataPayment();
  };

  const fetchDataPayment = async () => {
    setPaymentLoading(true);

    try {
      const params = new URLSearchParams();
      params.append('api_key', isLogin?.apiKey);

      const response = await apiClient({
        baseurl: 'user/pembayaran',
        parameter:
          selectedNominalItems?.kategori.toLowerCase() !== 'saldo' && isLogin
            ? 'auth'
            : '',
        method: 'POST',
        XGORDON: 'PEMBAYARAN',
        body: params,
        apiKey:
          selectedNominalItems?.kategori.toLowerCase() !== 'saldo' &&
          isLogin?.apiKey,
        token:
          selectedNominalItems?.kategori.toLowerCase() !== 'saldo' &&
          isLogin?.token,
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

  const getOrderConfirm = async () => {
    dispatch(isPending(true));
    const transformedDatalayanan = {id: selectedNominalItems.harga};
    const transformedDataPayment = {metode: selectedPaymentItems?.id};
    const transformedDataKontak = {
      kontak: isProfile?.ponsel?.replace('+62', '0'),
    };
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
      ...transformedDataKontak,
      ...transformedDataphonePayment,
    };
    try {
      const params = new URLSearchParams();
      for (const key in combinedData) {
        params.append(key, combinedData[key]);
      }
      params.append('api_key', isLogin?.apiKey);
      params.append(
        'layanan',
        selectedNominalItems?.kategori.toLowerCase() === 'membership'
          ? 'upgrade'
          : selectedNominalItems?.kategori.toLowerCase(),
      );

      const response = await apiClient({
        baseurl:
          selectedNominalItems?.kategori.toLowerCase() === 'saldo'
            ? 'user/orderConfirmTopup'
            : selectedNominalItems?.kategori.toLowerCase() === 'membership'
            ? 'user/orderConfirmMembership'
            : '',
        method: 'POST',
        XGORDON:
          selectedNominalItems?.kategori.toLowerCase() === 'saldo'
            ? 'ORDERCONFIRMTOPUP'
            : selectedNominalItems?.kategori.toLowerCase() === 'membership'
            ? 'ORDERCONFIRMMEMBERSHIP'
            : '',
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
    const transformedDatalayanan = {id: selectedNominalItems.harga};
    const transformedDataPayment = {metode: selectedPaymentItems.id};
    const transformedDataKontak = {
      kontak: isProfile?.ponsel?.replace('+62', '0'),
    };
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
      ...transformedDataKontak,
      ...transformedDataphonePayment,
    };
    try {
      const params = new URLSearchParams();
      for (const key in combinedData) {
        params.append(key, combinedData[key]);
      }
      params.append('api_key', isLogin?.apiKey);
      params.append(
        'layanan',
        selectedNominalItems?.kategori.toLowerCase() === 'membership'
          ? 'upgrade'
          : selectedNominalItems?.kategori.toLowerCase(),
      );

      const response = await apiClient({
        baseurl: 'user/order',
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
          title={`Selesaikan ${
            selectedNominalItems?.kategori.toLowerCase() === 'saldo'
              ? 'Top Up'
              : 'Membership'
          } `}
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
        <View style={{gap: 16, flexDirection: 'column'}}>
          <TopBar
            isIconLeft={false}
            isShowLogo={false}
            title={`Selesaikan ${
              selectedNominalItems?.kategori.toLowerCase() === 'saldo'
                ? 'Top Up'
                : 'Membership'
            } `}
          />

          <View
            style={{
              marginHorizontal: 16,
              gap: 8,
              borderBottomWidth: 1,
              paddingBottom: 8,
              borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
            }}>
            <DynamicText size={12}>
              {selectedNominalItems?.kategori.toLowerCase() === 'saldo'
                ? 'Nominal Top Up'
                : 'Jenis Membership'}
            </DynamicText>
            <DynamicText size={24} bold>
              {selectedNominalItems?.kategori.toLowerCase() === 'saldo'
                ? formatCurrency(selectedNominalItems?.harga)
                : selectedNominalItems?.harga}
            </DynamicText>
          </View>
          <PaymentMethodComponent
            item={paymentData}
            isWebSetting={isWebSetting}
            loading={paymentLoading}
            parsedProfile={isProfile}
            selectedNominalItems={
              selectedNominalItems?.kategori?.toLowerCase() === 'membership'
                ? {
                    kategori: 'Membership',
                    harga: selectedNominalItems.hargaMembership,
                  }
                : selectedNominalItems
            }
            selectedPaymentItems={selectedPaymentItems}
            selectedrekPayment={selectedrekPayment}
            type_payment={selectedNominalItems?.kategori.toLowerCase()}
            setselectedrekPayment={setselectedrekPayment}
            hargaFix={setHargaFix}
            setSelectedPaymentItems={a => {
              setSelectedPaymentItems(a);
            }}
          />
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
            Harga awal{' '}
            {selectedNominalItems?.kategori?.toLowerCase() === 'membership'
              ? formatCurrency(selectedNominalItems?.hargaMembership)
              : formatCurrency(selectedNominalItems?.harga)}
          </DynamicText>
          <DynamicText
            size={16}
            bold
            numberOfLines={1}
            style={{color:  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary}}>
            {formatCurrency(hargaFix?.harga)}
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
                  :colorSystem.dark.secondary,
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
                    getOrderConfirm();
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
                    getOrderConfirm();
                  }
                }
              } else {
                getOrderConfirm();
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
        type_order={selectedNominalItems?.kategori.toLowerCase()}
        setOrderFix={setOrderFix}
        invoice={invoice}
        isModalSuccess={isModalSuccess}
      />
    </SafeAreaView>
  );
};
export default TopupPages;
