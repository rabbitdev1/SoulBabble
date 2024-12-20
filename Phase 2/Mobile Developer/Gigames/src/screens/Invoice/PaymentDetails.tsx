import Barcode from '@kichiyaki/react-native-barcode-generator';
import Clipboard from '@react-native-clipboard/clipboard';
import React, {useRef} from 'react';
import {Linking, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import {useDispatch, useSelector} from 'react-redux';
import {default as Clipboard_btn} from '../../../src/assets/icon/ic_clipboard.svg';
import {setDropdownAlert} from '../../../store/actions/todoActions';
import DynamicButton from '../../components/common/DynamicButton';
import DynamicText from '../../components/common/DynamicText';
import ConditionalRender from '../../components/ui/ConditionalRender';
import {onShare} from '../../components/context/shareFunctions';
import {RootState} from '../../../store/reducers';

interface PaymentDetailsProps {
  detailInvoice: any; // Ganti 'any' dengan tipe yang sesuai
  isDarkMode: boolean;
  invoiceLoading: boolean;
  isWebSetting: any; // Ganti 'any' dengan tipe yang sesuai
  autoScreen: number;
  expired: any;
}
const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  expired,
  detailInvoice,
  isDarkMode,
  invoiceLoading,
  isWebSetting,
  autoScreen,
}) => {
  const colorSystem = useSelector(
    (state: RootState) => state.todoReducer.colorSystem,
  );

  const dispatch = useDispatch();
  const ref = useRef<any>();

  return (
    <View style={{flexDirection: 'column'}}>
      {!expired &&
        detailInvoice.status_pembayaran !== 'success' &&
        detailInvoice.status_pembayaran !== 'cancel' && (
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              borderRadius: 8,
              overflow: 'hidden',
              borderWidth: 1,
              padding: 16,
              gap: 4,
              marginHorizontal: 16,
              borderColor: isDarkMode
                ? colorSystem.dark.bordercolor
                : colorSystem.light.bordercolor,
            }}>
            {detailInvoice.tipe_pembayaran === 'QRIS' && (
              <ConditionalRender
                productsData={detailInvoice}
                isLoading={invoiceLoading}
                parsedSetting={isWebSetting}
                style={{height: 120}}
                model={'emptyData'}>
                <View style={{flex: 1, flexDirection: 'column', gap: 8}}>
                  <DynamicText
                    size={12}
                    style={{color: '#818994', textAlign: 'center'}}>
                    Mohon bayar sesuai nominal yang tertera agar pesanan
                    otomatis terproses.
                  </DynamicText>
                  <ViewShot
                    ref={ref}
                    options={{
                      fileName: detailInvoice.nama_kategori,
                      format: 'jpg',
                      quality: 1,
                    }}>
                    <View style={{alignItems: 'center'}}>
                      <QRCode
                        value={detailInvoice.aksi}
                        color={isDarkMode ? '#ffffff' : '#212121'}
                        size={autoScreen / 2}
                        backgroundColor={
                          isDarkMode
                            ? colorSystem.dark.card
                            : colorSystem.light.card
                        }
                        quietZone={8}
                        onError={(e: any) => console.log(e)}
                      />
                    </View>
                  </ViewShot>
                  <DynamicButton
                    styleSelected={{
                      backgroundColor: isDarkMode
                        ? colorSystem.dark.background
                        : colorSystem.light.background,
                      borderWidth: 1,
                      borderColor: isDarkMode
                        ? colorSystem.dark.primary
                        : colorSystem.light.primary,
                    }}
                    colorText={
                      isDarkMode
                        ? colorSystem.dark.primary
                        : colorSystem.light.primary
                    }
                    initialValue="Download QR Code"
                    onPress={() => {
                      onShare(ref, dispatch, setDropdownAlert);
                    }}
                  />
                </View>
              </ConditionalRender>
            )}
            {detailInvoice.tipe_pembayaran === 'barcode' && (
              <ConditionalRender
                productsData={detailInvoice}
                isLoading={invoiceLoading}
                parsedSetting={isWebSetting}
                style={{height: 120}}
                model={'emptyData'}>
                <View style={{flex: 1, flexDirection: 'column', gap: 8}}>
                  <DynamicText
                    size={12}
                    style={{color: '#818994', textAlign: 'center'}}>
                    Mohon bayar sesuai nominal yang tertera agar pesanan
                    otomatis terproses.
                  </DynamicText>
                  <Barcode
                    format="CODE128B"
                    lineColor={isDarkMode ? '#ffffff' : '#212121'}
                    background={
                      isDarkMode
                        ? colorSystem.dark.card
                        : colorSystem.light.card
                    }
                    value={detailInvoice?.aksi}
                    text={detailInvoice?.aksi}
                    maxWidth={autoScreen / 1.5}
                  />
                </View>
              </ConditionalRender>
            )}
            {detailInvoice.tipe_pembayaran === 'text' && (
              <ConditionalRender
                productsData={detailInvoice}
                isLoading={invoiceLoading}
                parsedSetting={isWebSetting}
                style={{height: 120}}
                model={'emptyData'}>
                <View style={{flex: 1, flexDirection: 'column', gap: 8}}>
                  <DynamicText
                    size={12}
                    style={{color: '#818994', textAlign: 'center'}}>
                    Mohon bayar sesuai nominal yang tertera agar pesanan
                    otomatis terproses.
                  </DynamicText>
                  <FastImage
                    source={{uri: detailInvoice?.gambar_pembayaran}}
                    resizeMode={FastImage.resizeMode.contain}
                    style={{
                      width: 60,
                      borderRadius: 6,
                      aspectRatio: 2,
                      backgroundColor: isDarkMode
                        ? colorSystem.dark.card
                        : colorSystem.light.card,
                    }}
                  />
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      Clipboard.setString(detailInvoice?.norek);
                      dispatch(
                        setDropdownAlert(
                          'error',
                          'Error',
                          detailInvoice.norek + ' Tersalin',
                        ),
                      );
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 12,
                        borderWidth: 1,
                        borderColor: '#9ca3af50',
                        borderRadius: 8,
                        margin: 2,
                      }}>
                      <DynamicText
                        size={14}
                        style={{
                          textAlign: 'left',
                        }}>
                        {detailInvoice?.norek}
                      </DynamicText>
                      <Clipboard_btn
                        style={{color: '#818994'}}
                        width={22}
                        height={17}
                      />
                    </View>
                  </TouchableOpacity>
                  <DynamicText
                    size={14}
                    style={{
                      textAlign: 'left',
                    }}>
                    {detailInvoice?.aksi}
                  </DynamicText>
                </View>
              </ConditionalRender>
            )}
            {detailInvoice.tipe_pembayaran === 'VA' && (
              <ConditionalRender
                productsData={detailInvoice}
                isLoading={invoiceLoading}
                parsedSetting={isWebSetting}
                style={{height: 120}}
                model={'emptyData'}>
                <View style={{flex: 1, flexDirection: 'column', gap: 8}}>
                  <DynamicText
                    size={12}
                    style={{color: '#818994', textAlign: 'center'}}>
                    Mohon bayar sesuai nominal yang tertera agar pesanan
                    otomatis terproses.
                  </DynamicText>
                  <View style={{flex: 1, alignItems: 'center'}}>
                    <FastImage
                      source={{uri: detailInvoice?.gambar_pembayaran}}
                      resizeMode={FastImage.resizeMode.contain}
                      style={{
                        width: autoScreen / 4,
                        borderRadius: 6,
                        aspectRatio: 2,
                        backgroundColor: isDarkMode
                          ? colorSystem.dark.card
                          : colorSystem.light.card,
                      }}
                    />
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      Clipboard.setString(detailInvoice?.aksi);
                      dispatch(
                        setDropdownAlert(
                          'success',
                          'Tersalin',
                          detailInvoice.aksi,
                        ),
                      );
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 12,
                        borderWidth: 1,
                        borderColor: '#9ca3af50',
                        borderRadius: 8,
                        margin: 2,
                      }}>
                      <View style={{flexDirection: 'column'}}>
                        <DynamicText size={12}>
                          Nomor Virtual Account
                        </DynamicText>
                        <DynamicText size={16} bold>
                          {detailInvoice?.aksi}
                        </DynamicText>
                      </View>
                      <Clipboard_btn
                        style={{color: '#818994'}}
                        width={22}
                        height={17}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </ConditionalRender>
            )}

            {detailInvoice.tipe_pembayaran === 'button' && (
              <ConditionalRender
                productsData={detailInvoice}
                isLoading={invoiceLoading}
                parsedSetting={isWebSetting}
                style={{height: 120}}
                model={'emptyData'}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    gap: 8,
                  }}>
                  <DynamicText
                    size={12}
                    style={{color: '#818994', textAlign: 'center'}}>
                    Mohon bayar sesuai nominal yang tertera agar pesanan
                    otomatis terproses.
                  </DynamicText>
                  <View style={{flex: 1, alignItems: 'center'}}>
                    <FastImage
                      source={{uri: detailInvoice?.gambar_pembayaran}}
                      resizeMode={FastImage.resizeMode.contain}
                      style={{
                        width: autoScreen / 4,
                        borderRadius: 6,
                        aspectRatio: 2,
                        backgroundColor: isDarkMode
                          ? colorSystem.dark.card
                          : colorSystem.light.card,
                      }}
                    />
                  </View>
                  <DynamicText
                    size={12}
                    style={{color: '#818994', textAlign: 'center'}}>
                    Dalam pembayaran menggunakan {detailInvoice.nama_pembayaran}
                    , mohon klik tombol dibawah, maka anda akan diarahkan ke web
                    official {detailInvoice.nama_pembayaran} untuk melakukan
                    pembayaran
                  </DynamicText>
                  <DynamicButton
                    initialValue={`Bayar Sekarang`}
                    styleSelected={{
                      backgroundColor: isDarkMode
                        ? colorSystem.dark.background
                        : colorSystem.light.background,
                      borderWidth: 1,
                      borderColor: isDarkMode
                        ? colorSystem.dark.secondary
                        : colorSystem.light.secondary,
                    }}
                    colorText={
                      isDarkMode
                        ? colorSystem.dark.secondary
                        : colorSystem.light.secondary
                    }
                    onPress={() => {
                      Linking.openURL(detailInvoice.aksi).catch(err => {
                        console.error('Failed to open URL:', err);
                      });
                    }}
                  />
                </View>
              </ConditionalRender>
            )}
            {detailInvoice.tipe_pembayaran === 'notifikasi' && (
              <ConditionalRender
                productsData={detailInvoice}
                isLoading={invoiceLoading}
                parsedSetting={isWebSetting}
                style={{height: 120}}
                model={'emptyData'}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    gap: 8,
                  }}>
                  <DynamicText
                    size={12}
                    style={{color: '#818994', textAlign: 'center'}}>
                    Mohon bayar sesuai nominal yang tertera agar pesanan
                    otomatis terproses.
                  </DynamicText>
                  <View style={{flex: 1, alignItems: 'center'}}>
                    <FastImage
                      source={{uri: detailInvoice?.gambar_pembayaran}}
                      resizeMode={FastImage.resizeMode.contain}
                      style={{
                        width: autoScreen / 4,
                        borderRadius: 6,
                        aspectRatio: 2,
                        backgroundColor: isDarkMode
                          ? colorSystem.dark.card
                          : colorSystem.light.card,
                      }}
                    />
                  </View>
                  <DynamicText
                    size={12}
                    style={{color: '#818994', textAlign: 'center'}}>
                    Dalam pembayaran menggunakan {detailInvoice.nama_pembayaran}
                    , mohon klik tombol dibawah, maka anda akan diarahkan ke web
                    official {detailInvoice.nama_pembayaran} untuk melakukan
                    pembayaran
                  </DynamicText>
                  <DynamicButton
                    initialValue={detailInvoice.aksi}
                    styleSelected={{
                      backgroundColor: isDarkMode
                        ? colorSystem.dark.background
                        : colorSystem.light.background,
                      borderWidth: 1,
                      borderColor: isDarkMode
                        ? colorSystem.dark.primary
                        : colorSystem.light.primary,
                    }}
                    colorText={
                      isDarkMode
                        ? colorSystem.dark.primary
                        : colorSystem.light.primary
                    }
                    onPress={() =>
                      dispatch(
                        setDropdownAlert(
                          'success',
                          'Sukses',
                          detailInvoice.aksi,
                        ),
                      )
                    }
                  />
                </View>
              </ConditionalRender>
            )}
          </View>
        )}
    </View>
  );
};
export default PaymentDetails;
