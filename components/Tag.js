import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

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
                color: 'white'
            },
            icon: {
                marginLeft: 5
            }
        });
    }

    render() {
        const { tag, text, icon } = this.styles;
        const { name, level } = this.props.tag;
        return (
            <TouchableOpacity style={tag} onPress={this.props.onPress}>
                <Text style={text}> {`${levelMap[level] || ''} ${name}`} </Text>
                {this.props.selected && (
                    <Text> ˟ </Text>
                )}
            </TouchableOpacity>
        );
    }
}
