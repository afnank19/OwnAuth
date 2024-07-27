import React from "react";
import { StyleSheet, Image, Platform, View, Text } from "react-native";
//import { ThemedText } from "@/components/ThemedText";
//import React from "react";

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text>Explore More</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});