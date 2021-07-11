import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Platform,
    Keyboard,
    Image,
    Dimensions,
    Alert
} from 'react-native';
import {connect} from 'react-redux';
import {Country, AnimateLoadingButton} from '../../components'
import ApiGraphQl from '../../networking/apiGraphQl'

const width = Dimensions.get('window').width - 38

class EnterCustomerInfoClass extends Component {

    apigraphql = new ApiGraphQl()

    constructor(props) {
        super(props);

        this.state = {
            emailTaken: false,

            modalCity: false,
            cityId: '',

            firstName: props.route.params.user.first_name,
            lastName: props.user.last_name,
            city: '',
            email: props.user.email,
            phone: props.user.phone,

            firstNameError: '',
            lastNameError: '',
            cityError: '',
            emailError: '',
            phoneError: '',
        };
    }

    emailValidator() {
        let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(this.state.email)
    }

    isValidAll(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key) && obj[key]) {
                return false;
            }
        }
        return true;
    }

    submit() {
        Keyboard.dismiss()
        let errors = {
            firstNameError: this.state.firstName ? '' : 'Invalid first name',
            lastNameError: this.state.lastName ? '' : 'Invalid first name',
            cityError: this.state.city ? '' : 'Select city',
            emailError: this.emailValidator() ? '' : 'Email Invalid',
            phoneError: this.state.phone ? '' : 'Email Invalid',
        };
        if (this.isValidAll(errors)) {
            this.createCustomer()
        } else {
            this.setState({
                ...errors
            })
        }
    }


    changeCity = (city, cityId) => {
        this.setState({
            city: city,
            cityId: cityId,
            cityError: ''
        })
    }

    createCustomer() {
        this.loadingButton.showLoading(true);
        let info = `{
                    id: ${this.props.user.id}
                    phone: "${this.state.phone}"
                    first_name: "${this.state.firstName}"
                    last_name:  "${this.state.lastName}"
                    city_id: ${this.state.cityId}
                    email: "${this.state.email}"
                }`
        this.apigraphql.updateCustomer(info)
            .then(async user => {
                await this.loadingButton.showLoading(false)
                if (user === 'VALIDATION.REGISTER.CUSTOMER.EMAIL.TAKEN') {
                    return this.setState({
                        emailTaken: true
                    })
                }
                await this.loadingButton.showLoading(false);
                await this.props.dispatch({
                    type: 'SET_USER', value: {
                        email: this.state.email,
                        phone: this.state.phone,
                        city_id: this.state.cityId,
                        city: this.state.city,
                        first_name: this.state.firstName,
                        last_name: this.state.lastName,
                    }
                });
                this.props.navigation.goBack();
            })
            .catch(err => {
                console.log(err);
            })
    }


    render() {
        console.log(this.props, 'props');
        return (
            <View style={styles.content}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps='always'
                            showsVerticalScrollIndicator={false}>
                    <Text style={styles.finish_text}>Finish signing up</Text>
                    <View style={styles.input_view}>
                        {this.props.user.first_name ?
                            null
                            : <TextInput
                                placeholder={'First name'}
                                placeholderTextColor={'#aba9a9'}
                                onChangeText={(e) => this.setState({
                                    firstName: e,
                                    firstNameError: '',
                                    emailTaken: false,
                                })}
                                style={[styles.input,
                                    this.state.firstNameError ?
                                        {backgroundColor: '#f8e6ed'} : null
                                ]}/>
                        }
                        {!this.props.user.last_name ?
                            <>
                                <TextInput
                                    placeholder={'Last name'}
                                    placeholderTextColor={'#aba9a9'}
                                    onChangeText={(e) => this.setState({
                                        lastName: e,
                                        emailTaken: false,
                                        lastNameError: ''
                                    })}
                                    style={[styles.input,
                                        this.state.lastNameError ?
                                            {backgroundColor: '#f8e6ed'} : null
                                    ]}/>
                                <Text style={styles.id_text}>Make sure it matches the name on your government ID.</Text>
                            </>
                            : null
                        }
                        {!this.props.user.city_id ?
                            <View style={[styles.city_view,
                                this.state.cityError ?
                                    {backgroundColor: '#f8e6ed'} : null
                            ]}>
                                <TouchableOpacity style={{flex: 1}} onPress={() => {
                                    Keyboard.dismiss()
                                    this.setState({modalCity: true})
                                }}>
                                    {this.state.city ? <Text
                                            style={[styles.city_text, {color: '#2C2929'}]}>{this.state.city}</Text> :
                                        <Text style={styles.city_text}>City</Text>}
                                </TouchableOpacity>
                            </View>
                            : null}
                        {!this.props.user.email ?
                            <TextInput
                                placeholder={'Email'}
                                autoCapitalize='none'
                                keyboardType="email-address"
                                placeholderTextColor={'#aba9a9'}
                                onChangeText={(e) => this.setState({
                                    email: e,
                                    emailTaken: false,
                                    emailError: ''
                                })}
                                style={[styles.input,
                                    this.state.emailError || this.state.emailTaken ?
                                        {backgroundColor: '#f8e6ed'} : null
                                ]}/>
                            : null}
                        {!this.props.user.phone ?
                            <TextInput
                                placeholder={'Phone'}
                                keyboardType={'phone-pad'}
                                placeholderTextColor={'#aba9a9'}
                                onChangeText={(e) => this.setState({
                                    phone: e,
                                    phoneTaken: false,
                                    phoneError: ''
                                })}
                                style={[styles.input,
                                    this.state.phoneError || this.state.phoneTaken ?
                                        {backgroundColor: '#f8e6ed'} : null
                                ]}/>
                            : null}
                        <View style={{height: 20, marginTop: 10}}>
                            {this.state.emailTaken &&
                            <Text style={{color: 'red', fontSize: 14,}}>Тhis email is already registered</Text>}
                        </View>
                        <View style={{marginTop: 10, height: 50,}}>
                            <AnimateLoadingButton
                                ref={c => (this.loadingButton = c)}
                                width={width}
                                height={50}
                                title="Update"
                                titleFontFamily={Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium'}
                                titleFontSize={16}
                                titleColor="rgb(255,255,255)"
                                backgroundColor="#6744f9"
                                borderRadius={12}
                                onPress={() => {
                                    Keyboard.dismiss()
                                    this.submit()
                                }}
                            />
                        </View>
                    </View>
                </ScrollView>
                <Country
                    close={() => {
                        this.setState({modalCity: false});
                    }}
                    isVisible={this.state.modalCity}
                    changeCity={this.changeCity}
                />
            </View>
        );
    }
}

export const EnterCustomerInfo = connect(({user}) => ({user}))(EnterCustomerInfoClass);


const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#fafbfd',
    },
    finish_text: {
        textAlign: 'center',
        fontSize: 24,
        lineHeight: 30,
        fontWeight: 'bold',
        marginTop: 60,
    },
    input_view: {
        marginTop: 36,
        marginHorizontal: 24,
    },
    input: {
        marginTop: 16,
        lineHeight: 20,
        fontSize: 16,
        paddingLeft: 27,
        borderRadius: 12,
        backgroundColor: '#fff',
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
    id_text: {
        fontSize: 11,
        marginTop: 10,
        color: '#010101',
    },
    city_view: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 27,
        paddingRight: 18,
        marginTop: 10,
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
    city_text: {
        //fontFamily: 'Circular-Std',
        fontSize: 16,
        lineHeight: 20,
        color: '#aba9a9',
    },
    password_view: {
        marginTop: 20,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        lineHeight: 20,
        fontSize: 16,
        paddingLeft: 27,
        borderRadius: 12,
        backgroundColor: '#fff',
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

    continue_btn: {
        width: '100%',
        backgroundColor: '#6844F9',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderRadius: 12,
        marginTop: 10,
        marginBottom: 20
    },
    continue_text: {
        color: '#fff',
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
        fontSize: 16,
        lineHeight: 20,
        fontWeight: 'bold',
    },
});
