import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableWithoutFeedback,
    TouchableOpacity,
    ScrollView,
    Platform,
    TextInput,
} from 'react-native';
import Modal from 'react-native-modal'
import Down from "../../assets/images/down.png";
import CountryPicker from 'react-native-country-picker-modal';

class EditPhoneClass extends Component {
    constructor() {
        super();
        this.state = {
            changeStyle: true,

            country: '',
            phone: '',
            code: '',
            invalidPhone: false,
            disabledSave: true,
            opacitySave: 0.3,
        };
    }

    handleChange = (e, name) => {
        this.setState({
            [name]: e,
        });
        if (this.state.phone.length > 1 && this.state.country) {
            this.setState({
                disabledSave: false,
                opacitySave: 1,
            });
        } else {
            this.setState({
                disabledSave: true,
                opacitySave: 0.3,
            });
        }
    };

    _rendercountry() {
        if (this.state.modallCountry) {
            return (
                <CountryPicker
                    onSelect={(value) => {
                        this.setState({
                            country: `${value.name}(+${value.callingCode[0]})`,
                            code: `+${value.callingCode[0]}`,
                        });
                    }}
                    translation='eng'
                    visible={true}
                    withAlphaFilter={true}
                    withCallingCode={true}
                    withFilter={true}
                    withFlag={true}
                    onClose={() => {
                        if (this.state.phone && this.state.country) {
                            this.setState({
                                disabledContinue: false,
                                opacityContinue: 1,
                            });
                        }
                        this.setState({modallCountry: false});
                    }}
                />
            );
        }
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
                        <Text style={styles.title_text}>Enter a new phone number</Text>
                    </View>
                    <Text style={styles.edit_text}>For notifications, reminders, and help logging in.</Text>
                    <View style={{paddingHorizontal: 16,}}>
                        <View style={styles.count_view}>
                            <TouchableOpacity style={styles.country_btn}
                                              onPress={() => this.setState({modallCountry: true})}>
                                {this.state.country ? <Text
                                        style={[styles.country_text, {color: '#2C2929'}]}>{this.state.country}</Text> :
                                    <Text style={styles.country_text}>Country/Region</Text>}

                                <Image source={Down}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.input_view}>
                            <TextInput
                                placeholder={'12345678'}
                                placeholderTextColor={'#aba9a9'}
                                style={this.state.invalidPhone ? [styles.input, {backgroundColor: '#f8e6ed'}] : styles.input}
                                keyboardType={'numeric'}
                                onChangeText={(e) => this.handleChange(e, 'phone')}
                            />
                        </View>
                    </View>
                    <View style={styles.btn_view}>
                        <TouchableOpacity style={[styles.continue_btn, {opacity: this.state.opacitySave}]}
                                          disabled={this.state.disabledSave} onPress={() => {
                            this.props.navigation.navigate('Code', {phone: `${this.state.code + this.state.phone}`});
                        }}>
                            <Text style={styles.continue_text}>Save</Text>
                        </TouchableOpacity>
                    </View>
                    {this._rendercountry()}
                </View>
            </Modal>
        );
    }
}

export const EditPhone = EditPhoneClass

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
        paddingLeft: 19,
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
        marginLeft: 16
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
        position: 'absolute',
        bottom: 24,
        right: 16
    }
});
