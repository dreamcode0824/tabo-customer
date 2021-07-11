import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Text,
    Animated,
    Platform, Dimensions
} from 'react-native';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';
import Back from '../../assets/images/back.png';
import { WebView } from 'react-native-webview';
import i18n from "../../constants/i18next";

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height


class TermsConditionsClass extends Component {
    canAnimate = true
    offset = 0
    constructor(props) {
        super(props);
        this.state = {
            curY: new Animated.Value(0),
            elevation: 0
        };
    }

    headerBorder(offsetY) {
        if (offsetY > 0 && this.canAnimate) {
            this.canAnimate = false;
            this.setState({
                elevation: 5
            })
        } else if (offsetY <= 0 && !this.canAnimate) {
            this.canAnimate = true
            this.setState({
                elevation: 0
            })
        }
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
                backdropColor={'rgb(255,255,255,0)'}
                backdropOpacity={1}
                style={{margin: 0, marginTop: 0}}
                isVisible={this.props.isVisible}>
                <View style={styles.content}>
                    <View style={styles.headerRow}>
                            <TouchableOpacity
                                style={styles.backButtonContainer}
                                activeOpacity={0.8}
                                style={styles.back_btn}
                                onPress={() => this.props.close()}>
                                <Image
                                    style={styles.backIcon}
                                    source={Back}/>
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>
                                {i18n.t('TERMS_CONDITIONS_DESCRIPTION2')}
                            </Text>
                    </View>
                    <Animated.ScrollView
                        showsVerticalScrollIndicator={false}
                        scrollEventThrottle={1}
                        contentContainerStyle={{marginTop: this.state.height}}
                        onScroll={Animated.event(
                            [{
                                nativeEvent: {contentOffset: {y: this.state.curY}}
                            }],
                            {
                                useNativeDriver: false,
                                listener: event => {
                                    const offsetY = event.nativeEvent.contentOffset.y
                                    this.headerBorder(offsetY)
                                },
                            },
                        )}
                    >
                        <View style={styles.rules_view}>
                            <WebView
                                textZoom={150}
                                style={styles.rules_text}
                            originWhitelist={['*']}
                            source={{ html: `${this.props.terms}` }}
                        />
                        </View>
                    </Animated.ScrollView>
                </View>
            </Modal>
        );
    }
}

export const TermsConditions = connect()(TermsConditionsClass);

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    backButtonContainer: {
        height: 28,
        width: 28,
        justifyContent: "center",
        alignItems: "center"
    },
    back_btn: {
        paddingLeft: 16,
        width: 50,
        height: 50,
        justifyContent: 'center',
    },
    backIcon: {
        resizeMode: 'contain',
        height: 16,
        width: 16
    },
    headerRow: {
        flexDirection: "row",
        alignItems: 'center',
        marginTop: 20,
    },
    headerTitle: {
        color: 'black',
        fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
        fontSize: 18,
        lineHeight: 22
    },
    rules_view: {
        marginHorizontal: 16,
        marginTop: 10
    },
    rules_text: {
        width: width,
        height: height,
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
        fontSize: 12,
        lineHeight: 16,
        color: '#898989'

    }
});
