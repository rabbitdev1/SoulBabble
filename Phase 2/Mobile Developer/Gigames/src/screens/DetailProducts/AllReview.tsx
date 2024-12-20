import { useRoute } from '@react-navigation/native';
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
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/reducers';
import { apiClient } from '../../../utils/api/apiClient';
import '../../../utils/ignoreWarnings';
import StarIcon from '../../assets/icon/star.svg';
import DynamicText from '../../components/common/DynamicText';
import { refreshControl } from '../../components/context/refreshFunctions';
import useAutoScreen from '../../components/context/useAutoScreen';
import ConditionalRender from '../../components/ui/ConditionalRender';
import TopBar from '../../components/ui/TopBar';
import { getDarkModePreference } from '../../components/common/darkModePreference';

export default function ReivewPages() {
  const colorSystem = useSelector(
      (state: RootState) => state.todoReducer.colorSystem,
    );
  
  const autoScreen = useAutoScreen();
  const isDarkMode = getDarkModePreference();
  const route = useRoute();
  const isWebSetting = useSelector(
    (state: RootState) => state.todoReducer.isWebSetting,
  );
  const {id, nama, kategori, gambar} = route.params as {
    id: string;
    nama: string;
    kategori: string;
    gambar: string;
  };
  const scrollYAnimatedValue = useRef(new Animated.Value(0)).current;

  const [reviewData, setReviewData] = useState<any>([]);
  const [rate, setRate] = useState<any>(0);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1000);
  const [currentPage, setCurrentPage] = useState(0);
  const [refreshingPage, setrefreshingPage] = useState(false);
  useEffect(() => {
    fetchDataApi();
  }, []);
  const fetchDataApi = async () => {
    fetchDataReview(id);
  };
  const fetchDataReview = async (id: any) => {
    setReviewLoading(true);
    try {
      const response = await apiClient({
        baseurl: 'user/listReview',
        parameter: `idKategori=${id}&limit=${itemsPerPage}&page=${currentPage}`,
        method: 'GET',
        XGORDON: 'LISTREVIEW',
      });
      setReviewLoading(false);
      if (response?.statusCode === 200) {
        setTotalPages(response?.result?.total_page);
        setReviewData(response.result.data);
        setRate(response.result.rate);
      } else {
        setReviewData([]);
        setRate([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleRefresh = () => {
    refreshControl(setrefreshingPage, fetchDataApi);
  };
  const ReviewItem = React.memo(({item}: {item: any}) => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          marginHorizontal: 16,
          backgroundColor:  isDarkMode
              ? colorSystem.dark.card
              : colorSystem.light.card,
          elevation: 1,
          marginVertical: 2,
          borderRadius: 6,
          overflow: 'hidden',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            gap: 8,
            paddingVertical: 8,
          }}>
          <View style={{flex: 1}}>
            <FastImage
              source={{uri: item?.Image || ''}}
              resizeMode={FastImage.resizeMode.cover}
              style={{
                width: '100%',
                aspectRatio: 1,
                borderRadius: 50,
              }}
            />
          </View>
          <View style={{flexDirection: 'column', flex: 7}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 8,
                  alignItems: 'center',
                }}>
                <DynamicText size={12} semiBold>
                  {item.nama}
                </DynamicText>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  padding: 2,
                  alignItems: 'center',
                }}>
                {[...Array(5)].map((_, index) => (
                  <StarIcon
                    key={index}
                    width={18}
                    style={{
                      color:
                        index < Math.round(item.rate)
                          ? '#F3B411'
                          : !isDarkMode
                          ? colorSystem.dark.bordercolor
                          : colorSystem.light.bordercolor,
                    }}
                  />
                ))}
              </View>
            </View>
            <DynamicText size={10}> {item.tanggal}</DynamicText>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            borderTopWidth: 1,
            borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
          }}
        />
        <View style={{paddingHorizontal: 16, gap: 8, paddingVertical: 8}}>
          <DynamicText size={12} numberOfLines={3} style={{color: '#818994'}}>
            "{item.review}"
          </DynamicText>
        </View>
      </View>
    );
  });
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
        <TopBar isIconLeft={false} isShowLogo={false} title={'Ulasan Produk'} />
        <View style={{flex: 1, flexDirection: 'column', gap: 16}}>
          <View
            style={{
              marginTop: 16,
              gap: 8,
              flex: 1,
              flexDirection: 'row',
              marginHorizontal: 16,
              overflow: 'hidden',
            }}>
            <View
              style={{
                height: '100%',
                minWidth: 60,
                aspectRatio: 1,
                backgroundColor:  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary,
                overflow: 'hidden',
                borderRadius: 6,
              }}>
              <FastImage
                source={{uri: gambar || ''}}
                resizeMode={FastImage.resizeMode.cover}
                style={{
                  flex: 1,
                }}
              />
            </View>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <DynamicText size={14} semiBold>
                {nama}
              </DynamicText>
              <DynamicText size={12}> {kategori}</DynamicText>
            </View>
            <View
              style={{
                flexDirection: 'column',
                gap: 4,
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 4,
                  alignItems: 'center',
                }}>
                <StarIcon
                  width={24}
                  style={{
                    color: '#F3B411',
                  }}
                />
                <DynamicText size={16} bold>
                  {rate?.rataRata}
                </DynamicText>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 4,
                  alignItems: 'center',
                }}>
                <DynamicText size={12}>{rate?.totalRating} Ulasan</DynamicText>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
              marginHorizontal: 16,
            }}
          />
          <View style={{paddingHorizontal: 16, gap: 8}}>
            <DynamicText size={14} semiBold>
              Detail Review
            </DynamicText>
            {[
              {total_rate: rate?.['1']},
              {total_rate: rate?.['2']},
              {total_rate: rate?.['3']},
              {total_rate: rate?.['4']},
              {total_rate: rate?.['5']},
            ].map((item, index) => {
              const percentage = rate?.totalRating
                ? (item.total_rate / rate?.totalRating) * 2.15
                : 0;
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 8,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 4,
                      alignItems: 'center',
                    }}>
                    <StarIcon
                      width={24}
                      style={{
                        color: '#F3B411',
                      }}
                    />
                    <DynamicText size={16} bold>
                      {index + 1} 
                      {/* {percentage} */}
                    </DynamicText>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: '#D9D9D9',
                      height: 6,
                      borderRadius: 20,
                      overflow: 'hidden',
                    }}>
                    <View
                      style={{
                        width: `${percentage}%`,
                        flex: 1,
                        backgroundColor:  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 4,
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}>
                    <DynamicText size={12}>
                      {item.total_rate} Reivew
                    </DynamicText>
                  </View>
                </View>
              );
            })}
          </View>
          <View
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
              marginHorizontal: 16,
            }}
          />
          <ConditionalRender
            productsData={reviewData}
            isLoading={reviewLoading}
            style={{aspectRatio: 4 / 1, marginHorizontal: 16}}
            model={'emptyReview'}
            parsedSetting={isWebSetting}>
            {reviewData.map((item: any, index: any) => (
              <React.Fragment key={index}>
                <ReviewItem item={item} />
              </React.Fragment>
            ))}
          </ConditionalRender>
        </View>
      </ScrollView>
      <HeaderAnimation />
    </SafeAreaView>
  );
}
