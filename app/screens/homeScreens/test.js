import React from 'react';
import { StyleSheet, Button, View, Image, Text } from 'react-native';

export const test = class testClass extends React.Component {



    render() {

        return (
            <View style={styles.container}>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
});
