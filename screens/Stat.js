import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    AsyncStorage,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { HeaderIcon, TagListItem } from '../components';
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
        for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
            dates.push(d.toLocaleDateString());
        }
        const pairs = await AsyncStorage.multiGet(dates);

        const total = pairs.length;

        const tags = {};
        console.log(pairs);

        pairs.forEach(([d, str]) => {
            const data = JSON.parse(str);

            console.log(data);
            data.selected.forEach(({ name, level, color }) => {
                if (tags[name] === undefined) {
                    tags[name] = {
                        count: 0,
                        levels: [
                            { count: 0, dates: [] },
                            { count: 0, dates: [] },
                            { count: 0, dates: [] }
                        ]
                    };
                }
                const tag = tags[name];
                tag.count++;
                tag.percentage = (tag.count / total * 100).toFixed(2);
                
                const lTag = tag.levels[level];
                lTag.count++;
                lTag.percentage = (lTag.count / total * 100).toFixed(2);
                lTag.dates.push(d);
            });
        });

        const tagList = [];
        Object.entries(tags).forEach(([tagName, data]) => {
            tagList.push({ name: tagName, ...data });
        });

        tagList.sort((t1, t2) => t1.count < t2.count);
        console.log(tagList);

        this.setState({
            data: tagList,
            isReady: true
        });
    }

    render() {
        if (!this.state.isReady) return <ActivityIndicator />;

        return (
            <FlatList
                data={this.state.data}
                renderItem={({ item }) => <TagListItem key={item.name} {...item} />}
                keyExtractor={item => item.name}
            />
        );
    }
}

export default Stat;