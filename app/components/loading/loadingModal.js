import React from 'react';
import {  Modal, View,Alert } from 'react-native';

function ActivityIndicatorElement(props) {

    return(
        <Modal
            animationType="fade"
            transparent={true}
            visible={true}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
            }}>
            <View style={{flex: 1, backgroundColor: 'rgba(236, 236, 236, 0)'}}  />
        </Modal>
    )
}

export const Loading =  ActivityIndicatorElement;
