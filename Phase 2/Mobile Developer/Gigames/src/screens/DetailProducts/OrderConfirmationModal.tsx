import {REACT_APP_TOKEN_ORDER_GUEST} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modalbox';
import RNSimpleCrypto from 'react-native-simple-crypto';
import {RootStackParamList} from '../../../App';
import RollyIcon from '../../../src/assets/icon/ic_rolly_rounded.svg';
import DynamicButton from '../../components/common/DynamicButton';
import DynamicText from '../../components/common/DynamicText';
import {formatCurrency} from '../../components/common/formatCurrency';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/reducers';
interface OrderConfirmationProps {
  isModalOrderConfirm: boolean;
  setIsModalOrderConfirm: (value: boolean) => void;
  setOrderFix: (value: any) => void;
  orderConfirm: any;
  type_order: string;
  invoice: string;
  isDarkMode: boolean;
  isModalSuccess: boolean;
}
type screenProp = StackNavigationProp<RootStackParamList, 'NextStep'>;
const OrderConfirmationModal: React.FC<OrderConfirmationProps> = ({
  isModalOrderConfirm,
  setIsModalOrderConfirm,
  setOrderFix,
  orderConfirm,
  type_order,
  isDarkMode,
  invoice,
  isModalSuccess,
}) => {
  const colorSystem = useSelector(
      (state: RootState) => state.todoReducer.colorSystem,
    );
  
  const navigation = useNavigation<screenProp>();
  const autoScreen = Dimensions.get('screen').width;
  const [parsedLogin, setParsedLogin] = useState<any>('');
  const [isDisabled, setIsDisabled] = useState(false);
  useEffect(() => {
    const fetchParsed = async () => {
      const parsedLogin = await AsyncStorage.getItem('isLogin');
      setParsedLogin(parsedLogin !== null && JSON.parse(parsedLogin || ''));
    };
    fetchParsed();
  }, []);

  const generateSHA256Hash_Product = async () => {
    const originalString = `${orderConfirm.data}${orderConfirm.id_layanan}${
      orderConfirm.id_pembayaran
    }${orderConfirm.kontak}${orderConfirm.expired}${
      parsedLogin?.apiKey === undefined
        ? REACT_APP_TOKEN_ORDER_GUEST
        : parsedLogin?.apiKey
    }`;
    const sha256Hash = await RNSimpleCrypto.SHA.sha256(originalString);

    setOrderFix(sha256Hash);
  };

  const generateSHA256Hash_Saldo = async () => {
    const originalString = `${orderConfirm.jumlah}${orderConfirm.id_pembayaran}${orderConfirm.kontak}${orderConfirm.expired}${parsedLogin?.apiKey}`;
    const sha256Hash = await RNSimpleCrypto.SHA.sha256(originalString);
    setOrderFix(sha256Hash);
  };

  const generateSHA256Hash_Membership = async () => {
    const originalString = `${orderConfirm.id_layanan}${orderConfirm.membership}${orderConfirm.id_pembayaran}${orderConfirm.kontak}${orderConfirm.expired}${parsedLogin?.apiKey}`;
    const sha256Hash = await RNSimpleCrypto.SHA.sha256(originalString);
    setOrderFix(sha256Hash);
  };

  return (
    <>
      <Modal
        animationDuration={1000}
        swipeToClose={false}
        position={'bottom'}
        backdropOpacity={0.5}
        backdropPressToClose={false}
        style={{
          width: autoScreen,
          height: 'auto',
          elevation: 1,
          backgroundColor: isDarkMode
              ? colorSystem.dark.background
              : colorSystem.light.background,
          borderTopStartRadius: 8,
          borderTopEndRadius: 8,
          padding: 16,
        }}
        isOpen={isModalOrderConfirm}>
        <View style={{flexDirection: 'column', gap: 16}}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                setIsModalOrderConfirm(false);
              }}
              style={{
                width: autoScreen / 3,
                height: 8,
                backgroundColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
                borderRadius: 20,
              }}
            />
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              height: Dimensions.get('screen').height / 1.6,
              width: '100%',
            }}>
            <View style={{flexDirection: 'column', gap: 16, padding: 2}}>
              <View style={{flexDirection: 'column', alignItems: 'center'}}>
                <RollyIcon
                  style={{
                    aspectRatio: 1,
                    color:  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary,
                  }}
                  height={autoScreen / 3}
                />
              </View>
              <View
                style={{flexDirection: 'column', alignItems: 'center', gap: 4}}>
                <DynamicText size={16} bold>
                  Ringkasan Pembelian
                </DynamicText>
                <DynamicText size={12} style={{textAlign: 'center'}}>
                  Pastikan data pemesanan telah sesuai, Lalu kamu bisa lanjutkan
                  transaksi
                </DynamicText>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  backgroundColor: isDarkMode ? '#45424f' : '#F7F8FC',
                  elevation: 1,
                  gap: 8,
                  borderRadius: 8,
                  padding: 16,
                }}>
                <DynamicText size={14} bold>
                  Data User
                </DynamicText>
                {orderConfirm?.user_id && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <DynamicText size={12} style={{flex: 1}} numberOfLines={2}>
                      User ID
                    </DynamicText>
                    <DynamicText
                      size={12}
                      bold
                      style={{flex: 1, textAlign: 'right'}}
                      numberOfLines={2}>
                      {orderConfirm?.user_id}
                    </DynamicText>
                  </View>
                )}
                {orderConfirm?.server && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <DynamicText size={12} style={{flex: 1}} numberOfLines={2}>
                      Server
                    </DynamicText>
                    <DynamicText
                      size={12}
                      bold
                      style={{flex: 1, textAlign: 'right'}}
                      numberOfLines={2}>
                      {orderConfirm?.server}
                    </DynamicText>
                  </View>
                )}
                {orderConfirm?.data && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <DynamicText size={12} style={{flex: 1}} numberOfLines={2}>
                      Data
                    </DynamicText>
                    <DynamicText
                      size={12}
                      bold
                      style={{flex: 1, textAlign: 'right'}}
                      numberOfLines={2}>
                      {orderConfirm?.data}
                    </DynamicText>
                  </View>
                )}
                {orderConfirm?.nick && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <DynamicText size={12} style={{flex: 1}} numberOfLines={2}>
                      Nickname
                    </DynamicText>
                    <DynamicText
                      size={12}
                      bold
                      style={{flex: 1, textAlign: 'right'}}
                      numberOfLines={2}>
                      {orderConfirm?.nick}
                    </DynamicText>
                  </View>
                )}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <DynamicText size={12} style={{flex: 1}} numberOfLines={2}>
                    Nomor Whatsapp
                  </DynamicText>
                  <DynamicText
                    size={12}
                    bold
                    style={{flex: 1, textAlign: 'right'}}
                    numberOfLines={2}>
                    {orderConfirm?.kontak}
                  </DynamicText>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  backgroundColor: isDarkMode ? '#45424f' : '#F7F8FC',
                  elevation: 1,
                  gap: 8,
                  borderRadius: 8,
                  padding: 16,
                }}>
                <DynamicText size={14} bold>
                  Pembelian
                </DynamicText>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <DynamicText size={12} style={{flex: 1}} numberOfLines={2}>
                    Kategori
                  </DynamicText>
                  <DynamicText
                    size={12}
                    bold
                    style={{flex: 1, textAlign: 'right'}}
                    numberOfLines={2}>
                    {orderConfirm?.namaKategori}
                  </DynamicText>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <DynamicText size={12} style={{flex: 1}} numberOfLines={2}>
                    Layanan
                  </DynamicText>
                  <DynamicText
                    size={12}
                    bold
                    style={{flex: 1, textAlign: 'right'}}
                    numberOfLines={2}>
                    {orderConfirm?.layanan}
                  </DynamicText>
                </View>
                {orderConfirm?.jumlah !== '1' ||
                  (orderConfirm?.jumlah !== 1 && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <DynamicText
                        size={12}
                        style={{flex: 1}}
                        numberOfLines={2}>
                        Jumlah
                      </DynamicText>
                      <DynamicText
                        size={12}
                        bold
                        style={{flex: 1, textAlign: 'right'}}
                        numberOfLines={2}>
                        {orderConfirm?.jumlah}
                      </DynamicText>
                    </View>
                  ))}
                {orderConfirm?.rek && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <DynamicText size={12} style={{flex: 1}} numberOfLines={2}>
                      Rek
                    </DynamicText>
                    <DynamicText
                      size={12}
                      bold
                      style={{flex: 1, textAlign: 'right'}}
                      numberOfLines={2}>
                      {orderConfirm?.rek}
                    </DynamicText>
                  </View>
                )}
                {orderConfirm?.voucher && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <DynamicText size={12} style={{flex: 1}} numberOfLines={2}>
                      Voucher
                    </DynamicText>
                    <DynamicText
                      size={12}
                      bold
                      style={{flex: 1, textAlign: 'right'}}
                      numberOfLines={2}>
                      {orderConfirm?.voucher}
                    </DynamicText>
                  </View>
                )}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <DynamicText size={12} style={{flex: 1}} numberOfLines={2}>
                    Payment Method
                  </DynamicText>
                  <DynamicText
                    size={12}
                    bold
                    style={{flex: 1, textAlign: 'right'}}
                    numberOfLines={2}>
                    {orderConfirm?.pembayaran}
                  </DynamicText>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  backgroundColor: isDarkMode ? '#45424f' : '#F7F8FC',
                  elevation: 1,
                  gap: 8,
                  borderRadius: 8,
                  padding: 16,
                }}>
                <DynamicText size={14} bold>
                  Total Pesanan
                </DynamicText>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <DynamicText size={12} style={{flex: 1}} numberOfLines={2}>
                    Harga Produk
                  </DynamicText>
                  <DynamicText
                    size={12}
                    bold
                    style={{flex: 1, textAlign: 'right'}}
                    numberOfLines={2}>
                    {formatCurrency(orderConfirm?.harga)}
                  </DynamicText>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <DynamicText size={12} style={{flex: 1}} numberOfLines={2}>
                    Diskon
                  </DynamicText>
                  <DynamicText
                    size={12}
                    bold
                    style={{flex: 1, textAlign: 'right'}}
                    numberOfLines={2}>
                    {formatCurrency(orderConfirm?.potongan_harga)}
                  </DynamicText>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <DynamicText size={12} style={{flex: 1}} numberOfLines={2}>
                    Total yang harus Dibayar
                  </DynamicText>
                  <DynamicText
                    size={12}
                    bold
                    style={{flex: 1, textAlign: 'right'}}
                    numberOfLines={2}>
                    {formatCurrency(orderConfirm?.total_bayar)}
                  </DynamicText>
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
            <View style={{flex: 1}}>
              <DynamicButton
                initialValue="Batal"
                onPress={() => setIsModalOrderConfirm(false)}
              />
            </View>
            <View style={{flex: 1}}>
              <DynamicButton
                disabled={isDisabled}
                initialValue="Selesaikan"
                styleSelected={{
                  backgroundColor:  isDarkMode
              ? colorSystem.dark.secondary
              : colorSystem.light.secondary,
                  borderWidth: 0,
                }}
                colorText={'#ffffff'}
                onPress={() => {
                  if (type_order === 'product') {
                    generateSHA256Hash_Product();
                  } else if (type_order === 'saldo') {
                    generateSHA256Hash_Saldo();
                  } else if (type_order === 'giftcard') {
                    generateSHA256Hash_Saldo();
                  } else if (type_order === 'membership') {
                    generateSHA256Hash_Membership();
                  }

                  setIsDisabled(true);
                  setTimeout(() => {
                    setIsDisabled(false);
                  }, 5000);
                  Keyboard.dismiss();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationDuration={1000}
        swipeToClose={false}
        backdropOpacity={0.5}
        backdropPressToClose={false}
        style={{
          width: autoScreen,
          height: '100%',
          elevation: 1,
          backgroundColor: isDarkMode
              ? colorSystem.dark.background
              : colorSystem.light.background,
          padding: 16,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
        }}
        isOpen={isModalSuccess}>
        <FastImage
          source={require('../../assets/images/transaction/success.gif')}
          resizeMode={FastImage.resizeMode.contain}
          style={{width: autoScreen / 2, aspectRatio: 1}}
        />
        <DynamicText size={16} bold>
          Transaksi Berhasil!
        </DynamicText>
        <DynamicText size={12}>
          Periksa halaman transaksi anda untuk info lebih lanjut
        </DynamicText>
        <View>
          <DynamicButton
            disabled={isDisabled}
            initialValue="Lihat Invoice"
            styleSelected={{
              backgroundColor:  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary,
              borderWidth: 0,
            }}
            colorText={'#ffffff'}
            onPress={() => {
              navigation.replace('Invoice', {
                invoice: invoice,
              });
            }}
          />
        </View>
      </Modal>
    </>
  );
};
export default OrderConfirmationModal;
