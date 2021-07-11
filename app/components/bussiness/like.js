import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    TouchableWithoutFeedback,
    Animated,
    Easing
} from 'react-native';

export class Like extends Component {

    topAnimValue = new Animated.Value(1);
    business =  11;
    animate() {
        this.topAnimValue.setValue(0);
        Animated.timing(this.topAnimValue, {
            toValue: 1,
            duration: 800,
            easing: Easing.bounce,
            useNativeDriver: false
        }).start();
    }

    render() {
        const top = this.topAnimValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [this.business, 0, this.business]
        });

        const scale = this.topAnimValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1, 0.7, 1]
        });
        const animatedStyles = [
            {
                position: 'absolute',
                right:  15 ,
                width: 32,
                height: 32,

            },
            {
                top: top,
                transform: [{scale: scale}]
            }
        ];

        return (
            <TouchableWithoutFeedback
            onPress={()=>{
                this.animate()
                this.props.setActive()
            }}
            >
                <Animated.View style={animatedStyles}>
                    <Image
                        style={[styles.like, this.props.active ? {tintColor: '#6844F9'} : {tintColor:  '#7E7E7E'}]}
                        source={require('../../assets/images/heart.png')}
                    />
                </Animated.View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    like: {
        height: 20,
        width: 21
    }
});
