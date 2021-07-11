import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
    Reserved,
    ReservedInfo
} from '../screens'

const Stack = createStackNavigator();

function ReservedNavigator() {
    return (
        <Stack.Navigator
            headerMode={'none'}
            //initialRouteName={'Home'}
        >
            <Stack.Screen name="Reserved" component={Reserved} />
            <Stack.Screen name="ReservedInfo" component={ReservedInfo} />
        </Stack.Navigator>
    );
}

export default ReservedNavigator;
