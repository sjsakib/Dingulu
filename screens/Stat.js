import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    AsyncStorage,
    FlatList,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
    DatePickerAndroid
} from 'react-native';
import { HeaderIcon, TagListItem } from '../components';
import populate from '../populate';
import dateString from '../utilities/dateString';

class Stat extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        drawerLabel: 'Stat'
    });

    constructor(props) {
        super(props);

        const start = new Date();
        start.setDate(1);
        this.state = {
            start,
            end: new Date(),
            isReady: false
        };
    }

    componentDidMount() {
        // populate();
        this.load();
    }

    async load() {
        const { start, end } = this.state;
        const dates = [];
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            dates.push(dateString(d, 'key'));
        }
        const pairs = await AsyncStorage.multiGet(dates);

        let totalDays = pairs.length;

        const tags = {};

        for (let i = 0; i < pairs.length; i++) {
            const [d, str] = pairs[i];

            const data = JSON.parse(str);

            if (!data) {
                totalDays--;
                continue;
            }

            for (let j = 0; j < data.selected.length; j++) {
                const { name, level, color } = data.selected[j];

                if (tags[name] === undefined) {
                    tags[name] = {
                        count: 0,
                        color,
                        levels: [
                            { count: 0, dates: [] },
                            { count: 0, dates: [] },
                            { count: 0, dates: [] }
                        ]
                    };
                }
                const tag = tags[name];
                tag.count++;
                tag.percentage = Math.round(tag.count / totalDays * 100);

                const lTag = tag.levels[level];
                lTag.count++;
                lTag.percentage = Math.round(lTag.count / totalDays * 100);
                lTag.dates.push(d);
            }
        }

        const tagList = [];
        const names = Object.keys(tags);
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            tagList.push({ name: name, ...tags[name] });
        }

        tagList.sort((t1, t2) => {
            if (t1.count > t2.count) return -1;
            else if (t1.count === t2.count) return 0;
            return 1;
        });

        this.setState({
            data: tagList,
            isReady: true,
            totalDays
        });
    }

    async setRange(point) {
        const date = point === 'start' ? this.state.start : this.state.end;
        const { action, year, month, day } = await DatePickerAndroid.open({
            date,
            maxDate: new Date()
        });
        if (action === DatePickerAndroid.dismissedAction) return;
        this.setState({
            [point]: new Date(year, month, day),
            isReady: false
        });
        this.load();
    }

    render() {
        if (!this.state.isReady) return <ActivityIndicator />;

        const startString = dateString(this.state.start, 'short');
        const endString = dateString(this.state.end, 'short');

        return (
            <View>
                <View style={styles.header}>
                    <HeaderIcon navigation={this.props.navigation} />
                    <TouchableOpacity onPress={() => this.setRange('start')}>
                        <Text>{startString}</Text>
                    </TouchableOpacity>
                    <Text>to</Text>
                    <TouchableOpacity onPress={() => this.setRange('end')}>
                        <Text>{endString}</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={this.state.data}
                    renderItem={({ item }) => (
                        <TagListItem
                            navigate={this.props.navigation.navigate}
                            {...item}
                        />
                    )}
                    keyExtractor={item => item.name}
                    ListHeaderComponent={
                        <View style={styles.listHeader}>
                            <Text>Total {this.state.totalDays} days recorded</Text>
                        </View>
                    }
                />
                <ScrollView>
                    <Text> {this.state.toLog} </Text>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        fontSize: 30,
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    headerText: {
        fontSize: 20,
        fontWeight: '400'
    },
    listHeader: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    }
});

export default Stat;