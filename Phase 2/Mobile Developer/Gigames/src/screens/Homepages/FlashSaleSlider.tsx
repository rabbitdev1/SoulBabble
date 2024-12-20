import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {FlatList, useColorScheme, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {RootStackParamList} from '../../../App';
import DynamicText from '../../components/common/DynamicText';
import {formatCurrency} from '../../components/common/formatCurrency';
import useAutoScreen from '../../components/context/useAutoScreen';
import ConditionalRender from '../../components/ui/ConditionalRender';
import CountdownTimer from '../../components/ui/CountdownTimer';
import FlashsaleIcon from '../../assets/icon/ic_flashsale.svg';
import {getDarkModePreference} from '../../components/common/darkModePreference';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/reducers';

interface FlashSaleSliderProps {
  data: {
    gambar: string;
    background: string;
    slug: string;
    harga: number;
    harga_silver: number;
    harga_pro: number;
    harga_gold: number;
    harga_diskon: number;
    kategori: string;
    stok: number;
    jumlah_stok: number;
    layanan: string;
  }[];
  loading: boolean;
  logicFlashsale: {
    waktu_berakhir: string;
  };
  isWebSetting: {
    datetime: string;
  };
}
interface ProfileData {
  level: string;
  // other properties...
}
type homeScreenProp = StackNavigationProp<RootStackParamList, 'DrawerScreen'>;
const FlashSaleSlider: React.FC<FlashSaleSliderProps> = ({
  data,
  loading,
  logicFlashsale,
  isWebSetting,
}) => {
  const colorSystem = useSelector(
    (state: RootState) => state.todoReducer.colorSystem,
  );

  const autoScreen = useAutoScreen();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const isDarkMode = getDarkModePreference();
  const navigation = useNavigation<homeScreenProp>();

  useEffect(() => {
    fetchParsed();
  }, []);

  const fetchParsed = async () => {
    const parsedProfile = await AsyncStorage.getItem('isProfile');
    const parsedResponseProfile = parsedProfile
      ? JSON.parse(parsedProfile)
      : null;
    setProfileData(parsedResponseProfile);
  };

  const ListItem: React.FC<{item: any}> = React.memo(({item}) => {
    const selectedPriceLevel =
      profileData?.level === 'member'
        ? item.harga
        : profileData?.level === 'silver'
        ? item.harga_silver
        : profileData?.level === 'pro'
        ? item.harga_pro
        : profileData?.level === 'gold'
        ? item.harga_gold
        : item.harga;
    const {gambar, background, slug, ...filteredData} = item;

    return item.layanan === 'opening' ? (
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          width: autoScreen / 4,
          overflow: 'hidden',
        }}>
        <FastImage
          source={require('../../../src/assets/images/flashsale.png')}
          resizeMode={FastImage.resizeMode.contain}
          style={{width: '100%', aspectRatio: 1}}
        />
      </View>
    ) : (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          navigation.navigate('Details', {slug: item.slug, data: filteredData});
        }}
        style={{
          flexDirection: 'column',
          width: autoScreen / 2.5,
          overflow: 'hidden',
          borderRadius: 6,
          backgroundColor: isDarkMode
            ? colorSystem.dark.card
            : colorSystem.light.card,
        }}>
        <View
          style={{
            flex: 1,
            position: 'relative',
            width: '100%',
            aspectRatio: 1,
          }}>
          <FastImage
            source={{uri: item.gambar}}
            resizeMode={FastImage.resizeMode.cover}
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: isDarkMode
                ? colorSystem.dark.card
                : colorSystem.light.card,
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: 8,
              right: 0,
            }}>
            <FlashsaleIcon
              width={60}
              height={30}
              style={{
                color: isDarkMode ? '#ffffff' : '#212121',
              }}
            />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            width: '100%',
            height: 10,
            backgroundColor: isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary,
          }}
        />
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            padding: 8,
          }}>
          <View style={{flexDirection: 'column'}}>
            <DynamicText semiBold size={12}>
              {item.layanan}
            </DynamicText>
            <DynamicText light size={12}>
              {item.kategori}
            </DynamicText>
            <DynamicText
              size={10}
              style={{color: '#F44336', textDecorationLine: 'line-through'}}>
              {formatCurrency(item.harga_diskon)}
            </DynamicText>
            <DynamicText semiBold size={12}>
              {formatCurrency(selectedPriceLevel)}
            </DynamicText>
          </View>
          <View
            style={{
              marginTop: 4,
              backgroundColor: isDarkMode
              ? colorSystem.dark.bordercolor
              : colorSystem.light.bordercolor,
              overflow: 'hidden',
              alignItems: 'center',
              borderRadius: 50,
              position: 'relative',
            }}>
            <View
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                backgroundColor: isDarkMode
                  ? colorSystem.dark.primary
                  : colorSystem.light.primary,
                width: `${
                  item.stok && item.jumlah_stok
                    ? (item.stok / item.jumlah_stok) * 100
                    : 0
                }%`,
              }}
            />
            <DynamicText
              semiBold
              size={10}
              style={{padding: 1, paddingVertical: 4, color: '#ffffff'}}>
              Tersedia {item.stok}
            </DynamicText>
          </View>
        </View>
      </TouchableOpacity>
    );
  });

  return (
    new Date(logicFlashsale.waktu_berakhir) >
      new Date(isWebSetting?.datetime) && (
      <LinearGradient
        colors={
          isDarkMode ? colorSystem.dark.gradient : colorSystem.light.gradient
        }
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={{width: autoScreen, paddingVertical: 16}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 16,
            paddingBottom: 8,
          }}>
          <DynamicText size={14} style={{color: '#ffffff'}} semiBold>
            Berakhir Dalam :
          </DynamicText>
          <CountdownTimer
            type={2}
            expired={logicFlashsale.waktu_berakhir || new Date()}
            onResponse={a => {}}
          />
        </View>
        <ConditionalRender
          productsData={data}
          isLoading={loading}
          style={{aspectRatio: 2 / 1, marginHorizontal: 16}}
          model={'emptyData'}
          parsedSetting={isWebSetting}>
          <FlatList
            data={data}
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
      </LinearGradient>
    )
  );
};
export default FlashSaleSlider;
