import { AsyncStorage } from 'react-native';
import dateString from './dateString';
import timeString from './timeString';

const uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files';
const listUrl = 'https://www.googleapis.com/drive/v3/files?spaces=appDataFolder';

async function backup(accessToken) {
    const keys = await AsyncStorage.getAllKeys();
    const data = await AsyncStorage.multiGet(keys);

    const headers = new Headers({ Authorization: `Bearer ${accessToken}` });

    const list = await (await fetch(listUrl, { headers })).json();

    let url, method;
    if (list.files.length) {
        url = uploadUrl + '/' + list.files[0].id;
        method = 'PATCH';
    } else {
        url = uploadUrl;
        method = 'POST';
    }
    url += '?uploadType=multipart';

    const metadata = {
        name: 'DinguluBackup',
        parents: ['appDataFolder']
    };

    let body = '\n--foo_bar_baz\nContent-Type: application/json; charset=UTF-8\n\n';
    body += JSON.stringify(metadata);
    body += '\n\n--foo_bar_baz\n';
    body += 'Content-Type: application/json\n\n';
    body += JSON.stringify(data);
    body += '\n--foo_bar_baz--';

    headers.append('Content-Type', 'multipart/related; boundary=foo_bar_baz');
    headers.append('Content-Length', body.length);

    await fetch(url, {
        method,
        headers,
        body
    });

    const d = new Date();
    const dateStr = dateString(d, 'short') + ' ' + timeString(d.getHours(), d.getMinutes());

    AsyncStorage.setItem('lastBackup', dateStr);
}

export default backup;
