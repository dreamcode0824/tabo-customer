import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, Dimensions, FlatList, Animated} from 'react-native'
import CarouselItem from './carouselItem'


const {width, heigth} = Dimensions.get('window')


const Carousel = ({data, navigation, list, time, autoPlay, fullSceen, style, zoom, video}) => {
    const scrollX = new Animated.Value(0)
    let position = Animated.divide(scrollX, width)
    const [dataList, setDataList] = useState(data)
    const [play, setPlay] = useState(autoPlay)

    useEffect(() => {
        setDataList(data)
    })

    if (data && data.length) {
        return (
            <View>
                <FlatList
                    keyboardShouldPersistTaps='handled'
                    data={data}
                    keyExtractor={(item, index) => 'key' + index}
                    horizontal
                    pagingEnabled
                    scrollEnabled
                    snapToAlignment="center"
                    scrollEventThrottle={1}
                    decelerationRate={"fast"}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => {
                        return <CarouselItem item={item} navigation={navigation} time={time} list={list}
                                             fullSceen={fullSceen} video={video} style={style} play={play}
                                             setPlay={setPlay} zoom={zoom}/>
                    }}
                    onScroll={Animated.event(
                        [{
                            nativeEvent: {contentOffset: {x: scrollX}}
                        }],
                        {useNativeDriver: false}
                    )}
                />

                <View style={styles.dotView}>
                    {data.map((_, i) => {
                        let opacity = position.interpolate({
                            inputRange: [i - 1, i, i + 1],
                            outputRange: [0.3, 1, 0.3],
                            extrapolate: 'clamp'
                        })
                        return (
                            <Animated.View
                                key={i}
                                style={{
                                    opacity,
                                    height: 8,
                                    width: 8,
                                    backgroundColor: '#fff',
                                    margin: 8,
                                    borderRadius: 4,
                                }}
                            />
                        )
                    })}

                </View>
            </View>
        )
    }

    return null
}

const styles = StyleSheet.create({
    dotView: {
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'absolute',
        top: 200,
        alignSelf: "center"
    }
})

export default Carousel
