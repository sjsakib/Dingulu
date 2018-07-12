import React from 'react';
import { Button, View, Text } from 'react-native';
import { createDrawerNavigator, createStackNavigator } from 'react-navigation';
import Day from './screens/Day';

const Days = createDrawerNavigator({
    Day: {
        screen: createStackNavigator({ Day: Day })
    }
});

export default Days;
