import {useNavigation} from '@react-navigation/native';
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
import {TouchableOpacity} from 'react-native-gesture-handler';
import Modal from 'react-native-modalbox';
import RNSimpleCrypto from 'react-native-simple-crypto';
import {useDispatch, useSelector} from 'react-redux';
import {RootStackParamList} from '../../../App';
import SelectIcon from '../../../src/assets/icon/ic_select.svg';
import {isPending, setDropdownAlert} from '../../../store/actions/todoActions';
import {RootState} from '../../../store/reducers';
import {apiClient} from '../../../utils/api/apiClient';
import '../../../utils/ignoreWarnings';
import DynamicButton from '../../components/common/DynamicButton';
import DynamicText from '../../components/common/DynamicText';
import {formatCurrency} from '../../components/common/formatCurrency';
import Input from '../../components/common/Input';
import {refreshControl} from '../../components/context/refreshFunctions';
import useAutoScreen from '../../components/context/useAutoScreen';
import ConditionalRender from '../../components/ui/ConditionalRender';
import RollyIcon from '../../assets/icon/ic_rolly.svg';
import TopBar from '../../components/ui/TopBar';
import OrderConfirmationModal from '../DetailProducts/OrderConfirmationModal';
import PaymentMethodComponent from '../DetailProducts/PaymentMethodComponent';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import Clipboard from '@react-native-clipboard/clipboard';
import {getDarkModePreference} from '../../components/common/darkModePreference';
interface GiftCardPagesProps {}
type GiftCardPagesScreenProp = StackNavigationProp<
  RootStackParamList,
  'DrawerScreen'
>;
const GiftCardPages: React.FC<GiftCardPagesProps> = () => {
  const colorSystem = useSelector(
    (state: RootState) => state.todoReducer.colorSystem,
  );

  const navigation = useNavigation<GiftCardPagesScreenProp>();
  const autoScreen = useAutoScreen();
  const isWebSetting = useSelector(
    (state: RootState) => state.todoReducer.isWebSetting,
  );
  const isProfile = useSelector(
    (state: RootState) => state.todoReducer.isProfile,
  );
  const isLogin = useSelector((state: RootState) => state.todoReducer.isLogin);

  const dispatch = useDispatch();
  const [selectedNominalItems, setselectedNominalItems] = useState({
    kategori: 'GiftCard',
    harga: '0',
  });

  const scrollYAnimatedValue = useRef(new Animated.Value(0)).current;
  const isDarkMode = getDarkModePreference();

  const [paymentData, setPaymentData] = useState([]);
  const [listMemberData, setListMemberData] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [selectedPaymentItems, setSelectedPaymentItems] = useState<any>([]);
  const [selectedrekPayment, setselectedrekPayment] = useState<any>([]);
  const [hargaFix, setHargaFix] = useState({harga: 0, logo: ''});
  const [invoice, setInvoice] = useState('');
  const [reedemVoucher, setreedemVoucher] = useState('');
  const [expired, setExpired] = useState('');
  const [confirmModal, setconfirmModal] = useState(false);

  const [isModalOrderConfirm, setIsModalOrderConfirm] = useState(false);
  const [listMemberLoading, setListMemberLoading] = useState(false);
  const [isModalSuccess, setIsModalSuccess] = useState(false);
  const [orderConfirm, setOrderConfirm] = useState<any>([]);
  const [refreshingPage, setrefreshingPage] = useState<boolean>(false);

  const [itemsPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(1000);
  const [currentPage, setCurrentPage] = useState(0);

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
    fetchListgiftCard(isLogin?.apiKey, isLogin?.token);
  };

  const fetchListgiftCard = async (api_key: any, token: any) => {
    setListMemberLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('api_key', api_key);
      params.append('limit', itemsPerPage.toString());
      params.append('page', currentPage.toString());

      const response = await apiClient({
        baseurl: 'user/listGiftCard',
        parameter: 'api_key=' + api_key,
        method: 'POST',
        XGORDON: 'LISTGIFTCARD',
        apiKey: api_key,
        token: token,
        body: params,
      });
      setListMemberLoading(false);
      if (response?.statusCode === 200) {
        setTotalPages(response?.result?.total_page);
        setListMemberData(response.result.data);
      } else {
        setListMemberData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchDataPayment = async () => {
    setPaymentLoading(true);

    try {
      const params = new URLSearchParams();

      const response = await apiClient({
        baseurl: 'user/pembayaran',
        parameter: '',
        method: 'POST',
        XGORDON: 'PEMBAYARAN',
        body: params,
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

  const confirmReedemVoucher = async () => {
    dispatch(isPending(true));
    try {
      const params = new URLSearchParams();
      params.append('api_key', isLogin?.apiKey);
      params.append('giftcard', reedemVoucher);

      const response = await apiClient({
        baseurl: 'user/konfirmGiftCard',
        method: 'POST',
        XGORDON: 'KONFIRMGIFTCARD',
        body: params,
        apiKey: isLogin?.apiKey,
        token: isLogin?.token,
      });
      dispatch(isPending(false));
      if (response?.statusCode === 200) {
        setconfirmModal(true);
        setExpired(response?.result.data.expired);
      } else {
        dispatch(setDropdownAlert('error', 'Error', response?.result.msg));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const changeReedemVoucher = async () => {
    dispatch(isPending(true));
    const originalString = `${reedemVoucher}${expired}${isLogin?.apiKey}`;
    console.log(originalString);
    const sha256Hash = await RNSimpleCrypto.SHA.sha256(originalString);

    try {
      const params = new URLSearchParams();
      params.append('api_key', isLogin?.apiKey);
      params.append('voucher_code', reedemVoucher);

      const response = await apiClient({
        baseurl: 'user/redeem',
        method: 'POST',
        customHeaders: {'x-gorgon': sha256Hash},
        XGORDON: 'REDEEM',
        body: params,
        apiKey: isLogin?.apiKey,
        token: isLogin?.token,
      });
      dispatch(isPending(false));
      if (response?.statusCode === 200) {
        dispatch(setDropdownAlert('success', 'Berhasil', response?.result.msg));
        setconfirmModal(false);
      } else {
        dispatch(setDropdownAlert('error', 'Error', response?.result.msg));
        setconfirmModal(true);
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

      const response = await apiClient({
        baseurl: 'user/orderConfirmGiftCard',
        method: 'POST',
        XGORDON: 'ORDERCONFIRMGIFT',
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
      params.append('layanan', selectedNominalItems?.kategori.toLowerCase());

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

  const HitoryGiftCardItem = React.memo(({item}: {item: any}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          Clipboard.setString(item.gift_code);
          dispatch(
            setDropdownAlert(
              'success',
              'Berhasil',
              item.gift_code + ' Tersalin',
            ),
          );
        }}
        style={{
          flex: 1,
          flexDirection: 'column',
          marginHorizontal: 16,
          borderRadius: 8,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: isDarkMode
            ? colorSystem.dark.bordercolor
            : colorSystem.light.bordercolor,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            alignItems: 'center',
            borderColor: isDarkMode
              ? colorSystem.dark.bordercolor
              : colorSystem.light.bordercolor,
          }}>
          <LinearGradient
            colors={
              isDarkMode
                ? colorSystem.dark.gradient
                : colorSystem.light.gradient
            }
            style={{
              flex: 1,
              paddingVertical: 8,
              borderBottomRightRadius: 20,
              alignItems: 'center',
              padding: 16,
            }}>
            <DynamicText size={20} bold style={{color: '#ffffff'}}>
              GIFTCARD
            </DynamicText>
          </LinearGradient>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              paddingVertical: 8,
              padding: 16,
            }}>
            <DynamicText
              size={12}
              style={{color: '#818994', textAlign: 'right'}}>
              {item.gift_code}
            </DynamicText>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            paddingVertical: 12,
            gap: 8,
            padding: 16,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 1,
              alignItems: 'center',
              gap: 8,
            }}>
            <DynamicText size={16} bold style={{textAlign: 'right'}}>
              {formatCurrency(item.nominal)}
            </DynamicText>
            {isWebSetting &&
              isWebSetting.logo &&
              (isDarkMode ? (
                <FastImage
                  source={{uri: isWebSetting.logo_dark || ''}}
                  resizeMode={FastImage.resizeMode.contain}
                  style={{
                    width: 80,
                    aspectRatio: 2,
                    alignSelf: 'flex-start',
                  }}
                />
              ) : (
                <FastImage
                  source={{uri: isWebSetting.logo || ''}}
                  resizeMode={FastImage.resizeMode.contain}
                  style={{
                    width: 80,
                    aspectRatio: 2,
                    alignSelf: 'flex-start',
                  }}
                />
              ))}
          </View>
        </View>
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
        <TopBar isIconLeft={false} isShowLogo={false} title={'Gift Card'} />
      </Animated.View>
    );
  };
  const handleNextPage = () => {
    setCurrentPage(halamanSebelumnya => halamanSebelumnya + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(halamanSebelumnya => halamanSebelumnya - 1);
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
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={
          isDarkMode ? colorSystem.dark.card : colorSystem.light.card
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
        <View style={{gap: 16, flexDirection: 'column', marginBottom: 16}}>
          <TopBar isIconLeft={false} isShowLogo={false} title={'Gift Card'} />

          <View style={{marginHorizontal: 16}}>
            <DynamicText size={16} bold>
              Redeem Gift Card
            </DynamicText>
          </View>
          <View
            style={{
              flexDirection: 'column',
              overflow: 'hidden',
              backgroundColor: isDarkMode
                ? colorSystem.dark.card
                : colorSystem.light.card,
              marginHorizontal: 16,
              elevation: 1,
              borderRadius: 6,
              padding: 16,
            }}>
            <View
              style={{flexDirection: 'row', gap: 8, alignItems: 'flex-end'}}>
              <Input
                label={'Input Kode Gift Card'}
                value={reedemVoucher}
                onChange={value => {
                  setreedemVoucher(value);
                }}
                type={'default'}
                style={{flex: 1}}
                placeholder={'Masukan 10 digit  kode gift card'}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  if (reedemVoucher.length < 4) {
                    dispatch(
                      setDropdownAlert(
                        'error',
                        'Error',
                        'Nomor Voucher Kosong',
                      ),
                    );
                  } else {
                    confirmReedemVoucher();
                  }
                }}
                style={{
                  height: 38,
                  width: 38,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  backgroundColor: isDarkMode
                    ? colorSystem.dark.primary
                    : colorSystem.light.primary,
                }}>
                <SelectIcon
                  style={{
                    aspectRatio: 1,
                  }}
                  height={23}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{marginHorizontal: 16}}>
            <DynamicText size={16} bold>
              List Gift Card
            </DynamicText>
          </View>
          <ConditionalRender
            productsData={listMemberData}
            isLoading={listMemberLoading}
            style={{aspectRatio: 1 / 1, marginHorizontal: 16}}
            model={'emptyData'}
            parsedSetting={isWebSetting}>
            {listMemberData.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  <HitoryGiftCardItem item={item} />
                </React.Fragment>
              );
            })}
          </ConditionalRender>
          {listMemberData.length !== 0 && (
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 16,
                gap: 8,
                marginBottom: 16,
              }}>
              <DynamicButton
                initialValue={`Sebelumnya`}
                disabled={currentPage <= 0}
                styleSelected={{
                  backgroundColor: isDarkMode
                    ? colorSystem.dark.background
                    : colorSystem.light.background,
                  borderWidth: 1,
                  borderColor:
                    currentPage <= 0
                      ? '#DDDDDD'
                      : isDarkMode
                      ? colorSystem.dark.primary
                      : colorSystem.light.primary,
                  flex: 1,
                }}
                colorText={
                  currentPage <= 0
                    ? '#DDDDDD'
                    : isDarkMode
                    ? colorSystem.dark.primary
                    : colorSystem.light.primary
                }
                onPress={() => {
                  handlePreviousPage();
                }}
              />
              <DynamicButton
                initialValue={`Selanjutnya`}
                disabled={
                  listMemberData.length === 0 || currentPage >= totalPages
                }
                styleSelected={{
                  backgroundColor: isDarkMode
                    ? colorSystem.dark.background
                    : colorSystem.light.background,
                  borderWidth: 1,
                  borderColor:
                    listMemberData.length === 0 || currentPage >= totalPages
                      ? '#DDDDDD'
                      : isDarkMode
                      ? colorSystem.dark.primary
                      : colorSystem.light.primary,
                  flex: 1,
                }}
                colorText={
                  listMemberData.length === 0 || currentPage >= totalPages
                    ? '#DDDDDD'
                    : isDarkMode
                    ? colorSystem.dark.primary
                    : colorSystem.light.primary
                }
                onPress={() => {
                  handleNextPage();
                }}
              />
            </View>
          )}

          <View style={{marginHorizontal: 16}}>
            <DynamicText size={16} bold>
              Beli Gift Card
            </DynamicText>
          </View>
          <View
            style={{
              flexDirection: 'column',
              overflow: 'hidden',
              backgroundColor: isDarkMode
                ? colorSystem.dark.card
                : colorSystem.light.card,
              marginHorizontal: 16,
              gap: 8,
              elevation: 1,
              borderRadius: 6,
              padding: 16,
            }}>
            <Input
              label={'Masukan Nominal Gift Card'}
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
          </View>
          {selectedNominalItems?.harga === '' ||
          selectedNominalItems?.harga === '0' ? null : (
            <PaymentMethodComponent
              item={paymentData}
              isWebSetting={isWebSetting}
              loading={paymentLoading}
              parsedProfile={isProfile}
              selectedNominalItems={selectedNominalItems}
              selectedPaymentItems={selectedPaymentItems}
              selectedrekPayment={selectedrekPayment}
              type_payment={'saldo'}
              setselectedrekPayment={setselectedrekPayment}
              hargaFix={setHargaFix}
              setSelectedPaymentItems={a => {
                setSelectedPaymentItems(a);
              }}
            />
          )}
        </View>
      </ScrollView>
      {selectedNominalItems?.harga === '' ||
      selectedNominalItems?.harga === '0' ? null : (
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
              Harga awal {formatCurrency(selectedNominalItems?.harga)}
            </DynamicText>
            <DynamicText
              size={16}
              bold
              numberOfLines={10}
              style={{
                color: isDarkMode
                  ? colorSystem.dark.primary
                  : colorSystem.light.primary,
              }}>
              {formatCurrency(hargaFix?.harga)}
            </DynamicText>
          </View>
          <View style={{flexDirection: 'column', flex: 1}}>
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
                    : isDarkMode
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
                (parseInt(selectedNominalItems.harga) > 5000000 && isDisabled)
              }
              onPress={() => {
                const phoneRegex = /^/;
                if (selectedPaymentItems.saldo === 0) {
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
      )}
      <HeaderAnimation />
      <OrderConfirmationModal
        isModalOrderConfirm={isModalOrderConfirm}
        setIsModalOrderConfirm={setIsModalOrderConfirm}
        orderConfirm={orderConfirm}
        isDarkMode={isDarkMode}
        type_order={'giftcard'}
        setOrderFix={setOrderFix}
        invoice={invoice}
        isModalSuccess={isModalSuccess}
      />

      <Modal
        animationDuration={1000}
        swipeToClose={false}
        backdropOpacity={0.5}
        position="bottom"
        backdropPressToClose={false}
        style={{
          width: autoScreen,
          height: 'auto',
          elevation: 1,
          backgroundColor: isDarkMode
            ? colorSystem.dark.background
            : colorSystem.light.background,
          borderTopStartRadius: 8,
          borderTopEndRadius: 8,
          padding: 16,
          justifyContent: 'center',
        }}
        isOpen={confirmModal}>
        <View style={{flexDirection: 'column', gap: 16}}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                setconfirmModal(false);
              }}
              style={{
                width: autoScreen / 3,
                height: 8,
                backgroundColor: isDarkMode
                  ? colorSystem.dark.bordercolor
                  : colorSystem.light.bordercolor,
                borderRadius: 20,
              }}
            />
          </View>
          <View style={{flexDirection: 'column', gap: 8, padding: 2}}>
            <View
              style={{flexDirection: 'column', alignItems: 'center', gap: 4}}>
              <DynamicText size={16} bold>
                Redeem Gift Card
              </DynamicText>
              <DynamicText size={12} style={{textAlign: 'center'}}>
                Apakah Anda Ingin Redeem Gift Card ?
              </DynamicText>
            </View>
            <View style={{flexDirection: 'row', gap: 8}}>
              <DynamicButton
                initialValue="Tidak"
                styleSelected={{flex: 1}}
                onPress={() => {
                  setconfirmModal(false);
                }}
              />
              <DynamicButton
                initialValue="Iya"
                styleSelected={{
                  backgroundColor: isDarkMode
                    ? colorSystem.dark.background
                    : colorSystem.light.background,
                  borderWidth: 1,
                  flex: 1,
                  borderColor: isDarkMode
                    ? colorSystem.dark.primary
                    : colorSystem.light.primary,
                }}
                colorText={
                  isDarkMode
                    ? colorSystem.dark.primary
                    : colorSystem.light.primary
                }
                onPress={() => {
                  changeReedemVoucher();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
export default GiftCardPages;
