import React from 'react';
import { Text, View } from 'react-native';

export default class TagListItem extends React.Component {
    render() {
        return (
            <View>
                <Text> {this.props.name} - {this.props.count} </Text>
            </View>
        )
    }
}
