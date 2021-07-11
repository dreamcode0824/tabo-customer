import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableWithoutFeedback,
    TouchableOpacity,
    ScrollView,
    TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import i18n from "../../constants/i18next";
import { connect } from 'react-redux'

class LanguagesClass extends Component {

    constructor(props) {
        super(props)
        this.state = {
            languages: [
                {
                    language: 'English',
                    short: 'en',
                    active: false
                },
                {
                    language: 'Romania',
                    short: 'ro',
                    active: false
                },
            ],
            lanfuageIndex: null
        }
        this.getLanguage()
    }

    getLanguage() {
        for (let i = 0; i < this.state.languages.length; i++) {
            if (this.state.languages[i].short == this.props.config.language) {
                this.state.languages[i].active = true
                this.setState({
                    lanfuageIndex: i
                })
            }
        }
    }

    async setLanguage(value) {
        try {
            await AsyncStorage.setItem('language', value)
        } catch (error) {
            console.log(error);
        }
    }

    handleChange = (i) => {
        let arr = this.state.languages
        arr.map((data, index) => {
            if (index === i) {
                data.active = true
            } else {
                data.active = false
            }
        })
        this.setState({
            languages: arr,
            lanfuageIndex: i
        })
    };

    _renderLanguages() {
        return this.state.languages.map((data, index) => {
            return (
                <TouchableOpacity
                    style={styles.language_btn}
                    key={index}
                    onPress={() => this.handleChange(index)}>
                    <Text style={styles.language_text}>{data.language}</Text>
                    <View style={styles.checkbox}>
                        <Text
                            style={[styles.checkbox_text, data.active && { backgroundColor: '#6844F9', }]} />
                    </View>
                </TouchableOpacity>
            )
        })
    }


    render() {
        return (
            <View style={styles.container}>
                <View style={styles.title_view}>
                    <TouchableOpacity style={styles.back_btn} onPress={() => this.props.navigation.goBack()}>
                        <Image source={require('../../assets/images/back.png')} style={styles.close_btn} />
                    </TouchableOpacity>
                    <Text style={styles.title_text}>{i18n.t('LANGUAGE')}</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                    {this._renderLanguages()}
                </View>
                <View style={styles.btn_view}>
                    <TouchableOpacity style={[styles.continue_btn,]}
                        onPress={() => {
                            this.setLanguage(this.state.languages[this.state.lanfuageIndex].short)
                            this.props.dispatch({ type: 'SET_LANGUAGE', value: this.state.languages[this.state.lanfuageIndex].short });
                            i18n.changeLanguage(this.state.languages[this.state.lanfuageIndex].short)
                            this.props.navigation.navigate('Profile')
                        }}>
                        <Text style={styles.continue_text}>{i18n.t('SAVE')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export const Languages = connect(({ config }) => ({ config }))(LanguagesClass)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title_view: {
        marginTop: 21,
        flexDirection: 'row',
        alignItems: 'center',
    },
    back_btn: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    close_btn: {
        resizeMode: 'contain',
        height: 16,
        width: 9.45
    },
    title_text: {
        color: '#000',
        fontSize: 17,
        lineHeight: 22,
        fontWeight: 'bold',
    },
    language_btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 16,
        height: 50,
        borderBottomColor: 'rgba(151, 151, 151, 0.13)',
        borderBottomWidth: 1,
    },
    language_text: {
        fontSize: 14,
        lineHeight: 20,
        color: '#000',
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    },
    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#979797',
        alignItems: 'center',
        justifyContent: 'center'
    },
    checkbox_text: {
        width: 10,
        height: 10,
        borderRadius: 50,
    },
    continue_btn: {
        width: 87,
        backgroundColor: '#6844F9',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        borderRadius: 12,
        marginTop: 10,

    },
    continue_text: {
        color: '#fff',
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
        fontSize: 16,
        lineHeight: 20,
        fontWeight: 'bold',
    },
    btn_view: {
        position: 'absolute',
        bottom: 24,
        right: 16
    }
});
