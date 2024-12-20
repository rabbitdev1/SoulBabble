import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import StarIcon from '../../assets/icon/star.svg';
import DynamicText from '../../components/common/DynamicText';
import ConditionalRender from '../../components/ui/ConditionalRender';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/reducers';
interface ProductReviewsProps {
  rate: {
    totalRating: number;
    rataRata: number;
  };
  reviewData: any[];
  navigation: any;
  reviewLoading: any;
  isWebSetting: any;
  productData: {
    id: string;
    nama: string;
    gambar: string;
    sub_nama: string;
  };
  isDarkMode: boolean;
}
const ProductReviews: React.FC<ProductReviewsProps> = ({
  rate,
  reviewData,
  navigation,
  productData,
  isDarkMode,
  reviewLoading,
  isWebSetting,
}) => {
  const colorSystem = useSelector(
      (state: RootState) => state.todoReducer.colorSystem,
    );
  
  const ReviewItem = React.memo(({item}: {item: any}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          gap: 8,
          paddingVertical: 8,
          borderBottomWidth: 0.5,
          borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
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
                flexDirection: 'column',
                marginBottom:8
              }}>
              <DynamicText size={12} semiBold>
                {item.nama}
              </DynamicText>
              <DynamicText size={10}> {item.tanggal}</DynamicText>
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
          <DynamicText size={12} numberOfLines={3} style={{color: '#818994'}}>
            "{item.review}"
          </DynamicText>
        </View>
      </View>
    );
  });
  return (
    <View
      style={{
        flexDirection: 'column',
        backgroundColor:  isDarkMode
              ? colorSystem.dark.card
              : colorSystem.light.card,
        marginHorizontal: 16,
        elevation: 1,
        borderRadius: 6,
      }}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 0.5,
          borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <DynamicText size={14} semiBold>
          Ulasan Produk
        </DynamicText>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
          <DynamicText size={12}>{rate?.totalRating}+ Pembelian</DynamicText>
          <StarIcon
            height={'100%'}
            style={{
              aspectRatio: 1,
              color: '#F3B411',
            }}
          />
          <DynamicText size={16} bold>
            {rate?.rataRata}
          </DynamicText>
        </View>
      </View>
      <ConditionalRender
        productsData={reviewData}
        isLoading={reviewLoading}
        style={{height: 80, borderRadius: 0}}
        model={'emptyData'}
        parsedSetting={isWebSetting}>
        {reviewData?.slice(0,5).map((item, index) => (
          <React.Fragment key={index}>
            <ReviewItem item={item} />
          </React.Fragment>
        ))}
      </ConditionalRender>
      <View
        style={{
          flexDirection: 'row',
          padding: 8,
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate('Reviews', {
              id: productData?.id,
              nama: productData?.nama,
              gambar: productData?.gambar,
              kategori: productData?.sub_nama,
            })
          }>
          <DynamicText
            size={12}
            style={{
              textAlign: 'center',
              color:  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary,
            }}>
            Tampilkan Semua
          </DynamicText>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default ProductReviews;
