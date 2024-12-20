import {REACT_APP_API, REACT_APP_TOKEN_GORDON} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNSimpleCrypto from 'react-native-simple-crypto';
import {getUserAgent} from 'react-native-user-agent';
import {Toast} from 'toastify-react-native';
import {
  isMaintenanceAction,
  isToManyRequestAction,isSession
} from '../../store/actions/todoActions';
import store from '../../store/index';
interface APIClientOptions {
  baseurl?: string;
  parameter?: string;
  apiKey?: string;
  token?: string;
  method?: string;
  customHeaders?: Record<string, string>;
  XGORDON?: string;
  body?: string | FormData | URLSearchParams | Record<string, any>;
}
const apiClient = async ({
  baseurl = '',
  parameter = '',
  apiKey = '',
  token = '',
  method = 'GET',
  customHeaders,
  XGORDON,
  body,
}: APIClientOptions): Promise<{result: any; statusCode: any} | undefined> => {
  const currentDate = new Date();
  const parseWebSetting = await AsyncStorage.getItem('isWebSetting');
  const parseWebSettingObject = parseWebSetting
    ? JSON.parse(parseWebSetting)
    : null;
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  const formattedDate =
    parseWebSettingObject?.date === `${year}-${month}-${day}`
      ? parseWebSettingObject?.date
      : `${year}-${month}-${day}`;

  const originalString = XGORDON + REACT_APP_TOKEN_GORDON + formattedDate;
  const sha256Hash = await RNSimpleCrypto.SHA.sha256(originalString);
  const headers = {
    method: apiKey ? 'POST' : method,
    headers: {
      'Client-Timezone': `${year}-${month}-${day}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      ...(token && {Authorization: `Bearer ${token}`}),
      XGORGON: sha256Hash,
      'User-Agent': getUserAgent(),
      ...customHeaders,
    },
    ...(body && {body: body.toString()}),
  };

  try {
    const response = await fetch(
      `${REACT_APP_API}` + baseurl + (parameter === '' ? '' : '?' + parameter),
      headers,
    );
    const result = await response.json();
    if (response.status === 200 || response.status === 400) {
      if (result.statusCode === 429) {
        store.dispatch(isToManyRequestAction(true));
      } else {
        return {result, statusCode: response.status};
      }
    } else if (response.status === 503) {
      store.dispatch(isMaintenanceAction(true));
    } else if (response.status === 401) {
      if (
        result.msg === 'unauthorized access' ||
        result.msg === 'Token Expired'
      ) {
        // clearLocalStorageAndRedirect();
        store.dispatch(isSession(true));
      } else if (result.msg === 'Authentication failed.') {
      }
      Toast.success(result.msg);
    } else {
      // throw { result, statusCode: response.status };
    }
  } catch (error) {
    throw error;
  }
};
export {apiClient};
