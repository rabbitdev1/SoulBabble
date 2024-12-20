import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {configureNotifications} from '../components/context/NotificationService';
import JailMonkey from 'jail-monkey';
import RNExitApp from 'react-native-exit-app';
interface ParsedSetting {
  favicon: string;
}
const SplashScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const [parsedSetting, setParsedSetting] = useState<ParsedSetting | null>(
    null,
  );

  const performTimeConsumingTask = async () => {
    return new Promise(resolve =>
      setTimeout(() => {
        resolve('result');
      }, 4500),
    );
  };

  useEffect(() => {
    configureNotifications();
    fetchData();
    fetchParsedSetting();
    // checkRootStatus();
  }, []);

  const checkRootStatus = async () => {
    if (JailMonkey.isJailBroken()) {
      console.log('Perangkat di-jailbreak.');

      RNExitApp.exitApp();
    } else {
      console.log('Perangkat tidak di-jailbreak.');
    }
  };

  const fetchData = async () => {
    const data = await performTimeConsumingTask();
    if (data !== null) {
      action();
    }
  };

  const fetchParsedSetting = async () => {
    const parsedSettingStr = await AsyncStorage.getItem('isWebSetting');
    if (parsedSettingStr) {
      const parsedResponse: ParsedSetting = JSON.parse(parsedSettingStr);
      setParsedSetting(parsedResponse);
    }
  };

  const action = async () => {
    const Intro = await AsyncStorage.getItem('Intro');
    if (Intro === '1') {
      navigation.replace('DrawerScreen');
    } else {
      navigation.replace('Introduction');
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar
        barStyle="dark-content"
        hidden={false}
        backgroundColor="transparent"
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        {parsedSetting && parsedSetting.favicon && (
          <FastImage
            source={{uri: parsedSetting.favicon}}
            resizeMode={FastImage.resizeMode.contain}
            style={{width: '50%', aspectRatio: 1 / 1}}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
export default SplashScreen;
