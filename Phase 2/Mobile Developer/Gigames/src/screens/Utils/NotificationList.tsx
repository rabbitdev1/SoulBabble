import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Linking,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {RootStackParamList} from '../../../App';
import {RootState} from '../../../store/reducers';
import {apiClient} from '../../../utils/api/apiClient';
import ToaIcon from '../../assets/icon/ic_toa.svg';

import '../../../utils/ignoreWarnings';
import {getDarkModePreference} from '../../components/common/darkModePreference';
import DynamicButton from '../../components/common/DynamicButton';
import DynamicText from '../../components/common/DynamicText';
import {refreshControl} from '../../components/context/refreshFunctions';
import useAutoScreen from '../../components/context/useAutoScreen';
import ConditionalRender from '../../components/ui/ConditionalRender';
import TopBar from '../../components/ui/TopBar';
interface NotificationListPagesProps {}
type NotificationListPagesScreenProp = StackNavigationProp<
  RootStackParamList,
  'DrawerScreen'
>;
const NotificationListPages: React.FC<NotificationListPagesProps> = () => {
  const colorSystem = useSelector(
      (state: RootState) => state.todoReducer.colorSystem,
    );
  
  const navigation = useNavigation<NotificationListPagesScreenProp>();
  const autoScreen = useAutoScreen();
  const dispatch = useDispatch();

  const [NotifikasiData, setNotifikasiData] = useState([]);
  const [NotifikasiProductData, setNotifProductData] = useState([]);

  const [NotifGigamesLoading, setNotifGigamesLoading] = useState(true);
  const [notifLoading, setNotifLoading] = useState(true);

  const [itemsPerPage,setitemsPerPage] = useState(5);
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
  const [pages, setPages] = useState(false);

  const [refreshingPage, setrefreshingPage] = useState<boolean>(false);

  useEffect(() => {
    fetchDataApi();
  }, [currentPage,itemsPerPage]);

  const fetchDataApi = async () => {
    fetchNotifikasi();
    if (isLogin) {
      fetchNotifProduct(isLogin?.apiKey, isLogin?.token);
    }
  };

  const fetchNotifikasi = async () => {
    setNotifGigamesLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());
      const response = await apiClient({
        baseurl: 'user/notifikasi?app',
        method: 'POST',
        XGORDON: 'NOTIFIKASI',
        body: params,
      });
      setNotifGigamesLoading(false);
      if (response?.statusCode === 200) {
        setTotalPages(response?.result?.total_page);
        setNotifikasiData(response.result.data);
      } else {
        setNotifikasiData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchNotifProduct = async (api_key: any, token: any) => {
    setNotifLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('api_key', api_key);
      params.append('limit', itemsPerPage.toString());
      params.append('page', currentPage.toString());

      const response = await apiClient({
        baseurl: 'user/notifikasi?pesanan',
        method: 'POST',
        XGORDON: 'NOTIFIKASI',
        apiKey: api_key,
        token: token,
        body: params,
      });
      setNotifLoading(false);
      if (response?.statusCode === 200) {
        setTotalPages(response?.result?.total_page);
        setNotifProductData(response?.result?.data);
      } else {
        setNotifProductData([]);
        [];
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const NotifikasiItem = React.memo(({item}: {item: any}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (pages) {
            navigation.navigate('Invoice', {
              invoice: item.deeplink,
              replaceRoute: 'DrawerScreen',
            });
          } else {
            Linking.openURL(item.deeplink);
          }
        }}
        activeOpacity={0.7}
        style={{
          flex: 1,
          flexDirection: 'row',
          gap: 8,
          padding: 16,
          borderBottomWidth: 1,
          borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
        }}>
        <View>
          <FastImage
            source={
              item.gambar === ''
                ? require('../../assets/images/image_toa.png')
                : {uri: item.gambar}
            }
            resizeMode={FastImage.resizeMode.cover}
            style={{
              width: 40,
              borderRadius: 8,
              aspectRatio: 1 / 1,
            }}
          />
        </View>
        <View style={{flex: 1}}>
          <DynamicText size={14} semiBold>
            {item.judul}
          </DynamicText>
          <DynamicText size={12} style={{color: '#818994', marginBottom: 8}}>
            {item.tanggal}
          </DynamicText>
          <DynamicText size={12}>{item.konten}</DynamicText>
        </View>
      </TouchableOpacity>
    );
  });
  const handleRefresh = () => {
    refreshControl(setrefreshingPage, fetchDataApi);
  };
  const handleNextPage = () => {
    setitemsPerPage(halamanSebelumnya => halamanSebelumnya + 5);
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
      <TopBar isIconLeft={false} isShowLogo={false} title={'Notifikasi'} />
      {isLogin && (
        <View
          style={{
            flexDirection: 'row',
            backgroundColor:  isDarkMode
              ? colorSystem.dark.card
              : colorSystem.light.card,
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setPages(true);
              }}>
              <DynamicText
                size={14}
                semiBold
                style={{
                  padding: 16,
                  color: pages ?  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary : isDarkMode ? '#ffffff' : '#212121',
                }}>
                Pesanan
              </DynamicText>
            </TouchableOpacity>
            <View
              style={{
                height: 3,
                width: '100%',
                backgroundColor: pages ?  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary : '#ffffff',
              }}
            />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setPages(false);
              }}>
              <DynamicText
                size={14}
                semiBold
                style={{
                  padding: 16,
                  color: !pages
                    ?  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary
                    : isDarkMode
                    ? '#ffffff'
                    : '#212121',
                }}>
                Gigames
              </DynamicText>
            </TouchableOpacity>
            <View
              style={{
                height: 3,
                width: '100%',
                backgroundColor: !pages ?  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary : '#ffffff',
              }}
            />
          </View>
        </View>
      )}
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
          <View style={{flexDirection: 'column', gap: 8}}>
            {!pages ? (
              <ConditionalRender
                productsData={NotifikasiData}
                isLoading={NotifGigamesLoading}
                style={{aspectRatio: 1 / 1, marginHorizontal: 16}}
                model={'emptyData'}
                parsedSetting={isWebSetting}>
                {NotifikasiData.map((item, index) => {
                  return (
                    <React.Fragment key={index}>
                      <NotifikasiItem item={item} />
                    </React.Fragment>
                  );
                })}
              </ConditionalRender>
            ) : (
              <ConditionalRender
                productsData={NotifikasiProductData}
                isLoading={notifLoading}
                style={{aspectRatio: 1 / 1, marginHorizontal: 16}}
                model={'emptyData'}
                parsedSetting={isWebSetting}>
                {NotifikasiProductData.map((item, index) => {
                  return (
                    <React.Fragment key={index}>
                      <NotifikasiItem item={item} />
                    </React.Fragment>
                  );
                })}
              </ConditionalRender>
            )}
          </View>
        </View>
      </ScrollView>

      {NotifikasiData.length >=itemsPerPage && (
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 16,
            gap: 8,
            marginBottom: 16,
          }}>
          <DynamicButton
            initialValue={`Lihat Lebih Banyak`}
            disabled={NotifikasiData.length === 0 || currentPage >= totalPages}
            styleSelected={{
              backgroundColor: isDarkMode
              ? colorSystem.dark.background
              : colorSystem.light.background,
              flex: 1,
              borderWidth:0
            }}
            colorText={  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary   }
            onPress={() => {
              handleNextPage();
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};
export default NotificationListPages;
