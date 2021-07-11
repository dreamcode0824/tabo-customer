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
import { Switch } from '../../components'

export class Notifications extends Component {

    constructor() {
        super();
        this.state = {
            notifications: true,
            email: false,
            textMessages: false,
            accountEmail: false,
            accountTextMessages: false
        }
    }


    render() {
        return (
            <View style={styles.container}>
                <View style={styles.title_view}>
                    <TouchableOpacity style={styles.back_btn} onPress={() => this.props.navigation.goBack()}>
                        <Image source={require('../../assets/images/back.png')} style={{height: 16, resizeMode: 'contain', width: 9.45}} />
                    </TouchableOpacity>
                    <Text style={styles.title_text}>Notifications</Text>
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.scrollInner}>
                        <View style={[styles.itemRow, { marginTop: 13 }]}>
                            <View>
                                <Text style={styles.itemText1}>
                                    Push notifications
                                </Text>
                                <Text style={styles.itemText2}>
                                    Tap to receive notifications
                                </Text>
                            </View>
                            <Switch
                                switchWidth={36}
                                switchHeight={21}
                                active={this.state.notifications}
                                activeBackgroundColor='#6844F9'
                                inactiveBackgroundColor='#B5B3BD'
                                activeButtonColor='#fff'
                                inactiveButtonColor='#fff'
                                activeButtonPressedColor='#fff'
                                inactiveButtonPressedColor='#fff'
                                buttonRadius={6}
                                border={5}
                                onActivate={() => {
                                    this.setState({
                                        notifications: true
                                    })
                                }}
                                onDeactivate={() => {
                                    this.setState({
                                        notifications: false
                                    })
                                }}
                            />
                        </View>
                        <Text style={styles.infoText}>
                            Updates from Tabo
                        </Text>
                        <View>
                            <Text style={styles.itemText1}>
                            Messages
                                </Text>
                            <Text style={styles.itemText2}>
                            Receive messages from hosts and guests, including booking requests.
                                </Text>
                        </View>
                        <View style={[styles.itemRow, { marginTop: 23 }]}>
                                <Text style={styles.itemText1}>
                                    Email
                                </Text>
                            <Switch
                                switchWidth={36}
                                switchHeight={21}
                                active={this.state.email}
                                activeBackgroundColor='#6844F9'
                                inactiveBackgroundColor='#B5B3BD'
                                activeButtonColor='#fff'
                                inactiveButtonColor='#fff'
                                activeButtonPressedColor='#fff'
                                inactiveButtonPressedColor='#fff'
                                buttonRadius={6}
                                border={5}
                                onActivate={() => {
                                    this.setState({
                                        email: true
                                    })
                                }}
                                onDeactivate={() => {
                                    this.setState({
                                        email: false
                                    })
                                }}
                            />
                        </View>
                        <View style={[styles.itemRow, { marginTop: 23 }]}>
                                <Text style={styles.itemText1}>
                                Text messages
                                </Text>
                            <Switch
                                switchWidth={36}
                                switchHeight={21}
                                active={this.state.textMessages}
                                activeBackgroundColor='#6844F9'
                                inactiveBackgroundColor='#B5B3BD'
                                activeButtonColor='#fff'
                                inactiveButtonColor='#fff'
                                activeButtonPressedColor='#fff'
                                inactiveButtonPressedColor='#fff'
                                buttonRadius={6}
                                border={5}
                                onActivate={() => {
                                    this.setState({
                                        textMessages: true
                                    })
                                }}
                                onDeactivate={() => {
                                    this.setState({
                                        textMessages: false
                                    })
                                }}
                            />
                        </View>
                        <View style={{marginTop: 20}}>
                            <Text style={styles.itemText1}>
                            Account support
                                </Text>
                            <Text style={styles.itemText2}>
                            Receive messages about your account, your trips, legal notifications, security and privacy matters, and customer  support requests.
                                </Text>
                        </View>
                        <View style={[styles.itemRow, { marginTop: 23 }]}>
                                <Text style={styles.itemText1}>
                                    Email
                                </Text>
                            <Switch
                                switchWidth={36}
                                switchHeight={21}
                                active={this.state.accountEmail}
                                activeBackgroundColor='#6844F9'
                                inactiveBackgroundColor='#B5B3BD'
                                activeButtonColor='#fff'
                                inactiveButtonColor='#fff'
                                activeButtonPressedColor='#fff'
                                inactiveButtonPressedColor='#fff'
                                buttonRadius={6}
                                border={5}
                                onActivate={() => {
                                    this.setState({
                                        accountEmail: true
                                    })
                                }}
                                onDeactivate={() => {
                                    this.setState({
                                        accountEmail: false
                                    })
                                }}
                            />
                        </View>
                        <View style={[styles.itemRow, { marginTop: 23 }]}>
                                <Text style={styles.itemText1}>
                                Text messages
                                </Text>
                            <Switch
                                switchWidth={36}
                                switchHeight={21}
                                active={this.state.accountTextMessages}
                                activeBackgroundColor='#6844F9'
                                inactiveBackgroundColor='#B5B3BD'
                                activeButtonColor='#fff'
                                inactiveButtonColor='#fff'
                                activeButtonPressedColor='#fff'
                                inactiveButtonPressedColor='#fff'
                                buttonRadius={6}
                                border={5}
                                onActivate={() => {
                                    this.setState({
                                        accountTextMessages: true
                                    })
                                }}
                                onDeactivate={() => {
                                    this.setState({
                                        accountTextMessages: false
                                    })
                                }}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title_view: {
        marginTop: 21,
        flexDirection: 'row',
        paddingLeft: 19,
        alignItems: 'center',
    },
    back_btn: {
        width: 50,
        height: 50,
        justifyContent: 'center'
    },
    title_text: {
        color: '#000',
        fontSize: 17,
        lineHeight: 22,
        fontWeight: 'bold',
        marginLeft: 29,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: 'rgba(151, 151, 151, 0.13)',
        borderBottomWidth: 1,
        paddingBottom: 20
    },
    scrollInner: {
        paddingLeft: 14,
        paddingRight: 16,
        paddingBottom: 60
    },
    itemText1: {
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
        color: 'black',
        fontSize: 14,
        lineHeight: 16
    },
    itemText2: {
        marginTop: 7,
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
        color: 'black',
        fontSize: 11,
        lineHeight: 16
    },
    infoText: {
        color: '#B5B3BD',
        fontSize: 10,
        lineHeight: 12,
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
        marginTop: 20,
        marginBottom: 14
    }
});
