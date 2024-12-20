import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {RootStackParamList} from '../../../App';
import Notification_btn from '../../../src/assets/icon/ic_notification.svg';
import Search_btn from '../../../src/assets/icon/ic_search.svg';
import Wallet_btn from '../../../src/assets/icon/ic_wallet.svg';
import {RootState} from '../../../store/reducers';
import {apiClient} from '../../../utils/api/apiClient';
import '../../../utils/ignoreWarnings';
import Add_btn from '../../assets/icon/ic_add.svg';
import DynamicText from '../../components/common/DynamicText';
import {formatCurrency} from '../../components/common/formatCurrency';
import {refreshControl} from '../../components/context/refreshFunctions';
import useAutoScreen from '../../components/context/useAutoScreen';
import ArticleSlider from './ArticleSlider';
import FlashSaleSlider from './FlashSaleSlider';
import PopularnCategory from './PopularnCategory';
import Slider from './Slider';
import TabCategory from './TabCategory';
import {isPopup, setDropdownAlert} from '../../../store/actions/todoActions';
import DeviceInfo from 'react-native-device-info';
import {getDarkModePreference} from '../../components/common/darkModePreference';
interface HomepagesProps {}
type homeScreenProp = StackNavigationProp<RootStackParamList, 'DrawerScreen'>;
const Homepages: React.FC<HomepagesProps> = () => {
  const colorSystem = useSelector(
      (state: RootState) => state.todoReducer.colorSystem,
    );
  
  const navigation = useNavigation<homeScreenProp>();
  const autoScreen = useAutoScreen();
  const dispatch = useDispatch();

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

  const isDarkMode = getDarkModePreference();
  const [sliderData, setSliderData] = useState<any[]>([]);
  const [flashSaleData, setFlashSaleData] = useState<any[]>([]);
  const [trendingData, setTrendingData] = useState<any[]>([]);
  const [productData, setProductData] = useState<any[]>([]);
  const [listProduct, setListProduct] = useState<any[]>([]);
  const [articleData, setArticleData] = useState<any[]>([]);

  const [sliderLoading, setSliderLoading] = useState<boolean>(true);
  const [flashSaleLoading, setFlashSaleLoading] = useState<boolean>(true);
  const [trendingLoading, setTrendingLoading] = useState<boolean>(true);
  const [productLoading, setProductLoading] = useState<boolean>(true);
  const [articleLoading, setArticleLoading] = useState<boolean>(true);

  const [tabcategroy, setTabCategory] = useState<string>('');

  const [logicFlashsale, setLogicFlashsale] = useState<any>({});
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [refreshingPage, setrefreshingPage] = useState<boolean>(false);

  useEffect(() => {
    fetchDataApi();
  }, []);

  const fetchDataApi = async () => {
    if (isLogin !== '') {
      let getSystemName = DeviceInfo.getSystemName();
      let getModel = DeviceInfo.getModel();
      fetchSetToken(
        isLogin?.apiKey,
        isLogin?.token,
        isTokenNotify,
        getSystemName + ' ' + getModel,
      );
      
    }

    if (isWebSetting.popup_image === null) {
      dispatch(isPopup(false));
    } else {
      dispatch(isPopup(true));
    }
    fetchDataSlider();
    fetchDataFlashSale();
    fetchDataPopuler();
    fetchDataProduct();
    fetchDataArticle();
  };

  const fetchSetToken = async (
    api_key: any,
    token: any,
    tokenPush: any,
    device_id: any,
  ) => {
    try {
      const params = new URLSearchParams();
      params.append('api_key', api_key);
      params.append('token', tokenPush);
      params.append('device_id', device_id);
      
      const response = await apiClient({
        baseurl: 'user/tokenFirebase',
        method: 'POST',
        XGORDON: 'TOKENFIREBASE',
        apiKey: api_key,
        token: token,
        body: params,
      });
      if (response?.statusCode === 200) {
        console.log(response?.result.msg);
      } else {
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchDataSlider = async () => {
    setSliderLoading(true);
    try {
      const response = await apiClient({
        baseurl: 'user/slider',
        method: 'GET',
        XGORDON: 'SLIDER',
      });
      setSliderLoading(false);
      if (response?.statusCode === 200) {
        setSliderData(response.result.data);
      } else {
        setSliderData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchDataFlashSale = async () => {
    setFlashSaleLoading(true);
    try {
      const response = await apiClient({
        baseurl: 'user/flashsale',
        method: 'GET',
        XGORDON: 'FLASHSALE',
      });
      setFlashSaleLoading(false);
      if (response?.statusCode === 200) {
        const updatedData = [...(response.result.data || [])];

        const newItem = {layanan: 'opening'};
        updatedData.unshift(newItem);

        setFlashSaleData(updatedData);
        setLogicFlashsale(response.result.flash_sale);
      } else {
        setFlashSaleData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchDataPopuler = async () => {
    setTrendingLoading(true);
    try {
      const response = await apiClient({
        baseurl: 'user/trending',
        method: 'GET',
        XGORDON: 'TRENDING',
      });
      setTrendingLoading(false);
      if (response?.statusCode === 200) {
        setTrendingData(response.result.data);
      } else {
        setTrendingData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchDataProduct = async () => {
    setProductLoading(true);
    try {
      const response = await apiClient({
        baseurl: 'user/kategori',
        method: 'GET',
        XGORDON: 'KATEGORI',
      });
      setProductLoading(false);
      if (response?.statusCode === 200) {
        setProductData(response?.result.data);
        setTabCategory('⭐ Semua');

        const allCategory = response?.result.data.reduce(
          (accumulator: any, current: any) => {
            return [...accumulator, ...current.kategori];
          },
          [],
        );
        const listProduct = allCategory.map((item: any) => {
          return {
            ...item,
            jenis: response?.result.data.find((jenis: any) =>
              jenis.kategori.some(
                (kategori: any) => kategori.nama === item.nama,
              ),
            ).jenis,
          };
        });
        const slugArray = listProduct.map((item: any) => item.slug);
        await AsyncStorage.setItem('isProduct', JSON.stringify(slugArray));

        setListProduct(listProduct);
      } else {
        setProductData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleRefresh = () => {
    refreshControl(setrefreshingPage, fetchDataApi);
  };

  const fetchDataArticle = async () => {
    setArticleLoading(true);
    try {
      const response = await apiClient({
        baseurl: 'user/jenisBlog?trending',
        method: 'GET',
        XGORDON: 'JENISBLOG',
      });
      setArticleLoading(false);
      if (response?.statusCode === 200) {
        setArticleData(response.result.data);
      } else {
        setArticleData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: isDarkMode
              ? colorSystem.dark.background
              : colorSystem.light.background}}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary}
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
        }>
        <View style={{flex: 1, flexDirection: 'column', gap: 8}}>
          <LinearGradient
            colors={isDarkMode
              ? colorSystem.dark.gradient
              : colorSystem.light.gradient}
            style={{
              width: '100%',
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
              paddingBottom: 100,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 8,
                padding: 16,
              }}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  flexDirection: 'row',
                  padding: 3,
                  gap: 8,
                }}>
                <View style={{width: 130, height: 32}}>
                  {isWebSetting && isWebSetting.logo && (
                     isDarkMode ?
                     <FastImage
                       source={{uri: isWebSetting?.logo_dark || ''}}
                       resizeMode={FastImage.resizeMode.contain}
                       style={{
                         width: '100%',
                         height: '100%',
                         alignSelf: 'flex-start',
                       }}
                     />:
                     <FastImage
                       source={{uri: isWebSetting?.logo || ''}}
                       resizeMode={FastImage.resizeMode.contain}
                       style={{
                         width: '100%',
                         height: '100%',
                         alignSelf: 'flex-start',
                       }}
                     />
                  )}
                </View>
              </View>
            </View>

            <View style={{flexDirection: 'column', gap: 16}}>
              {isLogin === '' && (
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
                    Selamat Datang,
                  </DynamicText>
                  <DynamicText
                    size={14}
                    light
                    style={{color: 'white'}}
                    semiBold
                    numberOfLines={1}>
                    Login untuk nikmatin semua fitur!
                  </DynamicText>
                </View>
              )}
              <View
                style={{flexDirection: 'row', paddingHorizontal: 16, gap: 8}}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('Search')}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    gap: 4,
                    flexDirection: 'row',
                    padding: 8,
                    backgroundColor:  isDarkMode
              ? colorSystem.dark.card
              : colorSystem.light.card,
                    borderRadius: 6,
                  }}>
                  <Search_btn
                    style={{color: '#818994'}}
                    width={'22'}
                    height={'100%'}
                  />
                  <DynamicText
                    size={13}
                    light
                    style={{color: '#818994'}}
                    numberOfLines={1}>
                    Cari atau masukan nama produk
                  </DynamicText>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('NotificationList')}
                  style={{
                    width: 40,
                    height: 40,
                    padding: 8,
                    backgroundColor:  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary,
                    borderRadius: 6,
                  }}>
                  <Notification_btn
                    style={{color: '#ffffff'}}
                    width={'100%'}
                    height={'100%'}
                  />
                </TouchableOpacity>
              </View>
              {isLogin !== '' && (
                <View
                  style={{flexDirection: 'row', paddingHorizontal: 16, gap: 8}}>
                  <View
                    style={{
                      flex: 1,
                      gap: 8,
                      flexDirection: 'column',
                      padding: 12,
                      backgroundColor:  isDarkMode
              ? colorSystem.dark.card
              : colorSystem.light.card,
                      borderRadius: 6,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        gap: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Wallet_btn
                        style={{color:  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary}}
                        width={18}
                        height={18}
                      />
                      <DynamicText size={12} semiBold>
                        Saldo Saya
                      </DynamicText>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        gap: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'center',
                          flexDirection: 'row',
                          gap: 8,
                          height: '100%',
                        }}>
                        <DynamicText size={18} bold numberOfLines={1}>
                          {formatCurrency(isProfile?.saldo)}
                        </DynamicText>
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => navigation.navigate('Saldo')}>
                          <Add_btn
                            width={24}
                            height={24}
                            style={{color:  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary}}
                          />
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 8,
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                          }}>
                          <DynamicText
                            size={14}
                            semiBold
                            style={{maxWidth: 150}}
                            numberOfLines={2}>
                            {isProfile.nama}
                          </DynamicText>
                          <DynamicText size={12} light numberOfLines={1}>
                            {isProfile.level}
                          </DynamicText>
                        </View>
                        <FastImage
                          source={{uri: isProfile.profil}}
                          resizeMode={FastImage.resizeMode.contain}
                          style={{
                            width: 40,
                            aspectRatio: 1 / 1,
                            borderRadius: 50,
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </LinearGradient>
          <View style={{marginTop: -90}}>
            <Slider
              sliderData={sliderData}
              sliderLoading={sliderLoading}
              activeSlide={activeSlide}
              setActiveSlide={setActiveSlide}
              isWebSetting={isWebSetting}
            />
          </View>
          <FlashSaleSlider
            data={flashSaleData}
            loading={flashSaleLoading}
            logicFlashsale={logicFlashsale}
            isWebSetting={isWebSetting}
          />
          <PopularnCategory
            data={trendingData}
            loading={trendingLoading}
            isWebSetting={isWebSetting}
          />
          <TabCategory
            data={productData}
            listProduct={listProduct}
            loading={productLoading}
            tabcategroy={tabcategroy}
            setTabCategory={setTabCategory}
            isWebSetting={isWebSetting}
          />
          <ArticleSlider
            data={articleData}
            loading={articleLoading}
            isWebSetting={isWebSetting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default Homepages;
