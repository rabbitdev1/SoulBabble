import React, {ReactNode, useEffect, useState} from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native-gesture-handler';
import DynamicText from '../common/DynamicText';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/reducers';
import { getDarkModePreference } from '../common/darkModePreference';
interface ConditionalRenderProps {
  productsData: any[]; // Adjust the type accordingly
  children: ReactNode;
  isLoading?: boolean;
  style?: any;
  model: string;
  parsedSetting?: any; // Adjust the type accordingly
}
const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  productsData,
  children,
  isLoading = true,
  style = {},
  model,
  parsedSetting,
}) => {
  const colorSystem = useSelector(
      (state: RootState) => state.todoReducer.colorSystem,
    );
    const isDarkMode = getDarkModePreference();
  
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const navigation = useNavigation<any>();
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderRadius: 6,
          ...style,
        }}>
        <View
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: isDarkMode
            ? colorSystem.dark.card
            : colorSystem.light.card,
          }}
        />
      </View>
    );
  } else {
    if (productsData.length === 0) {
      const emptyImageSource =
        model === 'emptyData'
          ? parsedSetting?.otherImage && parsedSetting.otherImage['empty_box']
          : model === 'emptyItem'
          ? parsedSetting?.otherImage &&
            parsedSetting.otherImage['productEmpty']
          : model === 'emptyForm'
          ? parsedSetting?.otherImage && parsedSetting.otherImage['empty_box']
          : model === 'emptySearch'
          ? parsedSetting?.otherImage && parsedSetting.otherImage['empty_box']
          : model === 'emptyReview'
          ? parsedSetting?.otherImage && parsedSetting.otherImage['empty_box']
          : null;

      return !isVisible ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            ...style,
          }}>
          <View
            style={{
              flex: 1,
              width: '100%',
              borderRadius: 6,
              backgroundColor:  isDarkMode
              ? colorSystem.dark.card
              : colorSystem.light.card,
            }}
          />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            gap: 8,
            justifyContent: 'center',
            padding: 16,
          }}>
          <FastImage
            source={{uri: emptyImageSource}}
            resizeMode={FastImage.resizeMode.contain}
            style={{width: '50%', aspectRatio: 1 / 1}}
          />
          <DynamicText size={14} semiBold>
            {model === 'emptyData'
              ? 'Data Tidak Ditemukan'
              : model === 'emptyItem'
              ? 'Produk belum tersedia...'
              : model === 'emptyForm'
              ? 'Form Tidak Ditemukan'
              : model === 'emptySearch'
              ? 'Game Tidak Ditemukan'
              : model === 'emptyReview'
              ? 'Ulasan Tidak Ditemukan'
              : ''}
          </DynamicText>
          {model === 'emptyItem' && (
            <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
              activeOpacity={0.7}
              style={{
                backgroundColor:  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary,
                padding: 16,
                paddingVertical: 12,
                borderRadius: 6,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 1,
                gap: 8,
              }}>
              <DynamicText size={12} style={{color: '#ffffff'}}>
                Cari Produk Lainnya
              </DynamicText>
            </TouchableOpacity>
          )}
        </View>
      );
    } else {
      return <>{children}</>;
    }
  }
};
export default ConditionalRender;
