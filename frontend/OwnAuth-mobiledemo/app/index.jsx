import React, { useState } from "react";
import {
  StyleSheet,
  Image,
  Platform,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Button,
  Keyboard,
  TouchableOpacity,
  StatusBar,
} from "react-native";

export default function TabTwoScreen() {
  const [email, setEmail] = useState("");

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" />
          <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
          </View>
          <KeyboardAvoidingView
            style={styles.inputContainer}
            behavior="padding"
          >
            <Text style={styles.inputText}>Email</Text>
            <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} value={email}/>
            <Text style={styles.inputText}>Password</Text>
            <TextInput style={styles.input} placeholder="Password" />
            <TouchableOpacity style={styles.inputButton}>
              <Text style={styles.buttonText} onPress={() => {console.log(email)}}>Login</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    margin: 10,
    alignItems: "center",
  },
  inputContainer: {
    flex: 1,
    paddingTop: 0,
    margin: 10,
    margin: "auto",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    padding: 100,
  },
  input: {
    height: 50,
    width: 270,
    margin: 10,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  inputText: {
    textAlign: "left",
    marginLeft: 14,
    marginBottom: 0,
  },
  inputButton: {
    height: 50,
    width: 270,
    margin: 10,
    borderRadius: 8,
    backgroundColor: "#000",
    color: "white",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
  },
});
