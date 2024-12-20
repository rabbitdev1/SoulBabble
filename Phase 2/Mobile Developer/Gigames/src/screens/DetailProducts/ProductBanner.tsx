import React from 'react';
import { ImageBackground, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ScrollView } from 'react-native-gesture-handler';
import JaminanLayananIcon from '../../../src/assets/icon/spesific/jaminanlayanan.svg';
import LayananPelangganIcon from '../../../src/assets/icon/spesific/layananpelanggan.svg';
import PembayaranamanIcon from '../../../src/assets/icon/spesific/pembayaranaman.svg';
import PengirimaninstanIcon from '../../../src/assets/icon/spesific/pengirimaninstan.svg';
import DynamicText from '../../components/common/DynamicText';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/reducers';
import { getDarkModePreference } from '../../components/common/darkModePreference';
interface ProductBannerProps {
  productData: any;
  type: number;
  title: string;
}
const ProductBanner: React.FC<ProductBannerProps> = ({
  productData,
  type,
  title,
}) => {
  const colorSystem = useSelector(
      (state: RootState) => state.todoReducer.colorSystem,
    );
    const isDarkMode = getDarkModePreference();
  
  return type === 1 ? (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        overflow: 'hidden',
      }}>
      <FastImage
        source={{uri: productData?.background || ''}}
        resizeMode="cover"
        style={{
          flex: 1,
          aspectRatio: 2.5 / 1,
        }}
      />
      <ImageBackground
        style={{
          flex: 1,
          flexDirection: 'row',
          gap: 8,
          padding: 16,
          elevation: 1,
        }}
        source={require('../../../src/assets/images/ornament_1.png')}
        imageStyle={{
          resizeMode: 'cover',
          alignSelf: 'center',
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
            source={{uri: productData?.gambar || ''}}
            resizeMode={FastImage.resizeMode.cover}
            style={{
              flex: 1,
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
          }}>
          {specSection(productData)}

          <View
            style={{
              flex: 1,
              flexDirection: 'column',
            }}>
            <DynamicText
              semiBold
              size={16}
              style={{color: 'white'}}
              numberOfLines={2}>
              {productData?.nama}
            </DynamicText>
            <DynamicText size={12} style={{color: 'white'}} numberOfLines={1}>
              {productData?.sub_nama}
            </DynamicText>
          </View>
        </View>
      </ImageBackground>
    </View>
  ) : (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        borderRadius: 16,
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 0,
        overflow: 'hidden',
      }}>
      <ImageBackground
        style={{
          flex: 1,
          flexDirection: 'row',
          gap: 8,
          padding: 16,
          elevation: 1,
        }}
        source={require('../../../src/assets/images/ornament_1.png')}
        imageStyle={{
          resizeMode: 'cover',
          alignSelf: 'center',
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
            source={{uri: productData?.gambar || ''}}
            resizeMode={FastImage.resizeMode.cover}
            style={{
              flex: 1,
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
          <DynamicText
            semiBold
            size={16}
            style={{color: 'white'}}
            numberOfLines={3}>
            {title}
          </DynamicText>
          <DynamicText size={12} style={{color: 'white'}} numberOfLines={1}>
            {productData?.nama}
          </DynamicText>
        </View>
      </ImageBackground>
    </View>
  );
};
export default ProductBanner;
function specSection(productData: any) {
  return (
    <View style={{flexDirection: 'column', height: 15}}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{gap: 8, flexDirection: 'row'}}>
        {[
          {
            icon: (
              <JaminanLayananIcon
                style={{color: '#ffffff', aspectRatio: 1}}
                height={'100%'}
              />
            ),
            text: 'Layanan Pelanggan 24/7',
          },
          {
            icon: (
              <LayananPelangganIcon
                style={{color: '#ffffff', aspectRatio: 1}}
                height={'100%'}
              />
            ),
            text: 'Jaminan Layanan',
          },
          {
            icon: (
              <PembayaranamanIcon
                style={{color: '#ffffff', aspectRatio: 1}}
                height={'100%'}
              />
            ),
            text: 'Pembayaran yang Aman',
          },
          productData?.is_manual === '0' && {
            icon: (
              <PengirimaninstanIcon
                style={{color: '#ffffff', aspectRatio: 1}}
                height={'100%'}
              />
            ),
            text: 'Pengiriman Instant',
          },
        ].map(
          (item, index) =>
            item && (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  marginEnd: 10,
                  alignItems: 'center',
                  gap: 4,
                }}>
                {item.icon}
                <DynamicText size={10} style={{color: 'white'}}>
                  {item.text}
                </DynamicText>
              </View>
            ),
        )}
      </ScrollView>
    </View>
  );
}
