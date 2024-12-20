import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import {sendLocalNotification} from './NotifService';
import { isTokenNotify } from '../../../store/actions/todoActions';
import store from '../../../store';

interface Token {
  token: string;
}

export const configureNotifications = (): void => {
  PushNotification.configure({
    onRegister: onRegister,
    onNotification: onNotification,
    onAction: onAction,
    onRegistrationError: onRegistrationError,
    // senderID: 'YOUR_SENDER_ID',
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
  });

  messaging().onMessage(onMessage);
  messaging().setBackgroundMessageHandler(onBackgroundMessage);
};

const onRegister = (token: Token): void => {
  AsyncStorage.setItem('tokenNotif', token.token);
  console.log('Device Token:', token);

  store.dispatch(isTokenNotify(token?.token));
};

const onNotification = (notification: any): void => {
  console.log('Notification:', notification);
};

const onAction = (notification: any): void => {
  console.log('Action:', notification);
};

const onRegistrationError = (err: Error): void => {
  console.error('Registration Error:', err.message, err);
};

const onMessage = async (message: any): Promise<void> => {
  console.log('Foreground Message:', message);
  console.log(message?.notification);
  console.log(message?.notification?.android?.smallIcon);
  console.log(message?.notification?.body);
  console.log(message?.notification?.title);

  sendLocalNotification({
    header: message?.notification?.title,
    message: message?.notification?.body,
    imageUrl: message?.notification?.android?.imageUrl,
    deepLink: message?.notification?.android?.smallIcon,
    channelId: message?.messageId,
  });
};

const onBackgroundMessage = async (message: any): Promise<void> => {
  console.log('Background Message:', message);
  sendLocalNotification({
    header: message?.notification?.title,
    message: message?.notification?.body,
    imageUrl: message?.notification?.android?.imageUrl,
    deepLink: message?.notification?.android?.smallIcon,
    channelId: message?.messageId,
  });
};
