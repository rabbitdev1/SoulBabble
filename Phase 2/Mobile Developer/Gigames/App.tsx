import AsyncStorage from '@react-native-async-storage/async-storage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect, useRef} from 'react';
import {Text, View, useColorScheme} from 'react-native';
import SideBar from './src/layout/SideBar';
import SplashScreen from './src/layout/SplashScreen';
import AccountPages from './src/screens/Account';
import Homepages from './src/screens/Homepages';
import {apiClient} from './utils/api/apiClient';

import Account_btn from './src/assets/TabBar/ic_account.svg';
import Homepages_btn from './src/assets/TabBar/ic_house.svg';
import Topup_btn from './src/assets/TabBar/ic_topup.svg';
import Transaction_btn from './src/assets/TabBar/ic_transaction.svg';

import DropdownAlert, {
  DropdownAlertData,
  DropdownAlertType,
} from 'react-native-dropdownalert';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import useAutoScreen from './src/components/context/useAutoScreen';
import IntroductionScreen from './src/layout/IntroductionScreen';
import LoginPages from './src/screens/Authentication';
import ForgotPasswordPages from './src/screens/Authentication/forgotPassword';
import OtpScreenPages from './src/screens/Authentication/OTP';
import ProductPages from './src/screens/DetailProducts';
import ReivewPages from './src/screens/DetailProducts/AllReview';
import NextStepPages from './src/screens/DetailProducts/NextStep';
import SearchPage from './src/screens/Homepages/SearchPage';
import CheckInvoicepages from './src/screens/Invoice/CheckInvoice';
import DetailInvoicePages from './src/screens/Invoice/DetailInvoice';
import {
  isLogin,
  isLogOut,
  isProfile,
  isSession,
  isWebSetting,
  setDropdownAlert,
} from './store/actions/todoActions';
import {RootState} from './store/reducers/index';
import LoadingData from './utils/LoadingData';
import Modal from 'react-native-modalbox';
import DynamicButton from './src/components/common/DynamicButton';
import DynamicText from './src/components/common/DynamicText';
import HistoryPages from './src/screens/Invoice';
import EditProfilepages from './src/screens/Account/EditProfile';
import EditPasswordpages from './src/screens/Account/EditPassword';
import TopupPages from './src/screens/Saldo/Topup';
import SaldoPages from './src/screens/Saldo';
import LogSaldoPages from './src/screens/Saldo/LogSaldo';
import TukarPointPages from './src/screens/Saldo/TukarPoint';
import GiftCardPages from './src/screens/Saldo/GiftCard';
import MembershipPages from './src/screens/Saldo/Membership';
import FAQPages from './src/screens/Utils/FAQ';
import TermConditionalPages from './src/screens/Utils/TermConditional';
import PrivacyPages from './src/screens/Utils/Privacy';
import NotificationListPages from './src/screens/Utils/NotificationList';
import DaftarLayananPages from './src/screens/Utils/DaftarLayanan';
import DetailBlogPages from './src/screens/Blog/DetailBlog';
import BlogPages from './src/screens/Blog';
import FastImage from 'react-native-fast-image';
import SearchPages from './src/screens/Blog/search';
import DukunganPages from './src/screens/Utils/Dukungan';
import {getDarkModePreference} from './src/components/common/darkModePreference';
import LogoutModal from './src/components/ui/LogoutModal';
import EndModal from './src/components/ui/EndModal';
import UpdateVersionModal from './src/components/ui/UpdateVersionModal';
import PopupModal from './src/components/ui/PopupModal';
import LeaderBoardPages from './src/screens/Utils/LeaderBoard';
import EditPinpages from './src/screens/Account/EditPin';
import SaveIDPages from './src/screens/Utils/SaveID';

export type RootStackParamList = {
  Splash: any;
  Introduction: any;
  DrawerScreen: any;
  Search: any;
  Details: any;
  NextStep: any;
  Reviews: any;
  CheckInvoice: any;
  Invoice: any;
  Login: any;
  Home: any;
  ForgotPassword: any;
  OTP: any;
  Account: any;
  EditProfle: any;
  EditPassword: any;
  Topup: any;
  LogSaldo: any;
  Saldo: any;
  TukarPoint: any;
  GiftCard: any;
  Membership: any;
  FAQ: any;
  TermConditional: any;
  Privacy: any;
  NotificationList: any;
  DaftarLayanan: any;
  DetailBlog: any;
  Blog: any;
  SearchBlog: any;
  Dukungan: any;
  LeaderBoard: any;
  EditPin:any;
  SaveID:any;
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

function DrawerScreen() {
  const isDarkMode = getDarkModePreference();
  const autoScreen = useAutoScreen();
  const colorSystem = useSelector(
    (state: RootState) => state.todoReducer.colorSystem,
  );
  return (
    <Drawer.Navigator
      initialRouteName="Tabbar"
      drawerContent={props => <SideBar {...props} />}
      screenOptions={{
        drawerStyle: {
          width: autoScreen - 100,
          borderRadius: 0,
          backgroundColor: isDarkMode
          ? colorSystem.dark.background
          : colorSystem.light.background,
        },
      }}>
      <Drawer.Screen
        options={{header: () => null}}
        name="Tabbar"
        component={Tabbar}
      />
    </Drawer.Navigator>
  );
}

function Tabbar() {
  const isDarkMode = getDarkModePreference();
  const autoScreen = useAutoScreen();
  const isLogin = useSelector((state: RootState) => state.todoReducer.isLogin);
  const colorSystem = useSelector(
    (state: RootState) => state.todoReducer.colorSystem,
  );
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        animation: 'slide_from_right',
        tabBarStyle: {
          height: 60,
          backgroundColor: isDarkMode
          ? colorSystem.dark.card
          : colorSystem.light.card,
        },
        tabBarIcon: ({focused}) => {
          const color = focused
            ? colorSystem.light.primary
            : isDarkMode
            ? '#f3f3f3'
            : '#616161';
          const iconSize = 22;
          const iconStyle = {color, width: iconSize, height: iconSize};
          const textStyle = {
            fontFamily: focused ? 'Gilroy-SemiBold' : 'Gilroy-Regular',
            fontSize: 12,
            color: focused
              ? isDarkMode
                ? '#ffffff'
                : '#45424f'
              : isDarkMode
              ? '#f3f3f3'
              : '#616161',
          };
          if (route.name === 'Home') {
            return (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 4,
                  height: '100%',
                  width: autoScreen / 4,
                }}>
                <Homepages_btn style={iconStyle} />
                <DynamicText style={textStyle}>Home</DynamicText>
              </View>
            );
          } else if (route.name === 'Transation') {
            return (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 4,
                  height: '100%',
                  width: autoScreen / 4,
                }}>
                <Transaction_btn style={iconStyle} />
                <DynamicText style={textStyle}>Transaksi</DynamicText>
              </View>
            );
          } else if (route.name === 'Saldo') {
            return (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 4,
                  height: '100%',
                  width: autoScreen / 4,
                }}>
                <Topup_btn style={iconStyle} />
                <DynamicText style={textStyle}>Topup</DynamicText>
              </View>
            );
          } else if (route.name === 'Account') {
            return (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 4,
                  height: '100%',
                  width: autoScreen / 4,
                }}>
                <Account_btn style={iconStyle} />
                <DynamicText style={textStyle}>Akun</DynamicText>
              </View>
            );
          }
        },
        tabBarShowLabel: false,
      })}>
      <Tab.Screen
        name="Home"
        options={{header: () => null}}
        component={Homepages}
      />
      <Tab.Screen
        name="Transation"
        options={{header: () => null}}
        component={isLogin ? HistoryPages : CheckInvoicepages}
      />
      {isLogin ? (
        <Tab.Screen
          name="Saldo"
          options={{header: () => null}}
          component={SaldoPages}
        />
      ) : null}
      <Tab.Screen
        name="Account"
        options={{header: () => null, unmountOnBlur: true}}
        component={AccountPages}
      />
    </Tab.Navigator>
  );
}

const App = () => {
  const dispatch = useDispatch();
  const autoScreen = useAutoScreen();
  const isDropdownAlert = useSelector(
    (state: RootState) => state.todoReducer.isDropdownAlert,
  );
  const logOut = useSelector((state: RootState) => state.todoReducer.isLogOut);
  const session = useSelector(
    (state: RootState) => state.todoReducer.isSession,
  );
  const isWebSettingView = useSelector(
    (state: RootState) => state.todoReducer.isWebSetting,
  );
  const updateApp = useSelector(
    (state: RootState) => state.todoReducer.isWebSetting,
  );
  const popupHome = useSelector(
    (state: RootState) => state.todoReducer.isPopup,
  );
  const isDarkMode = getDarkModePreference();
  let alert = useRef(
    (_data?: DropdownAlertData) => new Promise<DropdownAlertData>(res => res),
  );
  useEffect(() => {
    if (isDropdownAlert.type !== '') {
      setTimeout(async () => {
        await alert.current({
          type:
            isDropdownAlert?.type === 'error'
              ? DropdownAlertType.Error
              : isDropdownAlert?.type === 'success'
              ? DropdownAlertType.Success
              : isDropdownAlert?.type === 'warn'
              ? DropdownAlertType.Warn
              : DropdownAlertType.Info,
          title: isDropdownAlert?.title,
          message: isDropdownAlert?.message,
        });
      }, 100);
      dispatch(setDropdownAlert('', '', ``));
    }
  }, [isDropdownAlert]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchParsed = async () => {
    const webbSettingString = await AsyncStorage.getItem('isWebSetting');
    if (webbSettingString !== null) {
      const parsedwebSetting = JSON.parse(webbSettingString);
      dispatch(isWebSetting(parsedwebSetting));
    }

    const profileString = await AsyncStorage.getItem('isProfile');
    if (profileString !== null) {
      const parsedProfile = JSON.parse(profileString);
      dispatch(isProfile(parsedProfile));
    }

    const loginString = await AsyncStorage.getItem('isLogin');
    if (loginString !== null) {
      const parsedLogin = JSON.parse(loginString);
      dispatch(isLogin(parsedLogin));
    }
  };

  const fetchData = async () => {
    try {
      const response = await apiClient({
        baseurl: 'user/web_setting',
        method: 'GET',
      });
      if (response?.statusCode === 200) {
        await AsyncStorage.setItem(
          'isWebSetting',
          JSON.stringify(response?.result),
        );
        setTimeout(() => {
          fetchParsed();
        }, 1000);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const linking = {
    prefixes: ['https://www.gigames.id', 'gigames://'],
    config: {
      screens: {
        Home: 'home',
        Details: 'details/:id',
      },
    },
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <NavigationContainer linking={linking}>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen
            name="Splash"
            options={{animationEnabled: true, header: () => null}}
            component={SplashScreen}
          />
          <Stack.Screen
            name="Introduction"
            options={{animationEnabled: true, header: () => null}}
            component={IntroductionScreen}
          />
          <Stack.Screen
            name="DrawerScreen"
            options={{animationEnabled: true, header: () => null}}
            component={DrawerScreen}
          />
          <Stack.Screen
            name="Search"
            options={{animationEnabled: true, header: () => null}}
            component={SearchPage}
          />
          <Stack.Screen
            name="Details"
            options={{animationEnabled: true, header: () => null}}
            component={ProductPages}
          />
          <Stack.Screen
            name="NextStep"
            options={{animationEnabled: true, header: () => null}}
            component={NextStepPages}
          />
          <Stack.Screen
            name="Reviews"
            options={{animationEnabled: true, header: () => null}}
            component={ReivewPages}
          />
          <Stack.Screen
            name="CheckInvoice"
            options={{animationEnabled: true, header: () => null}}
            component={CheckInvoicepages}
          />
          <Stack.Screen
            name="Invoice"
            options={{animationEnabled: true, header: () => null}}
            component={DetailInvoicePages}
          />
          <Stack.Screen
            name="Login"
            options={{animationEnabled: true, header: () => null}}
            component={LoginPages}
          />
          <Stack.Screen
            name="ForgotPassword"
            options={{animationEnabled: true, header: () => null}}
            component={ForgotPasswordPages}
          />
          <Stack.Screen
            name="OTP"
            options={{animationEnabled: true, header: () => null}}
            component={OtpScreenPages}
          />
          <Stack.Screen
            name="EditProfle"
            options={{animationEnabled: true, header: () => null}}
            component={EditProfilepages}
          />
          <Stack.Screen
            name="EditPassword"
            options={{animationEnabled: true, header: () => null}}
            component={EditPasswordpages}
          />
          <Stack.Screen
            name="EditPin"
            options={{animationEnabled: true, header: () => null}}
            component={EditPinpages}
          />
          <Stack.Screen
            name="Topup"
            options={{animationEnabled: true, header: () => null}}
            component={TopupPages}
          />
          <Stack.Screen
            name="LogSaldo"
            options={{animationEnabled: true, header: () => null}}
            component={LogSaldoPages}
          />
          <Stack.Screen
            name="TukarPoint"
            options={{animationEnabled: true, header: () => null}}
            component={TukarPointPages}
          />
          <Stack.Screen
            name="GiftCard"
            options={{animationEnabled: true, header: () => null}}
            component={GiftCardPages}
          />
          <Stack.Screen
            name="Membership"
            options={{animationEnabled: true, header: () => null}}
            component={MembershipPages}
          />
          <Stack.Screen
            name="FAQ"
            options={{animationEnabled: true, header: () => null}}
            component={FAQPages}
          />
          <Stack.Screen
            name="TermConditional"
            options={{animationEnabled: true, header: () => null}}
            component={TermConditionalPages}
          />
          <Stack.Screen
            name="Privacy"
            options={{animationEnabled: true, header: () => null}}
            component={PrivacyPages}
          />
          <Stack.Screen
            name="NotificationList"
            options={{animationEnabled: true, header: () => null}}
            component={NotificationListPages}
          />
          <Stack.Screen
            name="DaftarLayanan"
            options={{animationEnabled: true, header: () => null}}
            component={DaftarLayananPages}
          />
          <Stack.Screen
            name="Blog"
            options={{animationEnabled: true, header: () => null}}
            component={BlogPages}
          />
          <Stack.Screen
            name="DetailBlog"
            options={{animationEnabled: true, header: () => null}}
            component={DetailBlogPages}
          />
          <Stack.Screen
            name="SearchBlog"
            options={{animationEnabled: true, header: () => null}}
            component={SearchPages}
          />
          <Stack.Screen
            name="Dukungan"
            options={{animationEnabled: true, header: () => null}}
            component={DukunganPages}
          />
          <Stack.Screen
            name="LeaderBoard"
            options={{animationEnabled: true, header: () => null}}
            component={LeaderBoardPages}
          />
          <Stack.Screen
            name="SaveID"
            options={{animationEnabled: true, header: () => null}}
            component={SaveIDPages}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <LoadingData />
      <DropdownAlert alert={func => (alert.current = func)} />
      <LogoutModal
        isOpen={logOut}
        isDarkMode={isDarkMode}
        isWebSettingView={isWebSettingView}
      />
      <EndModal
        session={session}
        isDarkMode={isDarkMode}
        isWebSettingView={isWebSettingView}
        />
        {/* <UpdateVersionModal
          update={updateApp}
          isDarkMode={isDarkMode}
          isWebSettingView={isWebSettingView}
        /> */}
        <PopupModal
          popop={popupHome}
          isDarkMode={isDarkMode}
          isWebSettingView={isWebSettingView}
        />
    </SafeAreaView>
  );
};

export default App;
