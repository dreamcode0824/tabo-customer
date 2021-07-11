import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Platform,
    TextInput, Keyboard,
} from 'react-native';
import Modal from 'react-native-modal'
import ApiGraphQl from '../../networking/apiGraphQl'
import {connect} from "react-redux";


class EditEmailClass extends Component {
    apigraphql = new ApiGraphQl()
    constructor() {
        super();
        this.state = {
            invalidPhone: false,
            disabledSave: true,
            err: false,
            email: '',
            opacitySave: 0.3,

            emailError: '',
        };
    }

    emailValidator() {
        let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(this.state.email)
    }

    handleChange = (e, name) => {
        this.setState({
            [name]: e,
            emailError: '',
            err: false
        });
        if(this.emailValidator()){
           this.setState({
               opacitySave: 1,
               disabledSave: false
           })
        }
    };



    updateCustomer(){

        let info = `{
                    id: ${this.props.id}
                    email: "${this.state.email}"
                    phone: "${this.props.phone}"
                }`
        this.apigraphql.updateCustomer(info)
            .then(data => {
                 this.props.changeEmail(this.state.email)
                 this.props.close();
            })
            .catch(err => {
                console.log(err);
            })
    }

    render() {
        return (
            <Modal
                onSwipeComplete={() => {
                    this.props.close();
                }}
                onBackButtonPress={() => {
                    this.props.close();
                }}
                swipeDirection="down"
                backdropColor={'rgba(0, 0, 0, 0.28)'}
                backdropOpacity={1}
                style={{marginTop: 50, marginHorizontal: 0, marginBottom: 0, borderTopRadius: 12}}
                isVisible={this.props.isVisible}>
                <View style={styles.container}>
                    <View style={styles.title_view}>
                        <TouchableOpacity onPress={() => this.props.close()}>
                            <Image source={require('../../assets/images/close.png')} style={styles.close_btn}/>
                        </TouchableOpacity>
                        <Text style={styles.title_text}>Update email</Text>
                        <Text />
                    </View>
                    <Text style={styles.edit_text}>We’ll send you an email to confirm your new email address.</Text>
                    <View style={{paddingHorizontal: 16, marginTop: 52}}>
                        <View style={styles.input_view}>
                            <TextInput
                                autoCapitalize = 'none'
                                keyboardType="email-address"
                                placeholder={'Email'}
                                placeholderTextColor={'#2C2929'}
                                style={this.state.emailError ? [styles.input, {backgroundColor: '#f8e6ed'}] : styles.input}
                                onChangeText={(e) => this.handleChange(e, 'email')}
                            />
                        </View>
                    </View>
                    <View style={styles.btn_view}>
                        <TouchableOpacity style={[styles.continue_btn, {opacity: this.state.opacitySave}]}
                                          disabled={this.state.disabledSave} onPress={() => {this.updateCustomer()}}>
                            <Text style={styles.continue_text}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
}

export const EditEmail =EditEmailClass

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    title_view: {
        marginTop: 21,
        flexDirection: 'row',
        paddingHorizontal: 19,
        alignItems: 'center',
    },
    close_btn: {
        width: 32,
        height: 32
    },
    title_text: {
        color: '#000',
        fontSize: 17,
        lineHeight: 22,
        fontWeight: 'bold',
        marginLeft: 29,
    },
    edit_text: {
        color: '#000',
        fontSize: 14,
        lineHeight: 20,
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
        marginTop: 25,
        marginHorizontal: 16
    },

    count_view: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 27,
        paddingRight: 18,
        marginTop: 40,
        width: '100%',
        height: 50,
        borderRadius: 12,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },
    country_btn: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    country_text: {
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
        fontSize: 16,
        lineHeight: 20,
        color: '#aba9a9',
    },
    input_view: {
        marginTop: 16,
        width: '100%',
        height: 50,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
    },
    input: {
        flex: 1,
        paddingLeft: 27,
        color: '#2C2929',
        backgroundColor: '#fff',
        fontSize: 16,
    },
    err_text: {
        color: 'red',
        fontSize: 14,
        marginTop: 20
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
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
        fontSize: 16,
        lineHeight: 20,
        fontWeight: 'bold',
    },
    btn_view: {
        marginTop: 60,
        position: 'absolute',
        bottom: 24,
        right: 16
    }
});
