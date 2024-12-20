import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Animated,
  Linking,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Share,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootStackParamList} from '../../../App';
import {RootState} from '../../../store/reducers';
import {apiClient} from '../../../utils/api/apiClient';
import '../../../utils/ignoreWarnings';
import {refreshControl} from '../../components/context/refreshFunctions';

import FacebookIcon from '../../assets/icon/socialmedia/facebook.svg';
import WAIcon from '../../assets/icon/socialmedia/whatapps.svg';
import XIcon from '../../assets/icon/socialmedia/x.svg';

import useAutoScreen from '../../components/context/useAutoScreen';
import TopBar from '../../components/ui/TopBar';
import HTMLDisplay from '../../components/ui/HTMLDisplay';
import DynamicText from '../../components/common/DynamicText';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ConditionalRender from '../../components/ui/ConditionalRender';
import {REACT_APP_LINK_SHARE} from '@env';
import { getDarkModePreference } from '../../components/common/darkModePreference';
interface DetailBlogPagesProps {}
type DetailBlogPagesScreenProp = StackNavigationProp<
  RootStackParamList,
  'DrawerScreen'
>;
const DetailBlogPages: React.FC<DetailBlogPagesProps> = () => {
  const colorSystem = useSelector(
      (state: RootState) => state.todoReducer.colorSystem,
    );
  
  const navigation = useNavigation<DetailBlogPagesScreenProp>();
  const autoScreen = useAutoScreen();
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(0);

  const scrollYAnimatedValue = useRef(new Animated.Value(0)).current;

  const isWebSetting = useSelector(
    (state: RootState) => state.todoReducer.isWebSetting,
  );
  const route = useRoute();

  const {slug} = route.params as {
    slug: string;
  };

  const isDarkMode =getDarkModePreference();
  const [detailBlogLoading, setDetailBlogLoading] = useState(true);
  const [detailBlog, setJenisDetailBlog] = useState<any>([]);

  const [value, setValue] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    endDate: new Date(),
  });

  const [refreshingPage, setrefreshingPage] = useState<boolean>(false);

  useEffect(() => {
    fetchDataApi();
  }, [value, currentPage]);

  const fetchDataApi = async () => {
    fetchDetailBlog(slug);
  };

  const fetchDetailBlog = async (slug: any) => {
    setDetailBlogLoading(true);
    const params = new URLSearchParams();
    params.append('slug', slug);

    try {
      const response = await apiClient({
        baseurl: 'user/bacaArtikel',
        method: 'POST',
        XGORDON: 'READARTIKEL',
        body: params,
      });
      setDetailBlogLoading(false);
      if (response?.statusCode === 200) {
        setJenisDetailBlog(response.result);
      } else {
        setJenisDetailBlog([]);
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
          title={detailBlog?.judul}
        />
      </Animated.View>
    );
  };
  const shareButtons = [
    {
      name: 'Facebook',
      bgColor: {backgroundColor: '#1A6DD4'},
      icon: <FacebookIcon width={18} height={18} />,
    },
    {
      name: 'Twitter',
      bgColor: {backgroundColor: '#55ACEF'},
      icon: <XIcon width={18} height={18} />,
    },
    {
      name: 'Whatsapp',
      bgColor: {backgroundColor: '#40E85F'},
      icon: <WAIcon width={18} height={18} />,
    },
  ];

  const shareTo = (platform: any) => {
    const currentURL = REACT_APP_LINK_SHARE + 'blog/' + slug;
    let appURL, webURL;
    switch (platform) {
      case 'Facebook':
        appURL = 'fb://feed';
        webURL = `https://www.facebook.com/share.php?u=${encodeURIComponent(
          currentURL,
        )}`;
        break;
      case 'Twitter':
        appURL = 'twitter://post';
        webURL = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          currentURL,
        )}&text=Your%20tweet%20text%20here`;
        break;
      case 'Whatsapp':
        appURL =
          'whatsapp://send?text=Your%20Whatsapp%20share%20message%20here%20${encodeURIComponent(currentURL)}';
        webURL = `https://api.whatsapp.com/send?text=Your%20Whatsapp%20share%20message%20here%20${encodeURIComponent(
          currentURL,
        )}`;
        break;
      default:
        Alert.alert('Platform tidak didukung');
        return;
    }

    Linking.canOpenURL(appURL)
      .then(supported => {
        if (supported) {
          Linking.openURL(appURL);
        } else {
          // Fallback to website
          Linking.openURL(webURL);
        }
      })
      .catch(() => {
        // Further fallback if there's an issue with the link
        Alert.alert('Gagal membuka link');
      });
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
        <View style={{flexDirection: 'column', gap: 16}}>
          <TopBar
            isIconLeft={false}
            isShowLogo={false}
            title={detailBlog?.judul}
          />
          <View style={{paddingHorizontal: 16, gap: 8}}>
            <DynamicText size={16} bold>
              {detailBlog?.judul}
            </DynamicText>
            <View style={{flexDirection: 'row', gap: 8}}>
              {shareButtons.map((button: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    backgroundColor: '#1A6DD4',
                    borderRadius: 5,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    gap: 4,
                    ...button.bgColor,
                  }}
                  onPress={() => {
                    shareTo(button.name);
                  }}>
                  {button.icon}
                  <DynamicText size={12} style={{color: '#ffffff'}}>
                    {button.name}
                  </DynamicText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <ConditionalRender
            productsData={detailBlog}
            isLoading={detailBlogLoading}
            parsedSetting={isWebSetting}
            model="emptyData"
            style={{height: 120, marginHorizontal: 16}}>
            <FastImage
              source={{uri: detailBlog?.gambar}}
              resizeMode={FastImage.resizeMode.contain}
              style={{width: autoScreen, aspectRatio: 2}}
            />
          </ConditionalRender>
          <ConditionalRender
            productsData={detailBlog}
            isLoading={detailBlogLoading}
            parsedSetting={isWebSetting}
            model="emptyData"
            style={{height: 200, marginHorizontal: 16}}>
            <View style={{paddingHorizontal: 16}}>
              <HTMLDisplay
                html={detailBlog?.konten || '<p></p>'}
                style={{textAlign: 'left'}}
              />
            </View>
          </ConditionalRender>
        </View>
      </ScrollView>
      <HeaderAnimation />
    </SafeAreaView>
  );
};
export default DetailBlogPages;
