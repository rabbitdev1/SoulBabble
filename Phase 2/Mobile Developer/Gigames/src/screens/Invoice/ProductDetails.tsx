import React from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import DynamicText from '../../components/common/DynamicText';
import { formatCurrency } from '../../components/common/formatCurrency';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/reducers';
interface ProductDetailsProps {
  detailInvoice: any; // Ganti 'any' dengan tipe yang sesuai
  isDarkMode: boolean;
}
const ProductDetails: React.FC<ProductDetailsProps> = ({
  detailInvoice,
  isDarkMode,
}) => {
  const colorSystem = useSelector(
      (state: RootState) => state.todoReducer.colorSystem,
    );
  
  return (
    <View style={{flexDirection: 'column', gap: 8}}>
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
        <DynamicText size={14} bold>
          Rincian Produk
        </DynamicText>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <DynamicText size={12} style={{flex: 1}} numberOfLines={2}>
            Tanggal
          </DynamicText>
          <DynamicText
            size={12}
            bold
            style={{flex: 1, textAlign: 'right'}}
            numberOfLines={2}>
            {detailInvoice?.tanggal}
          </DynamicText>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <DynamicText size={12} style={{flex: 1}} numberOfLines={2}>
            Nama Layanan
          </DynamicText>
          <DynamicText
            size={12}
            bold
            style={{flex: 1, textAlign: 'right'}}
            numberOfLines={2}>
            {detailInvoice?.nama_layanan}
          </DynamicText>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <DynamicText size={12} style={{flex: 1}} numberOfLines={2}>
            Nama Kategori
          </DynamicText>
          <DynamicText
            size={12}
            bold
            style={{flex: 1, textAlign: 'right'}}
            numberOfLines={2}>
            {detailInvoice?.nama_kategori}
          </DynamicText>
        </View>
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
            {detailInvoice?.data}
          </DynamicText>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <DynamicText size={12} style={{flex: 1}} numberOfLines={2}>
            Nomor Whatapps
          </DynamicText>
          <DynamicText
            size={12}
            bold
            style={{flex: 1, textAlign: 'right'}}
            numberOfLines={2}>
            {detailInvoice?.noWa}
          </DynamicText>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <DynamicText size={12} style={{flex: 1}} numberOfLines={2}>
            Status
          </DynamicText>
          <DynamicText
            size={12}
            bold
            style={{flex: 1, textAlign: 'right'}}
            numberOfLines={2}>
            {detailInvoice?.status === 'cancel'
              ? 'Cancel'
              : detailInvoice?.status === 'refund'
              ? 'Refund'
              : detailInvoice?.status === 'pending'
              ? 'Pending'
              : detailInvoice?.status === 'paid'
              ? 'Sudah Bayar'
              : detailInvoice?.status === 'not_paid'
              ? 'Belum Bayar'
              : detailInvoice?.status === 'processing'
              ? 'Processing'
              : detailInvoice?.status === 'success'
              ? 'Success'
              : null}
          </DynamicText>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <DynamicText size={12} style={{flex: 1}} numberOfLines={2}>
            Status Pembayaran
          </DynamicText>
          <DynamicText
            size={12}
            bold
            style={{flex: 1, textAlign: 'right'}}
            numberOfLines={2}>
            {detailInvoice?.status_pembayaran === 'cancel'
              ? 'Cancel'
              : detailInvoice?.status_pembayaran === 'refund'
              ? 'Refund'
              : detailInvoice?.status_pembayaran === 'pending'
              ? 'Pending'
              : detailInvoice?.status_pembayaran === 'paid'
              ? 'Sudah Bayar'
              : detailInvoice?.status_pembayaran === 'not_paid'
              ? 'Belum Bayar'
              : detailInvoice?.status_pembayaran === 'processing'
              ? 'Processing'
              : detailInvoice?.status_pembayaran === 'success'
              ? 'Success'
              : null}
          </DynamicText>
        </View>
      </View>

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
        <DynamicText size={14} bold>
          Rincian Pembayaran
        </DynamicText>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <DynamicText size={12} style={{flex: 1}} numberOfLines={2}>
            Metode Pembayaran
          </DynamicText>
          <FastImage
            source={{uri: detailInvoice?.gambar_pembayaran}}
            resizeMode={FastImage.resizeMode.contain}
            style={{
              width: 50,
              borderRadius: 6,
              aspectRatio: 2,
              backgroundColor:  isDarkMode
              ? colorSystem.dark.card
              : colorSystem.light.card,
            }}
          />
        </View>
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
            {formatCurrency(detailInvoice?.harga_layanan)}
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
            {formatCurrency(detailInvoice?.potongan_harga)}
          </DynamicText>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <DynamicText size={12} style={{flex: 1}} numberOfLines={2}>
            Fee
          </DynamicText>
          <DynamicText
            size={12}
            bold
            style={{flex: 1, textAlign: 'right'}}
            numberOfLines={2}>
            {formatCurrency(detailInvoice?.fee)}
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
            {formatCurrency(detailInvoice?.total_bayar)}
          </DynamicText>
        </View>
      </View>
    </View>
  );
};
export default ProductDetails;
