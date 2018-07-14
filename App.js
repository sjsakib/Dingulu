import React from 'react';
import { Button, View, Text } from 'react-native';
import { createDrawerNavigator, createStackNavigator } from 'react-navigation';
import Day from './screens/Day';
import Stat from './screens/Stat'

const Days = createDrawerNavigator({
    Day: {
        screen: createStackNavigator({ Day: Day })
    },
    Stat: {
        screen: createStackNavigator({ Stat: Stat })
    },
});

export default Days;
