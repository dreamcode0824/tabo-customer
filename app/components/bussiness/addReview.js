import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    StatusBar,
    Platform,
    Image,
    TouchableOpacity,
    Text,
    Keyboard,
    TouchableWithoutFeedback,
    TextInput,
    ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import ApiGraphQl from '../../networking/apiGraphQl'
import Back from '../../assets/images/close_icon.png';


class AddReviewClass extends Component {

    rateTexts = ['Terrible', 'Bad', 'Okay', 'Good', 'Great']
    apigraphql  = new ApiGraphQl()
    constructor(props) {
        super(props);
        this.state = {
            rate: 0,
            comment:''
        };
    }

    addReview(){
        let info = {
            review: this.state.comment,
            rate: this.state.rate,
            business_id: this.props.business_id,
            customer_id: this.props.customer_id
        }
        if(this.state.review){
            return this.setState({
                error: true
            })
        }
        this.apigraphql.addReview(info)
            .then(data => {
                this.props.close()
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
                testID={'modal'}
                // animationIn='slideInUp'
                // animationOut="slideOutRight"
                animationInTiming={500}
                backdropColor={'rgb(255,255,255,0)'}
                backdropOpacity={1}
                style={{ margin: 0, marginTop: 0 }}
                isVisible={this.props.isVisible}>
                <View style={styles.content}>

                        <View style={styles.headerRow}>
                            <TouchableOpacity
                                style={styles.backButtonContainer}
                                activeOpacity={0.8}
                                onPress={() => this.props.close()}>
                                <Image
                                    style={styles.backIcon}
                                    source={Back} />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>
                                Add review
                            </Text>
                            <View style={{ width: 50 }} />
                        </View>
                        <ScrollView contentContainerStyle={{flexGrow: 1}} >
                    <View style={styles.contentContainer}>
                        <View style={styles.rateValueContainer}>
                            <Text style={styles.routeNumber}>
                                {this.state.rate}.0
                                </Text>
                        </View>
                        <Text style={styles.watsText}>
                            What’s your rate?
                            </Text>
                        <View style={styles.starsRow}>
                            {this.rateTexts.map((item, i) => (<TouchableWithoutFeedback
                                onPress={() => {
                                    this.setState({
                                        rate: i + 1
                                    })
                                }}
                                key={i}
                            >
                                <Image
                                    style={[styles.star,
                                    this.state.rate >= i + 1 ?
                                        { tintColor: '#6844F9' } :
                                        { tintColor: '#B5B3BD' }]}
                                    source={require('../../assets/images/star.png')}
                                />
                            </TouchableWithoutFeedback>))}
                        </View>
                        <Text style={styles.rateText}>
                                {this.state.rate ? this.rateTexts[this.state.rate-1] : ''}
                        </Text>
                        <Text style={styles.title}>
                        Leave a comment
                        </Text>
                        <TouchableWithoutFeedback
                        onPress={()=>{
                            this.input.focus()
                        }}
                        >
                        <View style={styles.inputContainer}>
                                        <TextInput
                                        ref={ref=> this.input=ref}
                                        style={styles.input}
                                        placeholderTextColor='rgba(44, 41, 41, 0.22)'
                                        placeholder={'Type here....'}
                                        value={this.state.comment}
                                        onChangeText={(text)=>{
                                            this.setState({
                                                comment: text
                                            })
                                        }}
                                        />
                        </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <TouchableOpacity
                    onPress={()=>{
                        Keyboard.dismiss()
                        this.addReview()
                    }}
                    disabled={!this.state.rate}
                    activeOpacity={0.8}
                    style={[styles.saveButton, this.state.rate ? null : { opacity: 0.5  } ]}
                    >
                        <Text style={styles.buttonText}>
                            Save
                        </Text>
                    </TouchableOpacity>
                    </ScrollView>

                </View>
            </Modal>
        );
    }
}

export const AddReview = connect()(AddReviewClass);

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        flex: 1,
        marginHorizontal: 14
    },
    swipeItem: {
        backgroundColor: '#B5B3BD',
        height: 3,
        width: 39,
        borderRadius: 1.5,
        alignSelf: 'center',
        marginTop: 15
    },
    backButtonContainer: {
        height: 50,
        width: 50,
        justifyContent: "center",
        alignItems: "center"
    },
    backIcon: {
        height: 16,
        width: 16
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    headerTitle: {
        color: 'black',
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
        fontSize: 20,
        lineHeight: 22
    },
    rateValueContainer: {
        height: 74,
        width: 74,
        borderRadius: 37,
        backgroundColor: '#6844F9',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 25
    },
    routeNumber: {
        color: '#fff',
        fontSize: 24,
        lineHeight: 26,
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    },
    watsText: {
        color: 'black',
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' :  'Circular-Std-Bold',
        fontSize: 18,
        lineHeight: 20,
        textAlign: "center",
        marginTop: 23
    },
    starsRow: {
        flexDirection: 'row',
        alignSelf: "center",
        marginTop: 23,
    },
    star: {
        height: 30.67,
        width: 31.89,
        marginHorizontal: 7
    },
    rateText:{
        marginTop: 20,
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 16,
        height: 16,
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
        color: 'rgba(0, 0, 0, 0.33)'
    },
    title:{
        color: 'black',
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
        fontSize: 14,
        lineHeight: 16,
        marginTop: 24
    },
    inputContainer:{
        height: 120,
        borderRadius: 12,
        borderColor: '#F8F8F8',
        borderWidth: 1,
        marginTop: 14,
    },
    input:{
      color: 'black',
      fontSize: 16,
      lineHeight: 18,
      padding: 0,
      paddingHorizontal: 16,
      paddingVertical: 10,
      fontFamily: Platform.OS==='ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    },
    saveButton:{
        backgroundColor: '#6844F9',
        height: 40,
        width: 87,
        borderRadius: 8,
        marginVertical: 24,
        justifyContent: 'center',
        alignItems: "center",
        alignSelf: 'flex-end',
        marginRight: 16
    },
    buttonText:{
        color: '#fff',
        fontSize: 16,
        lineHeight: 18,
        fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold'
    }
});
