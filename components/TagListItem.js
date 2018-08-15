import React from 'react';
import { Text, View, StyleSheet, FlatList, TouchableNativeFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import dateString from '../utilities/dateString';

const DateListItem = props => {
    const dateStr = dateString(new Date(props.date), 'long');
    return (
        <TouchableNativeFeedback onPress={() => props.showDate(props.date)}>
            <View style={[styles.container, styles.grandchild]}>
                <Text>{dateStr}</Text>
            </View>
        </TouchableNativeFeedback>
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
                <TouchableNativeFeedback onPress={() => this.toggleExpansion()}>
                    <View style={[styles.container, styles.child, { backgroundColor: this.props.color }]}>
                        <View style={styles.side}>
                            <Icon
                                name={this.state.expanded ? 'expand-more' : 'chevron-right'}
                                size={30}
                                color="white"
                            />
                            <Text style={styles.white}>
                                {(this.props.level + ' ' + this.props.name).toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.side}>
                            <Text style={styles.white}>
                                {this.props.count}    {this.props.percentage}%
                            </Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>
                {this.state.expanded && (
                    <FlatList
                        data={this.props.dates}
                        renderItem={({ item }) => <DateListItem showDate={this.props.showDate} date={item} />}
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
                <TouchableNativeFeedback onPress={() => this.toggleExpansion()}>
                    <View style={[styles.container, { backgroundColor: this.props.color }]}>
                        <View style={styles.side}>
                            <Icon
                                name={this.state.expanded ? 'expand-more' : 'chevron-right'}
                                size={30}
                                color={'white'}
                            />
                            <Text style={styles.white}>{this.props.name.toUpperCase()}</Text>
                        </View>
                        <View style={styles.side}>
                            <Text style={styles.white}>
                                {this.props.count}    {this.props.percentage}%
                            </Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>
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
        paddingRight: 20,
        borderRadius: 15,
        margin: 2,

    },
    side: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    child: {
        margin: 2,
        marginLeft: 30,
        borderRadius: 10,
    },
    grandchild: {
        marginLeft: 50,
        margin: 2,
        borderRadius: 8,
        padding: 8,
    },
    white: {
        color: 'white'
    }
});
