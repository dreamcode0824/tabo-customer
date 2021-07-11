import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import API from '../../networking/api';
import {loadStripe} from '@stripe/stripe-js';
import i18n from "../../constants/i18next";


class AddCardClass extends Component {
    api = new API()
    constructor() {
        super();
        this.state = {
            cardNumber: '',
            expiration: '',
            cvc: '',
            fullName: '',
            disabl: true,

            fullNameError: '',
            cardNumberError: '',
            cvcError: '',
            expirationError: '',
            emailError: '',
        };
    }

    handleChange = (e, name) => {
        this.setState({
            [name]: e,
        });
    };

    handleChange1 = (text) => {
        let textTemp = text;
        if (textTemp[0] !== '1' && textTemp[0] !== '0') {
            textTemp = '';
        }
        if (text.length === 2) {
            this.setState({
                text: textTemp += '/',
            });
        }
        if (textTemp.length === 2) {
            if (parseInt(textTemp.substring(0, 2)) > 12 || parseInt(textTemp.substring(0, 2)) == 0) {
                textTemp = textTemp[0];
            } else if (this.state.text.length === 2) {
                textTemp += '/';
            } else {
                textTemp = textTemp[0];
            }
        }
        this.setState({expiration: textTemp});
    };


    cardNumberValidator() {
        return this.state.cardNumber.length > 15
    }

    cvcValidator() {
        return this.state.cvc.length > 2
    }

    expirationValidator() {
        return this.state.expiration.length > 4
    }

    isValidAll(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key) && obj[key]) {
                return false;
            }

        }
        return true;
    }

    cardValidator() {
        let errors = {
            cardNumberError: this.cardNumberValidator() ? '' : 'Invalid card number',
            fullNameError: this.state.fullName ? '' : 'Invalid full name',
            cvcError: this.cvcValidator() ? '' : 'Invalid cvc',
            expirationError: this.expirationValidator() ? '' : 'Invalid expiration',
        };
        if (this.isValidAll(errors)) {
            this.createCard()
        } else {
            this.setState({
                ...errors
            })
        }
    }

    async stripeCreate (data){
        let stripe = loadStripe(data.publishable_key)
            .then(stripe => {
                stripe.confirmCardPayment(data.client_secret,
                    {
                        payment_method : data.payment_token
                    }
                ).then(result => {
                    console.log(result, 'result');
                    if (result.error) {
                        // handle error ...
                    } else {

                    }

                })
            })
            .catch(err => {
                console.log(err, 'stripe err');
            })

    }

    createCard(){
        let info = {
            number: this.state.cardNumber,
            exp_year: `${this.state.expiration[3]}${this.state.expiration[4]}`,
            exp_month:  `${this.state.expiration[0]}${this.state.expiration[1]}`,
            cvc: this.state.cvc,
            reservation_id: this.props.reservationId
        };
       this.api.createCard(info)
           .then(data => {
               if(data.status === 200){
                  this.stripeCreate(data.data)
              }
           })
           .catch(err => {
               console.log(err);
           })
    }

    render() {
        return (
            <Modal
                onModalHide={()=>{
                    this.setState({
                        cardNumber: '',
                        expiration: '',
                        cvc: '',
                        fullName: '',
                        disabl: true,
            
                        fullNameError: '',
                        cardNumberError: '',
                        cvcError: '',
                        expirationError: '',
                        emailError: '',
                    })
                }}
                onSwipeComplete={() => {
                    this.props.close();
                }}
                onBackButtonPress={() => {
                    this.props.close();
                }}
                testID={'modal'}
                swipeDirection="down"
                backdropColor={'#6844F9'}
                backdropOpacity={1}
                style={{margin: 0, marginTop: 50, borderTopRadius: 12}}
                isVisible={this.props.isVisible}>
                <View style={styles.container}>
                    <View style={styles.swipeItem}/>
                    <View style={styles.title_view}>
                        <TouchableOpacity onPress={() => this.props.close()}>
                            <Image source={require('../../assets/images/close.png')} style={styles.close_btn}/>
                        </TouchableOpacity>
                        <Text style={styles.title_text}>{i18n.t('CREDIT_DEBIT_CRAD')}</Text>
                    </View>
                    <Text style={styles.add_card_info_text}>{i18n.t('CREDIT_DEBIT_CRAD_DESCRIPTION')}</Text>
                    <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}
                                showsVerticalScrollIndicator={false}>
                        <View style={styles.input_view}>
                            <TextInput
                                placeholderTextColor='#D1D0D0'
                                placeholder={i18n.t('CARD_NUMBER')}
                                maxLength={16}
                                keyboardType='numeric'
                                onChangeText={(e) => this.handleChange(e, 'cardNumber')}
                                style={[styles.input, {marginTop: 16}, this.state.cardNumberError && {backgroundColor: '#f8e6ed'} ]}/>
                            <View style={styles.min_input_view}>
                                <TextInput
                                    value={this.state.expiration}
                                    placeholderTextColor='#D1D0D0'
                                    keyboardType='numeric'
                                    placeholder={i18n.t('EXPIRATION')}
                                    maxLength={5}
                                    onChangeText={(e) => this.handleChange1(e, 'expiration')}
                                    style={[styles.input, {marginRight: '4%', width: '48%'},  this.state.expirationError && {backgroundColor: '#f8e6ed'}]}/>
                                <TextInput
                                    maxLength={4}
                                    keyboardType='numeric'
                                    placeholderTextColor='#D1D0D0'
                                    placeholder={'CVC'}
                                    onChangeText={(e) => this.handleChange(e, 'cvc')}
                                    style={[styles.input, {width: '48%'}, this.state.cvcError && {backgroundColor: '#f8e6ed'}]}/>
                            </View>
                            <TextInput
                                placeholderTextColor='#D1D0D0'
                                placeholder={i18n.t('FULL_NAME')}
                                onChangeText={(e) => this.handleChange(e, 'fullName')}
                                style={[styles.input, {marginTop: 16}, this.state.fullNameError && {backgroundColor: '#f8e6ed'}]}/>
                        </View>
                        <View style={styles.btn_view}>
                            <TouchableOpacity style={styles.btn} onPress={() => this.cardValidator()}>
                                <Text style={styles.btn_text}>{i18n.t('NEXT')}</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        );
    }
}

export const AddCard = AddCardClass;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    swipeItem: {
        backgroundColor: '#B5B3BD',
        height: 3,
        width: 39,
        borderRadius: 1.5,
        alignSelf: 'center',
        marginTop: 15,
    },
    title_view: {
        marginTop: 10,
        flexDirection: 'row',
        paddingHorizontal: 16,
        alignItems: 'center',
        paddingBottom: 10,
    },
    close_btn: {
        width: 32,
        height: 32,
    },
    title_text: {
        color: '#000',
        fontSize: 17,
        lineHeight: 22,
        fontWeight: 'bold',
        marginLeft: 29,
    },
    add_card_info_text: {
        marginTop: 25,
        paddingHorizontal: 16,
        color: '#000',
        fontSize: 14,
        lineHeight: 20,
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    },
    input_view: {
        paddingHorizontal: 16,
        marginTop: 16,
    },
    input: {
        fontSize: 16,
        lineHeight: 20,
        color: '#000',
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F8F8F8',
        paddingHorizontal: 16,
    },
    min_input_view: {
        width: '100%',
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    btn_view: {
        marginTop: 20,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingRight: 16,
        paddingBottom: 24,
    },
    btn: {
        marginTop: 100,
        backgroundColor: '#6844F9',
        borderRadius: 8,
        height: 40,
        width: 87,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn_text: {
        color: '#fff',
        fontSize: 16,
        lineHeight: 20,
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    },
});
