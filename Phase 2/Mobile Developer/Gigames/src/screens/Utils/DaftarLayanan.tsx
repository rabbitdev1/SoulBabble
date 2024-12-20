import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  ImageBackground,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootStackParamList } from '../../../App';
import { RootState } from '../../../store/reducers';
import '../../../utils/ignoreWarnings';

import FastImage from 'react-native-fast-image';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { apiClient } from '../../../utils/api/apiClient';
import DynamicText from '../../components/common/DynamicText';
import { formatCurrency } from '../../components/common/formatCurrency';
import { refreshControl } from '../../components/context/refreshFunctions';
import useAutoScreen from '../../components/context/useAutoScreen';
import ConditionalRender from '../../components/ui/ConditionalRender';
import TopBar from '../../components/ui/TopBar';
import { getDarkModePreference } from '../../components/common/darkModePreference';
import LinearGradient from 'react-native-linear-gradient';

interface DaftarLayananPagesProps { }
type homeScreenProp = StackNavigationProp<RootStackParamList, 'DrawerScreen'>;

const DaftarLayananPages: React.FC<DaftarLayananPagesProps> = () => {
  const colorSystem = useSelector(
    (state: RootState) => state.todoReducer.colorSystem,
  );

  const navigation = useNavigation<homeScreenProp>();
  const scrollYAnimatedValue = useRef(new Animated.Value(0)).current;
  const isLogin = useSelector((state: RootState) => state.todoReducer.isLogin);
  const isDarkMode = getDarkModePreference();

  const [daftarProdukData, setDaftarProdukData] = useState<any>([]);
  const [categoryData, setCategoryData] = useState<any>([]);

  const [daftarProdukloading, setDaftarProdukLoading] = useState(true);
  const [listItems, setListItems] = useState('⭐ Semua');

  const isWebSetting = useSelector(
    (state: RootState) => state.todoReducer.isWebSetting,
  );
  const autoScreen = useAutoScreen();

  const [productData, setProductData] = useState([]);
  const [listProduct, setListProduct] = useState([]);

  const [productLoading, setProductLoading] = useState(true);
  const [tabcategroy, setTabCategory] = useState('Game');

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
    console.log(isLogin);
    fetchDataProduct();
    fetchDaftarProduk();
  };

  useEffect(() => {
    fetchDaftarProduk1();
  }, [listItems]);

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
        setListItems(response?.result?.data[0]?.kategori[0]?.nama || '');
        setTabCategory(response?.result.data[0]?.jenis || '');

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

        setListProduct(listProduct);
      } else {
        setProductData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchDaftarProduk1 = async () => {
    setDaftarProdukLoading(true);
    try {
      const response = await apiClient({
        baseurl: `user/daftarProduk`,
        method: 'GET',
        XGORDON: 'DAFTARPRODUK',
      });
      setDaftarProdukLoading(false);
      if (response?.statusCode === 200) {
        setDaftarProdukData(response?.result?.data?.produk);
      } else {
        setDaftarProdukData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchDaftarProduk = async () => {
    setDaftarProdukLoading(true);
    try {
      const response = await apiClient({
        baseurl: `user/daftarProduk`,
        method: 'GET',
        XGORDON: 'DAFTARPRODUK',
      });
      setDaftarProdukLoading(false);
      if (response?.statusCode === 200) {
        const data = response.result.data.produk;
        const updatedata = [...data];
        const resultArray = updatedata.map(item => ({
          text: item.kategori,
          value: item.kategori,
          gambar: item.gambar,
        }));
        const uniqueArray: { text: string; value: string; gambar: string }[] = [
          ...new Set(resultArray.map((item: any) => JSON.stringify(item))),
        ].map((item: string) => JSON.parse(item));

        setCategoryData(uniqueArray);
      } else {
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
          title={' Daftar Layanan'}
          style={{
            backgroundColor: isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary
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
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollYAnimatedValue } } }],
          { useNativeDriver: false },
        )}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <ImageBackground
            style={{
              width: '100%',
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
              colorText="#ffffff"
              transparent={true}
            />
            <View
              style={{
                flexDirection: 'column',
                gap: 8,
                padding: 16,
                paddingTop: 0,
              }}>
              <DynamicText
                size={16}
                numberOfLines={1}
                bold
                style={{ color: '#ffffff' }}>
                Daftar Layanan
              </DynamicText>
              <DynamicText
                size={12}
                numberOfLines={3}
                style={{ color: '#ffffff' }}>
                Ini adalah halaman untuk melihat daftar harga semua produk kami.
                Silahkan pilih produk untuk melihat list harga
              </DynamicText>
            </View>
          </ImageBackground>
          <View
            style={{
              flexDirection: 'column',
              gap: 16,
              padding: 16,
            }}>
            <DynamicText size={16} numberOfLines={1} bold>
              Daftar Layanan
            </DynamicText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{  gap: 8 }}>
              {[...productData].map((item: any, index: number) => {
                return (
                  <LinearGradient
                    key={index}
                    colors={
                      tabcategroy === item.jenis
                        ? isDarkMode
                          ? colorSystem.light.gradient
                          : colorSystem.light.gradient
                        : isDarkMode
                          ? [colorSystem.dark.card, colorSystem.dark.card]
                          : [colorSystem.light.card, colorSystem.light.card]
                    }
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 0 }}
                    style={{
                      marginEnd: 8,
                      padding: 8,
                      paddingHorizontal: 16,
                      borderRadius: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      key={index}
                      onPress={() => {
                        if (item.jenis === tabcategroy) {
                          setTabCategory(item.jenis);
                        } else {
                          setTabCategory(item.jenis);
                        }
                      }}
                      style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      {tabcategroy === item.jenis ? (
                        <View
                          style={{
                            flexDirection: 'row',
                            gap: 4,
                            alignItems: 'center',
                          }}>
                          <DynamicText
                            size={12}
                            semiBold
                            style={{
                              textAlign: 'center',
                              color:
                                tabcategroy === item.jenis
                                  ? 'white'
                                  : isDarkMode
                                    ? 'white'
                                    : 'black',
                            }}>
                            {item.jenis}
                          </DynamicText>
                        </View>
                      ) : (
                        <DynamicText
                          size={12}
                          style={{
                            textAlign: 'center',
                            color: isDarkMode ? '#f3f3f3' : '#212121',
                          }}>
                          {item.jenis}
                        </DynamicText>
                      )}
                    </TouchableOpacity>
                  </LinearGradient>
                );
              })}
            </ScrollView>
            <ConditionalRender
              productsData={listProduct}
              isLoading={productLoading}
              model={'emptyData'}
              parsedSetting={isWebSetting}
              style={{ height: 100 }}>
              <ScrollView horizontal>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {listProduct.map((item: any, index: number) => {
                    return (
                      tabcategroy === item.jenis && (
                        <TouchableOpacity
                          key={index}
                          activeOpacity={0.7}
                          onPress={() => {
                            setListItems(item.nama);
                          }}
                          style={[
                            {
                              flexDirection: 'column',
                              width: autoScreen / 4 - 27,
                              overflow: 'hidden',
                              borderRadius: 6,
                            },
                          ]}>
                          <View style={{ borderRadius: 6, overflow: 'hidden' }}>
                            <FastImage
                              source={{ uri: item.gambar }}
                              resizeMode={FastImage.resizeMode.cover}
                              style={{
                                width: '100%',
                                aspectRatio: 2 / 3,
                                backgroundColor: isDarkMode
                                  ? colorSystem.dark.card
                                  : colorSystem.light.card,
                              }}
                            />
                            <View
                              style={{
                                width: '100%',
                                height: 6,
                                backgroundColor: isDarkMode
                                  ? colorSystem.dark.primary
                                  : colorSystem.light.primary,
                              }}
                            />
                          </View>
                          <View
                            style={{
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              flex: 1,
                              padding: 8,
                            }}>
                            <DynamicText
                              size={12}
                              style={{
                                textAlign: 'center',
                                color: isDarkMode ? 'white' : 'black',
                              }}>
                              {item.nama}
                            </DynamicText>
                          </View>
                        </TouchableOpacity>
                      )
                    );
                  })}
                </View>
              </ScrollView>
            </ConditionalRender>
            <ConditionalRender
              productsData={
                daftarProdukData[
                  daftarProdukData.findIndex(
                    (item: any) => item.kategori === listItems,
                  )
                ]?.items || []
              }
              isLoading={daftarProdukloading}
              model={'emptyData'}
              parsedSetting={isWebSetting}
              style={{ height: 500 }}>
              <ScrollView horizontal>
                <View style={{ flexDirection: 'column' }}>
                  {[
                    {
                      pid: 'PID',
                      kategori: 'KATEGORI',
                      layanan: 'LAYANAN',
                      harga: 'HARGA',
                      harga_silver: 'HARGA SILVER',
                      harga_gold: 'HARGA GOLD',
                      harga_pro: 'HARGA PRO',
                      status: 'STATUS',
                    },
                  ].map((item: any, index: number) => {
                    return (
                      <View
                        key={index}
                        style={[
                          {
                            flexDirection: 'row',
                            overflow: 'hidden',
                            backgroundColor: isDarkMode
                              ? colorSystem.dark.primary
                              : colorSystem.light.primary,
                          },
                        ]}>
                        <DynamicText
                          numberOfLines={1}
                          size={12}
                          style={{
                            padding: 8,
                            width: 100,
                            flex: 1,
                            paddingHorizontal: 12,
                            textAlign: 'center',
                            color: 'white',
                          }}>
                          {item.pid}
                        </DynamicText>
                        <DynamicText
                          numberOfLines={1}
                          size={12}
                          style={{
                            padding: 8,
                            width: 100,
                            flex: 1,
                            paddingHorizontal: 12,
                            textAlign: 'center',
                            color: 'white',
                          }}>
                          {item.kategori}
                        </DynamicText>
                        <DynamicText
                          numberOfLines={1}
                          size={12}
                          style={{
                            padding: 8,
                            width: 150,
                            flex: 1,
                            paddingHorizontal: 12,
                            textAlign: 'center',
                            color: 'white',
                          }}>
                          {item.layanan}
                        </DynamicText>
                        <DynamicText
                          numberOfLines={1}
                          size={12}
                          style={{
                            padding: 8,
                            width: 100,
                            flex: 1,
                            paddingHorizontal: 12,
                            textAlign: 'center',
                            color: 'white',
                          }}>
                          {item.harga}
                        </DynamicText>
                        <DynamicText
                          numberOfLines={1}
                          size={12}
                          style={{
                            width: 110,
                            padding: 8,
                            flex: 1,
                            paddingHorizontal: 12,
                            textAlign: 'center',
                            color: 'white',
                          }}>
                          {item.harga_silver}
                        </DynamicText>
                        <DynamicText
                          numberOfLines={1}
                          size={12}
                          style={{
                            padding: 8,
                            width: 100,
                            flex: 1,
                            paddingHorizontal: 12,
                            textAlign: 'center',
                            color: 'white',
                          }}>
                          {item.harga_gold}
                        </DynamicText>
                        <DynamicText
                          numberOfLines={1}
                          size={12}
                          style={{
                            padding: 8,
                            flex: 1,
                            width: 110,
                            paddingHorizontal: 12,
                            textAlign: 'center',
                            color: 'white',
                          }}>
                          {item.harga_pro}
                        </DynamicText>
                        <DynamicText
                          numberOfLines={1}
                          size={12}
                          style={{
                            padding: 8,
                            width: 100,
                            flex: 1,
                            textAlign: 'center',
                            paddingHorizontal: 12,
                            color: 'white',
                          }}>
                          {item.status}
                        </DynamicText>
                      </View>
                    );
                  })}
                  {daftarProdukData[
                    daftarProdukData.findIndex(
                      (item: any) => item.kategori === listItems,
                    )
                  ]?.items.map((item: any, index: number) => {
                    return (
                      <View
                        key={index}
                        style={[
                          {
                            flexDirection: 'row',
                            overflow: 'hidden',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor:
                              index % 2 === 0
                                ? isDarkMode
                                  ? colorSystem.dark.background
                                  : colorSystem.light.background
                                : isDarkMode
                                  ? colorSystem.dark.card
                                  : colorSystem.light.card,
                          },
                        ]}>
                        <DynamicText
                          numberOfLines={1}
                          size={12}
                          style={{
                            padding: 8,
                            flex: 1,
                            paddingHorizontal: 12,
                            width: 100,
                            textAlign: 'center',
                            color: isDarkMode ? 'white' : 'black',
                          }}>
                          {item.id}
                        </DynamicText>
                        <DynamicText
                          numberOfLines={3}
                          size={12}
                          style={{
                            padding: 8,
                            flex: 1,
                            width: 100,
                            paddingHorizontal: 12,
                            textAlign: 'center',
                            color: isDarkMode ? 'white' : 'black',
                          }}>
                          {item.kategori}
                        </DynamicText>
                        <DynamicText
                          numberOfLines={4}
                          size={12}
                          style={{
                            padding: 8,
                            flex: 1,
                            width: 150,
                            paddingHorizontal: 12,
                            textAlign: 'center',
                            color: isDarkMode ? 'white' : 'black',
                          }}>
                          {item.layanan}
                        </DynamicText>
                        <DynamicText
                          numberOfLines={1}
                          size={12}
                          style={{
                            padding: 8,
                            flex: 1,
                            width: 100,
                            paddingHorizontal: 12,
                            textAlign: 'center',
                            color: isDarkMode ? 'white' : 'black',
                          }}>
                          {formatCurrency(item.harga)}
                        </DynamicText>
                        <DynamicText
                          numberOfLines={1}
                          size={12}
                          style={{
                            padding: 8,
                            flex: 1,
                            width: 110,
                            paddingHorizontal: 12,
                            textAlign: 'center',
                            color: isDarkMode ? 'white' : 'black',
                          }}>
                          {formatCurrency(item.harga_silver)}
                        </DynamicText>
                        <DynamicText
                          numberOfLines={1}
                          size={12}
                          style={{
                            padding: 8,
                            flex: 1,
                            width: 110,
                            paddingHorizontal: 12,
                            textAlign: 'center',
                            color: isDarkMode ? 'white' : 'black',
                          }}>
                          {formatCurrency(item.harga_gold)}
                        </DynamicText>
                        <DynamicText
                          numberOfLines={1}
                          size={12}
                          style={{
                            padding: 8,
                            flex: 1,
                            width: 110,
                            paddingHorizontal: 12,
                            textAlign: 'center',
                            color: isDarkMode ? 'white' : 'black',
                          }}>
                          {formatCurrency(item.harga_pro)}
                        </DynamicText>
                        <DynamicText
                          numberOfLines={1}
                          size={12}
                          style={{
                            padding: 8,
                            flex: 1,
                            width: 100,
                            textAlign: 'center',
                            paddingHorizontal: 12,
                            color:
                              item.status === 'Aktif' ? '#0ABE5D' : '#F42536',
                          }}>
                          {item.status}
                        </DynamicText>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </ConditionalRender>
          </View>
        </View>
      </ScrollView>
      <HeaderAnimation />
    </SafeAreaView>
  );
};

export default DaftarLayananPages;
