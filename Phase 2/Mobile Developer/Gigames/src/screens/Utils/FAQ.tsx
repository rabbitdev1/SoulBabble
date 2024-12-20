import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import Help_Icon from '../../../src/assets/icon/ic_help_product.svg';

import Tentang_Icon from '../../../src/assets/icon/faq/tentang.svg';
import MAslahPembayaran_Icon from '../../../src/assets/icon/faq/masalahpembayaran.svg';
import Pesanan_Icon from '../../../src/assets/icon/faq/masalahakun.svg';
import MAsalahAKun_Icon from '../../../src/assets/icon/faq/masalahakun.svg';
import Lainnya_Icon from '../../../src/assets/icon/faq/lainnya.svg';

import {RootState} from '../../../store/reducers';
import {apiClient} from '../../../utils/api/apiClient';
import '../../../utils/ignoreWarnings';
import DynamicText from '../../components/common/DynamicText';
import {formatCurrency} from '../../components/common/formatCurrency';
import {refreshControl} from '../../components/context/refreshFunctions';
import useAutoScreen from '../../components/context/useAutoScreen';
import ConditionalRender from '../../components/ui/ConditionalRender';
import HTMLDisplay from '../../components/ui/HTMLDisplay';
import TopBar from '../../components/ui/TopBar';
import FastImage from 'react-native-fast-image';
import {getDarkModePreference} from '../../components/common/darkModePreference';
interface FAQPagesProps {}
const FAQPages: React.FC<FAQPagesProps> = () => {
  const colorSystem = useSelector(
    (state: RootState) => state.todoReducer.colorSystem,
  );

  const autoScreen = useAutoScreen();

  const [faqData, setFaqData] = useState([]);

  const [faqLoading, setFaqLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(-1);

  const scrollYAnimatedValue = useRef(new Animated.Value(0)).current;

  const isWebSetting = useSelector(
    (state: RootState) => state.todoReducer.isWebSetting,
  );

  const isDarkMode = getDarkModePreference();

  const [refreshingPage, setrefreshingPage] = useState<boolean>(false);

  const toggleAccordion = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(-1);
    } else {
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    fetchDataApi();
  }, []);

  const fetchDataApi = async () => {
    fetchDataFaq();
  };

  const fetchDataFaq = async () => {
    setFaqLoading(true);
    try {
      const response = await apiClient({
        baseurl: 'user/faq',
        method: 'GET',
        XGORDON: 'FAQ',
      });
      setFaqLoading(false);
      if (response?.statusCode === 200) {
        setFaqData(response.result.data);
      } else {
        setFaqData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const JenisLayanan = React.memo(
    ({item, index}: {item: any; index: number}) => {
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => toggleAccordion(index)}
          style={[
            {
              flexDirection: 'row',
              position: 'relative',
              overflow: 'hidden',
              padding: 16,
              gap: 8,
              borderWidth: 1,
              width: autoScreen / 1 - 32,
              borderRadius: 6,
              backgroundColor:
                activeIndex === index
                  ? colorSystem.dark.primary_opacity
                  : isDarkMode
                  ? colorSystem.dark.background
                  : colorSystem.light.background,
              borderColor:
                activeIndex === index
                  ? isDarkMode
                    ? colorSystem.dark.primary
                    : colorSystem.light.primary
                  : isDarkMode
                  ? colorSystem.dark.bordercolor
                  : colorSystem.light.bordercolor,
            },
            index % 2 === 2 ? {marginTop: 8} : {marginBottom: 8},
          ]}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              gap: 8,
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                gap: 8,
                alignItems: 'center',
                flex: 1,
              }}>
              <Help_Icon
                style={{
                  color: isDarkMode
                    ? colorSystem.dark.primary
                    : colorSystem.light.primary,
                }}
                width={18}
                height={18}
              />
              <DynamicText size={12} semiBold numberOfLines={3}>
                {item.kategori}
              </DynamicText>
            </View>
            {index === 0 ? (
              <Tentang_Icon
                style={{
                  color: isDarkMode
                    ? colorSystem.dark.primary
                    : colorSystem.light.primary,
                }}
                width={22}
                height={22}
              />
            ) : index === 2 ? (
              <MAslahPembayaran_Icon
                style={{
                  color: isDarkMode
                    ? colorSystem.dark.primary
                    : colorSystem.light.primary,
                }}
                width={22}
                height={22}
              />
            ) : index === 3 ? (
              <Pesanan_Icon
                style={{
                  color: isDarkMode
                    ? colorSystem.dark.primary
                    : colorSystem.light.primary,
                }}
                width={22}
                height={22}
              />
            ) : index === 4 ? (
              <MAsalahAKun_Icon
                style={{
                  color: isDarkMode
                    ? colorSystem.dark.primary
                    : colorSystem.light.primary,
                }}
                width={22}
                height={22}
              />
            ) : index === 5 ? (
              <Lainnya_Icon
                style={{
                  color: isDarkMode
                    ? colorSystem.dark.primary
                    : colorSystem.light.primary,
                }}
                width={22}
                height={22}
              />
            ) : index === 6 ? (
              <Lainnya_Icon
                style={{
                  color: isDarkMode
                    ? colorSystem.dark.primary
                    : colorSystem.light.primary,
                }}
                width={22}
                height={22}
              />
            ) : (
              <Lainnya_Icon
                style={{
                  color: isDarkMode
                    ? colorSystem.dark.primary
                    : colorSystem.light.primary,
                }}
                width={22}
                height={22}
              />
            )}
          </View>
        </TouchableOpacity>
      );
    },
  );
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
        <TopBar isIconLeft={false} isShowLogo={false} title={'FAQ'} />
      </Animated.View>
    );
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: isDarkMode ? '#1a1625' : '#ffffff'}}>
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
          <TopBar isIconLeft={false} isShowLogo={false} title={'FAQ'} />
          <View style={{alignItems: 'center'}}>
            <FastImage
              source={require('../../assets/images/faq.gif')}
              resizeMode={FastImage.resizeMode.contain}
              style={{width: '50%', aspectRatio: 1 / 1}}
            />
            <DynamicText size={14} semiBold>
              Frequently Asked Questions
            </DynamicText>
          </View>
          <ConditionalRender
            productsData={faqData}
            isLoading={faqLoading}
            parsedSetting={isWebSetting}
            style={{height: 120, margin: 16}}
            model={'emptyItem'}>
            <View style={{flexDirection: 'column', padding: 16, paddingTop: 0}}>
              {faqData.map((items: any, index: any) => {
                return (
                  <React.Fragment key={index}>
                    <JenisLayanan item={items} index={index} />
                    {activeIndex === index &&
                      items?.faq.map((item: any, index1: number) => {
                        return (
                          <View
                            key={index1}
                            style={{
                              backgroundColor: isDarkMode
                                ? colorSystem.dark.card
                                : colorSystem.light.card,
                              padding: 16,
                              borderRadius: 8,
                              marginBottom: 8,
                              flexDirection: 'column',
                              alignItems: 'flex-start',
                              gap: 8,
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                gap: 8,
                                alignItems: 'center',
                              }}>
                              <View
                                style={{
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor: isDarkMode
                                    ? colorSystem.dark.primary
                                    : colorSystem.light.primary,
                                  width: 33,
                                  height: 33,
                                  borderRadius: 50,
                                }}>
                                <DynamicText
                                  size={16}
                                  bold
                                  style={{color: '#ffffff'}}>
                                  {index1 + 1}
                                </DynamicText>
                              </View>
                              <DynamicText size={12} bold style={{flex: 1}}>
                                {item?.pertanyaan}
                              </DynamicText>
                            </View>
                            <HTMLDisplay
                              html={item.jawaban || '<p></p>'}
                              style={{textAlign: 'flex-start'}}
                            />
                          </View>
                        );
                      })}
                  </React.Fragment>
                );
              })}
            </View>
          </ConditionalRender>
        </View>
      </ScrollView>
      <HeaderAnimation />
    </SafeAreaView>
  );
};
export default FAQPages;
