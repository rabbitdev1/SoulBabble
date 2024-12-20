import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { FlatList, useColorScheme, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../../../App';
import DynamicText from '../../components/common/DynamicText';
import useAutoScreen from '../../components/context/useAutoScreen';
import ConditionalRender from '../../components/ui/ConditionalRender';
import { getDarkModePreference } from '../../components/common/darkModePreference';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/reducers';
interface PopularCategoryProps {
  data: any[];
  loading: boolean;
  isWebSetting: any;
}
type homeScreenProp = StackNavigationProp<RootStackParamList, 'DrawerScreen'>;
const PopularCategory: React.FC<PopularCategoryProps> = ({
  data,
  loading,
  isWebSetting,
}) => {
  const colorSystem = useSelector(
      (state: RootState) => state.todoReducer.colorSystem,
    );
  
  const autoScreen = useAutoScreen();
  const navigation = useNavigation<homeScreenProp>();
  const isDarkMode = getDarkModePreference();

  const ListItem = React.memo(({item}: {item: any}) => {
    return (
      <LinearGradient
        colors={isDarkMode
          ? colorSystem.dark.gradient
          : colorSystem.light.gradient}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        style={{
          flexDirection: 'row',
          width: autoScreen / 3,
          overflow: 'hidden',
          borderRadius: 6,
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Details', {slug: item.slug})}
          style={{
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'space-between',
          }}>
          <FastImage
            source={{uri: item.gambar}}
            resizeMode={FastImage.resizeMode.cover}
            style={{
              width: '100%',
              aspectRatio: 1,
              backgroundColor:  isDarkMode
              ? colorSystem.dark.card
              : colorSystem.light.card,
            }}
          />
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              padding: 8,
            }}>
            <DynamicText
              semiBold
              size={12}
              style={{textAlign: 'center', color: '#ffffff'}}>
              {item.nama}
            </DynamicText>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    );
  });

  return (
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
        <DynamicText size={16} bold>
          Paling Banyak Dicari
        </DynamicText>
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
export default PopularCategory;
