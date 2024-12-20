import PushNotification, {Importance} from 'react-native-push-notification';

export const createChannel = (channelId: string, channelName: string): void => {
  PushNotification.createChannel(
    {
      channelId: channelId,
      channelName: channelName,
      importance: Importance.HIGH,
      playSound: true,
      vibrate: true,
    },
    created => console.log(`createChannel returned '${created}'`),
  );
};

interface LocalNotification {
  header: string;
  message: string;
  imageUrl: string;
  deepLink: string;
  channelId: string;
}

export const sendLocalNotification = ({
  header,
  message,
  imageUrl,
  deepLink,
  channelId,
}: LocalNotification): void => {
  createChannel(channelId, 'Dynamic Channel');
  PushNotification.localNotification({
    title: header,
    message: message,
    channelId: channelId,
    largeIconUrl: imageUrl,
    bigPictureUrl: imageUrl,
    playSound: true,
    soundName: 'default',
    userInfo: {link: deepLink},
  });
};
