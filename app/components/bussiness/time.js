import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Text,
    ScrollView,
    TouchableWithoutFeedback,
    Platform
} from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import Back from '../../assets/images/back.png';
import i18n from "../../constants/i18next";


class TimeClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeHourIndex: 22,
            activeMinuteIndex: 50
        };
    }

    _renderHoursScroll() {
        let hours = []
        for (let i = 0; i < 24; i++) {
            hours.push(i < 10 ? '0' + i : '' + i)
        }
        return (<View style={{ width: 60 }}>
            <ScrollView
                onScrollBeginDrag={() => {
                    this.setState({
                        activeHourIndex: null
                    })
                }}
                onScrollEndDrag={(e) => {
                    let value = e.nativeEvent.contentOffset.y / 33
                    value = value.toFixed()
                    this.scroll1.scrollTo({ y: value * 33, x: 0, animated: true })
                    this.setState({
                        activeHourIndex: value
                    })
                }}
                ref={(ref) => { this.scroll1 = ref }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View style={styles.selectItem} />
                {hours.map((item, i) => (<TouchableWithoutFeedback
                    onPress={() => {
                        this.scroll1.scrollTo({ y: i * 33, x: 0, animated: true })
                        this.setState({
                            activeHourIndex: i
                        })
                    }}
                    key={i}
                >
                    <View
                        style={styles.selectItem}
                    >
                        <Text style={[
                            styles.selectItemText,
                            this.state.activeHourIndex == i ?
                                { color: '#fff' } :
                                null]}>
                            {item}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>))}
                <View style={styles.selectItem} />
            </ScrollView></View>)
    }

    _renderMinutesScroll() {
        let minutes = []
        for (let i = 0; i < 60; i++) {
            minutes.push(i < 10 ? '0' + i : '' + i)
        }
        return (<View style={{ width: 60 }}>
            <ScrollView
                onScrollBeginDrag={() => {
                    this.setState({
                        activeMinuteIndex: null
                    })
                }}
                onScrollEndDrag={(e) => {
                    let value = e.nativeEvent.contentOffset.y / 33
                    value = value.toFixed()
                    this.scroll.scrollTo({ y: value * 33, x: 0, animated: true })
                    this.setState({
                        activeMinuteIndex: value
                    })
                }}
                ref={(ref) => { this.scroll = ref }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View style={styles.selectItem} />
                {minutes.map((item, i) => (<TouchableWithoutFeedback
                    onPress={() => {
                        this.scroll.scrollTo({ y: i * 33, x: 0, animated: true })
                        this.setState({
                            activeMinuteIndex: i
                        })
                    }}
                    key={i}
                >
                    <View
                        style={styles.selectItem}
                    >
                        <Text style={[
                            styles.selectItemText,
                            this.state.activeMinuteIndex == i ?
                                { color: '#fff' } :
                                null]}>
                            {item}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>))}
                <View style={styles.selectItem} />
            </ScrollView></View>)
    }

    _renderDots() {
        return (<View>
            <View
                style={[styles.selectItem, { width: 20 }]}
            >
                <Text style={styles.selectItemText}>
                    :
                    </Text>
            </View>
            <View
                style={[styles.selectItem, { width: 20 }]}
            >
                <Text style={[styles.selectItemText, { color: '#fff' }]}>
                    :
                    </Text>
            </View>
            <View
                style={[styles.selectItem, { width: 20 }]}
            >
                <Text style={styles.selectItemText}>
                    :
                    </Text>
            </View>
        </View>)
    }

    render() {
        return (
            <Modal
                onShow={() => {
                    setTimeout(() => { this.scroll1.scrollTo({ y: this.state.activeHourIndex * 33, x: 0, animated: true }) }, 0)
                    setTimeout(() => { this.scroll.scrollTo({ y: this.state.activeMinuteIndex * 33, x: 0, animated: true }) }, 0)
                }}
                onSwipeComplete={() => {
                    this.props.close();
                }}
                swipeDirection="down"
                onBackButtonPress={() => {
                    this.props.close();
                }}
                backdropColor={'#6844F9'}
                backdropOpacity={1}
                style={{ margin: 0,/* marginTop: Dimensions.get('window').height/4.5*/ justifyContent: 'flex-end' }}
                isVisible={this.props.isVisible}>

                <View style={styles.content}>
                    <View style={styles.swipeItem} />
                    <View style={styles.headerRow}>
                        <TouchableOpacity
                            style={styles.backButtonContainer}
                            activeOpacity={0.8}
                            onPress={() => this.props.back({
                                activeHourIndex: this.state.activeHourIndex,
                                activeMinuteIndex: this.state.activeMinuteIndex
                            })}>
                            <Image
                                style={styles.backIcon}
                                source={Back} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>
                            {i18n.t('AT_WHAT_TIME')}
                        </Text>
                        <View style={{ width: 38 }} />
                    </View>
                        <Text style={styles.location_text}>{this.props.city}, {this.props.country}</Text>

                    <View style={styles.time_view}>
                        <Text style={styles.timePickerTitle}>
                            Time
                        </Text>
                        <View style={styles.timeLine} />
                        <View style={styles.pickerRow}>
                            {this._renderHoursScroll()}
                            {this._renderDots()}
                            {this._renderMinutesScroll()}
                        </View>
                    </View>
                    <View style={styles.buttonsRow}>
                        <TouchableOpacity
                            style={[styles.nextButton, { opacity: this.state.opacityNext }]}
                            //activeOpacity={0.8}
                            onPress={() => {
                                this.props.next({
                                    activeHourIndex: this.state.activeHourIndex,
                                    activeMinuteIndex: this.state.activeMinuteIndex
                                })
                            }}
                        >
                            {this.props.payFlag ?
                                <Text style={styles.nextButtonText}>
                                    {i18n.t('NEXT')}
                                </Text>
                                : <Text style={styles.nextButtonText}>
                                    OK
                                </Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
}

export const Time = connect()(TimeClass);

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
    location_text: {
        marginTop: 31,
        marginLeft: 16,
        fontSize: 16,
        lineHeight: 20,
        color: '#000000',
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    },
    time_view: {
        alignSelf: 'center',
        marginTop: 63,
        backgroundColor: '#6844F9',
        borderRadius: 12,
        height: 170,
        width: 233
    },
    buttonsRow: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'flex-end',
        marginHorizontal: 16,
        height: 90,
        marginTop: 45
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
    selectItem: {
        height: 33,
        width: 60,
        justifyContent: "center",
        alignItems: "center",
    },
    selectItemText: {
        color: 'rgba(255,255,255,0.22)',
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
        fontSize: 20,
        lineHeight: 22
    },
    timePickerTitle: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 14,
        lineHeight: 18,
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
        marginTop: 13
    },
    timeLine: {
        alignSelf: 'center',
        height: 1,
        width: 14,
        marginTop: 3,
        backgroundColor: '#fff'
    },
    pickerRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 99
    }
});
