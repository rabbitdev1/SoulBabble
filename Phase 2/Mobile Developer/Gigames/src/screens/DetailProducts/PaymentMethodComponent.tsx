import React, {useEffect, useState} from 'react';
import {TouchableOpacity, useColorScheme, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ScrollView} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {setDropdownAlert} from '../../../store/actions/todoActions';
import DynamicText from '../../components/common/DynamicText';
import {formatCurrency} from '../../components/common/formatCurrency';
import Input from '../../components/common/Input';
import useAutoScreen from '../../components/context/useAutoScreen';
import ConditionalRender from '../../components/ui/ConditionalRender';
import {getDarkModePreference} from '../../components/common/darkModePreference';
import {RootState} from '../../../store/reducers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DynamicButton from '../../components/common/DynamicButton';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../App';
interface Props {
  item: any;
  parsedProfile: any;
  isWebSetting: any;
  loading: any;
  type_payment: any;
  selectedNominalItems: any;
  selectedPaymentItems: any;
  selectedrekPayment: any;
  hargaFix: (item: any) => void;
  setselectedrekPayment: (item: any) => void;
  setSelectedPaymentItems: (item: any) => void;
}
type homeScreenProp = StackNavigationProp<RootStackParamList, 'DrawerScreen'>;

const PaymentMethodComponent: React.FC<Props> = ({
  item,
  parsedProfile,
  isWebSetting,
  loading,
  type_payment,
  selectedPaymentItems,
  selectedrekPayment,
  selectedNominalItems,
  setselectedrekPayment,
  setSelectedPaymentItems,
  hargaFix,
}) => {
  const colorSystem = useSelector(
    (state: RootState) => state.todoReducer.colorSystem,
  );

  const dispatch = useDispatch();
  const autoScreen = useAutoScreen();
  const isDarkMode = getDarkModePreference();
  const navigation = useNavigation<homeScreenProp>();

  const [activeIndex, setActiveIndex] = useState(-2);
  const [isSetPIN, setIsSetPIN] = useState(false);
  const [pake_rek, setPake_rek] = useState('0');
  const [itemid, setItemid] = useState('0');

  useEffect(() => {
    fetchParsed();
    setselectedrekPayment([]);
    setActiveIndex(-1);
  }, [selectedNominalItems?.harga]);

  const fetchParsed = async () => {
    const profileString = await AsyncStorage.getItem('isProfile');
    if (profileString !== null) {
      const parsedProfile = JSON.parse(profileString);
      console.log(parsedProfile.pin);
      if (parsedProfile.pin === 'Aktif') {
        setIsSetPIN(false);
      } else {
        setIsSetPIN(true);
      }
    }
  };
  const toggleAccordion = (index: number) => {
    if (
      selectedNominalItems === undefined ||
      selectedNominalItems?.harga === '0' ||
      selectedNominalItems?.harga === 0 ||
      selectedNominalItems.length === 0
    ) {
      dispatch(
        setDropdownAlert(
          'error',
          'Error',
          type_payment === 'saldo'
            ? 'Harap masukan jumlah topup saldo terlebih dahulu'
            : 'Harap pilih layanan terlebih dahulu',
        ),
      );
    } else {
      setselectedrekPayment([]);
      if (activeIndex === index) {
        setActiveIndex(-1);
      } else {
        setActiveIndex(index);
      }
    }
  };
  const handleInputChange = (value: any) => {
    const newInputs = [...selectedrekPayment];
    if (selectedrekPayment[0].nama === 'Saldo') {
      const numericValue = value.replace(/[^0-9]/g, '').slice(0, 6);
      newInputs[0].value = numericValue;
    } else {
      newInputs[0].value = value;
    }
    setselectedrekPayment(newInputs);
  };

  const JenisLayanan = React.memo(
    ({item, index}: {item: any; index: number}) => {
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => toggleAccordion(index)}
          style={[
            {
              flexDirection: 'row',
              position: 'relative',
              overflow: 'hidden',
              padding: 16,
              gap: 8,
              borderWidth: 1,
              width: autoScreen / 1 - 64,
              borderRadius: 6,
              backgroundColor:
                activeIndex === index
                  ? colorSystem.dark.primary_opacity
                  : isDarkMode
                  ? colorSystem.dark.background
                  : colorSystem.light.background,

              borderColor:
                activeIndex === index
                  ? isDarkMode
                    ? colorSystem.dark.primary
                    : colorSystem.light.primary
                  : isDarkMode
                  ? colorSystem.dark.bordercolor
                  : colorSystem.light.bordercolor,
            },
            index % 2 === 2 ? {marginTop: 8} : {marginBottom: 8},
          ]}>
          <View style={{flexDirection: 'column', flex: 1, gap: 8}}>
            <DynamicText size={12} semiBold numberOfLines={3}>
              {item.jenis}
            </DynamicText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              {item?.metode_pembayaran.map((item: any, index: number) => {
                return (
                  <View key={index} style={{marginEnd: 8}}>
                    <FastImage
                      source={{uri: item.gambar}}
                      resizeMode={FastImage.resizeMode.contain}
                      style={{
                        width: 60,
                        aspectRatio: 2,
                      }}
                    />
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      );
    },
  );
  return (
    <View
      style={{
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: isDarkMode
          ? colorSystem.dark.card
          : colorSystem.light.card,
        marginHorizontal: 16,
        elevation: 1,
        borderRadius: 6,
      }}>
      {type_payment === 'saldo' || type_payment === 'membership' ? (
        <View
          style={{
            flexDirection: 'row',
            borderRadius: 6,
            overflow: 'hidden',
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              padding: 12,
              paddingBottom: 0,
            }}>
            <DynamicText size={14} semiBold>
              Pilih Metode Pembayaran
            </DynamicText>
          </View>
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            borderRadius: 6,
            overflow: 'hidden',
            backgroundColor: isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary,
          }}>
          <LinearGradient
            colors={
              isDarkMode
                ? colorSystem.dark.gradient
                : colorSystem.light.gradient
            }
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              aspectRatio: 1,
              alignItems: 'center',
            }}>
            <DynamicText size={16} bold style={{color: 'white'}}>
              3
            </DynamicText>
          </LinearGradient>
          <View style={{flex: 1, flexDirection: 'column', padding: 12}}>
            <DynamicText size={14} semiBold style={{color: 'white'}}>
              Pilih Metode Pembayaran
            </DynamicText>
          </View>
        </View>
      )}
      <ConditionalRender
        productsData={item}
        isLoading={loading}
        parsedSetting={isWebSetting}
        style={{height: 120, margin: 16}}
        model={'emptyItem'}>
        <View style={{flexDirection: 'column', padding: 16}}>
          {item.map((items: any, index: any) => {
            return (
              <React.Fragment key={index}>
                <JenisLayanan item={items} index={index} />
                {activeIndex === index &&
                  items?.metode_pembayaran.map((item: any, index1: number) => {
                    const selectedPriceLevel =
                      parsedProfile?.level === 'member'
                        ? selectedNominalItems?.harga
                        : parsedProfile?.level === 'silver'
                        ? selectedNominalItems?.harga_silver
                        : parsedProfile?.level === 'pro'
                        ? selectedNominalItems?.harga_pro
                        : parsedProfile?.level === 'gold'
                        ? selectedNominalItems?.harga_gold
                        : selectedNominalItems?.harga;

                    const typePayment =
                      type_payment === 'product'
                        ? selectedPriceLevel
                        : selectedNominalItems?.harga;

                    let selectedPriceFee = 0;
                    if (parseInt(item.fee_persen) !== 0) {
                      selectedPriceFee = parseInt(
                        String(
                          (parseFloat(item.fee_persen) / 100) * typePayment +
                            parseInt(typePayment),
                        ),
                      );
                    } else if (parseInt(item.fee_flat) !== 0) {
                      selectedPriceFee =
                        parseInt(item.fee_flat) + parseInt(typePayment);
                    } else {
                      selectedPriceFee = parseInt(typePayment);
                    }
                    return items.jenis === 'Saldo' && isSetPIN ? (
                      <View
                        style={[
                          {
                            flexDirection: 'column',
                            position: 'relative',
                            overflow: 'hidden',
                            padding: 16,
                            gap: 8,
                            borderWidth: 1,
                            backgroundColor: isDarkMode
                              ? colorSystem.dark.background
                              : colorSystem.light.background,

                            width: autoScreen / 1 - 64,
                            borderRadius: 6,
                            borderColor: isDarkMode
                              ? colorSystem.dark.bordercolor
                              : colorSystem.light.bordercolor,
                          },
                          index % 2 === 2 ? {marginTop: 8} : {marginBottom: 8},
                        ]}>
                        <DynamicText size={12}>
                          Atur PIN Anda terlebih dahulu untuk menggunakan
                          layanan pembayaran Saldo
                        </DynamicText>
                        <DynamicButton
                          initialValue="Atur Pin Sekarang"
                          onPress={() => navigation.navigate('EditPin')}
                        />
                      </View>
                    ) : (
                      <View
                        key={index1}
                        style={[
                          {
                            flexDirection: 'column',
                            position: 'relative',
                            overflow: 'hidden',
                            padding: 16,
                            gap: 8,
                            borderWidth: 1,
                            backgroundColor:
                              selectedPaymentItems?.id === item.id
                                ? colorSystem.dark.primary_opacity
                                : isDarkMode
                                ? colorSystem.dark.background
                                : colorSystem.light.background,

                            width: autoScreen / 1 - 64,
                            borderRadius: 6,
                            borderColor:
                              selectedPaymentItems?.id === item.id
                                ? isDarkMode
                                  ? colorSystem.dark.primary
                                  : colorSystem.light.primary
                                : isDarkMode
                                ? colorSystem.dark.bordercolor
                                : colorSystem.light.bordercolor,
                          },
                          index % 2 === 2 ? {marginTop: 8} : {marginBottom: 8},
                        ]}>
                        <TouchableOpacity
                          activeOpacity={0.7}
                          style={{flexDirection: 'row', flex: 1, gap: 8}}
                          onPress={() => {
                            if (selectedNominalItems.length === 0) {
                              dispatch(
                                setDropdownAlert(
                                  'error',
                                  'Error',
                                  'Harap pilih layanan terlebih dahulu',
                                ),
                              );
                            } else if (item.is_gangguan === '1') {
                              dispatch(
                                setDropdownAlert(
                                  'error',
                                  'Error',
                                  'Sedang Gangguan',
                                ),
                              );
                            } else if (
                              selectedPriceFee < item.minimal_pembayaran
                            ) {
                              dispatch(
                                setDropdownAlert(
                                  'error',
                                  'Error',
                                  'Tidak Tersedia, Minimal ' +
                                    formatCurrency(item.minimal_pembayaran),
                                ),
                              );
                            } else {
                              if (item.pake_rek === '1') {
                                setSelectedPaymentItems(item);
                                setselectedrekPayment([
                                  {
                                    nama: item.nama,
                                    placeholder: item.keterangan_rek,
                                    value: '',
                                  },
                                ]);
                              } else {
                                setSelectedPaymentItems(item);
                                setselectedrekPayment([]);
                              }
                              if (
                                item?.nama === 'Saldo' ||
                                item?.nama === 'OVO' ||
                                items.jenis === 'Pulsa'
                              ) {
                                // scrollToSection('PIN');
                              } else {
                                // scrollToSection('complete');
                              }
                              hargaFix({
                                harga: selectedPriceFee,
                                logo: item.gambar,
                              });
                              setPake_rek(item.pake_rek);
                              setItemid(item.id);
                            }
                          }}>
                          <View
                            style={{
                              flexDirection: 'column',
                              flex: 1,
                              justifyContent: 'center',
                              gap: 8,
                            }}>
                            <FastImage
                              source={{uri: item.gambar}}
                              resizeMode={FastImage.resizeMode.contain}
                              style={{
                                width: 60,
                                aspectRatio: 2,
                              }}
                            />
                            <DynamicText size={12} semiBold numberOfLines={3}>
                              {item.nama}
                            </DynamicText>
                          </View>
                          <View
                            style={{
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'flex-end',
                              flex: 1,
                              gap: 8,
                            }}>
                            {selectedPriceFee < item.minimal_pembayaran ? (
                              <DynamicText
                                size={12}
                                numberOfLines={3}
                                style={{color: '#FF1515'}}>
                                Minimal
                                {formatCurrency(selectedPriceFee)}
                              </DynamicText>
                            ) : (
                              <DynamicText size={12} numberOfLines={3}>
                                {formatCurrency(selectedPriceFee)}
                              </DynamicText>
                            )}
                            {item.is_gangguan === '1' ? (
                              <DynamicText
                                size={12}
                                numberOfLines={3}
                                style={{color: '#FF1515'}}>
                                {item.nama} Sedang Gangguan
                              </DynamicText>
                            ) : (
                              <DynamicText size={12} numberOfLines={3}>
                                {item.info}
                              </DynamicText>
                            )}
                          </View>
                        </TouchableOpacity>
                        {selectedrekPayment?.findIndex(
                          (item: any) =>
                            item.nama === 'OVO' || item.nama === 'Saldo',
                        ) === index1 && (
                          <View style={{flexDirection: 'column'}}>
                            {selectedrekPayment.length ===
                            0 ? null : pake_rek ===
                              '0' ? null : selectedPaymentItems?.id ===
                              itemid ? (
                              <View style={{flexDirection: 'column', gap: 8}}>
                                <DynamicText size={12} semiBold>
                                  Masukan{' '}
                                  {selectedrekPayment[0].nama === 'Saldo'
                                    ? 'PIN'
                                    : selectedrekPayment[0].nama}
                                </DynamicText>
                                <Input
                                  style={{flex: 1}}
                                  value={selectedrekPayment[0].value}
                                  onChange={value => {
                                    handleInputChange(value);
                                  }}
                                  placeholder={
                                    selectedrekPayment[0].placeholder
                                  }
                                  type={
                                    selectedrekPayment[0].nama === 'Saldo'
                                      ? 'numeric'
                                      : 'phone-pad'
                                  }
                                />
                              </View>
                            ) : null}
                          </View>
                        )}
                      </View>
                    );
                  })}
              </React.Fragment>
            );
          })}
        </View>
      </ConditionalRender>
    </View>
  );
};
export default PaymentMethodComponent;
