import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    PermissionsAndroid
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {connect} from "react-redux";
import i18n from "../../constants/i18next";
import API from '../../networking/api'



class ShowProfileClass extends Component {

    api = new API()

    constructor() {
        super();
        this.state = {
            notifications: true,
            email: false,
            textMessages: false,
            accountEmail: false,
            accountTextMessages: false,
            avatarSource: 'data:image/jpeg;base64,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'
        }
    }

        async checkAllPermissions() {
        try {
            if(Platform.OS=='ios'){
                return true
            }
            const granted = await PermissionsAndroid.requestMultiple(
                [
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                ],

            );
            if (
                granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
                granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
            ) {
                return true
            } else {
                return false
            }
        } catch (err) {
            console.warn(err);
        }
    };

    selectPhoto() {
        this.checkAllPermissions().then((res) => {
            if (res) {
        // More info on all the options is below in the API Reference... just some common use cases shown here
        const options = {
            title: 'Select Avatar',
            //  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        ImagePicker.showImagePicker(options, (response) => {

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };
                this.api.uploadPhoto(response.uri)
                    .then(photo => {
                        if(photo.status === 200){
                            this.props.dispatch({
                                type: 'SET_USER', value: {
                                    photo: photo.data.data.Location,
                                }
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        });
    }
})
    .catch((error) => {
        console.log(error);
    })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.title_view}>
                    <TouchableOpacity style={styles.back_btn} onPress={() => this.props.navigation.goBack()}>
                        <Image source={require('../../assets/images/back.png')} style={{height: 16, width: 9.45, resizeMode: 'contain',}} />
                    </TouchableOpacity>
                </View>
                <View style={styles.photoRow}>
                    <View style={styles.photoContainer}>
                        <Image
                            style={styles.photo}
                            source={this.props.user.photo ? {uri: this.props.user.photo} : require('../../assets/images/avatar.png')}
                        />
                    </View>
                    <View>
                        <Text style={styles.nameText}>
                            {i18n.t('HI_I')} {this.props.user.first_name}  {this.props.user.last_name}
                            </Text>
                        <TouchableOpacity
                            onPress={() => {
                                this.selectPhoto()
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.showText}>
                                {i18n.t('CHANGE_PHOTO')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.categoryText}>
                    About
                    </Text>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.routeItem}
                    onPress={() => {}}
                >
                    <View style={styles.itemRow}>
                        <Image
                            source={require('../../assets/images/markerIcon.png')}
                            style={{ height: 26, width: 26 }}
                        />
                        <Text style={styles.itemText}>
                            Lives in Yerevan, Armenia
                        </Text>
                    </View>
                    <Image
                        source={require('../../assets/images/itemArrow.png')}
                        style={styles.arrowIcon}
                    />
                </TouchableOpacity>

            </View>
        );
    }
}

export const ShowProfile = connect(({user}) => ({user}))(ShowProfileClass)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16
    },
    title_view: {
        marginTop: 21,
        flexDirection: 'row',
        paddingLeft: 5,
        alignItems: 'center',
    },
    back_btn: {
        width: 50,
        height: 50,
        justifyContent: 'center'
    },
    photoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 9,
        borderBottomColor: 'rgba(151, 151, 151, 0.13)',
        borderBottomWidth: 1,
        paddingBottom: 20
    },
    photoContainer: {
        height: 89,
        width: 89,
        marginRight: 23
    },
    photo: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover',
        borderRadius: 44.5
    },
    nameText: {
        color: '#000',
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
        fontSize: 24,
        lineHeight: 30
    },
    showText: {
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
        color: '#6844F9',
        fontSize: 14,
        lineHeight: 22,
        marginTop: 15
    },
    categoryText: {
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
        color: '#B5B3BD',
        fontSize: 10,
        lineHeight: 12,
        marginTop: 20
    },
    routeItem: {
        height: 53,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        borderBottomColor: 'rgba(151, 151, 151, 0.13)',
        borderBottomWidth: 1,
        paddingTop: 11,
        paddingBottom: 16,
        marginBottom: 5
    },
    itemRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    itemText: {
        color: '#000',
        fontSize: 14,
        lineHeight: 16,
        marginLeft: 15,
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    },
    arrowIcon: {
        width: 8,
        height: 14
    },
});
