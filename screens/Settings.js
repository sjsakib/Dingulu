import React from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    NativeModules,
    AsyncStorage,
    TouchableNativeFeedback,
    TimePickerAndroid,
    ToastAndroid
} from 'react-native';
import { HeaderIcon, Seperator } from '../components';
import { backup, restore, timeString, scheduleNotification, headerStyle } from '../utilities';
import { GoogleSignin } from 'react-native-google-signin';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { RNGoogleSignin } = NativeModules;

class Settings extends React.Component {
    static navigationOptions = {
        drawerLabel: 'Settings',
        drawerIcon: ({ tintColor }) => <Icon color={tintColor} size={24} name="settings" />
    };

    constructor(props) {
        super(props);

        this.state = {
            notificationTime: '--:--',
            lastBackup: 'loading...',
            googleAccount: null
        };
        this.load();
    }

    async load() {
        let notificationTime = (await AsyncStorage.getItem('notificationTime')) || '22:00';
        let [hour, minute] = notificationTime.split(':').map(Number);

        const googleAccount = await AsyncStorage.getItem('googleAccount');
        let lastBackup = await AsyncStorage.getItem('lastBackup');
        if (!lastBackup) lastBackup = 'Never backed up';
        this.setState({
            notificationTime: timeString(hour, minute),
            googleAccount,
            lastBackup
        });
    }

    async setTime() {
        const { action, hour, minute } = await TimePickerAndroid.open({
            hour: 22,
            minute: 0,
            is24Hour: false
        });
        if (action === TimePickerAndroid.dismissedAction) return;

        scheduleNotification(hour, minute);

        await AsyncStorage.setItem('notificationTime', hour + ':' + minute);

        this.setState({ notificationTime: timeString(hour, minute) });
    }

    async signIn() {
        await GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/drive.appdata']
        });
        if (this.state.googleAccount) {
            await GoogleSignin.signOut();
            this.setState({ googleAccount: null });
            await AsyncStorage.removeItem('googleAccount');
            return;
        }

        try {
            const user = await GoogleSignin.signIn();
            this.setState({ googleAccount: user.email });
            await AsyncStorage.setItem('googleAccount', user.email);

            const accessToken = await RNGoogleSignin.getAccessToken(user);

            if (!(await restore(accessToken))) {
                await backup(accessToken);
            }
        } catch (e) {
            ToastAndroid.show('Failed. Make sure your internet connection is working', ToastAndroid.LONG);
        }
    }

    async backup() {
        ToastAndroid.show('Backing up...', ToastAndroid.SHORT);
        await GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/drive.appdata']
        });
        const user = await GoogleSignin.currentUserAsync();
        if (!user) return;
        const accessToken = await RNGoogleSignin.getAccessToken(user);

        try {
            await backup(accessToken);
            const lastBackup = await AsyncStorage.getItem('lastBackup');
            this.setState({ lastBackup }, () => ToastAndroid.show('Success!', ToastAndroid.SHORT));
        } catch (e) {
            ToastAndroid.show('Failed to backup. Make sure your internet connection is working', ToastAndroid.LONG);
        }
    }

    render() {
        const googleAccount = this.state.googleAccount;

        return (
            <View style={styles.container}>
                <View style={headerStyle.header}>
                    <View style={headerStyle.headerLeft}>
                        <HeaderIcon navigation={this.props.navigation} />
                    </View>
                    <View style={headerStyle.headerRight}>
                        <Text style={headerStyle.headerText}>Settings</Text>
                    </View>
                </View>
                <Seperator />
                <TouchableNativeFeedback onPress={() => this.setTime()}>
                    <View style={styles.timeSetting}>
                        <Text style={styles.settingsText}>Notification time</Text>
                        <Text style={styles.settingsText}>{this.state.notificationTime}</Text>
                        <Text style={styles.note}>New day will be considered after 6am, not 12</Text>
                    </View>
                </TouchableNativeFeedback>
                <Seperator />
                <View style={styles.bottom}>
                    <View style={styles.backup}>
                        <Text style={styles.info}>
                            {googleAccount && `${googleAccount} connected\n`}
                            Last backup: {this.state.lastBackup}
                        </Text>
                        <Text style={styles.infoSmall}>
                            Automatic backup is done every time the app starts, if an a google account is connected and an internet connection is available.
                        </Text>
                        {googleAccount && <Button title="backup now" onPress={() => this.backup()} />}
                        <View style={{ marginTop: 8 }}>
                            <Button
                                title={googleAccount ? 'Disconnect ' : 'Connect a Google account'}
                                onPress={() => this.signIn()}
                            />
                        </View>
                    </View>
                    <Seperator />
                    <TouchableNativeFeedback>
                        <View style={styles.credit}>
                            <Text style={styles.creditText}>Developed by - S.j. Sakib</Text>
                            <Text style={styles.creditText}>sjsakib.bd@gmail.com</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    timeSetting: {
        backgroundColor: 'white',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    settingsText: {
        color: 'black',
        fontWeight: '500',
        fontFamily: 'sans-serif-light'
    },
    bottom: {
        flex: 1
    },
    backup: {
        flex: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    credit: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    creditText: {
        color: 'black',
        fontWeight: '200',
        fontFamily: 'sans-serif-condensed'
    },
    info: {
        color: 'black',
        fontFamily: 'sans-serif-light',
        fontWeight: '500',
        // margin: 20,
        lineHeight: 20,
        textAlign: 'center',
    },
    infoSmall: {
        fontFamily: 'sans-serif-light',
        textAlign: 'center',
        paddingLeft: 30,
        paddingRight: 30,
        marginTop: 5,
        marginBottom: 20,
        fontSize: 12,
    },
    note: {
        marginTop: 5,
        fontFamily: 'sans-serif-light',
    }
});

export default Settings;
