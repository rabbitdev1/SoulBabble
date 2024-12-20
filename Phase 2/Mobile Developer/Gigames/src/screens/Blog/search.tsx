import {useNavigation, useRoute} from '@react-navigation/native';
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
interface SearchPagesProps {}
type SearchPagesScreenProp = StackNavigationProp<
  RootStackParamList,
  'DrawerScreen'
>;
const SearchPages: React.FC<SearchPagesProps> = () => {
  const colorSystem = useSelector(
      (state: RootState) => state.todoReducer.colorSystem,
    );
  
  const navigation = useNavigation<SearchPagesScreenProp>();
  const autoScreen = useAutoScreen();
  const route = useRoute();
  const {nama, id} = route.params as {
    nama: string;
    id: string;
  };
  const dispatch = useDispatch();
  const [blogTrending, setTrendingBlogTerbaru] = useState([]);
  const [jenisBlog, setJenisBlogTerbaru] = useState([]);
  const [jenisArtikeldata, setJenisArtikelData] = useState([]);

  const [blogTrendingLoading, setTrendingBlogLoading] = useState(true);
  const [jenisBlogLoading, setBlogTerbaruLoading] = useState(true);

  const [limit, setLimit] = useState(10);

  const [activeSlide, setActiveSlide] = useState<number>(0);
  const isWebSetting = useSelector(
    (state: RootState) => state.todoReducer.isWebSetting,
  );

  const scrollYAnimatedValue = useRef(new Animated.Value(0)).current;
  const isDarkMode = getDarkModePreference();
  const [refreshingPage, setrefreshingPage] = useState<boolean>(false);

  useEffect(() => {
    fetchDataApi();
  }, [limit]);

  const fetchDataApi = async () => {
    fetchJenisBlog();
  };

  const fetchJenisBlog = async () => {
    setBlogTerbaruLoading(true);
    const params = new URLSearchParams();
    params.append('idJenis', id);
    params.append('page', '0');
    params.append('limit', limit.toString());

    try {
      const response = await apiClient({
        baseurl: 'user/jenisBlog?jenis',
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
        <TopBar isIconLeft={false} isShowLogo={false} title={nama} />
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
          <TopBar isIconLeft={false} isShowLogo={false} title={nama} />
          <View style={{marginHorizontal: 16}}>
            <DynamicText size={16} bold>
              Hasil Pencarian : {nama}
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
export default SearchPages;
