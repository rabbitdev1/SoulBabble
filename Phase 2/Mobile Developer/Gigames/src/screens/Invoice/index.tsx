import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootStackParamList} from '../../../App';
import Search_btn from '../../../src/assets/icon/ic_search.svg';
import {RootState} from '../../../store/reducers';
import {apiClient} from '../../../utils/api/apiClient';
import '../../../utils/ignoreWarnings';
import DynamicButton from '../../components/common/DynamicButton';
import DynamicText from '../../components/common/DynamicText';
import Input from '../../components/common/Input';
import {refreshControl} from '../../components/context/refreshFunctions';
import ConditionalRender from '../../components/ui/ConditionalRender';
import TopBar from '../../components/ui/TopBar';
import {formatCurrency} from '../../components/common/formatCurrency';
import FastImage from 'react-native-fast-image';
import {getDarkModePreference} from '../../components/common/darkModePreference';
interface HistoryPagesProps {}
type HistoryPagesScreenProp = StackNavigationProp<
  RootStackParamList,
  'DrawerScreen'
>;
const HistoryPages: React.FC<HistoryPagesProps> = () => {
  const colorSystem = useSelector(
    (state: RootState) => state.todoReducer.colorSystem,
  );

  const navigation = useNavigation<HistoryPagesScreenProp>();
  const dispatch = useDispatch();

  const isWebSetting = useSelector(
    (state: RootState) => state.todoReducer.isWebSetting,
  );

  const scrollYAnimatedValue = useRef(new Animated.Value(0)).current;
  const isLogin = useSelector((state: RootState) => state.todoReducer.isLogin);
  const [isInvoice, setInvoice] = useState('');

  const isDarkMode = getDarkModePreference();

  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const [refreshingPage, setrefreshingPage] = useState<boolean>(false);
  const [itemsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1000);
  const [currentPage, setCurrentPage] = useState(0);

  const bulanJSON =
    '[{"text": "Semua", "value": "0"},{"text": "Januari", "value": "1"},{"text": "Februari", "value": "2"},{"text": "Maret", "value": "3"},{"text": "April", "value": "4"},{"text": "Mei", "value": "5"},{"text": "Juni", "value": "6"},{"text": "Juli", "value": "7"},{"text": "Agustus", "value": "8"},{"text": "September", "value": "9"},{"text": "Oktober", "value": "10"},{"text": "November", "value": "11"},{"text": "Desember", "value": "12"}]';
  const [bulan, setBulan] = useState('0');
  const statusJSON =
    '[{"text": "Semua", "value": ""},{"text": "Cancel", "value": "cancel"},{"text": "Refund", "value": "refund"},{"text": "Pending", "value": "pending"},{"text": "Paid", "value": "paid"},{"text": "Not Paid", "value": "not_paid"},{"text": "Processing", "value": "processing"},{"text": "Success", "value": "success"}]';
  const [status, setStatus] = useState('0');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      fetchDataApi();
    });
    return () => {
      const currentDate = new Date();
      const currentMonthValue = String(currentDate.getMonth() + 1);
      const bulanArray = JSON.parse(bulanJSON);
      const currentMonthObject = bulanArray.find(
        (month: any) => month.value === currentMonthValue,
      );
      if (currentMonthObject) {
        setBulan(currentMonthObject.value);
      }
      setStatus('');
      unsubscribe();

    };
    
  }, []);

  useEffect(() => {
    fetchDataApi();
  }, [currentPage, bulan, status, isInvoice]);

  const fetchDataApi = async () => {
    fetchhistory(isLogin?.apiKey, isLogin?.token);
  };

  const fetchhistory = async (api_key: any, token: any) => {
    setHistoryLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('api_key', api_key);
      params.append('limit', itemsPerPage.toString());
      params.append('page', currentPage.toString());

      const response = await apiClient({
        baseurl: 'user/historiOrder',
        parameter:
          'histori' +
          '&bulan=' +
          bulan +
          '&invoice=' +
          isInvoice +
          '&status=' +
          status,
        method: 'POST',
        XGORDON: 'HISTORIORDER',
        apiKey: api_key,
        token: token,
        body: params,
      });
      setHistoryLoading(false);
      if (response?.statusCode === 200) {
        setTotalPages(response?.result?.total_page);
        setHistoryData(response?.result?.data);
      } else {
        setHistoryData([]);
        [];
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const InvoiceItem = React.memo(
    ({item, index}: {item: any; index: number}) => {
      return (
        <TouchableOpacity
          key={index}
          activeOpacity={0.7}
          onPress={() => {
            navigation.navigate('Invoice', {
              invoice: item.invoice,
              replaceRoute: 'DrawerScreen',
            });
          }}
          style={{
            flex: 1,
            flexDirection: 'column',
            borderRadius: 8,
            overflow: 'hidden',
            borderWidth: 1,
            backgroundColor: isDarkMode
              ? colorSystem.dark.background
              : colorSystem.light.background,
            borderColor: isDarkMode
              ? colorSystem.dark.bordercolor
              : colorSystem.light.bordercolor,
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 12,
              padding: 16,
              borderBottomWidth: 1,
              alignItems: 'center',
              borderColor: isDarkMode
                ? colorSystem.dark.bordercolor
                : colorSystem.light.bordercolor,
            }}>
            <View style={{flexDirection: 'column'}}>
              <DynamicText
                size={14}
                bold
                style={{
                  color: isDarkMode
                    ? colorSystem.dark.primary
                    : colorSystem.light.primary,
                }}>
                {item.invoice}
              </DynamicText>
              <DynamicText size={12} style={{color: '#818994'}}>
                {item.tanggal}
              </DynamicText>
            </View>
            <View
              style={{
                padding: 8,
                paddingHorizontal: 12,
                borderRadius: 6,
                backgroundColor:
                  item.status === 'cancel'
                    ? '#F42536'
                    : item.status === 'refund'
                    ? '#ED610A'
                    : item.status === 'pending'
                    ? '#ED610A'
                    : item.status === 'paid'
                    ? '#ED610A'
                    : item.status === 'not_paid'
                    ? '#000000'
                    : item.status === 'processing'
                    ? '#3694ff'
                    : item.status === 'success'
                    ? '#0ABE5D'
                    : 'transparent',
              }}>
              <DynamicText
                size={12}
                bold
                style={{
                  color: '#ffffff',
                }}>
                {item?.status === 'cancel'
                  ? 'Cancel'
                  : item?.status === 'refund'
                  ? 'Refund'
                  : item?.status === 'pending'
                  ? 'Pending'
                  : item?.status === 'paid'
                  ? 'Sudah Bayar'
                  : item?.status === 'not_paid'
                  ? 'Belum Bayar'
                  : item?.status === 'processing'
                  ? 'Processing'
                  : item?.status === 'success'
                  ? 'Success'
                  : null}
              </DynamicText>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                gap: 8,
                paddingVertical: 12,
                padding: 16,
              }}>
              <View style={{width: 40, aspectRatio: 1}}>
                <FastImage
                  source={{uri: item?.gambar || ''}}
                  resizeMode={FastImage.resizeMode.cover}
                  style={{
                    width: '100%',
                    height: '100%',
                    alignSelf: 'flex-start',
                    borderRadius: 4,
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  gap: 4,
                  flex: 1,
                }}>
                <DynamicText size={14} semiBold>
                  {item.layanan}
                </DynamicText>
                <DynamicText size={12}>{item.kategori}</DynamicText>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'column',
                paddingVertical: 12,
                gap: 4,
                padding: 16,
                justifyContent: 'center',
              }}>
              <DynamicText size={16} bold>
                {formatCurrency(item.harga)}
              </DynamicText>
            </View>
          </View>
          {item.keterangan && (
            <View style={{padding: 16, paddingVertical: 12}}>
              <DynamicText size={12}>{item.keterangan}</DynamicText>
            </View>
          )}
        </TouchableOpacity>
      );
    },
  );

  const handleRefresh = () => {
    refreshControl(setrefreshingPage, fetchDataApi);
  };
  const handleNextPage = () => {
    setCurrentPage(halamanSebelumnya => halamanSebelumnya + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(halamanSebelumnya => halamanSebelumnya - 1);
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
        <TopBar isShowLogo={false} title={'Riwayat Transaksi'} />
      </Animated.View>
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
        <View style={{gap: 16, flexDirection: 'column'}}>
          <TopBar isShowLogo={false} title={'Riwayat Transaksi'} />
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              borderWidth: 1,
              borderColor: isDarkMode
                ? colorSystem.dark.bordercolor
                : colorSystem.light.bordercolor,
              gap: 8,
              padding: 12,
              marginHorizontal: 16,
              backgroundColor: isDarkMode
                ? colorSystem.dark.card
                : colorSystem.light.card,
              borderRadius: 6,
            }}>
            <Search_btn style={{color: '#818994'}} width={22} height="100%" />
            <TextInput
              value={isInvoice}
              onChangeText={text => {
                setInvoice(text);
              }}
              placeholder="Cari Transaksi dengan Invoice"
              style={{
                flex: 1,
                fontSize: 13,
                color: isDarkMode ? 'white' : 'black',
                fontFamily: 'Gilroy-Regular',
                height: 20,
                padding: 0,
              }}
              placeholderTextColor="#9E9E9E"
              numberOfLines={1}
            />
          </View>
          <View style={{flexDirection: 'row', paddingHorizontal: 16, gap: 8}}>
            <Input
              style={{
                flex: 1,
                backgroundColor: isDarkMode
                ? colorSystem.dark.card
                : colorSystem.light.card,
                borderColor: isDarkMode
                  ? colorSystem.dark.bordercolor
                  : colorSystem.light.bordercolor,
              }}
              colorText={
                isDarkMode
                  ? '#ffffff'
                  : '#212121'
              }
              label={''}
              value={bulan}
              onChange={value => {
                if (value.length <= 200) {
                  setBulan(value);
                  setCurrentPage(0);
                }
              }}
              type={'select'}
              options={bulanJSON}
              placeholder={`Pilih Bulan`}
            />
            <Input
              style={{
                flex: 1,
                backgroundColor: isDarkMode
                ? colorSystem.dark.card
                : colorSystem.light.card,
                borderColor: isDarkMode
                  ? colorSystem.dark.bordercolor
                  : colorSystem.light.bordercolor,
              }}
              colorText={
                isDarkMode
                  ? '#ffffff'
                  : '#212121'
              }
              label={''}
              value={status}
              onChange={value => {
                if (value.length <= 200) {
                  setStatus(value);
                  setCurrentPage(0);
                }
              }}
              type={'select'}
              options={statusJSON}
              placeholder={`Pilih Status`}
            />
          </View>

          <View
            style={{
              flexDirection: 'column',
              marginHorizontal: 16,
              borderRadius: 6,
              gap: 8,
            }}>
            <ConditionalRender
              productsData={historyData}
              isLoading={historyLoading}
              parsedSetting={isWebSetting}
              style={{height: 120}}
              model={'emptyData'}>
              {historyData.map((item: any, index: any) => (
                <React.Fragment key={index}>
                  <InvoiceItem item={item} index={index} />
                </React.Fragment>
              ))}
            </ConditionalRender>
          </View>
          {historyData.length !== 0 && (
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
                disabled={historyData.length === 0 || currentPage >= totalPages}
                styleSelected={{
                  backgroundColor: isDarkMode
                    ? colorSystem.dark.background
                    : colorSystem.light.background,
                  borderWidth: 1,
                  borderColor:
                    historyData.length === 0 || currentPage >= totalPages
                      ? '#DDDDDD'
                      : isDarkMode
                      ? colorSystem.dark.primary
                      : colorSystem.light.primary,
                  flex: 1,
                }}
                colorText={
                  historyData.length === 0 || currentPage >= totalPages
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
        </View>
      </ScrollView>
      <HeaderAnimation />
    </SafeAreaView>
  );
};
export default HistoryPages;
