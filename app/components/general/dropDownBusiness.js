import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    ScrollView,
    View,
    TouchableOpacity,
    Platform,
    Dimensions,
} from 'react-native';


export class DropDownBusiness extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            typeSelect: false,
        };
    }

    _renderTypeInput = () => {

        return (
            <TouchableOpacity
                onPress={() => {
                    this.setState({ typeSelect: !this.state.typeSelect });
                }}
                style={styles.typeSelectInput}>
                <Text style={styles.itemText}>
                    {this.props.title}
                </Text>
                <Image
                    style={{
                        height: 14,
                        width: 14,
                    }}
                    source={require('../../assets/images/down.png')} />
            </TouchableOpacity>);

    };

    _renderTypeDropdown = () => {
        return this.state.typeSelect ? (
            <View style={[styles.dropdownContainer,
            { top: 38 },
            ]}>
                <View style={styles.dropdownInner}>
                    <View >
                        {this.props.data.map((item, i) => {
                            return (
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => {
                                        this.setState({ typeSelect: false });
                                        this.props.handleChange(i)
                                    }}
                                    key={i}
                                    activeOpacity={0.8}
                                    style={styles.selectButton}>
                                    <Text style={styles.itemText}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
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
        borderColor: 'rgba(181, 179, 189, 0.25)',
        backgroundColor: '#fff',
        width: 138,
        height: 38,
        borderWidth: 1,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 14,
        paddingRight: 12,
    },
    dropdownContainer: {
        flex: 1,
        /*height: Dimensions.get('window').height * 0.6,*/
        width: 138,
        borderRadius: 6,
        zIndex: 2,
        position: 'absolute',
        backgroundColor: '#fff'
    },
    dropdownInner: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(181, 179, 189, 0.25)',
        borderTopWidth: 0,
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
    },
    selectButton: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.21)',
        height: 40,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingLeft: 14.5,
    },
    itemText: {
        color: '#2C2929',
        fontSize: 12,
        lineHeight: 15,
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book'
    },
})
