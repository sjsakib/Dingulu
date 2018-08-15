import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HeaderIcon = ({ navigation }) => (
    <TouchableOpacity style={{padding: 10}} onPress={() => navigation.openDrawer()}>
        <Icon color="#555" name="menu" size={28}/>
    </TouchableOpacity>
)

export default HeaderIcon;
