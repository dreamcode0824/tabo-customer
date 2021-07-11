import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Text,
    ScrollView,
    Animated,
    Dimensions
} from 'react-native';
import {connect} from 'react-redux';
import Carousel from '../../components/carousel/carousel'

import {
    BookCalendar,
    Comming,
    Time,
    ImageZoomModal,
    Reviews,
    DropDownBusiness,
    Menu,
    Rules,
    LikeBusiness,
    TermsConditions,
    PaymentChoose,
    AddCard,
    Payment
} from '../../components';

const imgHeight = Dimensions.get('window').width

class BusinessTestClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            facilitiesShow: false,
            cabana: false,
            bed: false,
            baldaquin: false,
            sunbed: false,
            umbrella: false,
            zoomVisible: false,
            bookCalendarVisible: false,
            commingVisible: false,
            paymentChooseVisible: false,
            paymentAddVisible: false,
            paymentVisible: false,
            timeVisible: false,
            reviewsVisible: false,
            menuVisible: false,
            termsConditionsVisible: false,
            rulesVisible: false,
            question1: false,
            question2: false,
            like: false,
            landscape: false,
            seat: '',
            reviews: [1, 2, 3, 4],
            height: new Animated.Value(0),
            opacity: new Animated.Value(0),
            opacityBtn: new Animated.Value(1),
            data: {
                active: false,
                dummyData: [
                    {
                        url: require('../../assets/images/slide1.png'),
                        id: 1

                    },
                    {
                        url: require('../../assets/images/slide2.png'),
                        id: 2
                    },
                    {
                        url: require('../../assets/images/slide3.png'),
                        id: 3
                    }
                ],
            },
            activeSlide: 0,
            related: [
                {
                    type: 'Club',
                    name: 'Vuela Vuela lomas',
                    price: '$50',
                    rating: '5.0',
                    ticket: 1
                },
                {
                    type: 'Club',
                    name: 'Vuela Vuela lomas',
                    price: '$50',
                    rating: '5.0',
                    ticket: 1
                },
                {
                    type: 'Beach & Pool',
                    name: 'Vuela Vuela lomas',
                    price: '$50',
                    rating: '5.0',
                    ticket: 1
                },
                {
                    type: 'Terraces & Restaurants',
                    name: 'Vuela Vuela lomas',
                    price: '$50',
                    rating: '5.0',
                    ticket: 1
                },
            ],
            img: [
                require('../../assets/images/slide1.png'),
                require('../../assets/images/slide2.png'),
                require('../../assets/images/slide3.png')
            ],
            quantity: ['1', '2', '3', '4',],
            quantityItem: '1',
            size: ['1', '2', '3', '4',],
            sizeItem: '1',
        };
    }

    componentDidMount() {
        this.getOrientation();
        Dimensions.addEventListener(
            'change',
            this.getOrientation
        );
        let arr = []
        this.state.img.map(data => {
            arr.push({
                props: {
                    source: data
                }
            })
        })
        this.setState({zoomImg: arr})
    }

    componentWillUnmount() {
        Dimensions.removeEventListener(
            'change',
            this.getOrientation
        )
        clearTimeout(this.time);
    }

    handleChange = (e, name) => {
        this.setState({
            [name]: e,
        });
    }

    changeSeat(name, seatChoose) {
        if (this.state.seat === name) {
            return this.setState({
                [name]: !this.state.seat,
                [seatChoose]: !this.state.seat,
                seat: ''
            })
        }
        this.setState({
            [name]: true,
            [seatChoose]: false,
            seat: name
        })
    }

    _renderfacilities() {
        return (
            <TouchableOpacity onPress={() => {
                this.setState({facilitiesShow: !this.state.facilitiesShow})
                this.setAnimation(this.state.facilitiesShow)
            }}>
                <Text style={styles.facilities_text}>Facilities</Text>
                <Text style={styles.text1}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </Text>
                <View style={styles.facilities_view}>
                    <View>
                        <View style={styles.facilities_item_view}>
                            <Image source={require('../../assets/images/wave.png')} style={styles.facilities_img}/>
                            <Text style={styles.facilities_item_text}>Blue Flag</Text>
                        </View>
                        <View style={styles.facilities_item_view}>
                            <Image source={require('../../assets/images/motor.png')} style={styles.facilities_img}/>
                            <Text style={styles.facilities_item_text}>Ski-Jet</Text>
                        </View>
                        <View style={[styles.facilities_item_view, !this.state.facilitiesShow && {opacity: 0.2}]}>
                            <Image source={require('../../assets/images/child.png')} style={styles.facilities_img}/>
                            <Text style={styles.facilities_item_text}>Kids</Text>
                        </View>
                        <Animated.View style={[
                            {
                                height: this.state.height,
                                opacity: this.state.opacity
                            }
                        ]}>
                            <View style={styles.facilities_item_view}>
                                <Image source={require('../../assets/images/massage.png')}
                                       style={styles.facilities_img}/>
                                <Text style={styles.facilities_item_text}>Massage</Text>
                            </View>
                            <View style={styles.facilities_item_view}>
                                <Image source={require('../../assets/images/credit-card.png')}
                                       style={styles.facilities_img}/>
                                <Text style={styles.facilities_item_text}>Credit Card</Text>
                            </View>
                        </Animated.View>

                    </View>
                    <View>
                        <View style={styles.facilities_item_view}>
                            <Image source={require('../../assets/images/restoran.png')} style={styles.facilities_img}/>
                            <Text style={styles.facilities_item_text}>Restaurant</Text>
                        </View>
                        <View style={styles.facilities_item_view}>
                            <Image source={require('../../assets/images/coffee-cup.png')}
                                   style={styles.facilities_img}/>
                            <Text style={styles.facilities_item_text}>Ski-Jet</Text>
                        </View>
                        <View style={[styles.facilities_item_view, !this.state.facilitiesShow && {opacity: 0.2}]}>
                            <Image source={require('../../assets/images/shower.png')} style={styles.facilities_img}/>
                            <Text style={styles.facilities_item_text}>Kids</Text>
                        </View>
                        <Animated.View style={[
                            {
                                height: this.state.height,
                                opacity: this.state.opacity
                            }
                        ]}>
                            <View style={styles.facilities_item_view}>
                                <Image source={require('../../assets/images/games.png')} style={styles.facilities_img}/>
                                <Text style={styles.facilities_item_text}>Games</Text>
                            </View>
                            <View style={styles.facilities_item_view}>
                                <Image source={require('../../assets/images/wi-fi.png')} style={styles.facilities_img}/>
                                <Text style={styles.facilities_item_text}>Wi-Fi</Text>
                            </View>
                        </Animated.View>
                    </View>
                </View>
                <Animated.View style={[styles.down_img_view, {
                    opacity: this.state.opacityBtn
                }]}>
                    <Image source={require('../../assets/images/down1.png')} style={styles.down_img}/>
                </Animated.View>
            </TouchableOpacity>
        )
    }

    _renderChooseSeat() {
        return (
            <View style={styles.seat_view}>
                <Text style={styles.seat_text}>Choose a seat</Text>
                <TouchableOpacity style={styles.seat_item_view} onPress={() => {
                    this.changeSeat('cabana', this.state.seat)
                }}>
                    <View style={[styles.seat_item_checkbox, this.state.cabana && {borderColor: '#6844F9'}]}>
                        <Text
                            style={[styles.seat_item_checkbox_text, this.state.cabana && {backgroundColor: '#6844F9'}]}/>
                    </View>
                    <View style={styles.seat_item_info_view}>
                        <View style={styles.seat_title_item_view}>
                            <Image source={require('../../assets/images/cabana.png')} style={styles.seat_caban_img}/>
                            <Text style={styles.seat_item_title_text}>Cabana</Text>
                        </View>
                        <Text style={styles.seat_item_info_text}>Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry.</Text>
                    </View>
                </TouchableOpacity>
                <View>
                    <TouchableOpacity style={styles.seat_item_view}
                                      onPress={() => this.changeSeat('bed', this.state.seat)}>
                        <View style={[styles.seat_item_checkbox, this.state.bed && {borderColor: '#6844F9'}]}>
                            <Text
                                style={[styles.seat_item_checkbox_text, this.state.bed && {backgroundColor: '#6844F9'}]}/>
                        </View>
                        <View style={styles.seat_item_info_view}>
                            <View style={styles.seat_title_item_view}>
                                <Image source={require('../../assets/images/bed.png')} style={styles.seat_img}/>
                                <Text style={styles.seat_item_title_text}>Bed</Text>
                            </View>
                            <Text style={styles.seat_item_info_text}>Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.select_title}>Select size</Text>
                    <View style={[{marginLeft: 25, marginTop: 7}]}>
                        <DropDownBusiness data={this.state.quantity} handleChange={this.handleChange}
                                          title={this.state.quantityItem} dropdownName='quantityItem'/>
                    </View>
                    <View style={styles.questions_view}>
                        <Text style={styles.questions_text}>Do you like the seats in the 1st row</Text>
                        <View style={styles.questions_btn_view}>
                            <TouchableOpacity
                                style={[styles.like_row_no_yes_btn, !this.state.question1 && {backgroundColor: '#6844F9'}]}
                                onPress={() => {
                                    this.setState({question1: false})
                                }}>
                                <Text
                                    style={[styles.like_row_no_yes_text, !this.state.question1 && {color: '#fff'}]}>No</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.like_row_no_yes_btn, this.state.question1 && {backgroundColor: '#6844F9'}]}
                                onPress={() => {
                                    this.setState({question1: true})
                                }}>

                                <Text
                                    style={[styles.like_row_no_yes_text, this.state.question1 && {color: '#fff'}]}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.questions_view}>
                        <Text style={styles.questions_text}>Do you like to rent an umbrella also?</Text>
                        <View style={styles.questions_btn_view}>
                            <TouchableOpacity
                                style={[styles.like_row_no_yes_btn, !this.state.question2 && {backgroundColor: '#6844F9'}]}
                                onPress={() => {
                                    this.setState({question2: false})
                                }}>
                                <Text
                                    style={[styles.like_row_no_yes_text, !this.state.question2 && {color: '#fff'}]}>No</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.like_row_no_yes_btn, this.state.question2 && {backgroundColor: '#6844F9'}]}
                                onPress={() => {
                                    this.setState({question2: true})
                                }}>
                                <Text
                                    style={[styles.like_row_no_yes_text, this.state.question2 && {color: '#fff'}]}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={styles.seat_item_view}
                                  onPress={() => this.changeSeat('baldaquin', this.state.seat)}>
                    <View style={[styles.seat_item_checkbox, this.state.baldaquin && {borderColor: '#6844F9'}]}>
                        <Text
                            style={[styles.seat_item_checkbox_text, this.state.baldaquin && {backgroundColor: '#6844F9',}]}/>
                    </View>
                    <View style={styles.seat_item_info_view}>
                        <View style={styles.seat_title_item_view}>
                            <Image source={require('../../assets/images/cabana.png')} style={styles.seat_caban_img}/>
                            <Text style={styles.seat_item_title_text}>Baldaquin</Text>
                        </View>
                        <Text style={styles.seat_item_info_text}>Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry.</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.seat_item_view}
                                  onPress={() => this.changeSeat('sunbed', this.state.seat)}>
                    <View style={[styles.seat_item_checkbox, this.state.sunbed && {borderColor: '#6844F9'}]}>
                        <Text
                            style={[styles.seat_item_checkbox_text, this.state.sunbed && {backgroundColor: '#6844F9',}]}/>
                    </View>
                    <View style={styles.seat_item_info_view}>
                        <View style={styles.seat_title_item_view}>
                            <Image source={require('../../assets/images/sunbed.png')} style={styles.seat_img}/>
                            <Text style={styles.seat_item_title_text}>Sunbed</Text>
                        </View>
                        <Text style={styles.seat_item_info_text}>Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry.</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.seat_item_view}
                                  onPress={() => this.changeSeat('umbrella', this.state.seat)}>
                    <View style={[styles.seat_item_checkbox, this.state.umbrella && {borderColor: '#6844F9'}]}>
                        <Text
                            style={[styles.seat_item_checkbox_text, this.state.umbrella && {backgroundColor: '#6844F9',}]}/>
                    </View>
                    <View style={styles.seat_item_info_view}>
                        <View style={styles.seat_title_item_view}>
                            <Image source={require('../../assets/images/umbrella.png')} style={styles.seat_img}/>
                            <Text style={styles.seat_item_title_text}>Umbrella</Text>
                        </View>
                        <Text style={styles.seat_item_info_text}>Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry.</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    _renderReviews() {
        return (
            <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal={true}
            >
                <View style={styles.reviews_view}>
                    {this.state.reviews.map((data, index) => {
                        return (
                            <View key={index} style={styles.review_item_view}>
                                <View style={styles.reviews_info}>
                                    <View style={styles.reviews_info_view}>
                                        <Image source={require('../../assets/images/reviews-avatar.png')}/>
                                        <View>
                                            <Text style={styles.reviews_info_name_text}>Joan.S</Text>
                                            <Text style={styles.reviews_info_time_text}>2 min</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.ratingRow, {marginLeft: 25}]}>
                                        <Image
                                            source={require('../../assets/images/star.png')}
                                            style={styles.star}/>
                                        <Text style={styles.ratingText}>5.0</Text>
                                    </View>
                                </View>
                                <Text style={styles.reviews_info_text}>Love this place ^^</Text>
                            </View>
                        )
                    })}
                </View>
            </ScrollView>
        )
    }

    _renderRelated() {
        return (
            <View style={styles.related_view}>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                >
                    {this.state.related.map((data, index) => {
                        return (
                            <View key={index} style={styles.related_item_view}>
                                <Image source={require('../../assets/images/slide1.png')} style={styles.related_img}/>
                                <View style={styles.related_type_view}>
                                    <Text style={styles.related_type_text}>{data.type}</Text>
                                </View>
                                <View style={styles.related_info_view}>
                                    <Text style={styles.related_name_text}>{data.name}</Text>
                                    <View style={styles.related_rating_view}>
                                        <Image source={require('../../assets/images/star.png')}
                                               style={styles.img_star}/>
                                        <Text style={styles.related_rating_text}>{data.rating}</Text>
                                    </View>
                                </View>
                                <Text style={styles.related_price_text}>{data.price} / <Text
                                    style={styles.related_ticket_text}>{data.ticket} ticket</Text></Text>
                            </View>
                        )
                    })}
                </ScrollView>
            </View>
        )
    }

    setAnimation(disable) {
        Animated.timing(this.state.height, {
            duration: 300,
            toValue: disable ? 0 : 35,
            useNativeDriver: false
        }).start(() => {
        })

        Animated.timing(this.state.opacity, {
            duration: 10,
            toValue: disable ? 0 : 1,
            useNativeDriver: false
        }).start(() => {
        })
        Animated.timing(this.state.opacityBtn, {
            duration: 10,
            toValue: disable ? 1 : 0,
            useNativeDriver: false
        }).start(() => {
        })
    };

    getOrientation = () => {
        if (Dimensions.get('window').width < Dimensions.get('window').height) {
            this.setState({landscape: false});
        } else {
            this.setState({landscape: true});
        }
    }

    zoom = () => {
        this.setState({
            zoomVisible: true
        })
    }

    render() {
        return (
            <View style={styles.content}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.sliderContainer}>
                        <View>
                            <Carousel data = {this.state.data.dummyData} style={'full'} zoom={this.zoom}/>
                        </View>
                        <TouchableOpacity style={styles.icon_btn}>
                            <Image source={require('../../assets/images/icon.png')} style={{width: 19, height: 19}}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.close_btn} onPress={() => this.props.navigation.goBack()}>
                            <Image source={require('../../assets/images/close_icon.png')}
                                   style={{width: 15, height: 15}}/>
                        </TouchableOpacity>
                        <LikeBusiness
                            business={true}
                            active={this.state.like}
                            setActive={() => {
                                this.setState({
                                    like: !this.state.like
                                })
                            }}
                        />
                    </View>
                    <View style={styles.ratingRow}>
                        <Image
                            source={require('../../assets/images/star.png')}
                            style={styles.star}/>
                        <Text style={styles.ratingText}>5.0</Text>
                    </View>
                    <Text style={styles.itemText}>
                        Vuela Vuela lomas | Mexico
                    </Text>
                    <Text style={styles.priceText}>
                        $50 / <Text style={styles.priceSmallText}>1 ticket</Text>
                    </Text>
                    <Text style={styles.line_text}/>
                    {this._renderfacilities()}
                    <Text style={styles.line_text}/>
                    <Text style={styles.location_text}>Location</Text>
                    <Image source={require('../../assets/images/map.png')} style={styles.map_img}/>
                    <Text style={styles.nearby_text}>Nearby Places</Text>
                    <View>
                        <View style={styles.nearby_item_view}>
                            <Text style={styles.nearby_text_item_text}>Licorería Limantour</Text>
                            <Text style={styles.nearby_text_item_text}>1.2 km</Text>
                        </View>
                        <View style={styles.nearby_item_view}>
                            <Text style={styles.nearby_text_item_text}>RR Live</Text>
                            <Text style={styles.nearby_text_item_text}>1.2 km</Text>
                        </View>
                        <View style={styles.nearby_item_view}>
                            <Text style={styles.nearby_text_item_text}>Camino Real Polanco México</Text>
                            <Text style={styles.nearby_text_item_text}>1.2 km</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={[styles.more_btn, {marginTop: 20}]}>
                        <Text style={styles.more_btn_text}>More about the location</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rules_view} onPress={() => this.setState({rulesVisible: true})}>
                        <View style={{width: '90%'}}>
                            <Text style={styles.rules_text}>Rules</Text>
                            <Text style={styles.rules_info_text}>Lorem Ipsum is simply dummy text of the
                                printing
                                and typesetting industry.</Text>
                        </View>
                        <Image source={require('../../assets/images/next.png')} style={styles.next_img}/>
                    </TouchableOpacity>
                    <Text style={styles.line_text}/>
                    <View style={styles.ofer_img_view}>
                        <Image source={require('../../assets/images/spacial-offer.png')}/>
                    </View>
                    <Text style={styles.line_text}/>
                    <TouchableOpacity style={styles.rules_view} onPress={() => this.setState({menuVisible: true})}>
                        <View style={{width: '90%'}}>
                            <Text style={styles.rules_text}>Beach Menu</Text>
                            <Text style={styles.rules_info_text}>Lorem Ipsum is simply dummy text of the
                                printing
                                and typesetting industry.</Text>
                        </View>
                        <View>
                            <Image source={require('../../assets/images/next.png')} style={styles.next_img}/>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.line_text}/>
                    {this._renderChooseSeat()}
                    <Text style={styles.line_text}/>
                    <Text style={styles.select_quantity_text}>Select quantity</Text>
                    <Text style={styles.select_quantity_info}>Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry.</Text>
                    <View style={[{marginLeft: 16, marginTop: 20}]}>
                        <DropDownBusiness data={this.state.quantity} handleChange={this.handleChange}
                                          title={this.state.quantityItem} dropdownName='quantityItem'/>
                    </View>
                    <Text style={styles.line_text}/>
                    <TouchableOpacity style={styles.terms_view}
                                      onPress={() => this.setState({termsConditionsVisible: true})}>
                        <View style={{width: '90%'}}>
                            <Text style={styles.terms_text}>Terms & Conditions</Text>
                            <Text style={styles.terms_info_text}>By selecting Reserve, I agree to Tabo’s <Text
                                style={[styles.terms_info_text, {
                                    fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
                                    color: '#000'
                                }]}>Terms
                                & Conditions</Text> and <Text
                                style={[styles.terms_info_text, {
                                    fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
                                    color: '#000'
                                }]}>Privacy
                                Policy</Text>
                            </Text>
                        </View>
                        <Image source={require('../../assets/images/next.png')} style={styles.next_img}/>
                    </TouchableOpacity>
                    <Text style={styles.line_text}/>
                    <Text style={styles.reviews_text}>Reviews</Text>
                    {this._renderReviews()}
                    <TouchableOpacity style={styles.more_btn} onPress={() => this.setState({reviewsVisible: true})}>
                        <Text style={styles.more_btn_text}>Show all reviews</Text>
                    </TouchableOpacity>
                    <Text style={styles.line_text}/>
                    <Text style={styles.related_text}>Related places</Text>
                    {this._renderRelated()}
                </ScrollView>
                <View style={[styles.reserve_view]}>
                    <Text style={styles.price_text}><Text style={[styles.price_text, {
                        color: '#000',
                        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
                        fontSize: 16
                    }]}>$33 /</Text> 1 seat</Text>
                    <TouchableOpacity style={styles.reserve_btn}
                                      onPress={() => this.setState({bookCalendarVisible: true})}>
                        <Text style={styles.reserve_btn_text}>Reserve</Text>
                    </TouchableOpacity>
                </View>
                <BookCalendar
                    close={() => {
                        this.setState({bookCalendarVisible: false});
                    }}
                    next={() => {
                        this.setState({commingVisible: true});
                    }}
                    skip={() => {
                        this.setState({commingVisible: true});
                    }}
                    isVisible={this.state.bookCalendarVisible}
                />
                <Comming
                    close={() => {
                        this.setState({bookCalendarVisible: true, commingVisible: false});
                    }}
                    next={() => {
                        this.setState({bookCalendarVisible: false, timeVisible: true});
                    }}
                    skip={() => {
                        this.setState({ bookCalendarVisible: false, timeVisible: true});
                    }}
                    navigation={this.props.navigation}
                    isVisible={this.state.commingVisible}
                />
                <Time
                    close={() => {
                        this.setState({timeVisible: false});
                    }}
                    next={() => {
                        this.setState({commingVisible: false, paymentChooseVisible: true});
                    }}
                    skip={() => {
                        this.setState({commingVisible: false,  paymentChooseVisible: true });
                    }}
                    isVisible={this.state.timeVisible}
                />
                <PaymentChoose
                    close={() => {
                        this.setState({paymentChooseVisible: false});
                    }}
                    next={() => {
                        this.setState({timeVisible: false, paymentAddVisible: true});
                    }}
                    isVisible={this.state.paymentChooseVisible}
                />
                <AddCard
                    close={() => {
                        this.setState({paymentAddVisible: false});
                    }}
                    next={() => {
                        this.setState({paymentChooseVisible: false, paymentVisible: true});
                    }}
                    isVisible={this.state.paymentAddVisible}
                />
                <Payment
                    close={() => {
                        this.setState({paymentVisible: false});
                    }}
                    next={() => {
                        this.setState({paymentAddVisible: false, paymentVisible: false});
                    }}
                    isVisible={this.state.paymentVisible}
                />
                <ImageZoomModal
                    close={() => {
                        this.setState({zoomVisible: false});
                    }}
                    zoomImg={this.state.zoomImg}
                    isVisible={this.state.zoomVisible}
                />
               {/* <Reviews
                    close={() => {
                        this.setState({reviewsVisible: false});
                    }}
                    isVisible={this.state.reviewsVisible}
                />*/}
                <Menu
                    close={() => {
                        this.setState({menuVisible: false});
                    }}
                    isVisible={this.state.menuVisible}
                />
                <Rules
                    close={() => {
                        this.setState({rulesVisible: false});
                    }}
                    isVisible={this.state.rulesVisible}
                />
                <TermsConditions
                    close={() => {
                        this.setState({termsConditionsVisible: false});
                    }}
                    isVisible={this.state.termsConditionsVisible}
                />
            </View>
        );
    }
}

export const BusinessTest = connect()(BusinessTestClass);

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    sliderContainer: {
        height:  imgHeight*9/16,
    },
    item: {
        height:  imgHeight*9/16,
    },
    imageContainer: {
        marginBottom: Platform.select({ios: 0, android: 1}),
        backgroundColor: 'white',
        borderRadius: 8,
        height: imgHeight*9/16
    },
    image: {
        resizeMode: 'cover',
    },
    icon_btn: {
        height: 35,
        width: 35,
        backgroundColor: '#fff',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 61,
        top: 19,
    },
    heart_icon_btn: {
        position: 'absolute',
        right: 16,
        top: 19,
        backgroundColor: '#fff',
        width: 32,
        height: 32,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1
    },
    close_btn: {
        position: 'absolute',
        left: 27,
        top: 19,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        backgroundColor: '#fff',
        width: 35,
        height: 35
    },
    categoryText: {
        fontSize: 10,
        lineHeight: 12,
        color: 'black',
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    },
    img: {
        width: '100%',
        height: 238
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 16,
        marginTop: 8,
        marginBottom: 7,
    },
    star: {
        height: 12,
        width: 12,
    },
    ratingText: {
        color: '#060606',
        fontSize: 11,
        lineHeight: 14,
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
        marginLeft: 5,
    },
    itemText: {
        color: 'black',
        fontSize: 16,
        lineHeight: 18,
        marginLeft: 16,
        marginTop: 2,
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    },
    priceText: {
        color: 'black',
        fontSize: 14,
        lineHeight: 16,
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
        marginLeft: 16,
        marginTop: 4,
    },
    line_text: {
        marginHorizontal: 16,
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(151, 151, 151, 0.13)'
    },
    facilities_title_view: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 16
    },
    facilities_text: {
        marginLeft: 16,
        fontSize: 14,
        lineHeight: 20,
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
        color: '#000'
    },
    text1: {
        marginLeft: 16,
        marginRight: 16,
        marginTop: 7,
        fontSize: 10,
        lineHeight: 14,
        color: '#898989'
    },
    down_img_view: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    down_img: {
        width: 14,
        height: 7.54
    },
    facilities_view: {
        marginLeft: 16,
        marginRight: 70,
        marginTop: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    facilities_img: {
        width: 14,
        height: 14
    },
    facilities_item_view: {
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    facilities_item_text: {
        marginLeft: 16,
        fontSize: 12,
        color: '#000000',
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    },
    location_text: {
        marginLeft: 16,
        fontSize: 14,
        lineHeight: 20,
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
        color: '#000'
    },
    reserve_view: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 90,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    price_text: {
        color: '#898989',
        fontSize: 12,
    },
    reserve_btn: {
        width: 108,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6844F9',
        borderRadius: 8,
    },
    reserve_btn_text: {
        fontSize: 16,
        color: '#FFFFFF',
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    },
    map_img: {
        marginTop: 20,
        width: '100%',
        marginHorizontal: 16
    },
    nearby_text: {
        marginLeft: 16,
        marginTop: 15,
        fontSize: 12,
        lineHeight: 19,
        color: '#000000',
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    },
    nearby_item_view: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 16,
        marginTop: 10
    },
    nearby_text_item_text: {
        fontSize: 12,
        color: '#000',
        lineHeight: 19,
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    },
    more_btn: {
        height: 44,
        marginHorizontal: 16,
        borderRadius: 5,
        borderColor: 'rgba(104, 68, 249, 0.03)',
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    more_btn_text: {
        color: '#2C2929',
        fontSize: 14,
        lineHeight: 18,
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    },
    rules_view: {
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rules_text: {
        marginTop: 15,
        fontSize: 12,
        lineHeight: 19,
        color: '#000000',
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    },
    rules_info_text: {
        marginTop: 7,
        fontSize: 10,
        lineHeight: 14,
        color: '#898989'
    },
    next_img: {
        height: 14,
        width: 14,
        borderWidth: 1,
    },
    ofer_img_view: {
        alignItems: 'center'
    },
    seat_view: {
        marginLeft: 16
    },
    seat_text: {
        fontSize: 12,
        lineHeight: 19,
        color: '#000000',
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    },
    seat_item_view: {
        flexDirection: 'row',
        marginTop: 20
    },
    seat_item_checkbox: {
        marginTop: 5,
        width: 15,
        height: 15,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#979797',
        alignItems: 'center',
        justifyContent: 'center'
    },
    seat_item_checkbox_text: {
        width: 7.5,
        height: 7.5,
        borderRadius: 50,
    },
    seat_item_info_view: {
        marginLeft: 10,
    },
    seat_title_item_view: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    seat_img: {
        width: 15,
        height: 15,
    },
    seat_caban_img: {
        width: 19,
        height: 14,
    },
    seat_item_title_text: {
        fontSize: 14,
        lineHeight: 20,
        color: '#000000',
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
        marginLeft: 4,
    },
    seat_item_info_text: {
        fontSize: 10,
        lineHeight: 14,
        color: '#898989',
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
        marginTop: 6
    },
    select_title: {
        marginLeft: 26,
        marginTop: 12,
        color: '#000',
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
        fontSize: 12,
        lineHeight: 17,
    },
    select_text: {
        color: '#2C2929',
        fontSize: 12,
        lineHeight: 15,
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    },
    select_quantity_text: {
        marginLeft: 16,
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
        fontSize: 14,
        lineHeight: 20
    },
    select_quantity_info: {
        marginLeft: 16,
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
        fontSize: 10,
        lineHeight: 14,
        color: '#898989',
        marginTop: 7,
    },
    questions_view: {
        marginLeft: 25,
        marginTop: 20
    },
    questions_text: {
        color: '#000',
        fontSize: 12,
        lineHeight: 17,
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    },
    questions_btn_view: {
        flexDirection: 'row',
        marginTop: 12,
        alignItems: 'center',

    },
    like_row_no_yes_btn: {
        marginRight: 12,
        width: 53,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(181, 179, 189, 0.25)'
    },
    like_row_no_yes_text: {
        color: 'rgba(44, 41, 41, 0.37)',
        lineHeight: 15,
        fontSize: 12,
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    },
    terms_view: {
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    terms_text: {
        marginTop: 15,
        fontSize: 12,
        lineHeight: 19,
        color: '#000000',
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    },
    terms_info_text: {
        marginTop: 7,
        fontSize: 10,
        lineHeight: 14,
        color: '#898989',
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    },
    reviews_text: {
        fontSize: 14,
        lineHeight: 20,
        color: '#000000',
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
        marginLeft: 16
    },
    reviews_view: {
        flexDirection: 'row',
        marginTop: 20,
        paddingBottom: 20,
    },
    review_item_view: {
        width: 166,
        marginLeft: 12,
        borderRadius: 6,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
    },
    reviews_info: {
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 10
    },
    reviews_info_view: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reviews_info_name_text: {
        fontSize: 10,
        lineHeight: 14,
        color: '#000',
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
        marginLeft: 8
    },
    reviews_info_time_text: {
        fontSize: 8,
        lineHeight: 10,
        color: '#B5B3BD',
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
        marginLeft: 8
    },
    reviews_info_text: {
        marginBottom: 29,
        marginLeft: 8,
        marginTop: 10,
        color: '#000000',
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    },
    related_text: {
        marginLeft: 16,
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
        fontSize: 14,
        lineHeight: 20
    },
    related_view: {
        paddingLeft: 6,
        marginBottom: 20
    },
    related_item_view: {
        marginLeft: 10,
    },
    related_img: {
        width: 137,
        height: 91,
        borderRadius: 8,
    },
    related_type_view: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 6,
        paddingVertical: 3
    },
    related_type_text: {
        fontSize: 8,
        lineHeight: 10,
        color: '#000',
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    },
    related_info_view: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 2,
    },
    related_name_text: {
        color: '#000',
        fontSize: 11,
        lineHeight: 16,
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    },
    related_rating_view: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    img_star: {
        width: 9.7,
        height: 9.7
    },
    related_rating_text: {
        marginLeft: 5,
        color: '#060606',
        fontSize: 8,
        lineHeight: 10,
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    },
    related_price_text: {
        marginLeft: 5,
        color: '#060606',
        fontSize: 11,
        lineHeight: 16,
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    },
    related_ticket_text: {
        color: '#898989',
        fontSize: 8,
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    }
});
