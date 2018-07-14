import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    AsyncStorage,
} from 'react-native';
import { HeaderIcon } from '../components';
import populate from '../populate';

class Stat extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        drawerLabel: '',
        headerTitle: new Date().toDateString(),
        headerLeft: <HeaderIcon navigation={navigation} />
    });

    constructor(props) {
        super(props);

        const start = new Date();
        start.setDate(1);
        this.state = {
            start,
            end: new Date(),
        }
    }

    componentDidMount() {
        // populate();
        this.load();
    }

    async load() {
        console.log('loading...');
        const { start, end } = this.state;
        const dates = [];
        for (let d = new Date(start); d < end; d.setDate(d.getDate()+1)) {
            dates.push(d.toLocaleDateString());
        }
        const pairs = await AsyncStorage.multiGet(dates);
        console.log(pairs);
    }

    render() {
        return <Text> Hi </Text>;
    }
}

export default Stat;