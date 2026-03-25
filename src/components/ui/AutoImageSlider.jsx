import React, { useEffect, useRef, useState } from "react";
import { View, ScrollView, Image, StyleSheet, Dimensions } from "react-native";
import FallBackImage from "../../../assets/svg/FallBackImage";
import defaultImage from "../../../assets/defaultImage.png";

const { width } = Dimensions.get("window");

const AutoImageSlider = ({
  images = [],
  width = "100%",
  height = 250,
  autoScrollInterval = 3000,
}) => {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % images.length;
      scrollRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [activeIndex, images.length]);

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
        }}
      >
        {images.length === 0 ? (
          <Image
            source={defaultImage}
            style={[styles.image, { height, width }]}
          />
        ) : (
          images.map((img, index) => (
            <Image
              key={index}
              source={img}
              style={[styles.image, { height, width }]}
            />
          ))
        )}
      </ScrollView>

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {images.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, activeIndex === i && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

export default AutoImageSlider;
const styles = StyleSheet.create({
  image: {
    resizeMode: "cover",
    borderRadius: 10,
  },
  dotsContainer: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    flexDirection: "row",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#fff",
    width: 8,
    height: 8,
  },
  counterContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  counterText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
});
