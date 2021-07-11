import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    StatusBar,
    Platform,
    Image,
    TouchableOpacity,
    Text,
    ScrollView,
    Animated
} from 'react-native';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';
import Back from '../../assets/images/back.png';
import {AddReview} from './addReview'
import moment from "moment";
import i18n from "../../constants/i18next";

class ReviewsClass extends Component {
    canAnimate = true
    offset = 0

    constructor(props) {
        super(props);
        this.state = {
            addReviewsVisible: false,
            curY: new Animated.Value(0),
            elevation: 0
        };
    }

    time(date) {
        let now = new Date();
        let then = date;
        let min = moment(now, "YYYY-MM-DD HH:mm:ss").diff(moment(then, "YYYY-MM-DD HH:mm:ss"), "minutes");
        if (min <= 60) {
            return <Text>{min} min</Text>
        } else {
            let hours = moment(now, "YYYY-MM-DD HH:mm:ss").diff(moment(then, "YYYY-MM-DD HH:mm:ss"), "hours");
            if (hours <= 24) {
                return <Text>{hours} hours</Text>
            } else {
                let day = moment(now, "YYYY-MM-DD HH:mm:ss").diff(moment(then, "YYYY-MM-DD HH:mm:ss"), "day");
                if (day <= 30) {
                    return <Text>{day} days</Text>
                } else {
                    let month = moment(now, "YYYY-MM-DD HH:mm:ss").diff(moment(then, "YYYY-MM-DD HH:mm:ss"), "month");
                    if (month <= 12) {
                        return <Text>{month} months</Text>
                    } else {
                        let year = moment(now, "YYYY-MM-DD HH:mm:ss").diff(moment(then, "YYYY-MM-DD HH:mm:ss"), "year");
                        return <Text>{year} years</Text>
                    }
                }
            }
        }
    }


    _renderReviews() {
        return this.props.reviews.map((data, index) => {
            return (
                <View style={styles.reviews_item_view} key={index}>
                    <View style={styles.reviews_item_header_view}>
                        <View style={styles.reviews_item_avatar_view}>
                            {data.customer.photo ?
                                <Image source={{uri: data.customer.photo}} style={{width: 26, height: 26}}/>
                                :
                                <View style={styles.avatar_view}>
                                    <Text style={styles.avatar_text}>{data.customer.last_name[0]}</Text>
                                </View>
                            }
                            <View style={styles.reviews_item_info_view}>
                                <Text
                                    style={styles.name_text}>{data.customer.last_name} {data.customer.first_name}</Text>
                                <Text style={styles.time_text}>{this.time(data.created_at)}</Text>
                            </View>
                        </View>
                        <View style={styles.reviews_item_rating_view}>
                            <Image source={require('../../assets/images/star.png')} style={styles.star_img}/>
                            <Text style={styles.reting_text}>{data.rate}</Text>
                        </View>
                    </View>
                    <Text style={styles.reviews_item_text}>{data.review}</Text>
                </View>
            )
        })
    }

    headerBorder(offsetY) {
        if (offsetY > 0 && this.canAnimate) {
            this.canAnimate = false;
            this.setState({
                elevation: 5
            })
        } else if (offsetY <= 0 && !this.canAnimate) {
            this.canAnimate = true
            this.setState({
                elevation: 0
            })
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
                testID={'modal'}
                animationIn="slideInRight"
                animationOut="slideOutRight"
                animationInTiming={500}
                backdropColor={'rgb(255,255,255,0)'}
                backdropOpacity={1}
                style={{margin: 0, marginTop: 0}}
                isVisible={this.props.isVisible}>
                <View style={styles.content}>
                    <View style={[styles.headerRow, {
                        backgroundColor: '#fff',
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,

                        elevation: this.state.elevation,
                    }]}>
                        <View style={styles.back_view}>
                            <TouchableOpacity
                                style={styles.backButtonContainer}
                                activeOpacity={0.8}
                                onPress={() => this.props.close()}>
                                <Image
                                    style={styles.backIcon}
                                    source={Back}/>
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>
                                {i18n.t('REVIEW')}
                            </Text>
                        </View>
                        <View style={styles.header_reating_view}>
                            <Image source={require('../../assets/images/star.png')} style={styles.start_img}/>
                            <Text style={styles.header_reating_text}>{this.props.rate} ({this.props.reviews.length} revies)</Text>
                        </View>
                    </View>
                    {this.props.add ? <TouchableOpacity
                        onPress={() => {
                            this.setState({
                                addReviewsVisible: true
                            })
                        }}
                        style={styles.addButton}
                    >
                        <Text style={styles.addButtonText}>
                            + Add a review
                        </Text>
                    </TouchableOpacity> : null}
                    <Animated.ScrollView
                        showsVerticalScrollIndicator={false}
                        scrollEventThrottle={1}
                        contentContainerStyle={{flexGrow: 1}}
                        onScroll={Animated.event(
                            [{
                                nativeEvent: {contentOffset: {y: this.state.curY}}
                            }],
                            {
                                useNativeDriver: false,
                                listener: event => {
                                    const offsetY = event.nativeEvent.contentOffset.y
                                    this.headerBorder(offsetY)
                                },
                            },
                        )}>
                        <View style={styles.reviews_view}>
                            {this._renderReviews()}
                        </View>
                    </Animated.ScrollView>
                    <AddReview
                        close={() => {
                            this.setState({addReviewsVisible: false});
                        }}
                        isVisible={this.state.addReviewsVisible}
                    />
                </View>
            </Modal>
        );
    }
}

export const Reviews = connect()(ReviewsClass);

const styles = StyleSheet.create({
    content: {
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
        marginTop: 15
    },
    backButtonContainer: {
        height: 53,
        width: 50,
        paddingLeft: 16,
        justifyContent: "center",
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
        paddingTop: 20,
        marginBottom: 10,
    },
    back_view: {
        flexDirection: "row",
        alignItems: 'center',
    },
    headerTitle: {
        color: 'black',
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
        fontSize: 18,
        lineHeight: 22
    },
    header_reating_view: {
        marginRight: 16,
        flexDirection: 'row',
        alignItems: 'center'
    },
    start_img: {
        width: 16,
        height: 16,
    },
    header_reating_text: {
        marginLeft: 6,
        color: '#060606',
        fontSize: 14,
        lineHeight: 18,
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    },
    reviews_view: {
        flex: 1,
        marginTop: 8,
        paddingBottom: 30,
    },
    reviews_item_view: {
        marginBottom: 10,
        paddingHorizontal: 14,
        marginHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ECECEE',
        backgroundColor: '#fff'
    },
    reviews_item_header_view: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    reviews_item_avatar_view: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 17,
    },
    avatar_view: {
        backgroundColor: '#6844F9',
        width: 26,
        height: 26,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50
    },
    avatar_text: {
        color: '#fff'
    },
    reviews_item_info_view: {
        marginLeft: 11
    },
    name_text: {
        fontSize: 12,
        color: '#000000',
        lineHeight: 17,
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    },
    time_text: {
        fontSize: 10,
        color: '#B5B3BD',
        lineHeight: 14,
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
        marginTop: 5
    },
    reviews_item_rating_view: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    star_img: {
        width: 12,
        height: 12
    },
    reting_text: {
        fontSize: 12,
        lineHeight: 15,
        marginLeft: 5,
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    },
    reviews_item_text: {
        marginTop: 11,
        color: '#000000',
        fontSize: 12,
        lineHeight: 16,
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
        marginBottom: 12,
        marginLeft: 48
    },
    addButton: {
        width: 109,
        height: 34,
        borderColor: '#6844F9',
        borderWidth: 1,
        alignSelf: 'flex-end',
        marginRight: 16,
        borderRadius: 8,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        color: '#6844F9',
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
        fontSize: 12
    }
});
