import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { FlatList, TouchableOpacity, useColorScheme, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { RootStackParamList } from '../../../App';
import DynamicText from '../../components/common/DynamicText';
import useAutoScreen from '../../components/context/useAutoScreen';
import ConditionalRender from '../../components/ui/ConditionalRender';
import { getDarkModePreference } from '../../components/common/darkModePreference';
import { RootState } from '../../../store/reducers';
import { useSelector } from 'react-redux';
interface ArticleSliderProps {
  data: any[];
  loading: boolean;
  isWebSetting: any;
}

interface DetailBlogPagesProps {}
type DetailBlogPagesScreenProp = StackNavigationProp<
  RootStackParamList,
  'DrawerScreen'
>;
const ArticleSlider: React.FC<ArticleSliderProps> = ({
  data,
  loading,
  isWebSetting,
}) => {
  const colorSystem = useSelector(
      (state: RootState) => state.todoReducer.colorSystem,
    );
  
  const isDarkMode =getDarkModePreference();
  const autoScreen = useAutoScreen();
  const navigation = useNavigation<DetailBlogPagesScreenProp>();

  const ListItem: React.FC<{item: any}> = React.memo(({item}) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('DetailBlog', {slug: item.slug})}
        activeOpacity={0.7}
        style={{
          flexDirection: 'column',
          width: autoScreen - (32 - 4),
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 6,
          elevation: 1,
          backgroundColor:  isDarkMode
              ? colorSystem.dark.card
              : colorSystem.light.card,
          marginBottom: 16,
        }}>
        <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
          <FastImage
            source={{uri: item.gambar}}
            resizeMode={FastImage.resizeMode.cover}
            style={{
              width: '100%',
              aspectRatio: 2.5 / 1,
              backgroundColor:  isDarkMode
              ? colorSystem.dark.card
              : colorSystem.light.card,
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: 0,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              width: autoScreen / 2,
              height: 6,
              backgroundColor:  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary,
            }}
          />
        </View>
        <View style={{flexDirection: 'column', flex: 1, padding: 8}}>
          <DynamicText semiBold size={12}>
            {item.judul}
          </DynamicText>
          <DynamicText light size={12}>
            {item.sub_konten}
          </DynamicText>
        </View>
      </TouchableOpacity>
    );
  });

  return (
    <View style={{width: autoScreen, paddingVertical: 8, gap: 8}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          paddingHorizontal: 16,
          paddingBottom: 8,
        }}>
        <DynamicText size={16} semiBold>
          Berita Terbaru
        </DynamicText>
        <TouchableOpacity style={{padding: 8}} activeOpacity={0.8} onPress={()=>navigation.navigate('Blog')}>
          <DynamicText
            size={10}
            style={{
              textAlign: 'center',
              color:  isDarkMode
              ? '#ffffff'
              : colorSystem.light.primary,
            }}>
            Lihat Lebih Banyak
          </DynamicText>
        </TouchableOpacity>
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
    </View>
  );
};
export default ArticleSlider;
