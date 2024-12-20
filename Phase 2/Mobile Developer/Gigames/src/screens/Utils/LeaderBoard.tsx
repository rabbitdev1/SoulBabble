import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  ImageBackground,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {RootStackParamList} from '../../../App';
import {RootState} from '../../../store/reducers';
import {apiClient} from '../../../utils/api/apiClient';
import '../../../utils/ignoreWarnings';
import {getDarkModePreference} from '../../components/common/darkModePreference';
import DynamicButton from '../../components/common/DynamicButton';
import DynamicText from '../../components/common/DynamicText';
import {formatCurrency} from '../../components/common/formatCurrency';
import {refreshControl} from '../../components/context/refreshFunctions';
import useAutoScreen from '../../components/context/useAutoScreen';
import ConditionalRender from '../../components/ui/ConditionalRender';
import TopBar from '../../components/ui/TopBar';
import Trophy_Icon from '../../../src/assets/icon/ic_trophy.svg';

interface LeaderBoardPagesProps {}
type LeaderBoardPagesScreenProp = StackNavigationProp<
  RootStackParamList,
  'DrawerScreen'
>;
const LeaderBoardPages: React.FC<LeaderBoardPagesProps> = () => {
  const colorSystem = useSelector(
    (state: RootState) => state.todoReducer.colorSystem,
  );
  const autoScreen = useAutoScreen();
  const [LeaderBoardLoading, setPesananRealtimeLoading] = useState(true);

  const scrollYAnimatedValue = useRef(new Animated.Value(0)).current;
  const isProfile = useSelector(
    (state: RootState) => state.todoReducer.isProfile,
  );
  const isLogin = useSelector((state: RootState) => state.todoReducer.isLogin);
  const isWebSetting = useSelector(
    (state: RootState) => state.todoReducer.isWebSetting,
  );

  const isDarkMode = getDarkModePreference();
  const [LeaderBoardData, setLeaderBoardData] = useState<any>([]);
  const [value, setValue] = useState<any>('week');

  const [refreshingPage, setrefreshingPage] = useState<boolean>(false);

  useEffect(() => {
    fetchDataApi();
    console.log(value);
  }, [value]);

  const fetchDataApi = async () => {
    fetchLeaderBoard(isLogin?.token, value);
  };

  const fetchLeaderBoard = async (token: any, value: any) => {
    setPesananRealtimeLoading(true);
    try {
      const response = await apiClient({
        baseurl: 'user/' + value,
        method: 'GET',
        XGORDON: value.toUpperCase(),
        token: token,
      });
      setPesananRealtimeLoading(false);
      if (response?.statusCode === 200) {
        setLeaderBoardData(response.result.data);
      } else {
        setLeaderBoardData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const LeaderBoardItem = React.memo(
    ({item, index}: {item: any; index: any}) => {
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
            backgroundColor: isDarkMode
              ? colorSystem.dark.background
              : colorSystem.light.background,
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              paddingVertical: 12,
              gap: 8,
              padding: 16,
              borderBottomWidth: 1,
              alignItems: 'center',
              borderColor: isDarkMode
                ? colorSystem.dark.bordercolor
                : colorSystem.light.bordercolor,
            }}>
            <View
              style={{
                width: 25,
                aspectRatio: 1,
                borderRadius: 20,
                backgroundColor: isDarkMode
                  ? colorSystem.dark.primary
                  : colorSystem.light.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <DynamicText
                size={14}
                bold
                style={{
                  color: '#ffffff',
                }}
                semiBold>
                {index}
              </DynamicText>
            </View>
            <FastImage
              source={{uri: item.gambar || ''}}
              resizeMode={FastImage.resizeMode.cover}
              style={{
                width: 40,
                aspectRatio: 1,
                borderRadius: 30,
                alignSelf: 'flex-start',
              }}
            />
            <DynamicText size={12} style={{flex: 1}} numberOfLines={2} semiBold>
              {item.nama}
            </DynamicText>
            <DynamicText
              size={12}
              style={{
                color: isDarkMode
                  ? colorSystem.dark.primary
                  : colorSystem.light.primary,
              }}>
              {formatCurrency(item.pembelian)}
            </DynamicText>
          </View>
        </View>
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
        <TopBar
          isIconLeft={false}
          isShowLogo={false}
          title={'Buyer Leaderboard'}
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
          <TopBar
            isIconLeft={false}
            isShowLogo={false}
            title={'Buyer Leaderboard'}
          />
          <View
            style={{
              backgroundColor: isDarkMode
                ? colorSystem.dark.primary
                : colorSystem.light.primary,
              flexDirection: 'row',
              padding: 8,
              marginHorizontal: 16,
              borderRadius: 8,
              gap: 8,
            }}>
            <DynamicButton
              initialValue="Hari Ini"
              styleSelected={{
                flex: 1,
                backgroundColor:
                  value === 'today'
                    ? isDarkMode
                      ? colorSystem.dark.secondary
                      : colorSystem.light.secondary
                    : 'transparent',
                borderWidth: 0,
              }}
              colorText={'#ffffff'}
              onPress={async () => {
                setValue('today');
              }}
            />
            <DynamicButton
              initialValue="Minggu Ini"
              styleSelected={{
                flex: 1,
                backgroundColor:
                  value === 'week'
                    ? isDarkMode
                      ? colorSystem.dark.secondary
                      : colorSystem.light.secondary
                    : 'transparent',
                borderWidth: 0,
              }}
              colorText={'#ffffff'}
              onPress={async () => {
                setValue('week');
              }}
            />
            <DynamicButton
              initialValue="Bulan Ini"
              styleSelected={{
                flex: 1,
                backgroundColor:
                  value === 'month'
                    ? isDarkMode
                      ? colorSystem.dark.secondary
                      : colorSystem.light.secondary
                    : 'transparent',
                borderWidth: 0,
              }}
              colorText={'#ffffff'}
              onPress={async () => {
                setValue('month');
              }}
            />
          </View>
          {LeaderBoardData[0]?.nama !== undefined && (
            <View
              style={{
                flexDirection: 'column',
                gap: 8,
                marginHorizontal: 16,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  borderWidth: 2,
                  borderColor: isDarkMode
                    ? colorSystem.dark.primary
                    : colorSystem.light.primary,
                  borderRadius: 8,
                  padding: 16,
                  alignItems: 'center',
                  position: 'relative',
                  gap: 16,
                }}>
                <View
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 25,
                    aspectRatio: 1,
                    borderRadius: 4,
                    backgroundColor: isDarkMode
                      ? colorSystem.dark.primary
                      : colorSystem.light.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <DynamicText
                    size={14}
                    bold
                    style={{
                      color: '#ffffff',
                    }}
                    semiBold>
                    1
                  </DynamicText>
                </View>
                <View style={{flexDirection: 'column', position: 'relative'}}>
                  <FastImage
                    source={{uri: LeaderBoardData[0]?.gambar || ''}}
                    resizeMode={FastImage.resizeMode.cover}
                    style={{
                      width: autoScreen / 5,
                      aspectRatio: 1,
                      borderRadius: 50,
                    }}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      width: 30,
                      height: 20,
                      bottom: 0,
                      right: 0,
                    }}>
                    <FastImage
                      source={require('../../../src/assets/images/membership/badge_pro1.png')}
                      resizeMode={FastImage.resizeMode.contain}
                      style={{
                        width: '100%',
                        aspectRatio: 1,
                        borderRadius: 50,
                      }}
                    />
                  </View>
                </View>
                <View style={{flex: 1, flexDirection: 'column', gap: 8}}>
                  <DynamicText size={16} bold numberOfLines={2}>
                    {LeaderBoardData[0]?.nama}
                  </DynamicText>
                  <View style={{flexDirection: 'row'}}>
                    <View
                      style={{
                        padding: 4,
                        paddingHorizontal: 8,
                        borderRadius: 8,
                        backgroundColor: '#2B5ADF',
                      }}>
                      <DynamicText
                        size={10}
                        numberOfLines={2}
                        style={{color: '#ffffff'}}>
                        {formatCurrency(LeaderBoardData[0]?.pembelian)}
                      </DynamicText>
                    </View>
                  </View>
                </View>
                <Trophy_Icon
                  style={{
                    color: isDarkMode
                      ? colorSystem.dark.primary
                      : colorSystem.light.primary,
                  }}
                  width={40}
                  height={40}
                />
              </View>
              {LeaderBoardData[1]?.nama !== undefined && (
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 8,
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                      borderWidth: 2,
                      flex: 1,
                      borderColor: isDarkMode
                        ? colorSystem.dark.bordercolor
                        : colorSystem.light.bordercolor,
                      borderRadius: 8,
                      padding: 16,
                      alignItems: 'center',
                      position: 'relative',
                      gap: 8,
                    }}>
                    <View
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        width: 25,
                        aspectRatio: 1,
                        borderRadius: 4,
                        backgroundColor: isDarkMode
                          ? colorSystem.dark.primary
                          : colorSystem.light.primary,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <DynamicText
                        size={14}
                        bold
                        style={{
                          color: '#ffffff',
                        }}
                        semiBold>
                        2
                      </DynamicText>
                    </View>
                    <View
                      style={{flexDirection: 'column', position: 'relative'}}>
                      <FastImage
                        source={{uri: LeaderBoardData[1]?.gambar || ''}}
                        resizeMode={FastImage.resizeMode.cover}
                        style={{
                          width: autoScreen / 6,
                          aspectRatio: 1,
                          borderRadius: 50,
                        }}
                      />
                      <View
                        style={{
                          position: 'absolute',
                          width: 30,
                          height: 20,
                          bottom: 0,
                          right: 0,
                        }}>
                        <FastImage
                          source={require('../../../src/assets/images/membership/badge_gold1.png')}
                          resizeMode={FastImage.resizeMode.contain}
                          style={{
                            width: '100%',
                            aspectRatio: 1,
                            borderRadius: 50,
                          }}
                        />
                      </View>
                    </View>
                    <DynamicText size={16} bold numberOfLines={2}>
                      {LeaderBoardData[1]?.nama}
                    </DynamicText>
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={{
                          padding: 4,
                          paddingHorizontal: 8,
                          borderRadius: 8,
                          backgroundColor: '#E45546',
                        }}>
                        <DynamicText
                          size={10}
                          numberOfLines={2}
                          style={{color: '#ffffff'}}>
                          {formatCurrency(LeaderBoardData[1]?.pembelian)}
                        </DynamicText>
                      </View>
                    </View>
                  </View>
                  {LeaderBoardData[2]?.nama !== undefined && (
                    <View
                      style={{
                        flexDirection: 'column',
                        borderWidth: 2,
                        flex: 1,
                        borderColor: isDarkMode
                          ? colorSystem.dark.bordercolor
                          : colorSystem.light.bordercolor,
                        borderRadius: 8,
                        padding: 16,
                        alignItems: 'center',
                        position: 'relative',
                        gap: 8,
                      }}>
                      <View
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          width: 25,
                          aspectRatio: 1,
                          borderRadius: 4,
                          backgroundColor: isDarkMode
                            ? colorSystem.dark.primary
                            : colorSystem.light.primary,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <DynamicText
                          size={14}
                          bold
                          style={{
                            color: '#ffffff',
                          }}
                          semiBold>
                          3
                        </DynamicText>
                      </View>
                      <View
                        style={{flexDirection: 'column', position: 'relative'}}>
                        <FastImage
                          source={{uri: LeaderBoardData[2]?.gambar || ''}}
                          resizeMode={FastImage.resizeMode.cover}
                          style={{
                            width: autoScreen / 6,
                            aspectRatio: 1,
                            borderRadius: 50,
                          }}
                        />
                        <View
                          style={{
                            position: 'absolute',
                            width: 30,
                            height: 20,
                            bottom: 0,
                            right: 0,
                          }}>
                          <FastImage
                            source={require('../../../src/assets/images/membership/badge_silver1.png')}
                            resizeMode={FastImage.resizeMode.contain}
                            style={{
                              width: '100%',
                              aspectRatio: 1,
                              borderRadius: 50,
                            }}
                          />
                        </View>
                      </View>
                      <DynamicText size={16} bold numberOfLines={2}>
                        {LeaderBoardData[2]?.nama}
                      </DynamicText>
                      <View style={{flexDirection: 'row'}}>
                        <View
                          style={{
                            padding: 4,
                            paddingHorizontal: 8,
                            borderRadius: 8,
                            backgroundColor: '#DA781E',
                          }}>
                          <DynamicText
                            size={10}
                            numberOfLines={2}
                            style={{color: '#ffffff'}}>
                            {formatCurrency(LeaderBoardData[2]?.pembelian)}
                          </DynamicText>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}
          <View style={{flexDirection: 'column', gap: 8, marginBottom: 16}}>
            <ConditionalRender
              productsData={LeaderBoardData}
              isLoading={LeaderBoardLoading}
              style={{aspectRatio: 1 / 1, marginHorizontal: 16}}
              model={'emptyData'}
              parsedSetting={isWebSetting}>
              {LeaderBoardData?.slice(3, 90).map((item: any, index: any) => {
                return (
                  <React.Fragment key={index + 4}>
                    <LeaderBoardItem item={item} index={index + 4} />
                  </React.Fragment>
                );
              })}
            </ConditionalRender>
          </View>
        </View>
      </ScrollView>
      <HeaderAnimation />
    </SafeAreaView>
  );
};
export default LeaderBoardPages;
