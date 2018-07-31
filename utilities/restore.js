import { AsyncStorage, ToastAndroid } from 'react-native';
import scheduleNotification from './scheduleNotification';

const url = 'https://www.googleapis.com/drive/v3/files';

async function restore(accessToken) {
    const headers = new Headers({
        Authorization: `Bearer ${accessToken}`
    });
    const listRes = await fetch(url + '?spaces=appDataFolder', {
        headers
    });
    const listData = await listRes.json();
    if (listData.files.length === 0) return false;

    const backupFileId = listData.files[0].id;

    try {
        ToastAndroid.show('Restoring your data, please wait...', ToastAndroid.SHORT);
        const fileRes = await fetch(url + `/${backupFileId}?alt=media`, { headers });

        const data = await fileRes.json();

        await AsyncStorage.clear();
        await AsyncStorage.multiSet(data);
        ToastAndroid.show('Restored successfully!', ToastAndroid.SHORT);
    } catch (e) {
        ToastAndroid.show('Failed to restore. Try signing in again.', ToastAndroid.LONG);
    }

    const notificationTime = await AsyncStorage.getItem('notificationTime');
    if (!notificationTime) return true;
    scheduleNotification(...notificationTime.split(':').map(Number));

    return true;
}

export default restore;
