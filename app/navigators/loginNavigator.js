import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
    Login,
    Code,
    FinishSigningUp,
    EnterPassword
} from '../screens'

const Stack = createStackNavigator();

function LoginNavigator() {
    return (
        <Stack.Navigator
            headerMode={'none'}
           // initialRouteName={'FinishSigningUp'}
        >
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Code" component={Code} />
            <Stack.Screen name="FinishSigningUp" component={FinishSigningUp} />
            <Stack.Screen name="EnterPassword" component={EnterPassword} />
        </Stack.Navigator>
    );
}

export default LoginNavigator;
