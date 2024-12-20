import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import moment from 'moment';
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
import SaldoKeluar_btn from '../../../src/assets/icon/ic_saldo_keluar.svg';
import SaldoMasuk_btn from '../../../src/assets/icon/ic_saldo_masuk.svg';
import {RootState} from '../../../store/reducers';
import {apiClient} from '../../../utils/api/apiClient';
import '../../../utils/ignoreWarnings';
import DynamicButton from '../../components/common/DynamicButton';
import DynamicText from '../../components/common/DynamicText';
import {formatCurrency} from '../../components/common/formatCurrency';
import {refreshControl} from '../../components/context/refreshFunctions';
import useAutoScreen from '../../components/context/useAutoScreen';
import CalendarComponent from '../../components/ui/CalendarComponent';
import ConditionalRender from '../../components/ui/ConditionalRender';
import TopBar from '../../components/ui/TopBar';
import { getDarkModePreference } from '../../components/common/darkModePreference';
interface LogSaldoPagesProps {}
type LogSaldoPagesScreenProp = StackNavigationProp<
  RootStackParamList,
  'DrawerScreen'
>;
const LogSaldoPages: React.FC<LogSaldoPagesProps> = () => {
  const colorSystem = useSelector(
      (state: RootState) => state.todoReducer.colorSystem,
    );
  
  const navigation = useNavigation<LogSaldoPagesScreenProp>();
  const autoScreen = useAutoScreen();
  const dispatch = useDispatch();

  const [LogSaldoLoading, setPesananRealtimeLoading] = useState(true);
  const [itemsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1000);
  const [currentPage, setCurrentPage] = useState(0);

  const scrollYAnimatedValue = useRef(new Animated.Value(0)).current;
  const isProfile = useSelector(
    (state: RootState) => state.todoReducer.isProfile,
  );
  const isLogin = useSelector((state: RootState) => state.todoReducer.isLogin);
  const isWebSetting = useSelector(
    (state: RootState) => state.todoReducer.isWebSetting,
  );

  const isDarkMode = getDarkModePreference();
  const [logSaldoData, setlogSaldoData] = useState([]);
  const [value, setValue] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    endDate: new Date(),
  });

  const [refreshingPage, setrefreshingPage] = useState<boolean>(false);

  useEffect(() => {
    fetchDataApi();
  }, [value, currentPage]);

  const fetchDataApi = async () => {
    const formattedstartDate = moment(new Date(value.startDate)).format(
      'YYYY-MM-DD',
    );
    const formattedendDate = moment(new Date(value.endDate)).format(
      'YYYY-MM-DD',
    );
    if (isLogin) {
      fetchLogSaldo(
        isLogin?.apiKey,
        isLogin?.token,
        formattedstartDate,
        formattedendDate,
      );
    }
  };

  const fetchLogSaldo = async (
    api_key: any,
    token: any,
    startDate: any,
    endDate: any,
  ) => {
    setPesananRealtimeLoading(true);
    try {
      const response = await apiClient({
        baseurl: 'user/logSaldo',
        parameter:
          'api_key=' +
          api_key +
          '&start_date=' +
          startDate +
          '&end_date=' +
          moment(value.endDate).format('YYYY-MM-DD') +
          '&page=' +
          currentPage +
          '&limit=' +
          itemsPerPage,
        method: 'GET',
        XGORDON: 'LOGSALDO',
        token: token,
      });
      setPesananRealtimeLoading(false);
      if (response?.statusCode === 200) {
        setTotalPages(response?.result?.total_page);
        setlogSaldoData(response.result.data);
      } else {
        setlogSaldoData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const LogSaldoItem = React.memo(({item}: {item: any}) => {
    return (
      <View
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
          backgroundColor: item.jenis === 'plus' ? '#4CAF5010' : '#F4433610',
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
          <DynamicText size={12} semiBold>
            Pembelian Item
          </DynamicText>
          <DynamicText size={12} style={{color: '#818994'}}>
            {item.tanggal}
          </DynamicText>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            paddingVertical: 12,
            gap: 8,
            padding: 16,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <DynamicText size={14} bold style={{flex: 1}}>
              {item.keterangan}
            </DynamicText>
            <DynamicText size={16} bold style={{textAlign: 'right'}}>
              {formatCurrency(item.jumlah_saldo)}
            </DynamicText>
          </View>
          <View
            style={{
              flexDirection: 'row',
              gap: 8,
              borderTopWidth: 1,
              borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
              paddingTop: 8,
            }}>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
              }}>
              <SaldoKeluar_btn
                style={{color: '#F44336'}}
                width={18}
                height={18}
              />
              <DynamicText
                size={12}
                bold
                style={{textAlign: 'center', color: '#F44336'}}>
                {formatCurrency(item.saldo_sebelum)}
              </DynamicText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
              }}>
              <SaldoMasuk_btn
                style={{color: '#4CAF50'}}
                width={18}
                height={18}
              />
              <DynamicText
                size={12}
                bold
                style={{textAlign: 'center', color: '#4CAF50'}}>
                {formatCurrency(item.saldo_sesudah)}
              </DynamicText>
            </View>
          </View>
        </View>
      </View>
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
        <TopBar
          isIconLeft={false}
          isShowLogo={false}
          title={'Informasi Penggunaan Saldo'}
        />
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
            title={'Informasi Penggunaan Saldo'}
          />

          <View style={{flexDirection: 'row', gap: 8, marginHorizontal: 16}}>
            <View
              style={{
                flex: 1,
                padding: 12,
                backgroundColor: '#4CAF50',
                borderRadius: 8,
                gap: 8,
              }}>
              <DynamicText size={12} style={{color: '#ffffff'}}>
                Saldo Masuk
              </DynamicText>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                <SaldoMasuk_btn
                  style={{color: '#ffffff'}}
                  width={18}
                  height={18}
                />
                <DynamicText
                  size={14}
                  bold
                  style={{color: '#ffffff'}}
                  numberOfLines={1}>
                  {formatCurrency(isProfile?.penambahan_saldo)}
                </DynamicText>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                padding: 12,
                backgroundColor: '#F44336',
                borderRadius: 8,
                gap: 8,
              }}>
              <DynamicText size={12} style={{color: '#ffffff'}}>
                Saldo Keluar
              </DynamicText>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                <SaldoKeluar_btn
                  style={{color: '#ffffff'}}
                  width={18}
                  height={18}
                />
                <DynamicText
                  size={14}
                  bold
                  style={{color: '#ffffff'}}
                  numberOfLines={1}>
                  {formatCurrency(isProfile?.pengurangan_saldo)}
                </DynamicText>
              </View>
            </View>
          </View>
          <View style={{flexDirection: 'column', gap: 8}}>
            <View style={{marginHorizontal: 16}}>
              <DynamicText size={16} semiBold numberOfLines={1}>
                Riwayat Penggunaan Saldo
              </DynamicText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 16,
                gap: 8,
                paddingBottom: 8,
              }}>
              <CalendarComponent
                startDate={moment(value.startDate).format('YYYY-MM-DD')}
                endDate={moment(value.endDate).format('YYYY-MM-DD')}
                value={value}
                onDayPress={(day: any) => {
                  setValue(day);
                  console.log('selected day', day);
                }}
              />
            </View>
            <ConditionalRender
              productsData={logSaldoData}
              isLoading={LogSaldoLoading}
              style={{aspectRatio: 1 / 1, marginHorizontal: 16}}
              model={'emptyData'}
              parsedSetting={isWebSetting}>
              {logSaldoData.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <LogSaldoItem item={item} />
                  </React.Fragment>
                );
              })}
            </ConditionalRender>
          </View>
          {logSaldoData.length !== 0 && (
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
                  borderColor: currentPage <= 0 ? '#DDDDDD' :  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary,
                  flex: 1,
                }}
                colorText={currentPage <= 0 ? '#DDDDDD' :  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary}
                onPress={() => {
                  handlePreviousPage();
                }}
              />
              <DynamicButton
                initialValue={`Selanjutnya`}
                disabled={
                  logSaldoData.length === 0 || currentPage >= totalPages
                }
                styleSelected={{
                  backgroundColor: isDarkMode
              ? colorSystem.dark.background
              : colorSystem.light.background,
                  borderWidth: 1,
                  borderColor:
                    logSaldoData.length === 0 || currentPage >= totalPages
                      ? '#DDDDDD'
                      :  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary,
                  flex: 1,
                }}
                colorText={
                  logSaldoData.length === 0 || currentPage >= totalPages
                    ? '#DDDDDD'
                    :  isDarkMode
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
export default LogSaldoPages;
