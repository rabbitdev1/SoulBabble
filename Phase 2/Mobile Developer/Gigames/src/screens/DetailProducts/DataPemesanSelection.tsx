import React from 'react';
import {useColorScheme, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DynamicText from '../../components/common/DynamicText';
import Input from '../../components/common/Input';
import {getDarkModePreference} from '../../components/common/darkModePreference';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/reducers';
interface Props {
  phone: any;
  productData: any;
  setPhone: (item: any) => void;
}
const DataPemesanSelection: React.FC<Props> = ({
  phone,
  productData,
  setPhone,
}) => {
  const colorSystem = useSelector(
      (state: RootState) => state.todoReducer.colorSystem,
    );
  
  const isDarkMode = getDarkModePreference();

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
            {productData.is_joki === '1' ? '6' : '5'}
          </DynamicText>
        </LinearGradient>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            gap: 8,
            alignItems: 'center',
            padding: 12,
          }}>
          <DynamicText size={14} semiBold style={{color: 'white'}}>
            Data Pemesanan
          </DynamicText>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'column',
          gap: 8,
          padding: 16,
        }}>
        <Input
          style={{flex: 1}}
          label={'Masukan Nomor WhatsApp'}
          value={phone}
          onChange={value => {
            const filteredValue = value.replace(/[^0-9]/g, '');
            setPhone(filteredValue);
          }}
          type={'number-pad'}
          placeholder={'Masukan Nomor WhatsApp'}
        />
      </View>
    </View>
  );
};
export default DataPemesanSelection;
