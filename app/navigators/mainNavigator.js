import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
    Splash,
    GetStarted,
} from '../screens'
import LoginNavigator from './loginNavigator'
import TabNavigator from './tabNavigator'

const Stack = createStackNavigator();

function MainNavigator() {
    return (
        <Stack.Navigator
            headerMode={'none'}
            //initialRouteName={'LoginNavigator'}
        >
            <Stack.Screen name="Splash" component={Splash}/>
            <Stack.Screen name="GetStarted" component={GetStarted}/>
            <Stack.Screen name="LoginNavigator" component={LoginNavigator} />
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
        </Stack.Navigator>
    );
}

export default MainNavigator;