import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    Keyboard,
    Dimensions,
    Animated
} from 'react-native';

export class SearchInput extends Component {

    anim = new Animated.Value(1)

    constructor(props) {
        super(props);
    }

    animate(value) {
        Animated.timing(
            this.anim,
            {
                useNativeDriver: false,
                toValue: value,
                duration: 200,
            }
        ).start();
    }

    render() {
        const width = this.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [ Dimensions.get('window').width - 32, 40],
        });
        const color = this.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [ '#6844F9', 'transparent'],
        });
        const opacity = this.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [ 1,0],
        });
        return (
            <View style={styles.content}>
                <Animated.Text
                style={[styles.title, { opacity: this.anim}]}>
                    {this.props.title}
                </Animated.Text>
                <Animated.View style={[
                    styles.searchInputContainer,
                     {
                         width,
                         borderColor: color,
                          }]}>

                    <TextInput
                        onChangeText={(text) => {
                            this.props.onChangeText(text)
                        }}
                        placeholder={'Search'}
                        placeholderTextColor={'#B5B3BD'}
                        style={styles.searchInput}
                        value={this.props.value}
                        ref={ref=>this.input = ref}
                    />
                    <TouchableOpacity
                        style={styles.searchIconContainer}
                        onPress={() => {
                            if(this.anim._value===0){
                                this.input.focus()
                            }
                            else{
                                this.input.focus()
                                this.animate(0)
                            }
                        }}
                        activeOpacity={0.8}
                    >
                        <Image
                            style={styles.searchIcon}
                            source={require('../../assets/images/search.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            Keyboard.dismiss()
                            this.animate(1)
                            this.props.onClose()
                        }}
                        activeOpacity={0.8}
                        style={styles.clearInput}
                    >
                        <Animated.Image
                            source={require('../../assets/images/close_icon.png')}
                            style={{
                                opacity,
                                height: 12,
                                width: 12,
                                 tintColor: '#979797'
                                  }} />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        height: 40,
        marginHorizontal: 16,
        marginTop: 14,
    },
    title: {
        color: '#000',
        fontSize: 24,
        lineHeight: 40,
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    },
    searchButton: {
        height: 25,
        width: 25,
        marginTop: 30,
        marginRight: 16
    },
    searchIconContainer: {
        zIndex: 2,
        position: 'absolute',
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: "center"
    },
    searchIcon: {
        height: 18,
        width: 18
    },
    searchInputContainer: {
        position: 'absolute',
        right: 0,
        width: 40,
        height: 40,
        borderRadius: 4,
        borderWidth: 1,
        backgroundColor: '#fff'
    },
    searchInput: {
        padding: 0,
        flex: 1,
        paddingHorizontal: 48,
        fontSize: 14,
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    },
    clearInput: {
        position: "absolute",
        top: 7,
        right: 12,
        height: 24,
        width: 24,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
