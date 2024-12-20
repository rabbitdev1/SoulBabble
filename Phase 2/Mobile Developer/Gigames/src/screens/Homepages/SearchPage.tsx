import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { RootStackParamList } from '../../../App';
import { RootState } from '../../../store/reducers';
import { apiClient } from '../../../utils/api/apiClient';
import '../../../utils/ignoreWarnings';
import DynamicText from '../../components/common/DynamicText';
import { refreshControl } from '../../components/context/refreshFunctions';
import useAutoScreen from '../../components/context/useAutoScreen';
import ConditionalRender from '../../components/ui/ConditionalRender';
import SearchBar from '../../components/ui/SearchBar';
import { getDarkModePreference } from '../../components/common/darkModePreference';

type screenProps = StackNavigationProp<RootStackParamList, 'DrawerScreen'>;
export default function SearchPage() {
  const colorSystem = useSelector(
      (state: RootState) => state.todoReducer.colorSystem,
    );
  
  const autoScreen = useAutoScreen();
  const isDarkMode = getDarkModePreference();
  const navigation = useNavigation<screenProps>();
  const scrollYAnimatedValue = useRef(new Animated.Value(0)).current;
  const isWebSetting = useSelector(
    (state: RootState) => state.todoReducer.isWebSetting,
  );

  const [trendingData, setTrendingData] = useState<any>([]);
  const [searchData, setSearchData] = useState<any>([]);

  const [trendingLoading, setTrendingLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  const [refreshingPage, setrefreshingPage] = useState(false);

  const [isSearching, setSearching] = useState('');

  useEffect(() => {
    fetchDataApi();
  }, []);

  const fetchDataApi = async () => {
    fetchDataPopuler();
  };
  const getSearch = async (keyword: string) => {
    setSearchLoading(true);
    try {
      const response = await apiClient({
        baseurl: 'user/search',
        parameter: `search=${keyword}`,
        method: 'POST',
        XGORDON: 'SEARCH',
      });
      setSearchLoading(false);
      if (response?.statusCode === 200) {
        setSearchData(response.result.data);
      } else {
        setSearchData([]);
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

  const handleRefresh = () => {
    refreshControl(setrefreshingPage, fetchDataApi);
  };

  const ListItem = React.memo(({item}: {item: any}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={{
          flex: 1,
          gap: 8,
          flexDirection: 'row',
          width: 200,
          overflow: 'hidden',
        }}
        onPress={() => navigation.navigate('Details', {slug: item.slug})}>
        <View style={{flexDirection: 'row'}}>
          <FastImage
            source={{uri: item.gambar}}
            resizeMode={FastImage.resizeMode.cover}
            style={{
              width: 60,
              aspectRatio: 1,
              borderRadius: 20,
              backgroundColor:  isDarkMode
              ? colorSystem.dark.card
              : colorSystem.light.card,
            }}
          />
        </View>
        <View
          style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
          <DynamicText semiBold size={12} numberOfLines={2}>
            {item.nama}
          </DynamicText>
          <DynamicText size={12} style={{color: '#818994'}} numberOfLines={1}>
            {item.sub_nama}
          </DynamicText>
        </View>
      </TouchableOpacity>
    );
  });

  const SearchItem = React.memo(({item}: {item: any}) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Details', {slug: item.slug})}
        activeOpacity={0.7}
        style={{
          flex: 1,
          gap: 8,
          flexDirection: 'row',
          marginHorizontal: 16,
          backgroundColor:  isDarkMode
              ? colorSystem.dark.card
              : colorSystem.light.card,
          elevation: 1,
          marginVertical: 2,
          padding: 8,
          borderRadius: 6,
          overflow: 'hidden',
        }}>
        <View style={{flexDirection: 'row'}}>
          <FastImage
            source={{uri: item.gambar}}
            resizeMode={FastImage.resizeMode.cover}
            style={{
              width: 60,
              aspectRatio: 1,
              borderRadius: 20,
              backgroundColor:  isDarkMode
              ? colorSystem.dark.card
              : colorSystem.light.card,
            }}
          />
        </View>
        <View
          style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
          <DynamicText semiBold size={12} numberOfLines={2}>
            {item.nama}
          </DynamicText>
          <DynamicText size={12} style={{color: '#818994'}} numberOfLines={1}>
            {item.sub_nama}
          </DynamicText>
        </View>
      </TouchableOpacity>
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
        <SearchBar
          isSearching={isSearching}
          setSearching={setSearching}
          getSearch={getSearch}
        />
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
        <SearchBar
          isSearching={isSearching}
          setSearching={setSearching}
          getSearch={getSearch}
        />
        <View style={{flex: 1, flexDirection: 'column', gap: 8, marginTop: 8}}>
          <View
            style={{
              width: autoScreen,
              paddingVertical: 8,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                paddingHorizontal: 16,
                paddingBottom: 8,
              }}>
              <DynamicText size={14} semiBold>
                Paling Banyak Dicari
              </DynamicText>
            </View>
            <ConditionalRender
              productsData={trendingData}
              isLoading={trendingLoading}
              style={{aspectRatio: 6 / 1, marginHorizontal: 16}}
              model={'emptyData'}
              parsedSetting={isWebSetting}>
              <FlatList
                data={trendingData}
                renderItem={({item}) => {
                  return <ListItem item={item} />;
                }}
                keyExtractor={(item, index) => index.toString()}
                initialNumToRender={5}
                windowSize={1}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                getItemLayout={(data, index) => ({
                  length: 50,
                  offset: 50 * index,
                  index,
                })}
                ItemSeparatorComponent={() => <View style={{width: 12}} />}
                ListFooterComponent={() => <View style={{width: 16}} />}
                ListHeaderComponent={() => <View style={{width: 16}} />}
              />
            </ConditionalRender>
          </View>

          <View
            style={{
              width: autoScreen,
              paddingVertical: 8,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                paddingHorizontal: 16,
                paddingBottom: 8,
              }}>
              <DynamicText size={14} semiBold>
                Hasil Pencarian{' '}
                {isSearching && (
                  <DynamicText size={14} semiBold style={{color:  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary}}>
                    "{isSearching}"
                  </DynamicText>
                )}
              </DynamicText>
            </View>
            <ConditionalRender
              productsData={searchData}
              isLoading={searchLoading}
              style={{aspectRatio: 4 / 1, marginHorizontal: 16}}
              model={'emptySearch'}
              parsedSetting={isWebSetting}>
              {searchData.map((item:any, index:number) => (
                <React.Fragment key={index}>
                  <SearchItem item={item} />
                  {index !== searchData.length - 1 && (
                    <View style={{height: 12}} />
                  )}
                </React.Fragment>
              ))}
            </ConditionalRender>
          </View>
        </View>
      </ScrollView>
      <HeaderAnimation />
    </SafeAreaView>
  );
}
