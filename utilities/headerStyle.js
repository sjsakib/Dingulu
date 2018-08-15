import { StyleSheet } from 'react-native';

const headerStyle = StyleSheet.create({
    header: {
        fontSize: 30,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    headerText: {
        color: '#555',
        fontWeight: '500'
    },
    headerLeft: {
        flex: 1,
        alignItems: 'center'
    },
    headerRight: {
        flex: 4,
        alignItems: 'flex-start'
    },
});

export default headerStyle;
