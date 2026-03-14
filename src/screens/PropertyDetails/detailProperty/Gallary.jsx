import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  FlatList,
  Modal,
} from "react-native";
import { useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import useCity from "../../../components/CustomHooks/useCity";
import YoutubePlayer from "react-native-youtube-iframe";

const VideoItem = ({ item }) => {
  const videoId = getYoutubeId(item.url);

  return (
      

    <View style={styles.videoContainer}>
  <View style={{ aspectRatio: 16 / 9 }}>
    <YoutubePlayer
      height={200}
      play={false}
      videoId={videoId}
    />
  </View>
  <Text style={styles.title}>{item.title}</Text>
</View>
  );
};

const getYoutubeId = (url) => {
  const regExp = /v=([^&]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

const Gallery = ({ property }) => {
  const [visible, setVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const { selectedCity } = useCity();
  return (
    <View>
      <View style={styles.gallery}>
        <Text
          numberOfLines={1}
          style={[
            styles.galleryText,
            { color: property?.color ? property.color : "#000" },
          ]}
        >
          Gallery
        </Text>
        <Text style={styles.smallText}>
         See the space before you step in
          {selectedCity?.city ? selectedCity.city : "Hyderabad"}
        </Text>
        <FlatList
          data={property?.gallerySummary}
          horizontal
          keyExtractor={(item) => item.order.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <Pressable
              style={styles.galleryItem}
              onPress={() => {
                setImageUrl(item.url);
                setVisible(true);
              }}
            >
              <Image source={{ uri: item.url }} style={styles.galleryImage} />

              <View style={styles.overlay}>
                <Text style={styles.overlayText}>{item.category}</Text>
              </View>
            </Pressable>
          )}
        />
        {/* {property?.youtubeVideos ? <Text style={[
            styles.galleryText,
            { marginTop:15,marginBottom:10,paddingLeft:4, color: property?.color ? property.color : "#000" },
          ]}>Video Tour</Text> : null} */}


        <FlatList
          data={property?.youtubeVideos}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 ,marginTop:15}}
          keyExtractor={(item) => item.order.toString()}
          renderItem={({ item }) => <VideoItem item={item} />}
        />
      </View>
      <Modal
        visible={visible}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.fullScreenContainer}>
          <View style={styles.fullScreenImageContainer}>
            {/* Close button */}
            <Pressable
              style={styles.closeButton}
              onPress={() => setVisible(false)}
            >
              <Entypo name="squared-cross" size={30} color="#fff" />
            </Pressable>

            <Image
              source={{ uri: imageUrl }}
              style={styles.fullScreenImage}
              // resizeMode="contain"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default Gallery;

const styles = StyleSheet.create({
  gallery: {
    marginVertical: 10,
  },

  galleryText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  smallText: {
    fontSize: 12,
    color: "gray",
    marginBottom: 20,
    marginLeft: 11,
  },

  galleryItem: {
    width: 280,
    height: 190,
    marginRight: 18,
    borderRadius: 12,
    overflow: "hidden",
  },

  galleryImage: {
    width: "100%",
    height: "100%",
  },

  fullScreenContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  videoContainer: {
    width: 280,
    // marginVertical:10,
    marginRight:15,
    // height:200,
    // alignSelf: "center",
    // gap:3,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth:1,
    borderColor:"#e5e3e3",
    backgroundColor:"#fff"
  },
title:{
  fontSize:14,
  fontWeight:500,
  padding:10
},
  fullScreenImageContainer: {
    width: "90%",
    height: "85%",
    borderRadius: 10,
    position: "relative",
    overflow: "hidden",
  },

  fullScreenImage: {
    width: "100%",
    height: "100%",
  },

  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
    // backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 16,
    padding: 4,
  },
});
