import React from 'react';
import {
    Text,
    Button,
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput
} from 'react-native';

class Note extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: props.text,
            editing: false
        };
    }

    handleChange(text) {
        console.log(text);
        this.setState({
            text
        });
    }

    handleSave() {
        this.props.updateNote(this.state.text);
        this.setState({editing: false});
    }

    render() {
        if (this.state.editing) {
            return (
                <View style={styles.notepad}>
                    <TextInput
                        style={styles.input}
                        multiline={true}
                        defaultValue={this.state.text}
                        numberOfLines={10}
                        onChangeText={(text) => this.handleChange(text)}
                    />
                    <Button
                        title="Save"
                        onPress={() => this.handleSave()}
                    />
                </View>
            );
        }
        return (
            <View>
                <Text style={styles.title}> Note </Text>
                <TouchableOpacity>
                    <Text> ✎ </Text>
                </TouchableOpacity>
                <Text> {this.state.text} </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    notepad: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(255, 255, 255, .95)'
    },
    input: {
        height: 200,
        fontSize: 15,
    },
    title: {
        fontSize: 24,
    }
});

export default Note;
