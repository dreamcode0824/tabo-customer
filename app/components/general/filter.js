import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Platform,
    StatusBar,
} from 'react-native';
import Modal from 'react-native-modal';
import ApiGraphQl from '../../networking/apiGraphQl';

class FilterClass extends Component {
    apigraphql = new ApiGraphQl();

    constructor() {
        super();
        this.state = {
            filter: [],
            apply: false,
            sort: [
                {
                    type: 'normal',
                    active: true,
                    img: require('../../assets/images/normal.png'),
                    text: 'Normal',
                },
                {
                    type: 'avg_rate',
                    active: false,
                    img: require('../../assets/images/statFilter.png'),
                    text: 'Rating',
                },
                {
                    type: 'distance',
                    active: false,
                    img: require('../../assets/images/locationFilter.png'),
                    text: 'Distance',
                },
            ],
        };
        this.getFilter();
    }

    getFilter() {
        this.apigraphql.getFilter()
            .then(facilities => {
                let arr = facilities.data.facilities.map(data => {
                    return {...data, active: false};
                });
                this.setState({
                    filter: arr,
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    _renderSearchImage(key, data) {
        switch (key) {
            case 'kids':
                return <View style={{alignItems: 'center'}}>
                    <View style={[styles.filter_item_icon_view, data.active && {backgroundColor: '#6844F9'}]}>
                        <Image source={require('../../assets/images/child.png')}
                               style={[styles.filter_img, data.active ? {tintColor: '#fff'} : {tintColor: '#000'}]}/>
                    </View>
                    <Text style={[styles.filter_item_text, data.active && {color: '#6844F9'}]}>Kids</Text>
                </View>;
            case 'credit_card':
                return <View style={{alignItems: 'center'}}>
                    <View style={[styles.filter_item_icon_view, data.active && {backgroundColor: '#6844F9'}]}>
                        <Image source={require('../../assets/images/credit-card.png')}
                               style={[styles.filter_img, data.active ? {tintColor: '#fff'} : {tintColor: '#000'}]}/>
                    </View>
                    <Text style={[styles.filter_item_text, data.active && {color: '#6844F9'}]}>Credit Card</Text>
                </View>;
            case 'bar':
                return <View style={{alignItems: 'center'}}>
                    <View style={[styles.filter_item_icon_view, data.active && {backgroundColor: '#6844F9'}]}>
                        <Image source={require('../../assets/images/coffee-cup.png')}
                               style={[styles.filter_img, data.active ? {tintColor: '#fff'} : {tintColor: '#000'}]}/>
                    </View>
                    <Text style={[styles.filter_item_text, data.active && {color: '#6844F9'}]}>Bar</Text>
                </View>;
            case 'restaurant':
                return <View style={{alignItems: 'center'}}>
                    <View style={[styles.filter_item_icon_view, data.active && {backgroundColor: '#6844F9'}]}>
                        <Image source={require('../../assets/images/restoran.png')}
                               style={[styles.filter_img, data.active ? {tintColor: '#fff'} : {tintColor: '#000'}]}/>
                    </View>
                    <Text style={[styles.filter_item_text, data.active && {color: '#6844F9'}]}>Resraurant</Text>
                </View>;
            case 'shower':
                return <View style={{alignItems: 'center'}}>
                    <View style={[styles.filter_item_icon_view, data.active && {backgroundColor: '#6844F9'}]}>
                        <Image source={require('../../assets/images/shower.png')}
                               style={[styles.filter_img, data.active ? {tintColor: '#fff'} : {tintColor: '#000'}]}/>
                    </View>
                    <Text style={[styles.filter_item_text, data.active && {color: '#6844F9'}]}>Shower</Text>
                </View>;
            case 'wifi':
                return <View style={{alignItems: 'center'}}>
                    <View style={[styles.filter_item_icon_view, data.active && {backgroundColor: '#6844F9'}]}>
                        <Image source={require('../../assets/images/wi-fi.png')}
                               style={[styles.filter_img, data.active ? {tintColor: '#fff'} : {tintColor: '#000'}]}/>
                    </View>
                    <Text style={[styles.filter_item_text, data.active && {color: '#6844F9'}]}>Wi-Fi</Text>
                </View>;
            case 'massage':
                return <View style={{alignItems: 'center'}}>
                    <View style={[styles.filter_item_icon_view, data.active && {backgroundColor: '#6844F9'}]}>
                        <Image source={require('../../assets/images/massage.png')}
                               style={[styles.filter_img, data.active ? {tintColor: '#fff'} : {tintColor: '#000'}]}/>
                    </View>
                    <Text style={[styles.filter_item_text, data.active && {color: '#6844F9'}]}>Massage</Text>
                </View>;
            case 'blue_flag':
                return <View style={{alignItems: 'center'}}>
                    <View style={[styles.filter_item_icon_view, data.active && {backgroundColor: '#6844F9'}]}>
                        <Image source={require('../../assets/images/wave.png')}
                               style={[styles.filter_img, data.active ? {tintColor: '#fff'} : {tintColor: '#000'}]}/>
                    </View>
                    <Text style={[styles.filter_item_text, data.active && {color: '#6844F9'}]}>Blue Flag</Text>
                </View>;
            case 'music':
                return <View style={{alignItems: 'center'}}>
                    <View style={[styles.filter_item_icon_view, data.active && {backgroundColor: '#6844F9'}]}>
                        <Image source={require('../../assets/images/music.png')}
                               style={[styles.filter_img, data.active ? {tintColor: '#fff'} : {tintColor: '#000'}]}/>
                    </View>
                    <Text style={[styles.filter_item_text, data.active && {color: '#6844F9'}]}>Music</Text>
                </View>;
            case 'ski_jet':
                return <View style={{alignItems: 'center'}}>
                    <View style={[styles.filter_item_icon_view, data.active && {backgroundColor: '#6844F9'}]}>
                        <Image source={require('../../assets/images/motor.png')}
                               style={[styles.filter_img, data.active ? {tintColor: '#fff'} : {tintColor: '#000'}]}/>
                    </View>
                    <Text style={[styles.filter_item_text, data.active && {color: '#6844F9'}]}>Ski-Jet</Text>
                </View>;
            case 'games':
                return <View style={{alignItems: 'center'}}>
                    <View style={[styles.filter_item_icon_view, data.active && {backgroundColor: '#6844F9'}]}>
                        <Image source={require('../../assets/images/games.png')}
                               style={[styles.filter_img, data.active ? {tintColor: '#fff'} : {tintColor: '#000'}]}/>
                    </View>
                    <Text style={[styles.filter_item_text, data.active && {color: '#6844F9'}]}>Game</Text>
                </View>;
            default:
                return;
        }
    }

    _renderFilter() {
        return this.state.filter.map((data, index) => {
            return (
                <TouchableOpacity style={styles.filter_item_view} key={index} onPress={() => this.changeFilter(index)}>
                    {this._renderSearchImage(data.name, data)}
                </TouchableOpacity>
            );
        });
    }

    changeFilter(i) {
        let filter = this.state.filter;
        filter.map((data, index) => {
            if (index === i) {
                data.active = !data.active;
            }
        });
        this.setState({
            apply: false,
            filter: filter,
        });
    }

    _renderSort() {
        return this.state.sort.map((data, index) => {
            return (
                <TouchableOpacity style={styles.filter_item_view} key={index}
                                  onPress={() => this.changeSort(data, index)}>
                    <View style={[styles.filter_item_icon_view, data.active && {backgroundColor: '#6844F9'}]}>
                        <Image source={data.img}
                               style={[styles.filter_img, data.active ? {tintColor: '#fff'} : {tintColor: '#000'}]}/>
                    </View>
                    <Text style={[styles.filter_item_text, data.active && {color: '#6844F9'}]}>{data.text}</Text>
                </TouchableOpacity>
            );
        });
    }

    changeSort(data, i) {
        let sort = this.state.sort;
        sort.map((data, index) => {
            if (index === i) {
                data.active = true;
            } else {
                data.active = false;
            }
        });
        this.setState({
            apply: false,
            sort: sort,
        });
    }

    deselect() {
        let sort = this.state.sort;
        let filter = this.state.filter;
        sort.map(data => {
            if (data.type === 'normal') {
                data.active = true;
            } else {
                data.active = false;
            }
        });
        filter.map(data => {
            data.active = false;
        });
        this.setState({
            apply: true,
            sort: sort,
            filter: filter,
        });
    }

    searchBtn() {
        let facilitys = [];
        let sort;
        this.state.filter.map(data => {
            if (data.active) {
                facilitys.push(data.id);
            }
        });
        this.state.sort.map(data => {
            if (data.active) {
                sort = data.type;
            }
        });
        if(!facilitys.length){
            return this.props.filterSort(sort)
        }
        let where
        if(this.props.data.country && this.props.data.state){
            where = `where: {name: "facility_filter", facilityIds: [${facilitys}], sort: "${sort}", city_id: ${this.props.data.id}}` ;
        }else{
            where = `where: {name: "facility_filter", facilityIds: [${facilitys}], sort: "${sort}", country_id: ${this.props.data.id}}` ;
        }
        this.apigraphql.filterFacilites(where)
            .then(data => {
                this.props.close(data.data.custom_query[0].result)
            })
            .catch(err => {
                console.log(err);
            })
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
                style={{marginTop: 28, marginHorizontal: 0, marginBottom: 0, borderTopRadius: 12}}
                isVisible={this.props.isVisible}>
                {Platform.OS === 'android' ?
                    <StatusBar backgroundColor="rgba(0, 0, 0, 0.28)" barStyle={'dark-content'}/> : null}
                <View style={styles.container}>
                    <View style={styles.title_view}>
                        <TouchableOpacity onPress={() => this.props.close()} style={styles.close_btn}>
                            <Image source={require('../../assets/images/back.png')} style={styles.close_img}/>
                        </TouchableOpacity>
                        <Text style={styles.title_text}>Filter</Text>
                        <Text/>
                    </View>
                    <Text style={styles.filter_text}>Filter by</Text>
                    <ScrollView>
                        <View style={styles.filter_view}>
                            {this._renderFilter()}
                        </View>
                        <Text style={styles.text_sort}>Sort by</Text>
                        <View style={styles.filter_view}>
                            {this._renderSort()}
                        </View>
                    </ScrollView>
                    <View style={styles.btn_view}>
                        <TouchableOpacity style={styles.deselect_btn} onPress={() => this.deselect()}>
                            <Text style={styles.deselect_text}>Reset</Text>
                        </TouchableOpacity>
                        {this.state.apply ?
                            <TouchableOpacity style={styles.search_btn} onPress={() => this.props.go()}>
                                <Text style={styles.search_text}>Apply</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={styles.search_btn} onPress={() => this.searchBtn()}>
                                <Text style={styles.search_text}>Search</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            </Modal>
        );
    }
}

export const Filter = FilterClass;

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
    },
    close_btn: {
        width: 62,
        paddingLeft: 16,
        height: 52,
    },
    close_img: {
        resizeMode: 'contain',
        marginTop: 4,
        width: 9.45,
        height: 16,
    },
    title_text: {
        color: '#000',
        fontSize: 17,
        lineHeight: 22,
        fontWeight: 'bold',
    },
    filter_text: {
        marginLeft: 16,
        fontSize: 15,
        lineHeight: 19,
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    },
    filter_view: {
        marginRight: 20,
        flexWrap: 'wrap',
        marginTop: 19,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    filter_item_view: {
        width: 68,
        alignItems: 'center',
        marginRight: 25,
        marginBottom: 25,
    },
    filter_item_icon_view: {
        width: 44,
        height: 44,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#B5B3BD',
        alignItems: 'center',
        justifyContent: 'center',
    },
    filter_img: {
        resizeMode: 'contain',
        width: 24,
        height: 24,
    },
    filter_item_text: {
        marginTop: 4,
        fontSize: 11,
        lineHeight: 16,
        color: '#000',
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    },
    text_sort: {
        marginTop: 3,
        marginLeft: 16,
        fontSize: 15,
        lineHeight: 19,
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    },
    btn_view: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    deselect_btn: {
        height: 40,
        width: 124,
        backgroundColor: '#fff',

        justifyContent: 'center',
        borderRadius: 8,
    },
    deselect_text: {
        color: '#979797',
        fontSize: 16,
        lineHeight: 20,
        fontWeight: '700',
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    },
    search_btn: {
        height: 40,
        width: 124,
        backgroundColor: '#6844F9',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    search_text: {
        color: '#fff',
        fontSize: 16,
        lineHeight: 20,
        fontWeight: '700',
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    },
});
