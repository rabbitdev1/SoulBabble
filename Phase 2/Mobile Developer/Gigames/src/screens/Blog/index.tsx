import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {useDispatch, useSelector} from 'react-redux';
import {RootStackParamList} from '../../../App';
import {RootState} from '../../../store/reducers';
import {apiClient} from '../../../utils/api/apiClient';
import '../../../utils/ignoreWarnings';
import DynamicButton from '../../components/common/DynamicButton';
import DynamicText from '../../components/common/DynamicText';
import {formatCurrency} from '../../components/common/formatCurrency';
import {refreshControl} from '../../components/context/refreshFunctions';
import useAutoScreen from '../../components/context/useAutoScreen';
import ConditionalRender from '../../components/ui/ConditionalRender';
import TopBar from '../../components/ui/TopBar';
import LinearGradient from 'react-native-linear-gradient';
import { getDarkModePreference } from '../../components/common/darkModePreference';
interface BlogPagesProps {}
type BlogPagesScreenProp = StackNavigationProp<
  RootStackParamList,
  'DrawerScreen'
>;
const BlogPages: React.FC<BlogPagesProps> = () => {
  const colorSystem = useSelector(
      (state: RootState) => state.todoReducer.colorSystem,
    );
  
  const navigation = useNavigation<BlogPagesScreenProp>();
  const autoScreen = useAutoScreen();
  const dispatch = useDispatch();
  const [blogTrending, setTrendingBlogTerbaru] = useState([]);
  const [jenisBlog, setJenisBlogTerbaru] = useState([]);
  const [jenisArtikeldata, setJenisArtikelData] = useState([]);

  const [blogTrendingLoading, setTrendingBlogLoading] = useState(true);
  const [jenisBlogLoading, setBlogTerbaruLoading] = useState(true);
  const [jenisArtikelLoading, setJenisArtikelLoading] = useState(true);

  const [limit, setLimit] = useState(10);

  const [activeSlide, setActiveSlide] = useState<number>(0);
  const isWebSetting = useSelector(
    (state: RootState) => state.todoReducer.isWebSetting,
  );

  const scrollYAnimatedValue = useRef(new Animated.Value(0)).current;
  const isDarkMode =getDarkModePreference();
  const [refreshingPage, setrefreshingPage] = useState<boolean>(false);

  useEffect(() => {
    fetchTrendingBlog();
    fetchJenisArticle();
    fetchDataApi();
  }, [limit]);

  const fetchDataApi = async () => {
    fetchJenisBlog();
  };

  const fetchTrendingBlog = async () => {
    setTrendingBlogLoading(true);

    try {
      const response = await apiClient({
        baseurl: 'user/jenisBlog?trending',
        method: 'GET',
        XGORDON: 'JENISBLOG',
      });
      setTrendingBlogLoading(false);
      if (response?.statusCode === 200) {
        setTrendingBlogTerbaru(response?.result?.data);
      } else {
        setTrendingBlogTerbaru([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchJenisArticle = async () => {
    setJenisArtikelLoading(true);
    try {
      const response = await apiClient({
        baseurl: 'user/jenisArtikel',
        method: 'GET',
        XGORDON: 'JENISARTIKEL',
      });
      setJenisArtikelLoading(false);
      if (response?.statusCode === 200) {
        setJenisArtikelData(response.result.data);
      } else {
        setJenisArtikelData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchJenisBlog = async () => {
    setBlogTerbaruLoading(true);
    const params = new URLSearchParams();
    params.append('page', '0');
    params.append('limit', limit.toString());

    try {
      const response = await apiClient({
        baseurl: 'user/jenisBlog?terbaru',
        method: 'POST',
        XGORDON: 'JENISBLOG',
        body: params,
      });
      setBlogTerbaruLoading(false);
      if (response?.statusCode === 200) {
        setJenisBlogTerbaru(response.result.data);
      } else {
        setJenisBlogTerbaru([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const LogSaldoItem = React.memo(({item}: {item: any}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.navigate('DetailBlog', {slug: item.slug})}
        style={{
          flex: 1,
          flexDirection: 'row',
          marginHorizontal: 16,
          gap: 8,
        }}>
        <FastImage
          source={{uri: item.gambar}}
          style={{
            width: '30%',
            aspectRatio: 3 / 2,
            borderRadius: 8,
            overflow: 'hidden',
          }}
        />
        <View style={{flex: 1}}>
          <DynamicText size={12} numberOfLines={1}>
            {item.jenis}
          </DynamicText>
          <DynamicText
            bold
            size={14}
            numberOfLines={3}
            style={{marginBottom: 3}}>
            {item.judul}
          </DynamicText>
          <DynamicText size={12} numberOfLines={1}>
            Writer - {item.tanggal}
          </DynamicText>
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
        <TopBar isIconLeft={false} isShowLogo={false} title={'Blog'} />
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
          <View style={{flexDirection: 'column'}}>
            <TopBar isIconLeft={false} isShowLogo={false} title={'Blog'} />
            <LinearGradient
              colors={isDarkMode
                ? colorSystem.dark.gradient
                : colorSystem.light.gradient}
              start={{x: 1, y: 0}}
              end={{x: 0, y: 0}}
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                padding: 16,
              }}>
              <ConditionalRender
                productsData={jenisArtikeldata}
                isLoading={jenisArtikelLoading}
                style={{height: 10}}
                model="emptyData">
                <View style={{flex: 1}}>
                  <ScrollView horizontal style={{flex: 1, gap: 8}} showsHorizontalScrollIndicator={false}>
                    {jenisArtikeldata.map((item: any, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          navigation.navigate('SearchBlog', {id: item.id,nama: item.nama});
                        }}
                        activeOpacity={0.7}
                        style={{marginEnd: 8}}>
                        <DynamicText
                          size={12}
                          semiBold={true}
                          style={{color: '#ffffff'}}>
                          {item.nama}
                        </DynamicText>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </ConditionalRender>
            </LinearGradient>
          </View>
          <View style={{flexDirection: 'column', gap: 8}}>
            <ConditionalRender
              productsData={blogTrending}
              isLoading={blogTrendingLoading}
              style={{aspectRatio: 3 / 1, marginHorizontal: 16}}
              parsedSetting={isWebSetting}
              model={'emptyData'}>
              <Carousel
                layout="default"
                autoplayInterval={8000}
                autoplay={true}
                data={blogTrending}
                loop={true}
                sliderWidth={autoScreen}
                itemWidth={autoScreen - 20}
                inactiveSlideOpacity={1}
                inactiveSlideScale={1}
                onSnapToItem={index => setActiveSlide(index)}
                renderItem={({item}) => {
                  return (
                    <View
                      style={{
                        padding: 6,
                        flexDirection: 'column',
                        gap: 8,
                        overflow: 'hidden',
                        flex: 1,
                        aspectRatio: 2,
                      }}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() =>
                          navigation.navigate('DetailBlog', {slug: item.slug})
                        }>
                        <FastImage
                          resizeMode={FastImage.resizeMode.cover}
                          style={{
                            backgroundColor: '#45424f',
                            borderRadius: 6,
                            width: '100%',
                            height: '100%',
                          }}
                          source={{uri: item?.gambar}}
                        />
                      </TouchableOpacity>
                      <View
                        style={{
                          margin: 16,
                          position: 'absolute',
                          justifyContent: 'space-between',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end',
                          }}>
                          <View
                            style={{
                              padding: 6,
                              paddingHorizontal: 16,
                              borderRadius: 6,
                              backgroundColor:  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary,
                            }}>
                            <DynamicText
                              size={12}
                              numberOfLines={3}
                              style={{color: '#ffffff'}}>
                              {item?.jenis}
                            </DynamicText>
                          </View>
                        </View>
                        <View>
                          <DynamicText
                            size={14}
                            bold
                            numberOfLines={3}
                            style={{color: '#ffffff'}}>
                            {item?.judul}
                          </DynamicText>
                          <DynamicText
                            size={12}
                            numberOfLines={4}
                            style={{color: '#ffffff'}}>
                            {item?.sub_konten}
                          </DynamicText>
                        </View>
                      </View>
                    </View>
                  );
                }}
                removeClippedSubviews={false}
              />
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  marginBottom: 6,
                }}>
                <Pagination
                  dotsLength={blogTrending?.length}
                  activeDotIndex={activeSlide}
                  dotContainerStyle={{marginHorizontal: -2}}
                  containerStyle={{paddingVertical: 4}}
                  dotStyle={{
                    width: autoScreen / 15,
                    height: 5,
                    borderRadius: 50,
                    backgroundColor:  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary,
                  }}
                  inactiveDotStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  }}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                />
              </View>
            </ConditionalRender>
          </View>
          <View style={{marginHorizontal: 16}}>
            <DynamicText size={16} bold>
              Artikel Terbaru
            </DynamicText>
          </View>
          <ConditionalRender
            productsData={jenisBlog}
            isLoading={jenisBlogLoading}
            style={{aspectRatio: 1 / 1, marginHorizontal: 16}}
            model={'emptyData'}
            parsedSetting={isWebSetting}>
            {jenisBlog.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  <LogSaldoItem item={item} />
                </React.Fragment>
              );
            })}
          </ConditionalRender>
          {jenisBlog.length !== 0 && (
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 16,
                gap: 8,
                marginBottom: 16,
              }}>
              <DynamicButton
                initialValue={`Selanjutnya`}
                styleSelected={{
                  backgroundColor: isDarkMode
              ? colorSystem.dark.background
              : colorSystem.light.background,
                  borderWidth: 1,
                  borderColor:  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary,
                  flex: 1,
                }}
                colorText={ isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary}
                onPress={() => {
                  setLimit(limit + 3);
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
export default BlogPages;
