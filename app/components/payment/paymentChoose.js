import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableWithoutFeedback,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Platform, Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import API from '../../networking/api';
import {loadStripe} from '@stripe/stripe-js';
import i18n from "../../constants/i18next";


class PaymentChooseClass extends Component {
    api = new API();

    constructor(props) {
        super(props);
        this.state = {
            cards: props.cards,
            cardId: props.cards.length ? props.cards[0].id : null
        };
    }


    async stripePay(data) {
        let stripe = loadStripe(data.publishable_key)
            .then(stripe => {
                stripe.confirmCardPayment(data.client_secret,
                    {
                        payment_method: data.payment_token,
                    },
                ).then(result => {
                    if (result.error) {
                        // handle error ...
                    } else {

                    }

                });
            })
            .catch(err => {
                console.log(err, 'stripe err');
            });
    }

    pay() {
        let info = {
            card_id: this.state.cardId,
            reservation_id: this.props.reservationId,
        };
        this.api.createCard(info)
            .then(data => {
                if (data.status === 200) {
                    this.stripePay(data.data);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    changeCard(i) {
        let arr = this.state.cards;
        arr.map((data, index) => {
            if (index === i) {
                return data.active = true;
            }
            data.active = false;

        });
        this.setState({
            cards: arr,
            cardId: this.state.cards[i].id
        });
    }

    _renderDeletAlert(index) {
        return Alert.alert(
            '',
            'Unknown error',
            [
                {
                    text: 'Close',
                    onPress: () => {
                    },
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        this.deleteCard(index)
                    },
                    style: 'delete',
                }
            ],
            {cancelable: true},
        );


    }

    deleteCard(index) {
        let info = {
            id: this.state.cards[index].id
        }
        this.api.deleteCard(info)
            .then(data => {
                if(data.status === 200){
                    this.props.getCards()
                }
            })
            .catch(err => {
                console.log(err, 'jerwfhj');
            })
    }

    _renderCard() {
        return this.props.cards.map((card, index) => {
            return (
                <TouchableOpacity style={styles.card_btn} key={index}
                                  onPress={() => this.changeCard(index)}
                                  onLongPress={() => this._renderDeletAlert(index)}

                >
                    <View style={styles.card_info_view}>
                        {card.brand === 'mastercard' &&
                        <Image source={require('../../assets/images/mastercard.png')} style={styles.card_img}/>}
                        {card.brand === 'visa' &&
                        <Image source={require('../../assets/images/visacard.png')} style={styles.card_img}/>}

                        <View style={styles.card_number_view}>
                            <Text style={styles.dot_text}>{'\u2B24'}{'\u2B24'}{'\u2B24'}{'\u2B24'}</Text>
                            <Text style={styles.number_text}>{card.last4}</Text>
                        </View>
                    </View>
                    {card.active &&
                    <Image source={require('../../assets/images/check.png')} style={{width: 16, height: 16}}/>}
                </TouchableOpacity>
            );
        });
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
                testID={'modal'}
                swipeDirection="down"
                backdropColor={'#6844F9'}
                backdropOpacity={1}
                style={{justifyContent: 'flex-end', margin: 0, borderTopRadius: 12}}
                isVisible={this.props.isVisible}>
                <View style={styles.container}>
                    <View style={styles.swipeItem}/>
                    <View style={styles.title_view}>
                        <TouchableOpacity onPress={() => this.props.close()}>
                            <Image source={require('../../assets/images/close.png')} style={styles.close_btn}/>
                        </TouchableOpacity>
                        <Text style={styles.title_text}>{i18n.t('CHOOSE_HOW_TO_PAY')}</Text>
                        <Text/>
                    </View>
                    <View>
                        {this._renderCard()}
                        <Text style={styles.payment_method}>{i18n.t('ADD_PAYMENT_METHOD')}</Text>
                        <TouchableOpacity style={styles.credit_card_view} onPress={() => this.props.next()}>
                            <Image source={require('../../assets/images/credit-card.png')} style={styles.card_img}/>
                            <Text style={styles.credit_card_text}>{i18n.t('CREDIT_DEBIT_CARD')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{width: '100%', alignItems: 'flex-end', paddingRight: 16, paddingVertical: 10}}
                          onPress={() => this.pay()}>
                        <TouchableOpacity style={styles.pay_now_btn}>
                            <Text style={styles.pay_now_btn_text}>{i18n.t('PAY_NOW_BTN')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
}

export const PaymentChoose = PaymentChooseClass;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-end',
        margin: 0,
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
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(151, 151, 151, 0.13)',
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
    card_btn: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    card_info_view: {
        alignItems: 'center',
        flexDirection: 'row',

    },
    card_img: {
        backgroundColor: '#fff',
        width: 40,
        height: 40,
    },
    card_number_view: {
        marginLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot_text: {
        fontSize: 7,
    },
    number_text: {
        marginLeft: 5,
        fontSize: 16,
        lineHeight: 16,
        color: '#2C2929',
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    },
    check_img: {
        width: 15,
        height: 15,
    },
    payment_method: {
        marginTop: 20,
        color: '#7f7f7f',
        fontSize: 14,
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
        marginLeft: 16,
    },
    credit_card_view: {
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(151, 151, 151, 0.13)',
        paddingBottom: 10,
    },
    credit_card_text: {
        color: '#000',
        fontSize: 14,
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
        marginLeft: 10,
    },
    pay_now_btn: {
        backgroundColor: '#6844F9',
        borderRadius: 8,
        width: 94,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pay_now_btn_text: {
        color: '#fff',
        lineHeight: 20,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    },
});
