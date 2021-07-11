import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    TouchableWithoutFeedback,
    Animated,
    Easing,
    View,
    Dimensions
} from 'react-native';

const { height } = Dimensions.get('window');
const imageHeight = (30 / 100) * height


export class LikeBusiness extends Component {

    topAnimValue = new Animated.Value(1);
    business = 19;

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
                right: 11,
                borderRadius: 50,
                width: 38,
                height: 38,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',

            },
            {
                top: top,
                transform: [{scale: scale}]
            }
        ];


        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    this.animate()
                    this.props.setActive()
                }}
            >
                <Animated.View style={animatedStyles}>
                    {this.props.active ?
                            <Image
                                style={styles.like}
                                source={require('../../assets/images/heartActive.png')}
                            />
                        :
                            <Image
                                style={{width: 32, height: 32,   resizeMode: 'contain'}}
                                source={require('../../assets/images/heartIcon.png')}
                            />
                    }

                </Animated.View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    like: {
        resizeMode: 'contain',
        height: 16,
        width: 16
    }
});
