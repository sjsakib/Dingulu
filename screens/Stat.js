import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    AsyncStorage,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    DatePickerAndroid,
} from 'react-native';
import { HeaderIcon, TagListItem } from '../components';
import populate from '../populate';

class Stat extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        drawerLabel: 'Stat',
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
            dates.push(d.toLocaleDateString());
        }
        const pairs = await AsyncStorage.multiGet(dates);

        let total = pairs.length;

        const tags = {};

        pairs.forEach(([d, str]) => {
            const data = JSON.parse(str);

            if (!data) {
                total--;
                return;
            }

            data.selected.forEach(({ name, level, color }) => {
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
                tag.percentage = Math.round(tag.count / total * 100);
                
                const lTag = tag.levels[level];
                lTag.count++;
                lTag.percentage = Math.round(lTag.count / total * 100);
                lTag.dates.push(d);
            });
        });

        const tagList = [];
        Object.entries(tags).forEach(([tagName, data]) => {
            tagList.push({ name: tagName, ...data });
        });

        tagList.sort((t1, t2) => t1.count < t2.count);

        this.setState({
            data: tagList,
            isReady: true
        });
    }

    async setRange(point) {
        const date = point === 'start' ? this.state.start : this.state.end;
        const { action, year, month, day } = await DatePickerAndroid.open({
            date,
            maxDate: new Date(),
        })
        if (action === DatePickerAndroid.dismissedAction) return;
        this.setState({
            [point]: new Date(year, month, day),
            isReady: false,
        });
        this.load();
    }

    render() {
        if (!this.state.isReady) return <ActivityIndicator />;

        const startString = this.state.start.toLocaleDateString('en-US', dateOptions);
        const endString = this.state.end.toLocaleDateString('en-US', dateOptions);

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
                renderItem={({ item }) => <TagListItem navigate={this.props.navigation.navigate} {...item} />}
                keyExtractor={item => item.name}
            />
            </View>
        );
    }
}

const dateOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
};

const styles = StyleSheet.create({
    header: {
        fontSize: 30,
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 20,
        fontWeight: "400",
    }
});

export default Stat;