import React, {useState} from 'react';
import {Text, TouchableOpacity, useColorScheme, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HelpIcon from '../../assets/icon/ic_help_product.svg';
import DynamicText from '../../components/common/DynamicText';
import Input from '../../components/common/Input';
import useAutoScreen from '../../components/context/useAutoScreen';
import {getDarkModePreference} from '../../components/common/darkModePreference';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/reducers';
interface Props {
  inputForms: any;
  saveID: any;
  isLogin:any;
  setInputForms: (item: any) => void;
  productData: any;
  isBantuan: any;
  setIsBantuan: (item: any) => void;
  isModalDescription: any;
  setIsModalDescription: (item: any) => void;
  navigation: any;
}
const InputFormComponent: React.FC<Props> = ({
  inputForms,
  saveID,
  isLogin,
  setInputForms,
  productData,
  isBantuan,
  setIsBantuan,
  isModalDescription,
  setIsModalDescription,
  navigation,
}) => {
  const colorSystem = useSelector(
    (state: RootState) => state.todoReducer.colorSystem,
  );

  const autoScreen = useAutoScreen();
  const isDarkMode = getDarkModePreference();
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (index: number, value: any) => {
    const newInputs = [...inputForms];
    newInputs[index].value = value;
    setInputForms(newInputs);
    console.log(newInputs);
  };

  return (
    <View style={{gap: 8, flexDirection: 'column'}}>
      {productData.tutorial_singkat && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginHorizontal: 16,
          }}>
          <DynamicText size={14} semiBold>
            Cara Pembelian
          </DynamicText>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setIsModalDescription({...isModalDescription, status: true});
            }}>
            <HelpIcon
              height={15}
              style={{
                aspectRatio: 1,
                color: isDarkMode ? '#ffffff' : '#212121',
              }}
            />
          </TouchableOpacity>
        </View>
      )}
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
              1
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
              Masukan Detil Akun
            </DynamicText>
            {isBantuan?.uri !== '' && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setIsBantuan({...isBantuan, status: true});
                }}>
                <HelpIcon
                  height={15}
                  style={{
                    aspectRatio: 1,
                    color: '#ffffff',
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {saveID.length <= 0 ? (
          <View
            style={{
              padding: 16,
              paddingBottom: 0,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <DynamicText size={12}>Simpan ID dengan fitur </DynamicText>
            <TouchableOpacity
              onPress={() =>{
                isLogin ? navigation.navigate('SaveID') : navigation.navigate('Account')}}
              activeOpacity={0.7}>
              <DynamicText size={12} bold>
                Save ID
              </DynamicText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{padding: 16, paddingBottom: 0}}>
            <Input
              label={'Save ID'}
              colorText={isDarkMode ? '#ffffff' : '#000000'}
              value={inputValue}
              onChange={value => {
                setInputValue(value);
                console.log(JSON.parse(value));

                setInputForms((prevInputForms: any) => {
                  return prevInputForms?.map((item: any) => {
                    if (JSON.parse(value).hasOwnProperty(item.name)) {
                      return {...item, value: JSON.parse(value)[item.name]};
                    }
                    return item;
                  });
                });
              }}
              type={'select'}
              options={JSON.stringify(saveID)}
              placeholder={`Pilih ID`}
            />
          </View>
        )}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            padding: 8,
          }}>
          {inputForms?.map((item: any, index: any) => {
            return (
              <View
                key={index}
                style={[
                  {
                    flexDirection: 'column',
                    width:
                      inputForms.length <= 1
                        ? autoScreen - 65
                        : autoScreen / 2 - 36,
                  },
                  index % 2 === 2
                    ? {marginRight: 8, marginTop: 8}
                    : {marginLeft: 8, marginBottom: 8},
                ]}>
                <Input
                  key={index}
                  style={{flex: 1}}
                  label={item.title}
                  colorText={isDarkMode ? '#ffffff' : '#000000'}
                  value={item.value === undefined ? '' : item.value}
                  onChange={value => {
                    const inputValue = value;
                    if (inputValue.length <= 500) {
                      handleInputChange(index, inputValue);
                    }
                  }}
                  type={
                    item.type === 'text'
                      ? 'default'
                      : item.type === 'number'
                      ? 'number-pad'
                      : item.type
                  }
                  options={item.options ? item.options : null}
                  placeholder={`${item.placeholder}`}
                />
              </View>
            );
          })}
        </View>
        {productData?.info_form && (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              borderTopWidth: 1,
              borderColor: isDarkMode
                ? colorSystem.dark.bordercolor
                : colorSystem.light.bordercolor,
              paddingVertical: 8,
              padding: 16,
            }}>
            <DynamicText size={10} style={{opacity: 0.7}}>
              {productData?.info_form}
            </DynamicText>
          </View>
        )}
      </View>
    </View>
  );
};
export default InputFormComponent;
