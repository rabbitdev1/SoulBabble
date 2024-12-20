import Clipboard from '@react-native-clipboard/clipboard';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modalbox';
import {useDispatch, useSelector} from 'react-redux';
import {RootStackParamList} from '../../../App';
import {default as Clipboard_btn} from '../../../src/assets/icon/ic_clipboard.svg';
import {default as Star_btn} from '../../../src/assets/icon/ic_star.svg';
import {default as Print_btn} from '../../../src/assets/icon/ic_print.svg';
import {default as Review_btn} from '../../../src/assets/icon/ic_review.svg';
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
import CountdownTimer from '../../components/ui/CountdownTimer';
import HTMLDisplay from '../../components/ui/HTMLDisplay';
import TopBar from '../../components/ui/TopBar';
import FaqModal from './FaqModal';
import PaymentDetails from './PaymentDetails';
import ProductDetails from './ProductDetails';
// import {Ipush} from 'ipush-js';
import {
  REACT_APP_PUSHER_KEY,
  REACT_APP_PUSHER_CLUSTER,
  REACT_APP_PUSHER_NAME,
} from '@env';
import {
  Pusher,
  PusherMember,
  PusherChannel,
  PusherEvent,
} from '@pusher/pusher-websocket-react-native';
import {sendLocalNotification} from '../../components/context/NotifService';
import {getDarkModePreference} from '../../components/common/darkModePreference';
import ViewShot from 'react-native-view-shot';
import {onShare} from '../../components/context/shareFunctions';

type screenProp = StackNavigationProp<RootStackParamList, 'NextStep'>;
export default function DetailInvoicePages() {
  const colorSystem = useSelector(
      (state: RootState) => state.todoReducer.colorSystem,
    );
  
  const dispatch = useDispatch();
  const ref = useRef<any>();

  const navigation = useNavigation<screenProp>();
  const isDarkMode = getDarkModePreference();
  const route = useRoute();
  const {invoice} = route.params as {
    invoice: string;
  };

  const scrollYAnimatedValue = useRef(new Animated.Value(0)).current;

  const isWebSetting = useSelector(
    (state: RootState) => state.todoReducer.isWebSetting,
  );
  const isProfile = useSelector(
    (state: RootState) => state.todoReducer.isProfile,
  );
  const isLogin = useSelector((state: RootState) => state.todoReducer.isLogin);

  const [detailInvoice, setDetailInvoice] = useState<any>([]);
  const [invoiceLoading, setInvoiceLoading] = useState(true);

  const [refreshingPage, setrefreshingPage] = useState(false);
  const [isModalReview, setisModalReview] = useState(false);
  const [isModalFaqPembayaran, setIsModalFaqPembayaran] = useState(false);
  const [expired, isExpired] = useState(false);
  const [isReview, setisReview] = useState('');
  const [isBintang, setisBintang] = useState(5);

  const autoScreen = useAutoScreen();
  const pusher = Pusher.getInstance();
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      fetchDataApi();
    });
    return () => {
      unsubscribe();
    };
  }, [invoice]);

  useEffect(() => {
    if (Platform.OS !== 'android' || Platform.Version < 29) {
      return;
    }
    const initPusher = async () => {
      try {
        await pusher.init({
          apiKey: REACT_APP_PUSHER_KEY,
          cluster: REACT_APP_PUSHER_CLUSTER,
          onConnectionStateChange: state => {
            console.log('Connection state changed:', state);
            if (state === 'DISCONNECTED') {
              // Perform any necessary cleanup or handle the disconnection
            }
          },
          onSubscriptionSucceeded: (channelName, data) => {
            console.log(
              `Subscription to ${channelName} succeeded with data: ${JSON.stringify(
                data,
              )}`,
            );
          },
          onEvent: (data: any) => {
            const dataJson = JSON.parse(data?.data);
            if (dataJson.statusCode === 200) {
              if (dataJson.Code === 'actionInvoice') {
                const mergedData = {
                  ...detailInvoice,
                  ...dataJson.data,
                };
                if (dataJson.data?.invoice === detailInvoice?.invoice) {
                  setDetailInvoice(mergedData);
                }
              }
            }
          },
        });

        await pusher.subscribe({channelName: REACT_APP_PUSHER_NAME});
        await pusher.connect();
      } catch (e) {
        console.error(`ERROR initializing Pusher: ${e}`);
      }
    };
    initPusher();
    return () => {
      pusher.unsubscribe({channelName: REACT_APP_PUSHER_NAME});
      pusher.disconnect();
    };
  }, [REACT_APP_PUSHER_NAME, detailInvoice]);

  const fetchDataApi = async () => {
    fetchDataProduct(invoice);
  };

  const fetchDataProduct = async (invoice: any) => {
    setInvoiceLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('invoice', invoice);

      const response = await apiClient({
        baseurl: 'user/invoice',
        XGORDON: 'INVOICE',
        method: 'POST',
        body: params,
      });
      setInvoiceLoading(false);
      if (response?.statusCode === 200) {
        setDetailInvoice(response.result.data);
        if (
          response.result.data?.nama_kategori !== 'Topup Saldo' &&
          response.result.data?.nama_kategori !== 'Upgrade Membership' &&
          response.result.data?.nama_kategori !== 'Gift Card'
        ) {
          if (
            response.result.data?.status === 'success' &&
            response.result.data?.is_review === 'Belum di Review' &&
            isLogin
          ) {
            setisModalReview(true);
          } else {
            setisModalReview(false);
          }
        }
      } else {
        setDetailInvoice([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchWriteReview = async () => {
    dispatch(isPending(true));
    try {
      const params = new URLSearchParams();
      params.append('api_key', isLogin?.apiKey);
      params.append('bintang', isBintang?.toString());
      params.append('review', isReview);
      params.append('invoice', invoice);

      const response = await apiClient({
        baseurl: 'user/review',
        XGORDON: 'REVIEW',
        method: 'POST',
        body: params,
        apiKey: isLogin?.apiKey,
        token: isLogin?.token,
      });
      dispatch(isPending(false));
      if (response?.statusCode === 200) {
        dispatch(setDropdownAlert('success', 'Sukses', response?.result.msg));
        setisModalReview(false);
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
          isIconLeft={
            <Print_btn
              style={{color: isDarkMode ? '#ffffff' :  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary}}
              width={'80%'}
              height={'80%'}
            />
          }
          onClickIconLeft={() => onShare(ref, dispatch, setDropdownAlert)}
          isShowLogo={false}
          title={'Invoice #' + invoice?.toUpperCase()}
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
      <ViewShot
        ref={ref}
        options={{
          fileName: detailInvoice.nama_kategori,
          format: 'jpg',
          quality: 1,
        }}>
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
            isIconLeft={
              <Print_btn
                style={{color: isDarkMode ? '#ffffff' :  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary}}
                width={'80%'}
                height={'80%'}
              />
            }
            onClickIconLeft={() => onShare(ref, dispatch, setDropdownAlert)}
            isShowLogo={false}
            title={'Invoice #' + invoice?.toUpperCase()}
          />
          <View style={{paddingVertical: 16, gap: 16}}>
            <View
              style={{paddingHorizontal: 16, alignItems: 'flex-start', gap: 4}}>
              <DynamicText size={12} light semiBold numberOfLines={2}>
                Terima Kasih!
              </DynamicText>
              <DynamicText size={16} bold numberOfLines={1}>
                Pesanan kamu{' '}
                {detailInvoice?.status === 'cancel'
                  ? 'Cancel'
                  : detailInvoice?.status === 'refund'
                  ? 'Refund'
                  : detailInvoice?.status === 'pending'
                  ? 'Pending'
                  : detailInvoice?.status === 'paid'
                  ? 'Sudah Bayar'
                  : detailInvoice?.status === 'not_paid'
                  ? 'Belum Bayar'
                  : detailInvoice?.status === 'processing'
                  ? 'Processing'
                  : detailInvoice?.status === 'success'
                  ? 'Success'
                  : null}
              </DynamicText>
              <DynamicText
                size={12}
                light
                semiBold
                numberOfLines={2}
                style={{color: '#818994'}}>
                {detailInvoice?.status === 'cancel'
                  ? 'Pesanan Kamu Gagal Kami proses'
                  : detailInvoice?.status === 'refund'
                  ? 'Pesanan Kamu Gagal Kami proses'
                  : detailInvoice?.status === 'pending'
                  ? 'Pesanan Kamu Pending'
                  : detailInvoice?.status === 'paid'
                  ? 'Pesanan Kamu Mengalami kendala Internal, Silahkan hubungi Admin'
                  : detailInvoice?.status === 'not_paid'
                  ? 'Pesanan Kamu Belum Bayar'
                  : detailInvoice?.status === 'processing'
                  ? 'Pesanan Kamu sedang dalam proses'
                  : detailInvoice?.status === 'success'
                  ? 'Pesanan Kamu telah berhasil Kami proses'
                  : null}
              </DynamicText>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                borderRadius: 8,
                overflow: 'hidden',
                borderWidth: 1,
                padding: 12,
                paddingHorizontal: 16,
                gap: 4,
                alignItems: 'center',
                marginHorizontal: 16,
                borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
              }}>
              <View
                style={{
                  flex: 1,
                  gap: 4,
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <DynamicText size={14} light semiBold numberOfLines={2}>
                  {invoice?.toUpperCase()}
                </DynamicText>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    Clipboard.setString(invoice?.toUpperCase());
                    dispatch(
                      setDropdownAlert(
                        'success',
                        'Tersalin',
                        invoice?.toUpperCase(),
                      ),
                    );
                  }}>
                  <Clipboard_btn
                    style={{color: '#818994'}}
                    width={22}
                    height={17}
                  />
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'column'}}>
                <DynamicText
                  size={12}
                  light
                  semiBold
                  numberOfLines={2}
                  style={{color: '#818994', textAlign: 'right'}}>
                  Tanggal :
                </DynamicText>
                <DynamicText
                  size={12}
                  light
                  semiBold
                  numberOfLines={2}
                  style={{color: '#818994', textAlign: 'right'}}>
                  {detailInvoice?.tanggal}
                </DynamicText>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                borderRadius: 8,
                overflow: 'hidden',
                borderWidth: 1,
                alignItems: 'center',
                marginHorizontal: 16,
                borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
              }}>
              <View
                style={{
                  width: '100%',
                  flex: 1,
                  flexDirection: 'row',
                  padding: 12,
                  paddingHorizontal: 16,
                  gap: 4,
                  alignItems: 'center',
                }}>
                <DynamicText size={14} bold numberOfLines={1} style={{flex: 1}}>
                  Status Pesanan
                </DynamicText>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 8,
                    borderRadius: 20,
                    paddingHorizontal: 16,
                    backgroundColor:
                      detailInvoice?.status === 'cancel'
                        ? '#F42536'
                        : detailInvoice?.status === 'refund'
                        ? '#ED610A'
                        : detailInvoice?.status === 'pending'
                        ? '#ED610A'
                        : detailInvoice?.status === 'paid'
                        ? '#ED610A'
                        : detailInvoice?.status === 'not_paid'
                        ? '#000000'
                        : detailInvoice?.status === 'processing'
                        ? '#3694ff'
                        : detailInvoice?.status === 'success'
                        ? '#0ABE5D'
                        : '#000000',
                  }}>
                  <DynamicText
                    bold
                    size={12}
                    style={{
                      color: '#FFFFFF',
                    }}>
                    {detailInvoice?.status === 'cancel'
                      ? 'Cancel'
                      : detailInvoice?.status === 'refund'
                      ? 'Refund'
                      : detailInvoice?.status === 'pending'
                      ? 'Pending'
                      : detailInvoice?.status === 'paid'
                      ? 'Sudah Bayar'
                      : detailInvoice?.status === 'not_paid'
                      ? 'Belum Bayar'
                      : detailInvoice?.status === 'processing'
                      ? 'Processing'
                      : detailInvoice?.status === 'success'
                      ? 'Success'
                      : null}
                  </DynamicText>
                </View>
              </View>
              <View
                style={{
                  borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
                  borderBottomWidth: 1,
                  width: '100%',
                }}
              />
              <View
                style={{
                  width: '100%',
                  flex: 1,
                  flexDirection: 'column',
                  padding: 12,
                  paddingHorizontal: 16,
                  gap: 4,
                }}>
                <ConditionalRender
                  productsData={detailInvoice}
                  isLoading={invoiceLoading}
                  parsedSetting={isWebSetting}
                  style={{height: 120}}
                  model={'emptyData'}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      gap: 16,
                    }}>
                    <FastImage
                      source={{uri: detailInvoice?.backround_layanan}}
                      resizeMode={FastImage.resizeMode.cover}
                      style={{
                        width: 60,
                        borderRadius: 6,
                        aspectRatio: 1,
                        backgroundColor:  isDarkMode
              ? colorSystem.dark.card
              : colorSystem.light.card,
                      }}
                    />
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                      }}>
                      <DynamicText size={14} bold numberOfLines={2}>
                        {detailInvoice?.nama_layanan}
                      </DynamicText>
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 4,
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <DynamicText size={12} light numberOfLines={1}>
                          {detailInvoice?.nama_kategori}
                        </DynamicText>
                        <DynamicText size={16} bold numberOfLines={1}>
                          {formatCurrency(detailInvoice?.total_bayar)}
                        </DynamicText>
                      </View>
                    </View>
                  </View>
                </ConditionalRender>
              </View>
              {!expired && detailInvoice.status === 'not_paid' ? (
                <View
                  style={{
                    width: '100%',
                    flex: 1,
                    flexDirection: 'column',
                    padding: 16,
                    paddingTop: 4,
                    gap: 4,
                  }}>
                  <ConditionalRender
                    productsData={detailInvoice}
                    isLoading={invoiceLoading}
                    parsedSetting={isWebSetting}
                    style={{height: 40}}
                    model={'emptyData'}>
                    <CountdownTimer
                      expired={detailInvoice.expired}
                      startTime={isWebSetting?.datetime}
                      onResponse={(time: string) => {
                        if (time < '00:00:00') {
                          isExpired(true);
                        } else {
                          isExpired(false);
                        }
                      }}
                      type={1}
                    />
                  </ConditionalRender>
                </View>
              ) : null}
            </View>

            <PaymentDetails
              expired={expired}
              detailInvoice={detailInvoice}
              isDarkMode={isDarkMode}
              invoiceLoading={invoiceLoading}
              isWebSetting={isWebSetting}
              autoScreen={autoScreen}
            />
            {detailInvoice.status_pembayaran !== 'not_paid' ? (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  borderRadius: 8,
                  overflow: 'hidden',
                  borderWidth: 1,
                  padding: 16,
                  gap: 4,
                  alignItems: 'center',
                  marginHorizontal: 16,
                  borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
                }}>
                <FastImage
                  source={{
                    uri:
                      detailInvoice.status === 'cancel'
                        ? isWebSetting?.animasiPesanan['cancel'] || ''
                        : detailInvoice.status === 'refund'
                        ? isWebSetting?.animasiPesanan['refund'] || ''
                        : detailInvoice.status === 'success'
                        ? isWebSetting?.animasiPesanan['success'] || ''
                        : detailInvoice.status === 'pending'
                        ? isWebSetting?.animasiPesanan['pending'] || ''
                        : detailInvoice.status === 'processing'
                        ? isWebSetting?.animasiPesanan['processing'] || ''
                        : detailInvoice.status === 'paid'
                        ? isWebSetting?.animasiPesanan['paid'] || ''
                        : null,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                  style={{width: '100%', aspectRatio: 2}}
                />
              </View>
            ) : null}
            {detailInvoice.status_pembayaran === 'not_paid' && expired ? (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  borderRadius: 8,
                  overflow: 'hidden',
                  borderWidth: 1,
                  padding: 16,
                  gap: 4,
                  alignItems: 'center',
                  marginHorizontal: 16,
                  borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
                }}>
                <FastImage
                  source={{
                    uri: isWebSetting?.animasiPesanan['cancel'] || '',
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                  style={{width: '100%', aspectRatio: 2}}
                />
              </View>
            ) : null}
            {detailInvoice.keterangan === '' ? null : (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  borderRadius: 8,
                  overflow: 'hidden',
                  borderWidth: 1,
                  padding: 16,
                  gap: 4,
                  marginHorizontal: 16,
                  borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
                }}>
                <DynamicText size={14} bold>
                  Keterangan
                </DynamicText>
                <HTMLDisplay html={detailInvoice.keterangan || '<p></p>'} />
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    Clipboard.setString(detailInvoice.keterangan);
                    dispatch(
                      setDropdownAlert(
                        'success',
                        'Tersalin',
                        detailInvoice.keterangan,
                      ),
                    );
                  }}>
                  <Clipboard_btn
                    style={{color: '#818994'}}
                    width={22}
                    height={17}
                  />
                </TouchableOpacity>
              </View>
            )}
            {detailInvoice.detailPembayaran === '' ? null : (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  borderRadius: 8,
                  overflow: 'hidden',
                  borderWidth: 1,
                  padding: 16,
                  gap: 4,
                  marginHorizontal: 16,
                  borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
                }}>
                <DynamicText size={14} bold>
                  Detail Pembayaran
                </DynamicText>
                <HTMLDisplay
                  html={detailInvoice.detailPembayaran || '<p></p>'}
                />
              </View>
            )}
            <ProductDetails
              detailInvoice={detailInvoice}
              isDarkMode={isDarkMode}
            />
            {detailInvoice?.faq && (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  borderRadius: 8,
                  gap: 4,
                  marginHorizontal: 16,
                }}>
                <DynamicButton
                  initialValue={`FAQ Pembayaran `}
                  styleSelected={{
                    backgroundColor: isDarkMode
              ? colorSystem.dark.background
              : colorSystem.light.background,
                    borderWidth: 1,
                    borderColor:  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary,
                  }}
                  colorText={ isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary}
                  onPress={() => {
                    setIsModalFaqPembayaran(true);
                  }}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </ViewShot>
      <HeaderAnimation />

      <FaqModal
        isOpen={isModalFaqPembayaran}
        setIsModalFaqPembayaran={setIsModalFaqPembayaran}
        detailInvoice={detailInvoice}
        isDarkMode={isDarkMode}
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
        isOpen={isModalReview}>
        <View style={{flexDirection: 'column', gap: 16}}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                setisModalReview(false);
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
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
              <Review_btn
                style={{color: isDarkMode ? '#ffffff' :  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary}}
                width={autoScreen / 5}
                height={autoScreen / 5}
              />
            </View>
            <View
              style={{flexDirection: 'column', alignItems: 'center', gap: 4}}>
              <DynamicText size={16} bold>
                Berikan Ulasanmu!
              </DynamicText>
              <DynamicText
                size={12}
                style={{textAlign: 'center', opacity: 0.7}}>
                Tulis bagaimana kesan dan penilaianmu saat membeli produk
              </DynamicText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {[1, 2, 3, 4, 5].map((number, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setisBintang(number)}
                  style={{
                    backgroundColor: 'transparent',
                    borderRadius: 5,
                    padding: 5,
                  }}>
                  {/* <DynamicText
                    size={40}
                    style={{
                      color: number <= isBintang ? '#ff772b' : '#647082',
                    }}>
                    ★
                  </DynamicText> */}
                  {/* Star_btn */}
                  <Star_btn
                    style={{color: number <= isBintang ? '#ff772b' : '#647082'}}
                    width={autoScreen / 10}
                    height={autoScreen / 10}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Input
              value={isReview}
              onChange={value => setisReview(value)}
              type={'textarea'}
              placeholder="Tulis Ulasan Anda"
            />
            <DynamicButton
              initialValue="Submit Ulasan"
              styleSelected={{
                backgroundColor: isDarkMode
              ? colorSystem.dark.background
              : colorSystem.light.background,
                borderWidth: 1,
                borderColor:  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary,
              }}
              colorText={ isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary}
              onPress={() => {
                fetchWriteReview();
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
