import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';

export const checkPermission = () => {
    check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS)
        .then((result) => {
            switch (result) {
                case RESULTS.UNAVAILABLE:
                    console.log('This feature is not available (on this device / in this context)');
                    break;
                case RESULTS.DENIED:
                    console.log('The permission has not been requested / is denied but requestable');
                    break;
                case RESULTS.LIMITED:
                    console.log('The permission is limited: some actions are possible');
                    break;
                case RESULTS.GRANTED:
                    console.log('The permission is granted');
                    break;
                case RESULTS.BLOCKED:
                    console.log('The permission is denied and not requestable anymore');
                    break;
            }
        })
        .catch((error) => {
            console.log(error);
        });
};

export const requestPermission = async() => {
    try {
        if (Platform.OS === 'android') {
            const permissionStatus = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
            if (permissionStatus === RESULTS.GRANTED) {
                console.log('Notification permission granted');
            } else {
                console.log('Permission denied');
            }
        } else {
            // For platforms other than Android (e.g., iOS), adjust with the appropriate permission
            console.log('Platform is not Android');
        }
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        console.log('Permission request failed');
    }
};


export async function requestStoragePermission() {
    try {
        if (Platform.OS === 'android') {
            const permissionStatus = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
            if (permissionStatus === 'granted') {
                console.log('Notification permission granted');
            } else {
                // Alert.alert('Permission denied');
            }
        } else {
            // Untuk platform selain Android (misal: iOS), sesuaikan dengan izin yang sesuai
            console.log('Platform is not Android');
        }
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        // Alert.alert('Permission request failed');
    }
}
export async function requestStoragePermission1() {
    try {
        if (Platform.OS === 'android') {
            const permissionStatus = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
            if (permissionStatus === 'granted') {
                console.log('Notification permission granted');
            } else {
                // Alert.alert('Permission denied');
            }
        } else {
            // Untuk platform selain Android (misal: iOS), sesuaikan dengan izin yang sesuai
            console.log('Platform is not Android');
        }
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        // Alert.alert('Permission request failed');
    }
}