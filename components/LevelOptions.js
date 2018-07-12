import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Tag from './Tag';

// returns three different tags from one with different levels
function levelTag(tag, addTag) {
    const leveledTags = [];
    for (let i = 0; i < 3; i++) {
        const leveledTag = { ...tag, level: i };
        leveledTags.push(
            <Tag
                onPress={() => addTag(leveledTag)}
                key={i}
                tag={leveledTag}
            />
        );
    }
    return leveledTags;
}

const LevelOptions = props => {
    return (
        <View style={styles.overlay}>
            {levelTag(props.tag, props.addTag)}
            <TouchableOpacity onPress={props.onCancel}>
                <Text> + </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, .8)'
    }
});

export default LevelOptions;
