import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Animated,
    Platform,
    FlatList,
    StatusBar,
    SafeAreaView,
} from 'react-native';
import Modal from 'react-native-modal';
import i18n from "../../constants/i18next";


class MenuClass extends Component {
    canAnimate = true;
    offset = 0;
    curY = new Animated.Value(0);

    constructor(props) {
        super(props);
        this.state = {
            menuType: props.menuCategories[0] ? props.menuCategories[0].title.en : '',
            menuTypeId: props.menuCategories[0] ? props.menuCategories[0].id : null,

            height: 170,
            elevation: 0,
            indexStartItem: 0,
        };
    }

    isBigEnough(value) {
        return value <= 0;
    }

    _renderMenuTypeHeader(data, index) {
        return (
            <View style={styles.menu_title_view}>
                <TouchableOpacity key={index} onPress={async () => {
                    await this.scrollActive(data.title.en, data.id);
                }} style={[styles.button, this.state.menuType === data.title.en && {backgroundColor: '#6844F9'}]}>
                    <Text style={[styles.buttonText, this.state.menuType === data.title.en && {color: '#fff'}]}>
                        {data.title.en}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    scrollActive(title, id) {
        this.props.menuItems.some((data, index) => {
            if (id === data.beach_menu_category_id) {
                this.setState({
                    scrollIndex: false,
                    menuType: title,
                    menuTypeId: id,
                });
                this.flatListRef.scrollToIndex({animated: true, index: index});

                return true;
            }
        });
    }


    _renderMenu(data, index) {
        return (
            <View key={index} style={styles.menu_item_view}>
                <View style={styles.menu_info_view}>
                    <Image source={require('../../assets/images/menu2.png')} style={styles.img_menu_item}/>
                    <View style={{marginLeft: 12}}>
                        <Text
                            style={[styles.menu_item_name_text, {fontSize: 14, lineHeight: 20}]}>{data.title.en}</Text>
                        <Text style={[styles.menu_item_ml_text, {
                            fontSize: 12,
                            lineHeight: 17,
                            marginTop: 8,
                        }]}>{data.description.en}</Text>
                    </View>
                </View>
                <Text style={[styles.menu_item_price_text, {fontSize: 16, lineHeight: 23}]}>${data.price}</Text>
            </View>
        );

    }


    headerBorder(offsetY) {
        if (offsetY > 0 && this.canAnimate) {
            this.canAnimate = false;
            this.setState({
                elevation: 5,
                scrollIndex: false,
            });
        } else if (offsetY <= 0 && !this.canAnimate) {
            this.canAnimate = true;
            this.setState({
                elevation: 0,
                scrollIndex: false,
            });
        }
    }


    onViewableItemsChanged = ({viewableItems, changed}) => {
        if (this.state.scrollIndex) {
            return;
        }
        if (viewableItems[0].item.beach_menu_category_id !== this.state.menuTypeId) {
            this.props.menuCategories.some((data, index) => {
                if (data.id === viewableItems[0].item.beach_menu_category_id) {
                    this.setState({
                        menuType: data.title.en,
                        menuTypeId: data.id,
                    });
                    if(index % 2 === 0 || index === 1){
                        this.flatListRefHeader.scrollToIndex({animated: true, index: index === 0 ? 0 : index -1});
                    }
                    return true;
                }
            });
        }
    };


    _renderHeaderAnimation() {
        if (!this.clampedScrollY) {
            this.minScroll = 0;
            this.clampedScrollY = this.curY.interpolate({
                inputRange: [this.minScroll, this.minScroll + 1],
                outputRange: [0, 1],
                extrapolateLeft: 'clamp',
            });
            this.minusScrollY = Animated.multiply(this.clampedScrollY, -1);
            this.headerDistance = Animated.diffClamp(this.minusScrollY, -73, 0).interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
            });
        }

        return this.headerDistance;
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
                backdropColor={'rgb(255,255,255,0)'}
                backdropOpacity={1}
                testID={'modal'}
                animationIn="slideInRight"
                animationOut="slideOutRight"
                animationInTiming={500}
                style={{margin: 0}}
                isVisible={this.props.isVisible}>
                <View style={styles.container}>
                    <Animated.View style={{
                        transform: [{
                            translateY: this._renderHeaderAnimation(),
                        }],
                        position: 'absolute',
                        top: 0,
                        zIndex: 1,
                        width: '100%',
                        backgroundColor: '#fff',
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,

                        elevation: this.state.elevation,

                    }}>
                        <View style={styles.title_view}>
                            <TouchableOpacity style={styles.back_btn} onPress={() => this.props.close()}>
                                <Image source={require('../../assets/images/left.png')}/>
                            </TouchableOpacity>
                            <Text style={styles.title_text}>{i18n.t('BEACH_MENU')}</Text>
                        </View>
                        <View>
                            <View style={styles.cont}>
                                <FlatList
                                    data={this.props.menuCategories}
                                    renderItem={({item, index}) => this._renderMenuTypeHeader(item, index)}
                                    showsHorizontalScrollIndicator={false}
                                    horizontal={true}
                                    onViewableItemsChanged={this.onViewableItemsChangedHeader}
                                    ref={(ref) => {
                                        this.flatListRefHeader = ref;
                                    }}
                                    viewabilityConfig={{
                                        itemVisiblePercentThreshold: 100,
                                    }}
                                />
                            </View>
                        </View>
                    </Animated.View>
                    <FlatList
                        data={this.props.menuItems}
                        renderItem={({item, index}) => this._renderMenu(item, index)}
                        keyExtractor={(item) => item.id}
                        onViewableItemsChanged={this.onViewableItemsChanged}
                        viewabilityConfig={{
                            itemVisiblePercentThreshold: 100,
                        }}
                        ref={(ref) => {
                            this.flatListRef = ref;
                        }}
                        showsVerticalScrollIndicator={false}
                        decelerationRate={0.8}
                        scrollEventThrottle={1}
                        contentContainerStyle={{marginTop: 150, paddingBottom: 150}}
                        onScroll={Animated.event(
                            [{
                                nativeEvent: {contentOffset: {y: this.curY}},
                            }],
                            {
                                useNativeDriver: false,
                                listener: event => {
                                    const offsetY = event.nativeEvent.contentOffset.y;
                                    this.headerBorder(offsetY);
                                },
                            },
                        )}
                    />
                </View>
            </Modal>
        );
    }
}

export const Menu = MenuClass;

const styles = StyleSheet.create({
    container1: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },


    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title_view: {
        height: 52,
        marginTop: 21,
        flexDirection: 'row',
        alignItems: 'center',
    },
    back_btn: {
        width: 53,
        height: 50,
        justifyContent: 'center',
        paddingLeft: 19,
    },
    title_text: {
        color: '#000',
        fontSize: 18,
        lineHeight: 22,
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    },
    cont: {
        marginTop: 10,
        paddingHorizontal: 12,
    },
    menu_title_view: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 20,
    },
    menu_title_item_view: {
        marginLeft: 25,
        borderWidth: 1,
        borderColor: 'rgba(181, 179, 189, 0.46)',
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
    },
    menu_type_img: {
        width: 22,
        height: 22,
    },
    menu_title_name_view: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 25,
    },
    menu_title_name_text: {
        color: '#000',
        fontSize: 11,
        lineHeight: 16,
        marginTop: 4,
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    },
    menu_item_info_view: {
        marginTop: 18,
    },
    menu_item_info_text: {
        marginTop: 7,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    menu_item_name_text: {
        fontSize: 12,
        lineHeight: 17,
        color: '#000',
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    },
    menu_item_price_text: {
        fontSize: 12,
        lineHeight: 17,
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
        color: '#000',
    },
    menu_item_ml_text: {
        fontSize: 9,
        lineHeight: 14,
        color: '#979797',
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    },
    menu_item_view: {
        marginHorizontal: 16,
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ECECEE',
        borderRadius: 8,
        marginBottom: 10,
    },
    menu_info_view: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    img_menu_item: {
        borderRadius: 4,
        width: 67,
        height: 60,
    },
    button: {
        minWidth: 109,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 8,
        paddingTop: 10,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#6844F9',
        backgroundColor: '#fff',
        borderRadius: 8,
        marginHorizontal: 4,
    },
    buttonText: {
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
        fontSize: 14,
        lineHeight: 17,
        color: '#6844F9',
        marginBottom: 2,
    },
});
