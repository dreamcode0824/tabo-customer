import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import Video from 'react-native-video';

const width = Dimensions.get('window').width;


const CarouselItem = ({ item, navigation, style, zoom, list, video, play, fullSceen, setPlay }) => {
  if (video) {
    if (item.type === "video") {
      return (
        <TouchableOpacity style={[styles.cardView, style && { width: width, margin: 0 }]}
          onPress={() => {
            if (navigation) {
              navigation()
              setPlay(true)
            }
          }}
        >
          <Video
            source={{ uri: item.url }}
            poster={'https://WWW.W3schools.com/w3images/woods.jpg'}
            posterResizeMode={'stretch'}
            resizeMode="stretch"
            paused={play}
            style={{ width: '100%', height: '100%', borderRadius: 10 }}
          />
          <TouchableOpacity
            style={{ position: 'absolute', alignSelf: 'center', top: width / 4, opacity: play ? 1 : 0 }}
            onPress={() => {
              setPlay(!play)
            }}>
            <Image source={require('../../assets/images/play.png')}
              style={{ width: 32, tintColor: '#fff', height: 32 }} />
          </TouchableOpacity>
          {list ?
            null
            :
            <TouchableOpacity style={{ position: 'absolute', bottom: 20, right: 20, opacity: 1 }}
              onPress={async () => {
                await setPlay(true)
                await fullSceen(item.url)

              }}>
              <Image source={require('../../assets/images/fullScreen.png')}
                style={{ width: 25, tintColor: '#fff', height: 25 }} />
            </TouchableOpacity>
          }
        </TouchableOpacity>
      )

    } else {
      return (
        <TouchableOpacity style={[styles.cardView, style && { width: width, margin: 0 }]}
          onPress={() => navigation ? navigation() : zoom()}>
          <Image
            style={[styles.image,
            style && {
              width: width,
              margin: 0,
              borderRadius: navigation ? 8 : 0,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            }]}
            source={{ uri: item.url }}
          />
        </TouchableOpacity>
      )
    }
  } else {
    return (
      <TouchableWithoutFeedback
        onPress={() => navigation ? navigation() : zoom()}
      >
        <View style={[styles.cardView, style && { width: width, margin: 0 }]}
        >
          {
            typeof (item) === 'number' ?
              <Image
                style={[styles.image,
                style && {
                  width: width,
                  margin: 0,
                  borderRadius: navigation ? 8 : 0,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                }]}
                source={item}
              />
              :
              <Image
                style={[styles.image,
                style && {
                  width: width,

                  margin: 0,
                  borderRadius: navigation ? 8 : 0,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                }]}
                source={{ uri: item }}
              />
          }
        </View>
      </TouchableWithoutFeedback>
    );
  }

};

const styles = StyleSheet.create({
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

export default CarouselItem;
