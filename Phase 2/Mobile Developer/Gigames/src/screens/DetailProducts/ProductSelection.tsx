import React, { useEffect, useState } from 'react';
import { TouchableOpacity, useColorScheme, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import DynamicText from '../../components/common/DynamicText';
import { formatCurrency } from '../../components/common/formatCurrency';
import useAutoScreen from '../../components/context/useAutoScreen';
import { getDarkModePreference } from '../../components/common/darkModePreference';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/reducers';
interface Props {
  itemProduct: any;
  parsedProfile: any;
  setselectedNominalItems: (item: any) => void;
  selectedNominalItems: any;
}
const ProductSelection: React.FC<Props> = ({
  itemProduct,
  parsedProfile,
  setselectedNominalItems,
  selectedNominalItems,
}) => {
  const colorSystem = useSelector(
      (state: RootState) => state.todoReducer.colorSystem,
    );
  
  const autoScreen = useAutoScreen();
  const isDarkMode = getDarkModePreference();

  const [tabNominal, setTabNominal] = useState(0);

  useEffect(() => {
    setTabNominal(itemProduct[0]?.jenis_layanan);
  }, [itemProduct]);

  const JenisItem = React.memo(({item, index}: {item: any; index: number}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          if (item.jenis_layanan === tabNominal) {
            setTabNominal(0);
          } else {
            setTabNominal(item.jenis_layanan);
          }
        }}
        style={[
          {
            flexDirection: 'column',
            gap: 8,
            padding: 16,
            borderWidth: 1,
            alignItems: 'center',
            width: autoScreen / 3 - 27,
            borderRadius: 6,
            borderColor:
              item.jenis_layanan === tabNominal
                ?  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary
                :isDarkMode
                ? colorSystem.dark.bordercolor
                : colorSystem.light.bordercolor,
            backgroundColor:
              item.jenis_layanan === tabNominal
                ? colorSystem.dark.primary_opacity
                :  isDarkMode
                ? colorSystem.dark.background
                : colorSystem.light.background,
  
          },
          index % 2 === 2
            ? {marginRight: 8, marginTop: 8}
            : {marginLeft: 8, marginBottom: 8},
        ]}>
        {item.gambar_jenis !== '' && (
          <FastImage
            source={{uri: item?.gambar_jenis || ''}}
            resizeMode={FastImage.resizeMode.cover}
            style={{
              width: '50%',
              aspectRatio: 1,
            }}
          />
        )}
        <DynamicText
          size={12}
          numberOfLines={3}
          style={{
            textAlign: 'center',
            flex: 1,
            textAlignVertical: 'center',
          }}>
          {item.jenis_layanan}
        </DynamicText>
      </TouchableOpacity>
    );
  });

  const JenisLayanan = React.memo(
    ({
      item,
      index,
      logicFee,
      diskonoff,
    }: {
      item: any;
      index: number;
      logicFee: any;
      diskonoff: any;
    }) => {
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setselectedNominalItems(item);
          }}
          style={[
            {
              flexDirection: 'row',
              position: 'relative',
              overflow: 'hidden',
              padding: 16,
              gap: 8,
              borderWidth: 1,
              backgroundColor:
                selectedNominalItems?.id === item.id
                  ? colorSystem.dark.primary_opacity
                  : isDarkMode
                  ? colorSystem.dark.background
                  : colorSystem.light.background,
    
              width: autoScreen / 2 - 36,
              borderRadius: 6,
              borderColor:
                selectedNominalItems?.id === item.id
                  ?  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary
                  :isDarkMode
                  ? colorSystem.dark.bordercolor
                  : colorSystem.light.bordercolor,
            },
            index % 2 === 2
              ? {marginRight: 8, marginTop: 8}
              : {marginLeft: 8, marginBottom: 8},
          ]}>
          <View style={{flexDirection: 'column', flex: 1}}>
            <DynamicText size={12} semiBold numberOfLines={3}>
              {item.layanan}
            </DynamicText>
            {logicFee()}
            {item.point !== '0' && (
              <DynamicText size={10} style={{color: '#4CAF50'}}>
                + {item.point} Poin
              </DynamicText>
            )}
          </View>
          {item.icon_layanan && (
            <FastImage
              source={{uri: item?.icon_layanan || ''}}
              resizeMode={FastImage.resizeMode.cover}
              style={{
                width: 25,
                aspectRatio: 1,
              }}
            />
          )}
          {item.status_diskon == 'Aktif' && (
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
              }}>
              <View
                style={{
                  padding: 3,
                  backgroundColor:  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary,
                  paddingHorizontal: 9,
                  borderTopLeftRadius: 6,
                }}>
                <DynamicText size={10} semiBold style={{color: 'white'}}>
                  {diskonoff}%
                </DynamicText>
              </View>
            </View>
          )}
        </TouchableOpacity>
      );
    },
  );

  const getPriceAndDiscount = (item: any, profileLevel: any) => {
    let selectedPriceLevel;
    let diskonoff;

    switch (profileLevel) {
      case 'member':
        selectedPriceLevel = item.harga;
        diskonoff = item.diskon_off;
        break;
      case 'silver':
        selectedPriceLevel = item.harga_silver;
        diskonoff = item.diskon_off_silver;
        break;
      case 'pro':
        selectedPriceLevel = item.harga_pro;
        diskonoff = item.diskon_off_pro;
        break;
      case 'gold':
        selectedPriceLevel = item.harga_gold;
        diskonoff = item.diskon_off_gold;
        break;
      default:
        selectedPriceLevel = item.harga;
        diskonoff = item.diskon_off;
        break;
    }

    const logicFee = () => {
      if (item.status_diskon === 'Aktif') {
        return (
          <View style={{flexDirection: 'column'}}>
            <DynamicText
              size={10}
              style={{
                textDecorationLine: 'line-through',
                color: '#ef4444',
              }}>
              {formatCurrency(item.harga_diskon)}
            </DynamicText>
            <DynamicText size={12} semiBold>
              {formatCurrency(selectedPriceLevel)}
            </DynamicText>
          </View>
        );
      } else {
        return (
          <DynamicText size={12}>
            {formatCurrency(selectedPriceLevel)}
          </DynamicText>
        );
      }
    };

    return {diskonoff, logicFee};
  };

  return (
    <View
      style={{
        flexDirection: 'column',
        overflow: 'hidden',
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
          borderRadius: 6,
          overflow: 'hidden',
          backgroundColor:  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary,
        }}>
        <LinearGradient
          colors={isDarkMode
            ? colorSystem.dark.gradient
            : colorSystem.light.gradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            aspectRatio: 1,
            alignItems: 'center',
          }}>
          <DynamicText size={16} bold style={{color: 'white'}}>
            2
          </DynamicText>
        </LinearGradient>
        <View style={{flex: 1, flexDirection: 'column', padding: 12}}>
          <DynamicText size={14} semiBold style={{color: 'white'}}>
            Pilih Nominal
          </DynamicText>
        </View>
      </View>
      <View style={{flex: 1, flexDirection: 'column'}}>
        {itemProduct[0]?.jenis_layanan !== 'Default' && (
          <View style={{flexDirection: 'column'}}>
            <DynamicText
              size={14}
              semiBold
              style={{padding: 16, paddingBottom: 0}}>
              Pilih Item
            </DynamicText>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                paddingHorizontal: 8,
                paddingTop: 8,
              }}>
              {itemProduct.map((item: any, index: any) => (
                <React.Fragment key={index}>
                  <JenisItem item={item} index={index} />
                </React.Fragment>
              ))}
            </View>
            <View
              style={{
                height: 1,
                marginVertical: 8,
                backgroundColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
              }}
            />
          </View>
        )}
        {tabNominal === 0 ? (
          <View style={{flexDirection: 'column', padding: 8}}>
            {itemProduct.map((item: any, index: any) => {
              return (
                <View
                  key={index}
                  style={{flex: 1, flexDirection: 'column', gap: 8}}>
                  {item?.jenis_layanan === 'Default' ? null : (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 8,
                        paddingBottom: 0,
                      }}>
                      {item.gambar_jenis !== '' && (
                        <FastImage
                          source={{uri: item?.gambar_jenis || ''}}
                          resizeMode={FastImage.resizeMode.contain}
                          style={{
                            width: 20,
                            aspectRatio: 1,
                            borderRadius: 50,
                          }}
                        />
                      )}
                      <DynamicText size={14} semiBold>
                        {item?.jenis_layanan}
                      </DynamicText>
                    </View>
                  )}
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      paddingTop: 8,
                    }}>
                    {itemProduct[index]?.items.map((item: any, index: any) => {
                      const {diskonoff, logicFee} = getPriceAndDiscount(
                        item,
                        parsedProfile?.level,
                      );

                      return (
                        <React.Fragment key={index}>
                          <JenisLayanan
                            item={item}
                            index={index}
                            logicFee={logicFee}
                            diskonoff={diskonoff}
                          />
                        </React.Fragment>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              padding: 8,
            }}>
            {itemProduct[
              itemProduct.findIndex(
                (item: any) => item.jenis_layanan === tabNominal,
              )
            ]?.items.map((item: any, index: any) => {
              const {diskonoff, logicFee} = getPriceAndDiscount(
                item,
                parsedProfile?.level,
              );
              return (
                <React.Fragment key={index}>
                  <JenisLayanan
                    item={item}
                    index={index}
                    logicFee={logicFee}
                    diskonoff={diskonoff}
                  />
                </React.Fragment>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};
export default ProductSelection;
