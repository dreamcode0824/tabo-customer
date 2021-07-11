import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Text,
    Platform,
    Linking
} from 'react-native';
import Modal from 'react-native-modal';
import MapView, { Marker } from 'react-native-maps';

class MapClass extends Component {
    constructor() {
        super();
        this.state = {};
    }

    _goToYosemite() {
        const location = `${this.props.location.latitude},${this.props.location.longitude}`
        const url = Platform.select({
            ios: "maps:" + location + "?q=" + location,
            android: "geo:" + location + "?q=" + location
        });
        console.log(url);
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                return Linking.openURL(url);
            } else {
                let browser_url =
                    "https://www.google.de/maps/@" +
                    this.props.location.latitude +
                    "," +
                    this.props.location.longitude +
                    "?q=" +
                    location;
                return Linking.openURL(browser_url);
            }
        });
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
                backdropOpacity={1}
                style={{ margin: 0 }}
                isVisible={this.props.isVisible}>
                <View style={styles.container}>
                    <MapView
                        style={{ width: '100%', height: '100%' }}
                        mapType={'terrain'}
                        region={{
                            latitude: Number(this.props.location.latitude),
                            longitude: Number(this.props.location.longitude),
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: Number(this.props.location.latitude),
                                longitude: Number(this.props.location.longitude),
                            }}
                        />
                    </MapView>
                    <TouchableOpacity style={styles.close_btn} onPress={() => this.props.close()}>
                        <Image source={require('../../assets/images/close.png')} style={{ width: 35, height: 35 }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.open_map_btn} onPress={() => this._goToYosemite()}>
                        <Image source={require('../../assets/images/google-maps-icon.png')} style={{ width: 28, height: 28 }} />
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }
}

export const Map = MapClass;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    close_btn: {
        width: 60,
        height: 60,
        position: 'absolute',
        top: 16,
        left: 16,
    },
    open_map_btn: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        backgroundColor: '#fff',
        width: 54,
        height: 54,
        position: 'absolute',
        bottom: 16,
        right: 16,
    },
});
