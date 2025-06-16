import React, { useState, useRef, useEffect } from "react";
import { Animated, View } from "react-native";

// Dinamikus magasság animációval rendelkező komponens
const AnimatedExpandable = ({ expanded, children }) => {
  const animation = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: expanded ? contentHeight : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [expanded, contentHeight]);

  return (
    <Animated.View style={{ height: animation, overflow: "hidden" }}>
      {/* Láthatatlan, mérhető tartalom */}
      <View
        style={{ position: "absolute", top: 0, left: 0, right: 0, opacity: 0 }}
        onLayout={(e) => {
          if (contentHeight === 0) {
            setContentHeight(e.nativeEvent.layout.height);
          }
        }}
      >
        {children}
      </View>

      {/* Látható tartalom */}
      <View pointerEvents={expanded ? "auto" : "none"}>{children}</View>
    </Animated.View>
  );
};

export default AnimatedExpandable;