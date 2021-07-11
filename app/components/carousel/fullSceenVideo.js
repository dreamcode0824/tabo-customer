import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import Video from 'react-native-video';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


class FullScreenVideoClass extends Component {

    constructor(props) {
        super(props);

    }


    render() {
        console.log(this.props);
        return (
            <Modal
                onSwipeComplete={() => {
                    this.props.close();
                }}
                onBackButtonPress={() => {
                    this.props.close();
                }}
                backdropColor={'black'}
                backdropOpacity={1}
                testID={'modal'}
                animationInTiming={500}
                animationIn="slideInRight"
                animationOut="slideOutRight"
                style={{margin: 0}}
                isVisible={this.props.isVisible}>
                <View style={styles.container}>
                    <Video
                        source={{uri: this.props.url}}
                        resizeMode="contain"
                        paused={this.props.paused}
                        controls={true}
                        fullscreen={true}
                        fullscreenOrientation='landscape'
                        ref={ref => (this.player = ref)}
                        seek={this.props.timeVideo}
                        //rotation={90}
                        style={{overflow: 'hidden', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
                        isMuted={false}
                        repeat={false}
                    />
                    <TouchableOpacity style={styles.close_btn} onPress={async () => {
                        await this.setState({
                            paused: true
                        })
                        await this.props.close()
                    }}>
                        <Image source={require('../../assets/images/close.png')} style={{width: 32, height: 32}}/>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }
}

export const FullSceenVideo = FullScreenVideoClass;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1
    },
    close_btn: {
        position: 'absolute',
        top: 20,
        right: 20,
    }
});
