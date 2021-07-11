import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput
} from 'react-native';
import {connect} from 'react-redux';
import i18n from "../../constants/i18next";
import ApiGraphQl from '../../networking/apiGraphQl'
import {
    EditEmail,
    Country
} from '../../components';

class PersonalInformationClass extends Component {
    apigraphql = new ApiGraphQl()

    constructor(props) {
        super(props);
        this.state = {
            editPhone: false,
            editEmail: false,
            modalCity: false,

            first_name: props.user.first_name,
            last_name: props.user.last_name,
            city: props.user.city,
            cityId: null,
            email: props.user.email,

            firstNameError: '',
            lastNameError: '',
            cityError: '',
        }
    }

    componentDidMount() {
        this.apigraphql.getCustomer(this.props.user.id)
            .then(user => {
                this.setState({
                    city: user.data.customer[0].city.name,
                    cityId: user.data.customer[0].city_id
                })
            })
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

    save() {
        let errors = {
            firstNameError: this.state.first_name ? '' : 'Invalid first name',
            lastNameError: this.state.last_name ? '' : 'Invalid first name',
            cityError: this.state.city ? '' : 'Select city',
        };
        if (this.isValidAll(errors)) {
            this.saveCustomer()
        } else {
            this.setState({
                ...errors
            })
        }
    }

    saveCustomer() {
        let info = `{
                    id: ${this.props.user.id}
                    first_name: "${this.state.first_name}"
                    last_name:  "${this.state.last_name}"
                    city_id: ${this.state.cityId}
                }`
        this.apigraphql.updateCustomer(info)
            .then(data => {
                this.props.dispatch({
                    type: 'SET_USER', value: {
                        last_name: this.state.last_name,
                        first_name: this.state.first_name,
                        city_id: this.state.cityId,
                        city: this.state.city
                    }
                })
                this.props.navigation.goBack()
            })
            .catch(err => {
                console.log(err);
            })
    }

    changeEmail = (email) =>  {
        this.setState({
            email: email
        })
        this.props.dispatch({
            type: 'SET_USER', value: {
                email: email
            }
        })
    }

    changeCity = (city, cityId) => {
        this.setState({
            city: city,
            cityId: cityId,
            firstNameError: '',
            lastNameError: '',
            cityError: '',
        })
    }

    handleChange = (e, name) => {
        this.setState({
            [name]: e,
            emailError: ''
        });
    };

    render() {
        return (
            <View style={styles.content}>
                <View style={styles.header_view}>
                    <View style={styles.back_view}>
                        <TouchableOpacity style={styles.back_btn} onPress={() => this.props.navigation.goBack()}>
                            <Image
                            style={{height: 16, width: 9.45, resizeMode: 'contain',}}
                            source={require('../../assets/images/back.png')}/>
                        </TouchableOpacity>
                        <Text style={styles.personal_text}>{i18n.t('PERSONAL_INFORMATION')}</Text>
                    </View>
                    <TouchableOpacity onPress={() => this.save()}>
                        <Text style={styles.save_btn_text}>{i18n.t('SAVE')}</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <View style={styles.input_view}>
                        <View style={styles.input_item_view}>
                            <Text style={styles.input_text}>{i18n.t('FIRST_NAME')}</Text>
                            <TextInput
                                value={this.state.first_name}
                                onChangeText={(e) => this.handleChange(e, 'first_name')}
                                style={[styles.input, this.state.firstNameError && {backgroundColor: '#f8e6ed'}]}
                            />
                        </View>
                        <View style={styles.input_item_view}>
                            <Text style={styles.input_text}>{i18n.t('LAST_NAME')}</Text>
                            <TextInput
                                value={this.state.last_name}
                                onChangeText={(e) => this.handleChange(e, 'last_name')}
                                style={[styles.input, this.state.lastNameError && {backgroundColor: '#f8e6ed'}]}
                            />
                        </View>
                        <TouchableOpacity style={styles.input_item_view}
                                          onPress={() => this.setState({modalCity: true})}>
                            <Text style={styles.input_text}>{i18n.t('CITY')}</Text>
                            <TextInput
                                value={this.state.city}
                                editable={false}
                                onChangeText={(e) => this.handleChange(e, 'city')}
                                style={[styles.input, this.state.cityError && {backgroundColor: '#f8e6ed'}]}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.input_item_view} onPress={() => {
                            this.setState({
                                editEmail: true
                            })
                        }}>
                            <View style={styles.input_header_view}>
                                <Text style={styles.input_text}>{i18n.t('EMAIL')}</Text>
                                <View>
                                    <Text style={styles.edit_btn}>{i18n.t('EDIT')}</Text>
                                </View>
                            </View>
                            <TextInput
                                editable={false}
                                value={this.state.email}
                                autoCapitalize = 'none'
                                keyboardType="email-address"
                                onChangeText={(e) => this.handleChange(e, 'email')}
                                style={styles.input}
                            />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <Country
                    close={() => {
                        this.setState({modalCity: false});
                    }}
                    isVisible={this.state.modalCity}
                    changeCity={this.changeCity}
                />
                <EditEmail
                    close={() => {
                        this.setState({editEmail: false});
                    }}
                    changeEmail={this.changeEmail}
                    id={this.props.user.id}
                    phone={this.props.user.phone}
                    isVisible={this.state.editEmail}
                />
            </View>
        );
    }
}

export const PersonalInformation = connect(({user}) => ({user}))(PersonalInformationClass);

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header_view: {
        paddingRight: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 13
    },
    back_view: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    back_btn: {
        paddingLeft: 16,
        width: 50,
        height: 50,
        justifyContent: 'center'
    },
    personal_text: {
        fontSize: 18,
        lineHeight: 22,
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
        color: '#000',
    },
    save_btn_text: {
        color: '#6844F9',
        fontSize: 15,
        lineHeight: 20,
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    },
    input_view: {
        marginHorizontal: 14,
        marginTop: 15,
    },
    input_item_view: {
        marginTop: 16,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(151, 151, 151, 0.13)'
    },
    input_text: {
        color: '#B5B3BD',
        fontSize: 10,
        lineHeight: 14,
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    },
    input: {
        color: '#000',
        fontSize: 15,
        lineHeight: 20
    },
    input_header_view: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    edit_btn: {
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
        fontSize: 15,
        lineHeight: 20,
        color: '#000'
    },
    text: {
        width: 240,
        marginTop: 8,
        fontSize: 15,
        lineHeight: 20,
        color: 'rgba(0, 0, 0, 0.2)',
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    },
});
