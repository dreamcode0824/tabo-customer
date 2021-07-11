import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Modal,
    Image, Dimensions
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

const imgHeight = Dimensions.get('window').width

export class ImageZoomModal extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.props.isVisible}
                >
                    <View style={{flex: 1}}>
                        <TouchableOpacity onPress={() => this.props.close()}
                                          style={styles.back_btn}>
                            <Image source={require('../../assets/images/back_white.png')}/>
                        </TouchableOpacity>
                        <ImageViewer imageUrls={this.props.zoomImg} />
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    back_btn: {
        position: 'absolute',
        top: 40,
        left: 19,
        zIndex: 88,
        height: 25,
        width: 50
    },
});

