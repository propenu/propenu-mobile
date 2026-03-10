import { WebView } from "react-native-webview";
import { View } from "react-native";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { setBaseField } from "../../redux/slice/PostPropertySlice";

export default function MapScreen() {
  const webRef = useRef(null);

  const dispatch = useDispatch();

  const [position, setPosition] = useState([17.4013, 78.41104]); //Hyderabad

  const handleWebViewMessage = (event) => {
    const { lat, lng } = JSON.parse(event.nativeEvent.data);
    setPosition([lat, lng]);

    dispatch(
      setBaseField({
        key: "location",
        value: {
          type: "Point",
          coordinates: [lng, lat],
        },
      })
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webRef} 
        source={require("../../../assets/map.html")}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        onMessage={handleWebViewMessage}
        onLoadEnd={() => {
          webRef.current?.postMessage(JSON.stringify({ mode: "picker" }));
        }}
      />
    </View>
  );
}
