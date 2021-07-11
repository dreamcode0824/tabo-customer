import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    StatusBar,
    Platform,
    Image,
    TouchableOpacity,
    Text,
     Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';
import Back from '../../assets/images/back.png';
import LocationBlack from "../../assets/images/locationBlack.png";
import i18n from "../../constants/i18next";
import moment from 'moment'


class CommingClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            countAdults: 0,
            countChildren: 0,
            opacityNext: 0.3,
            disabledNext: true
        };
    }

    render() {
        return (
            <Modal
                onSwipeComplete={() => {
                    this.props.close();
                }}
                swipeDirection="down"
                onBackButtonPress={() => {
                    this.props.close();
                }}
                backdropColor={'#6844F9'}
                backdropOpacity={1}
                style={{margin: 0,  justifyContent: 'flex-end'}}
                isVisible={this.props.isVisible}>

                <View style={styles.content}>
                    <View style={styles.swipeItem}/>
                    <View style={styles.headerRow}>
                        <TouchableOpacity
                            style={styles.backButtonContainer}
                            activeOpacity={0.8}
                            onPress={() => this.props.close()}>
                            <Image
                                style={styles.backIcon}
                                source={Back}/>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>
                            {i18n.t('WHEN_WILL_THERE')}
                        </Text>
                        <View style={{width: 38}}/>
                    </View>
                    <View style={styles.location_view}>
                        <View style={styles.location_img_view}>
                            <Image source={LocationBlack} style={{width: 32, height: 32}}/>
                        </View>
                        <View>
                            <Text style={styles.location_text}>{this.props.name}</Text>
                            <Text style={styles.location_date_text}> {moment(this.props.date).format('DD MMM YYYY')}</Text>
                        </View>
                    </View>
                    <View style={styles.adults_view}>
                        <View>
                            <Text style={styles.adults_text}>{i18n.t('PARTICIPANTS')}</Text>
                        </View>
                        <View style={styles.count_view}>
                            <TouchableOpacity style={styles.minus_btn} onPress={() => {
                                if (this.state.countAdults === 0) {
                                    this.setState({
                                        countAdults: 0,
                                        disabledNext: true
                                    })
                                } else {
                                    if(this.state.countAdults === 1){
                                        this.setState({
                                            disabledNext: true,
                                            countAdults: this.state.countAdults - 1,
                                        })
                                    }else{
                                        this.setState({
                                            countAdults: this.state.countAdults - 1,
                                        })
                                    }
                                }
                            }}>
                                <Text style={styles.minus_btn_text}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.count_adults}>{this.state.countAdults}</Text>
                            <TouchableOpacity style={styles.plus_btn} onPress={() => {
                                this.setState({
                                    countAdults: this.state.countAdults + 1,
                                    disabledNext: false
                                })
                            }}>
                                <Text style={styles.plus_btn_text}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.buttonsRow}>
                        <View/>

                        <TouchableOpacity
                            disabled={this.state.disabledNext}
                            style={this.state.disabledNext ? [styles.nextButton, {opacity: 0.3}] : styles.nextButton}
                            //activeOpacity={0.8}
                            onPress={() => {
                                this.props.reserve(this.state.countAdults + this.state.countChildren)
                            }}
                        >
                            <Text style={styles.nextButtonText}>
                                OK
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
}

export const Comming = connect()(CommingClass);

const styles = StyleSheet.create({
    content: {
        width: '100%',
        backgroundColor: '#fff',
        marginTop: 22,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    swipeItem: {
        backgroundColor: '#B5B3BD',
        height: 3,
        width: 39,
        borderRadius: 1.5,
        alignSelf: 'center',
        marginTop: 15
    },
    backButtonContainer: {
        marginLeft: 10,
        height: 28,
        width: 28,
        justifyContent: "center",
        alignItems: "center"
    },
    backIcon: {
        resizeMode: 'contain',
        height: 16,
        width: 16
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20
    },
    headerTitle: {
        color: 'black',
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
        fontSize: 20,
        lineHeight: 22
    },
    location_view: {
        marginTop: 28,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 16,
    },
    location_img_view: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(181, 179, 189, 0.2)',
        borderRadius: 4
    },
    location_text: {
        marginLeft: 16,
        fontSize: 16,
        lineHeight: 20,
        color: '#000000',
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    },
    location_date_text: {
        marginLeft: 16,
        marginTop: 4,
        fontSize: 12,
        lineHeight: 15,
        color: '#9A98A3',
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    },
    adults_view: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopColor: '#ECECEC',
        marginHorizontal: 16,
        borderTopWidth: 1,
        marginTop: 37,
        paddingVertical: 24,
    },
    adults_text: {
        fontSize: 18,
        lineHeight: 23,
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
        color: '#000000',
    },
    age_text: {
        fontSize: 14,
        lineHeight: 18,
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
        color: '#9A98A3',
        marginTop: 9
    },
    count_view: {
        width: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    minus_btn: {
        width: 30,
        height: 30,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#979797',
        alignItems: 'center',
        justifyContent: 'center'
    },
    minus_btn_text: {
        fontSize: 22,
        lineHeight: 28,
        color: '#979797'
    },
    count_adults: {
        color: '#000000',
        fontSize: 22,
        lineHeight: 28,
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    },
    plus_btn: {
        width: 30,
        height: 30,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center'
    },
    plus_btn_text: {
        fontSize: 22,
        lineHeight: 28,
        color: '#000000'
    },
    buttonsRow: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 16,
        height: 90
    },
    skipText: {
        color: 'black',
        fontSize: 16,
        lineHeight: 26,
        paddingHorizontal: 10,
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    },
    nextButton: {
        backgroundColor: '#6844F9',
        height: 40,
        width: 96,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center"
    },
    nextButtonText: {
        color: '#fff',
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
        fontSize: 16,
        lineHeight: 18
    },
});
