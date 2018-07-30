import React from 'react';
import { View, StyleSheet } from 'react-native';

const Seperator = () => <View style={styles.seperator} />;

const styles = StyleSheet.create({
    seperator: {
        height: 1,
        backgroundColor: '#e1e8ee'
    }
});

export default Seperator;
