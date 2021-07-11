import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Image,
    ScrollView,
    View,
    TouchableOpacity,
    Dimensions,
    Platform
} from 'react-native';


export default class DropDown extends Component {

    constructor(props) {
        super(props)
        this.state = {
            typeSelect: false,
            typeIndex: null,
        };
    }

    _renderTypeInput = () => {
        return (<TouchableOpacity
            onPress={() => {
                this.setState({typeSelect: !this.state.typeSelect});
            }}
            style={this.state.typeSelect ? [styles.typeSelectInput, { borderBottomLeftRadius: 0, borderBottomRightRadius: 0,  borderBottomWidth: 0 }] : [styles.typeSelectInput]}>
            <Text style={[styles.itemText, this.state.typeIndex === null ? {color: '#fff'} : null]}>
                {this.state.typeIndex !== null ? this.props.data[this.state.typeIndex].title : this.props.title}
            </Text>
            <Image
                style={{
                    height: 14,
                    width: 14,
                }}
                source={require('../../assets/images/down-arrow.png')}/>
        </TouchableOpacity>);

    };

    _renderTypeDropdown = () => {
        return this.state.typeSelect ? (
            <View style={[styles.dropdownContainer,
                {top: 50},
            ]}>
                <View style={styles.dropdownInner}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{
                            marginBottom: 20,
                        }}>
                            {this.props.data.map((item, i) => {
                                return (
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => {
                                            this.setState({typeIndex: i, typeSelect: false});
                                            this.props.handleChange(this.props.data[i], this.props.dropdownName)
                                        }}
                                        key={i}
                                        activeOpacity={0.8}
                                        style={styles.selectButton}>
                                        <Text style={styles.itemText}>
                                            {item.title}
                                        </Text>
                                        {item.title === this.props.title ? <Image source={require('../../assets/images/chek.png')} /> : null}
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </ScrollView>
                </View>
            </View>) : null;
    };

    render() {
        return (
            <View>
                {this._renderTypeInput()}
                {this._renderTypeDropdown()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    typeSelectInput: {
        borderColor: '#fff',
        width: '90%',
        marginHorizontal: '5%',
        height: 50,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 14,
        paddingRight: 12,
    },
    dropdownContainer: {
        marginHorizontal: '5%',
        height: Dimensions.get('window').height * 0.6,
        width: '90%',
        borderRadius: 10,
        zIndex: 2,
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0)'
    },
    dropdownInner: {
        backgroundColor: '#6844F9',
        borderWidth: 1,
        borderColor: '#fff',
        borderTopWidth: 0,
        height: '50%',
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 2,
    },
    selectButton: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.21)',
        height: 48,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 14.5,
    },
    itemText: {
        color: '#fff',
        fontSize: 16,
        lineHeight: 19,
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Book' : 'Circular-Std-Book'
    },
})
