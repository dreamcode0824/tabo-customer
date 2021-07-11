import React, {Component} from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import {
    DotIndicator,
  } from 'react-native-indicators';

export class ContentLoading extends Component {

    render() {
        return this.props.loading ? (
            <View style={[styles.content, this.props.style]}>
               <DotIndicator
               size={10}
               count={3}
               color='#6844F9' />
            </View>
        ) : null
    }
}

const styles = StyleSheet.create({
    content: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        minHeight: 50,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
        backgroundColor: 'transparent'
    },
});
