import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { RootStackParamList } from '../../../App';
import { RootState } from '../../../store/reducers';
import { getDarkModePreference } from '../../components/common/darkModePreference';
import DynamicText from '../../components/common/DynamicText';
import useAutoScreen from '../../components/context/useAutoScreen';
import ConditionalRender from '../../components/ui/ConditionalRender';

interface TabCategoryProps {
  data: any[];
  loading: boolean;
  listProduct: any[];
  tabcategroy: string;
  setTabCategory: React.Dispatch<React.SetStateAction<string>>;
  isWebSetting: any;
}
type screenProps = StackNavigationProp<RootStackParamList, 'DrawerScreen'>;
const TabCategory: React.FC<TabCategoryProps> = ({
  data,
  loading,
  listProduct,
  tabcategroy,
  setTabCategory,
  isWebSetting,
}) => {
  const colorSystem = useSelector(
    (state: RootState) => state.todoReducer.colorSystem,
  );

  const autoScreen = useAutoScreen();
  const isDarkMode = getDarkModePreference();
  const navigation = useNavigation<screenProps>();
  const [productDataUpdate, setProductDataUpdate] = useState<any[]>([]);

  useEffect(() => {
    const itemBaru = {
      jenis: '⭐ Semua',
      kategori: [],
    };
    const newData = [itemBaru, ...data];
    setProductDataUpdate(newData);
    setVisibleItems(9)
  }, [data]);


  const [visibleItems, setVisibleItems] = useState(9);

  const loadMoreItems = () => {
    setVisibleItems(prevVisibleItems => prevVisibleItems + 6);
  };

  const isLoadMoreVisible = (filteredProductsLength: any) => {
    return filteredProductsLength >= 9 && visibleItems < filteredProductsLength;
  };

  const ListItem = React.memo(({ item, index }: { item: any; index: number }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.navigate('Details', { slug: item.slug })}
        style={[
          {
            flexDirection: 'column',
            width: autoScreen / 3 - 27,
            overflow: 'hidden',
            borderRadius: 6,
          },
          index % 3 == 3
            ? { marginRight: 8, marginTop: 8 }
            : { marginLeft: 8, marginBottom: 8 },
        ]}>
        <View style={{ borderRadius: 6, overflow: 'hidden' }}>
          <FastImage
            source={{ uri: item.gambar }}
            resizeMode={FastImage.resizeMode.cover}
            style={{
              width: '100%',
              aspectRatio: 2 / 3,
              backgroundColor: isDarkMode
                ? colorSystem.dark.card
                : colorSystem.light.card,
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            padding: 8,
          }}>
          <DynamicText
            size={12}
            semiBold
            style={{
              textAlign: 'center',
              color: isDarkMode ? 'white' : 'black',
            }}>
            {item.nama}
          </DynamicText>
        </View>
      </TouchableOpacity>
    );
  });

  const ListItem1 = React.memo(({ item, index }: { item: any; index: number }) => {
    return (
      tabcategroy === item.jenis && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Details', { slug: item.slug })}
          style={[
            {
              flexDirection: 'column',
              width: autoScreen / 3 - 27,
              overflow: 'hidden',
              borderRadius: 6,
            },
            index % 3 == 3
              ? { marginRight: 8, marginTop: 8 }
              : { marginLeft: 8, marginBottom: 8 },
          ]}>
          <View style={{ borderRadius: 6, overflow: 'hidden' }}>
            <FastImage
              source={{ uri: item.gambar }}
              resizeMode={FastImage.resizeMode.cover}
              style={{
                width: '100%',
                aspectRatio: 2 / 3,
                backgroundColor: isDarkMode
                  ? colorSystem.dark.card
                  : colorSystem.light.card,
              }}
            />
            <View
              style={{
                width: '100%',
                height: 6,
                backgroundColor: isDarkMode
                  ? colorSystem.dark.primary
                  : colorSystem.light.primary,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              padding: 8,
            }}>
            <DynamicText
              size={12}
              semiBold
              style={{
                textAlign: 'center',
                color: isDarkMode ? 'white' : 'black',
              }}>
              {item.nama}
            </DynamicText>
          </View>
        </TouchableOpacity>
      )
    );
  });

  return (
    <View
      style={{
        width: autoScreen,
        paddingVertical: 8,
        paddingHorizontal: 16,
      }}>
      <View
        style={{
          flexDirection: 'row',
          marginBottom: 8,
          borderRadius: 6,
        }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flex: 1, flexDirection: 'row' }}>
          {productDataUpdate.map((item, index) => {
            return (

              <LinearGradient
                key={index}
                colors={
                  tabcategroy === item.jenis
                    ? isDarkMode
                      ? colorSystem.light.gradient
                      : colorSystem.light.gradient
                    : isDarkMode
                      ? [colorSystem.dark.card, colorSystem.dark.card]
                      : [colorSystem.light.card, colorSystem.light.card]
                }
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 0 }}
                style={{
                  marginEnd: 8,
                  padding: 8,
                  paddingHorizontal: 16,
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={index}
                  onPress={() => {
                    if (item.jenis === tabcategroy) {
                      setTabCategory('⭐ Semua');
                      setVisibleItems(9)
                    } else {
                      setTabCategory(item.jenis);
                      setVisibleItems(9)
                    }
                  }}
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {tabcategroy === item.jenis ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 4,
                        alignItems: 'center',
                      }}>
                      <DynamicText
                        size={12}
                        semiBold
                        style={{
                          textAlign: 'center',
                          color:
                            tabcategroy === item.jenis
                              ? 'white'
                              : isDarkMode
                                ? 'white'
                                : 'black',
                        }}>
                        {item.jenis}
                      </DynamicText>
                    </View>
                  ) : (
                    <DynamicText
                      size={12}
                      style={{
                        textAlign: 'center',
                        color: isDarkMode ? '#f3f3f3' : '#212121',
                      }}>
                      {item.jenis}
                    </DynamicText>
                  )}
                </TouchableOpacity>
              </LinearGradient>
            );
          })}
        </ScrollView>
      </View>
      <View
        style={{
          gap: 8,
          paddingVertical: 16,
          backgroundColor: isDarkMode
            ? colorSystem.dark.card
            : colorSystem.light.card,
          elevation: 1,
          borderRadius: 6,
        }}>
        <ConditionalRender
          productsData={listProduct}
          isLoading={loading}
          style={{ height: 200, marginHorizontal: 16, marginBottom: 8 }}
          model={'emptyData'}
          parsedSetting={isWebSetting}>
          {tabcategroy === '⭐ Semua' ? (
            data.map((jenis, index) => {
              const filteredProducts = listProduct
                .filter(item => item.jenis === jenis.jenis);

              const displayedProducts = filteredProducts.slice(0, visibleItems); // Use state to manage visible items

              return (
                <View key={index} style={{ gap: 8 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      position: 'relative',
                    }}>
                    <DynamicText
                      size={14}
                      semiBold
                      style={{
                        paddingHorizontal: 16,
                        paddingBottom: 8,
                      }}>
                      {jenis.jenis}
                    </DynamicText>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      paddingHorizontal: 8,
                    }}>
                    {displayedProducts.map((item, index) => (
                      <ListItem key={index} item={item} index={index} />
                    ))}
                  </View>

                </View>
              );
            })
          ) : (
            <View style={{ flexDirection: 'column', gap: 4 }}>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  paddingHorizontal: 8,
                }}>
                {listProduct
                  .filter(item => item.jenis === tabcategroy)
                  .slice(0, visibleItems) // Use state to manage visible items
                  .map((item, index) => (
                    <ListItem1 key={index} item={item} index={index} />
                  ))}
              </View>
              {isLoadMoreVisible(listProduct.filter(item => item.jenis === tabcategroy).length) && (
                <TouchableOpacity style={{ padding: 8 }} activeOpacity={0.8} onPress={loadMoreItems}>
                  <DynamicText
                    size={12}
                    style={{
                      textAlign: 'center',
                      color: isDarkMode
                        ? '#ffffff'
                        : colorSystem.light.primary,
                    }}>
                    Lihat Lebih Banyak
                  </DynamicText>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ConditionalRender>
      </View>
    </View>
  );
};
export default TabCategory;