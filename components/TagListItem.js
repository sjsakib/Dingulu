import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import dateString from '../utilities/dateString';

function leveledTag(name, level) {
    const levelMap = ['somehow', '', 'very'];
    return `${levelMap[level] || ''} ${name}`;
}

const DateListItem = props => {
    const dateStr = dateString(new Date(props.date), 'long');
    return (
        <TouchableOpacity
            style={[styles.container, styles.grandchild]}
            onPress={() => props.showDate(props.date)}
            >
            <Text>{dateStr}</Text>
        </TouchableOpacity>
    );
};

class SubTagListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        };
    }

    toggleExpansion() {
        this.setState({
            expanded: !this.state.expanded
        });
    }

    render() {
        return (
            <View>
                <TouchableOpacity
                    style={[styles.container, styles.child, {backgroundColor: this.props.color}]}
                    onPress={() => this.toggleExpansion()}>
                    <View style={styles.side}>
                        <Icon
                            name={
                                this.state.expanded
                                    ? 'expand-more'
                                    : 'chevron-right'
                            }
                            size={30}
                            color="white"
                        />
                        <Text style={styles.white}>
                            {leveledTag(
                                this.props.name,
                                this.props.level
                            ).toUpperCase()}
                        </Text>
                    </View>
                    <View style={styles.side}>
                        <Text style={styles.white}>
                            {this.props.count}   {this.props.percentage}%
                        </Text>
                    </View>
                </TouchableOpacity>
                {this.state.expanded && (
                    <FlatList
                        data={this.props.dates}
                        renderItem={({ item }) => (
                            <DateListItem
                                showDate={this.props.showDate}
                                date={item}
                            />
                        )}
                        keyExtractor={(item, index) => item}
                    />
                )}
            </View>
        );
    }
}

export default class TagListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        };
    }

    toggleExpansion() {
        this.setState({
            expanded: !this.state.expanded
        });
    }

    render() {
        return (
            <View>
                <TouchableOpacity
                    style={[styles.container, {backgroundColor: this.props.color}]}
                    onPress={() => this.toggleExpansion()}>
                    <View style={styles.side}>
                        <Icon
                            name={
                                this.state.expanded
                                    ? 'expand-more'
                                    : 'chevron-right'
                            }
                            size={30}
                            color={'white'}
                        />
                        <Text style={styles.white}>{this.props.name.toUpperCase()}</Text>
                    </View>
                    <View style={styles.side}>
                        <Text style={styles.white}>
                            {this.props.count}   {this.props.percentage}%
                        </Text>
                    </View>
                </TouchableOpacity>
                {this.state.expanded && (
                    <FlatList
                        data={this.props.levels}
                        renderItem={({ item, index }) => (
                            <SubTagListItem
                                name={this.props.name}
                                level={index}
                                showDate={this.props.showDate}
                                color={this.props.color}
                                {...item}
                            />
                        )}
                        keyExtractor={(item, index) => 'level-' + index}
                    />
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: 10,
    },
    side: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    child: {
        margin: 2,
        borderRadius: 20
    },
    grandchild: {
        marginLeft: 20,
        margin: 2,
        borderRadius: 10,
    },
    white: {
        color: 'white',
    },
});