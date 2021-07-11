import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableNativeFeedback,
    View
} from 'react-native';

export class ListTouchable extends Component {

    constructor(props) {
        super(props);

    }



    render() {
        return (
            <TouchableNativeFeedback
            disabled={this.props.disabled ? true : false}
                onPress={() => this.props.onPress()}
            >
                <View style={this.props.style || {}}>
                    {this.props.children}
                </View>
            </TouchableNativeFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

});

