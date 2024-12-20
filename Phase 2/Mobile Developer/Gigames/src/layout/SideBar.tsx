import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { getDarkModePreference } from '../components/common/darkModePreference';
import DarkModeToggle from '../components/common/DarkModeToggle';
import DynamicText from '../components/common/DynamicText';

import ArrowLeft_btn from '../assets/icon/ic_arrowleft.svg';
import LeaderBoard_btn from '../assets/icon/ic_leaderboard.svg';

import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import { RootState } from '../../store/reducers';
import Dukungan_btn from '../assets/icon/ic_dukungan.svg';
import FAQ_btn from '../assets/icon/ic_faq.svg';
import List_btn from '../assets/icon/ic_list.svg';
import Privacy_btn from '../assets/icon/ic_privacy.svg';
import Search_btn from '../assets/icon/ic_search.svg';
interface SideBarProps {
  navigation: any;
}
const SideBar: React.FC<SideBarProps> = ({navigation}) => {
  const colorSystem = useSelector(
    (state: RootState) => state.todoReducer.colorSystem,
  );

  const dispatch = useDispatch();
  const isDarkMode = getDarkModePreference();
  const [parsedSetting, setParsedSetting] = useState<any>('');

  useEffect(() => {
    fetchParsed();
  }, []);

  const fetchParsed = async () => {
    const parsedSetting = await AsyncStorage.getItem('isWebSetting');
    if (parsedSetting !== null) {
      const parsedResponse = JSON.parse(parsedSetting);
      setParsedSetting(parsedResponse);
    } else {
      // Handle the case where parsedSetting is null
    }
  };
  return (
    <SafeAreaView>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'column',
            padding: 3,
            gap: 8,
            margin: 16,
            marginBottom: 0,
          }}>
          {parsedSetting && parsedSetting.logo && ( 
            isDarkMode ?
            <FastImage
              source={{uri: parsedSetting?.logo_dark || ''}}
              resizeMode={FastImage.resizeMode.contain}
              style={{
                width: '100%',
                height: 40,
                alignSelf: 'flex-start',
              }}
            />:
            <FastImage
              source={{uri: parsedSetting?.logo || ''}}
              resizeMode={FastImage.resizeMode.contain}
              style={{
                width: '100%',
                height: 40,
                alignSelf: 'flex-start',
              }}
            />
          )}
        </View>
        <View
          style={{
            flex: 1,
            borderRadius: 8,
            backgroundColor: isDarkMode
              ? colorSystem.dark.card
              : colorSystem.light.card,
            margin: 16,
          }}>
          <DynamicText
            size={14}
            bold
            style={{paddingHorizontal: 8, marginTop: 8}}>
            Menu
          </DynamicText>
          <TouchableOpacity
            onPress={() => navigation.navigate('CheckInvoice')}
            activeOpacity={0.7}
            style={{
              flexDirection: 'row',
              overflow: 'hidden',

              padding: 12,
              alignItems: 'center',
              gap: 8,
            }}>
            <Search_btn
              width={24}
              height={24}
              style={{
                color: isDarkMode
                  ? colorSystem.dark.primary
                  : colorSystem.light.primary,
              }}
            />
            <DynamicText size={12} style={{flex: 1}}>
              Cari Transaksi
            </DynamicText>
            <ArrowLeft_btn width={12} height={12} style={{color: '#818994'}} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('LeaderBoard')}
            activeOpacity={0.7}
            style={{
              flexDirection: 'row',
              overflow: 'hidden',
              backgroundColor: isDarkMode
                ? colorSystem.dark.card
                : colorSystem.light.card,
              padding: 12,
              alignItems: 'center',
              gap: 8,
              borderRadius: 6,
            }}>
            <LeaderBoard_btn
              width={24}
              height={24}
              style={{
                color: isDarkMode
                  ? colorSystem.dark.primary
                  : colorSystem.light.primary,
              }}
            />
            <DynamicText size={12} style={{flex: 1}}>
              Leaderboard
            </DynamicText>
            <ArrowLeft_btn width={12} height={12} style={{color: '#818994'}} />
          </TouchableOpacity>
          <DarkModeToggle type="2" />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('DaftarLayanan')}
            style={{
              flexDirection: 'row',
              overflow: 'hidden',

              padding: 12,
              alignItems: 'center',
              gap: 8,
            }}>
            <List_btn
              width={24}
              height={24}
              style={{
                color: isDarkMode
                  ? colorSystem.dark.primary
                  : colorSystem.light.primary,
              }}
            />
            <DynamicText size={12} style={{flex: 1}}>
              Daftar Layanan
            </DynamicText>
            <ArrowLeft_btn width={12} height={12} style={{color: '#818994'}} />
          </TouchableOpacity>

          <DynamicText
            size={14}
            bold
            style={{paddingHorizontal: 8, marginTop: 8}}>
            Navigasi
          </DynamicText>
          <TouchableOpacity
            onPress={() => navigation.navigate('FAQ')}
            activeOpacity={0.7}
            style={{
              flexDirection: 'row',
              overflow: 'hidden',

              padding: 12,
              alignItems: 'center',
              gap: 8,
            }}>
            <FAQ_btn
              width={24}
              height={24}
              style={{
                color: isDarkMode
                  ? colorSystem.dark.primary
                  : colorSystem.light.primary,
              }}
            />
            <DynamicText size={12} style={{flex: 1}}>
              FAQ
            </DynamicText>
            <ArrowLeft_btn width={12} height={12} style={{color: '#818994'}} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Dukungan')}
            style={{
              flexDirection: 'row',
              overflow: 'hidden',

              padding: 12,
              alignItems: 'center',
              gap: 8,
            }}>
            <Dukungan_btn
              width={24}
              height={24}
              style={{
                color: isDarkMode
                  ? colorSystem.dark.primary
                  : colorSystem.light.primary,
              }}
            />
            <DynamicText size={12} style={{flex: 1}}>
              Dukungan Pelanggan
            </DynamicText>
            <ArrowLeft_btn width={12} height={12} style={{color: '#818994'}} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('TermConditional')}
            activeOpacity={0.7}
            style={{
              flexDirection: 'row',
              overflow: 'hidden',

              padding: 12,
              alignItems: 'center',
              gap: 8,
            }}>
            <Privacy_btn
              width={24}
              height={24}
              style={{
                color: isDarkMode
                  ? colorSystem.dark.primary
                  : colorSystem.light.primary,
              }}
            />
            <DynamicText size={12} style={{flex: 1}}>
              Terms and Conditional
            </DynamicText>
            <ArrowLeft_btn width={12} height={12} style={{color: '#818994'}} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Privacy')}
            activeOpacity={0.7}
            style={{
              flexDirection: 'row',
              overflow: 'hidden',

              padding: 12,
              alignItems: 'center',
              gap: 8,
            }}>
            <Privacy_btn
              width={24}
              height={24}
              style={{
                color: isDarkMode
                  ? colorSystem.dark.primary
                  : colorSystem.light.primary,
              }}
            />
            <DynamicText size={12} style={{flex: 1}}>
              Kebijakan Privasi
            </DynamicText>
            <ArrowLeft_btn width={12} height={12} style={{color: '#818994'}} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default SideBar;
