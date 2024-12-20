import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';
import Point_btn from '../../assets/icon/ic_point.svg';

import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../../App';
import { isPending, setDropdownAlert } from '../../../store/actions/todoActions';
import { RootState } from '../../../store/reducers';
import { apiClient } from '../../../utils/api/apiClient';
import '../../../utils/ignoreWarnings';
import DynamicButton from '../../components/common/DynamicButton';
import DynamicText from '../../components/common/DynamicText';
import { refreshControl } from '../../components/context/refreshFunctions';
import useAutoScreen from '../../components/context/useAutoScreen';
import ConditionalRender from '../../components/ui/ConditionalRender';
import TopBar from '../../components/ui/TopBar';
import { getDarkModePreference } from '../../components/common/darkModePreference';
interface TukarPointPagesProps {}
type TukarPointPagesScreenProp = StackNavigationProp<
  RootStackParamList,
  'DrawerScreen'
>;
const TukarPointPages: React.FC<TukarPointPagesProps> = () => {
  const colorSystem = useSelector(
      (state: RootState) => state.todoReducer.colorSystem,
    );
  
  const navigation = useNavigation<TukarPointPagesScreenProp>();
  const autoScreen = useAutoScreen();
  const isWebSetting = useSelector(
    (state: RootState) => state.todoReducer.isWebSetting,
  );
  const isProfile = useSelector(
    (state: RootState) => state.todoReducer.isProfile,
  );
  const isLogin = useSelector((state: RootState) => state.todoReducer.isLogin);

  const dispatch = useDispatch();

  const scrollYAnimatedValue = useRef(new Animated.Value(0)).current;
  const isDarkMode = getDarkModePreference();

  const [paymentData, setPaymentData] = useState([]);
  const [listMemberData, setListMemberData] = useState([]);
  const [point, setPoint] = useState(0);
  const [itemsPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(1000);
  const [currentPage, setCurrentPage] = useState(0);

  const [listMemberLoading, setListMemberLoading] = useState(true);
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
    fetchDataApi();
  }, [currentPage]);

  const fetchDataApi = async () => {
    if (isLogin) {
      fetchListgiftCard(isLogin?.apiKey, isLogin?.token);
    }
  };

  const fetchListgiftCard = async (api_key: any, token: any) => {
    setListMemberLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('api_key', api_key);
      params.append('limit', itemsPerPage.toString());
      params.append('page', currentPage.toString());

      const response = await apiClient({
        baseurl: 'user/listTukarPoint',
        parameter: 'api_key=' + api_key,
        method: 'POST',
        XGORDON: 'LISTTUKARPOINT',
        apiKey: api_key,
        token: token,
        body: params,
      });
      setListMemberLoading(false);
      if (response?.statusCode === 200) {
        setTotalPages(response?.result?.total_page);
        setListMemberData(response.result.data);
        setPoint(response.result.pointku);
      } else {
        setListMemberData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const cekPoin = async (id: any) => {
    dispatch(isPending(true));
    try {
      const params = new URLSearchParams();
      params.append('api_key', isLogin?.apiKey);
      params.append('id', id);

      const response = await apiClient({
        baseurl: 'user/tukar',
        method: 'POST',
        XGORDON: 'TUKAR',
        apiKey: isLogin?.apiKey,
        token: isLogin?.token,
        body: params,
      });
      dispatch(isPending(false));

      if (response?.statusCode === 200) {
        dispatch(setDropdownAlert('success', 'Sukses', response?.result.msg));
      } else {
        dispatch(setDropdownAlert('error', 'Error', response?.result.msg));
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
        }}>
        <FastImage
          source={{
            uri: item.gambar,
          }}
          resizeMode={FastImage.resizeMode.cover}
          style={{
            width: '100%',
            aspectRatio: 2 / 1,
          }}
        />
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            gap: 8,
            justifyContent: 'space-between',
            paddingVertical: 12,
            padding: 16,
          }}>
          <DynamicText size={14} bold>
            {item.judul}
          </DynamicText>
          <DynamicText size={12}>{item.deskripsi}</DynamicText>
          <View
            style={{
              flexDirection: 'row',
              gap: 8,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
              <Point_btn width={18} height={18} style={{color:  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary}} />
              <DynamicText size={14} bold>
                {item.harga_tukar}
              </DynamicText>
            </View>
            <DynamicButton
              initialValue="Tukar Point"
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
                cekPoin(item.id);
              }}
            />
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
        <TopBar isIconLeft={false} isShowLogo={false} title={'Tukar Point'} />
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
        <View style={{gap: 16, flexDirection: 'column', marginBottom: 16}}>
          <TopBar isIconLeft={false} isShowLogo={false} title={'Tukar Point'} />

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
            <DynamicText size={12}>Total Point Saya</DynamicText>
            <DynamicText size={24} bold>
              {isProfile?.point}
            </DynamicText>
          </View>

          <View style={{flexDirection: 'column', gap: 8}}>
            <View style={{marginHorizontal: 16}}>
              <DynamicText size={16} semiBold numberOfLines={1}>
                Riwayat Penggunaan Saldo
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
                    <LogSaldoItem item={item} />
                  </React.Fragment>
                );
              })}
            </ConditionalRender>
          </View>
        </View>
      </ScrollView>
      {listMemberData.length !== 0 && (
        <View
          style={{
            flexDirection: 'row',
            padding: 16,
            gap: 8,
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
            disabled={listMemberData.length === 0 || currentPage >= totalPages}
            styleSelected={{
              backgroundColor: isDarkMode
              ? colorSystem.dark.background
              : colorSystem.light.background,
              borderWidth: 1,
              borderColor:
                listMemberData.length === 0 || currentPage >= totalPages
                  ? '#DDDDDD'
                  :  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary,
              flex: 1,
            }}
            colorText={
              listMemberData.length === 0 || currentPage >= totalPages
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
      <HeaderAnimation />
    </SafeAreaView>
  );
};
export default TukarPointPages;
