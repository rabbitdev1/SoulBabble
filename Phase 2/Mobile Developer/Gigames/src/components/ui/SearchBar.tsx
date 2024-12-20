import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import Back_btn from '../../../src/assets/icon/ic_arrow_back.svg';
import Search_btn from '../../../src/assets/icon/ic_search.svg';
import { RootState } from '../../../store/reducers';
import { getDarkModePreference } from '../common/darkModePreference';
import useAutoScreen from '../context/useAutoScreen';
interface SearchBarProps {
  isSearching: string;
  setSearching: React.Dispatch<React.SetStateAction<string>>;
  getSearch: (searchQuery: string) => void;
}
const SearchBar: React.FC<SearchBarProps> = ({
  isSearching,
  setSearching,
  getSearch,
}) => {
  const colorSystem = useSelector(
    (state: RootState) => state.todoReducer.colorSystem,
  );

  const navigation = useNavigation();
  const autoScreen = useAutoScreen();
  const isDarkMode = getDarkModePreference();

  return (
    <View
      style={{
        backgroundColor:  isDarkMode
              ? colorSystem.dark.card
              : colorSystem.light.card,
        width: autoScreen,
        gap: 8,
        padding: 16,
      }}>
      <View
        style={{flexDirection: 'row', justifyContent: 'space-between', gap: 8}}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={{width: 32, height: 37, padding: 3}}>
          <Back_btn
            style={{color: isDarkMode ? '#ffffff' : '#212121'}}
            width={'100%'}
            height={'100%'}
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            gap: 8,
            padding: 8,
            backgroundColor: isDarkMode
              ? colorSystem.dark.background
              : colorSystem.light.background,

            borderRadius: 6,
          }}>
          <TextInput
            value={isSearching}
            onChangeText={text => {
              setSearching(text);
              getSearch(isSearching);
            }}
            onSubmitEditing={() => {
              getSearch(isSearching);
            }}
            placeholder="Cari atau masukkan nama produk"
            style={{
              flex: 1,
              fontSize: 13,
              color: isDarkMode ? 'white' : 'black',
              fontFamily: 'Gilroy-Regular',
              height: 20,
              padding: 0,
            }}
            placeholderTextColor="#9E9E9E"
            numberOfLines={1}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => getSearch(isSearching)}
            style={{height: 20}}>
            <Search_btn style={{color: '#818994'}} width={22} height="100%" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default SearchBar;
