import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const levelMap = ['somehow', '', 'very'];

export default class Tag extends React.Component {
    constructor(props) {
        super(props);
        this.styles = StyleSheet.create({
            tag: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: props.tag.color,
                padding: 10,
                margin: 5,
                borderRadius: 20
            },
            text: {
                color: 'white',
            },
            icon: {
                marginLeft: 2
            }
        });
    }

    render() {
        const { tag, text, icon } = this.styles;
        const { name, level } = this.props.tag;
        return (
            <TouchableOpacity style={tag} onPress={this.props.onPress}>
                <Text style={text}> {`${levelMap[level] || ''} ${name}`.toUpperCase()} </Text>
                {this.props.selected && (
                    <Icon style={[icon, text]} name="close" size={15} />
                )}
            </TouchableOpacity>
        );
    }
}
