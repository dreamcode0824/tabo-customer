import React, {Component} from 'react';
import {
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    View,
    Dimensions,
    FlatList,
    Animated,
    TouchableHighlight,
} from 'react-native';
import Video from 'react-native-video';


const {width, heigth} = Dimensions.get('window');


class CaruselVideoClass extends Component {
    scrollX = new Animated.Value(0);
    position = Animated.divide(this.scrollX, width);
    playIndex;

    constructor(props = {video: true}) {
        super(props);
        this.state = {
            data: this.props.data,
            playKey: this.props.playKey,
        };
    }

    _renderCaruselItem() {
        return this.props.data.map((item, index) => {
            if (item.type === 'video') {
                let tempStyle = {};
                if (this.props.style) {
                    tempStyle = this.props.playBtn ? {opacity: 1} : {opacity: 0};
                } else {
                    tempStyle = this.props.playObj.status ? {opacity: 1} : {opacity: 0};
                }
                return (
                    <TouchableOpacity style={[styles.cardView, this.props.style && {width: width, margin: 0}]}
                                      onPress={() => {
                                          this.props.style ? null : this.props.navigation();
                                      }}>
                        <Video
                            source={{uri: item.url}}
                            poster={item.thumbnail}
                            posterResizeMode={'stretch'}
                            onEnd={(data) => {
                                if (this.props.style) {

                                } else {
                                    this.props.startPaly(this.props.playObj.key, index, 'finish');
                                }
                            }}
                            preventsDisplaySleepDuringVideoPlayback={false}
                            resizeMode="stretch"
                            paused={this.props.style ?
                                this.props.autoPlay[index]
                                :
                                this.props.playKey[this.props.playObj.key] === index ? false : true
                            }
                            style={[{width: '100%', height: '100%'}, !this.props.style && {borderRadius: 10}]}
                        />
                        <TouchableHighlight
                            underlayColor={'transparent'}
                            style={[{
                                position: 'absolute',
                                alignSelf: 'center',
                                top: width / 4,
                            },
                                tempStyle,
                            ]}
                            onPress={() => {
                                if (this.props.style) {
                                    this.props.startPaly(index);
                                } else {
                                    this.props.startPaly(this.props.playObj.key, index);
                                }
                            }}
                        >
                            <Image source={require('../../assets/images/play.png')}
                                   style={{width: 32, tintColor: '#fff', height: 32}}/>
                        </TouchableHighlight>

                        <TouchableOpacity style={{position: 'absolute', bottom: 20, right: 20, opacity: 1}}
                                          onPress={async () => {
                                              await this.props.startPaly(index, 'finish');
                                              await this.props.fullSceen(item.url,);
                                          }}>
                            <Image source={require('../../assets/images/fullScreen.png')}
                                   style={[{width: 25, tintColor: '#fff', height: 25},
                                       this.props.style ? null : {width: 20, height: 20},
                                   ]}/>
                        </TouchableOpacity>
                    </TouchableOpacity>
                );

            } else {
                return (
                    <TouchableOpacity style={[styles.cardView, this.props.style && {width: width, margin: 0}]}
                                      onPress={() => {
                                          this.props.style ? null : this.props.navigation();
                                      }}>
                        <Image
                            style={[styles.image, this.props.style && {borderRadius: 0, width: width}]}
                            source={{uri: item.url}}
                        />
                    </TouchableOpacity>
                );
            }
        });

    }

    headerBorder(offsetX) {
        if (this.props.style) {
            if (this.props.playKey && Object.keys(this.props.playKey).length) {
                this.props.startPaly(this.state.playKey.key, 'scroll');
            }
        } else {
            if (this.props.playKey && Object.keys(this.props.playKey).length) {
                this.props.startPaly(this.state.playKey.key, this.state.playKey[this.state.playKey.key], 'scroll');
            }
        }

    }

    render() {
        return (
            <View>
                <ScrollView
                    horizontal={true}
                    keyboardShouldPersistTaps='handled'
                    snapToAlignment="center"
                    pagingEnabled={true}
                    scrollEnabled={true}
                    decelerationRate={'fast'}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => 'key' + index}
                    scrollEventThrottle={1}
                    onScroll={Animated.event(
                        [{
                            nativeEvent: {contentOffset: {x: this.scrollX}},
                        }],
                        {
                            useNativeDriver: false,
                            listener: event => {
                                const offsetX = event.nativeEvent.contentOffset.x;
                                this.headerBorder(offsetX);
                            },
                        },
                    )}
                >
                    {this._renderCaruselItem()}
                </ScrollView>
                <View style={styles.dotView}>
                    {this.props.data.map((_, i) => {
                        let opacity = this.position.interpolate({
                            inputRange: [i - 1, i, i + 1],
                            outputRange: [0.3, 1, 0.3],
                            extrapolate: 'clamp',
                        });
                        return (
                            <Animated.View
                                key={i}
                                style={{
                                    opacity,
                                    height: 10,
                                    width: 10,
                                    backgroundColor: '#fff',
                                    margin: 8,
                                    borderRadius: 5,
                                }}
                            />
                        );
                    })}
                </View>
            </View>
        );
    }
}

export const CaruselVideo = CaruselVideoClass;


const styles = StyleSheet.create({
    dotView: {
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'absolute',
        top: 180,
        alignSelf: 'center',
    },
    cardView: {
        flex: 1,
        width: width - 32,
        height: '100%',
        backgroundColor: 'white',
        marginTop: 0,
        margin: 16,
        borderRadius: 50,
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    image: {
        width: width - 32,
        height: '100%',
        borderRadius: 10,
    },
    itemTitle: {
        color: 'white',
        fontSize: 22,
        shadowColor: '#000',
    },
    itemDescription: {
        color: 'white',
        fontSize: 12,
        shadowColor: '#000',

    },
});

