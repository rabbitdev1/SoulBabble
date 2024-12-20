import React from 'react';
import { useColorScheme, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DynamicText from '../../components/common/DynamicText';
import Input from '../../components/common/Input';
import { getDarkModePreference } from '../../components/common/darkModePreference';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/reducers';
interface Props {
  jumlahJoki: any;
  setJumlahJoki: (item: any) => void;
}
const JumlahSelection: React.FC<Props> = ({jumlahJoki, setJumlahJoki}) => {
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
            5
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
            Jumlah
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
          value={jumlahJoki}
          onChange={event => {
            const inputValue = event;
            const numericValue = inputValue.replace(/\D/g, '');
            const validValue = Math.min(Number(numericValue), 1000);
            setJumlahJoki(validValue.toString());
          }}
          type={'jumlah_joki'}
          onSubmit1={() => {
            setJumlahJoki(parseInt(jumlahJoki) + 1);
          }}
          onSubmit={() => {
            setJumlahJoki(
              parseInt(jumlahJoki) <= 1 ? jumlahJoki : jumlahJoki - 1,
            );
            console.log('xx');
          }}
          placeholder={'Masukan Promo'}
        />
      </View>
    </View>
  );
};
export default JumlahSelection;
