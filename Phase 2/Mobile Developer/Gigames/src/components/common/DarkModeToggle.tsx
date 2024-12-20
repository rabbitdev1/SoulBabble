import React, {useState, useEffect} from 'react';
import {TouchableOpacity, useColorScheme} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Switch_btn from '../../assets/icon/ic_switch.svg';
import Mode_btn from '../../assets/icon/ic_mode.svg';
import DynamicText from './DynamicText';
import {setDarkModePreference} from '../../../store/actions/todoActions';
import {RootState} from '../../../store/reducers';

const DarkModeToggle = ({type}: {type: string}) => {
  const colorScheme = useColorScheme();
  const [isDarkMode, setDarkMode] = useState(colorScheme === 'dark');
  const dispatch = useDispatch();

  const darkModePreference = useSelector(
    (state: RootState) => state.todoReducer.darkMode,
  );

  const colorSystem = useSelector(
    (state: RootState) => state.todoReducer.colorSystem,
  );

  useEffect(() => {
    setDarkMode(darkModePreference);
  }, [darkModePreference]);

  const toggleDarkMode = () => {
    const newDarkModeValue = !isDarkMode;
    setDarkMode(newDarkModeValue);
    dispatch(setDarkModePreference(newDarkModeValue));
  };

  return type === '2' ? (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={toggleDarkMode}
      style={{
        flexDirection: 'row',
        overflow: 'hidden',
        padding: 12,
        alignItems: 'center',
        gap: 8,
      }}>
      <Mode_btn
        width={24}
        height={24}
        style={{
          color: isDarkMode
            ? colorSystem.dark.primary
            : colorSystem.light.primary,
        }}
      />
      <DynamicText size={12} style={{flex: 1}}>
        Mode Gelap
      </DynamicText>
      <Switch_btn
        width={40}
        height={24}
        style={{
          color: isDarkMode ? colorSystem.dark.primary : '#dddddd',
          transform: [{rotate: isDarkMode ? '0deg' : '180deg'}],
        }}
      />
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={toggleDarkMode}
      style={{
        flexDirection: 'row',
        overflow: 'hidden',
        backgroundColor: isDarkMode
          ? colorSystem.dark.card
          : colorSystem.light.card,
        marginHorizontal: 16,
        padding: 12,
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: isDarkMode
          ? colorSystem.dark.bordercolor
          : colorSystem.light.bordercolor,
        borderRadius: 6,
      }}>
      <Mode_btn
        width={24}
        height={24}
        style={{
          color: isDarkMode
            ? colorSystem.dark.primary
            : colorSystem.light.primary,
        }}
      />
      <DynamicText size={12} style={{flex: 1}}>
        Mode Gelap
      </DynamicText>
      <Switch_btn
        width={40}
        height={24}
        style={{
          color: isDarkMode ? colorSystem.dark.primary : '#dddddd',
          transform: [{rotate: isDarkMode ? '0deg' : '180deg'}],
        }}
      />
    </TouchableOpacity>
  );
};

export default DarkModeToggle;
