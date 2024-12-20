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
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootStackParamList} from '../../../App';
import Document_btn from '../../../src/assets/icon/ic_document.svg';
import Search_btn from '../../../src/assets/icon/ic_search.svg';
import {isPending, setDropdownAlert} from '../../../store/actions/todoActions';
import {RootState} from '../../../store/reducers';
import {apiClient} from '../../../utils/api/apiClient';
import '../../../utils/ignoreWarnings';
import DynamicText from '../../components/common/DynamicText';
import {refreshControl} from '../../components/context/refreshFunctions';
import ConditionalRender from '../../components/ui/ConditionalRender';
import TopBar from '../../components/ui/TopBar';
import {getDarkModePreference} from '../../components/common/darkModePreference';
interface CheckInvoiceProps {}
type checkinvoiceScreenProp = StackNavigationProp<
  RootStackParamList,
  'DrawerScreen'
>;
const CheckInvoicepages: React.FC<CheckInvoiceProps> = () => {
  const colorSystem = useSelector(
    (state: RootState) => state.todoReducer.colorSystem,
  );

  const navigation = useNavigation<checkinvoiceScreenProp>();
  const dispatch = useDispatch();

  const scrollYAnimatedValue = useRef(new Animated.Value(0)).current;
  const isWebSetting = useSelector(
    (state: RootState) => state.todoReducer.isWebSetting,
  );
  const [isSearching, setSearching] = useState('');

  const isDarkMode = getDarkModePreference();
  const [PesananRealtimeData, setPesananRealtimeData] = useState<any>([]);
  const [PesananRealtimeLoading, setPesananRealtimeLoading] = useState(true);
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
    fetchPesananRealtime();
  };

  const fetchPesananRealtime = async () => {
    setPesananRealtimeLoading(true);
    try {
      const response = await apiClient({
        baseurl: 'user/pesananTerakhir',
        method: 'GET',
        XGORDON: 'PESANANTERAKHIR',
      });
      setPesananRealtimeLoading(false);
      if (response?.statusCode === 200) {
        setPesananRealtimeData(response?.result.data);
      } else {
        setPesananRealtimeData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const InvoiceItem = React.memo(({item}: {item: any}) => {
    return (
      <View
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
          <DynamicText size={12} style={{color: '#818994'}}>
            {item.datetime}
          </DynamicText>
          <DynamicText
            size={12}
            bold
            style={{
              color:
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
            {item.status?.toUpperCase()}
          </DynamicText>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            paddingVertical: 12,
            gap: 4,
            padding: 16,
          }}>
          <DynamicText size={12}>{item.invoice}</DynamicText>
          <DynamicText size={14} semiBold>
            {item.layanan}
          </DynamicText>
          <DynamicText size={12}>{item.kategori}</DynamicText>
        </View>
      </View>
    );
  });

  const fetchCheckInvoice = async (path: any) => {
    dispatch(isPending(true));
    try {
      const params = new URLSearchParams();
      params.append('invoice', path);

      const response = await apiClient({
        baseurl: 'user/invoice',
        XGORDON: 'INVOICE',
        method: 'POST',
        body: params,
      });
      dispatch(isPending(false));
      if (response?.statusCode === 200) {
        navigation.navigate('Invoice', {
          invoice: response?.result?.data.invoice,
          replaceRoute: 'DrawerScreen',
        });
      } else {
        dispatch(setDropdownAlert('error', 'Error', response?.result.msg));
        setSearching('');
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
          title={'Cek Transaksi'}
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
              paddingBottom: 60,
            }}
            source={require('../../../src/assets/images/ornament_1.png')}
            imageStyle={{
              resizeMode: 'cover',
              alignSelf: 'center',
            }}>
            <TopBar
              isIconLeft={false}
              isShowLogo={false}
              title={''}
              transparent={true}
            />
            <View style={{flexDirection: 'column', gap: 16}}>
              <View
                style={{
                  paddingHorizontal: 16,
                  alignItems: 'flex-start',
                  gap: 4,
                }}>
                <DynamicText
                  size={16}
                  bold
                  style={{color: 'white'}}
                  numberOfLines={1}>
                  Cari Transaksi
                </DynamicText>
                <DynamicText
                  size={14}
                  style={{color: 'white'}}
                  numberOfLines={3}>
                  Transaksimu akan otomatis diproses, umumnya akan selesai dalam
                  1-2 detik namun jika kamu mengalami masalah silahkan cari
                  transaksimu disini.
                </DynamicText>
              </View>

              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  gap: 8,
                  padding: 12,
                  marginHorizontal: 16,
                  backgroundColor: isDarkMode
                    ? colorSystem.dark.card
                    : colorSystem.light.card,
                  borderRadius: 6,
                }}>
                <Document_btn
                  style={{color: '#818994'}}
                  width={22}
                  height="100%"
                />
                <TextInput
                  value={isSearching}
                  onChangeText={text => {
                    setSearching(text);
                  }}
                  onSubmitEditing={() => {
                    fetchCheckInvoice(isSearching);
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
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    fetchCheckInvoice(isSearching);
                  }}
                  style={{height: 20}}>
                  <Search_btn
                    style={{color: '#818994'}}
                    width={22}
                    height="100%"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
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
            marginTop: -44,
            marginBottom: 10,
          }}>
          <View
            style={{
              flexDirection: 'column',
              gap: 8,
              padding: 16,
            }}>
            <DynamicText size={12} style={{marginBottom: 8}}>
              Menampilkan 10 Transaksi Terbaru
            </DynamicText>
            <ConditionalRender
              productsData={PesananRealtimeData}
              isLoading={PesananRealtimeLoading}
              parsedSetting={isWebSetting}
              style={{height: 120}}
              model={'emptyData'}>
              {PesananRealtimeData.map((item: any, index: any) => (
                <React.Fragment key={index}>
                  <InvoiceItem item={item} />
                </React.Fragment>
              ))}
            </ConditionalRender>
          </View>
        </View>
      </ScrollView>
      <HeaderAnimation />
    </SafeAreaView>
  );
};
export default CheckInvoicepages;
