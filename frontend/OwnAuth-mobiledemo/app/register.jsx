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
import { Link } from "expo-router";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [credentials, setCredentials] = useState({});

    //Add the error text if fields not filled
  function RegisterUser() {
    //Send over credentials to API

    //if response OK then redirect to homepage

    //if response BAD then show error
  }
  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" />
          <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
          </View>
          <KeyboardAvoidingView
            style={styles.inputContainer}
            behavior="padding"
          >
            <Text style={styles.inputText}>Username</Text>
            <TextInput
              style={styles.input}
              onChangeText={setUsername}
              value={username}
              placeholder="Username"
            />
            <Text style={styles.inputText}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={setEmail}
              value={email}
            />
            <Text style={styles.inputText}>Password</Text>
            <TextInput
              secureTextEntry={true}
              style={styles.input}
              onChangeText={setPassword}
              value={password}
              placeholder="Password"
            />
            <TouchableOpacity style={styles.inputButton}>
              <Text
                style={styles.buttonText}
                onPress={() => {
                  if (email != "" && password != "" && username != "") {
                    setCredentials({
                      username: username,
                      email: email,
                      password: password,
                    });

                    RegisterUser();
                  }

                  console.log(credentials);
                }}
              >
                Register
              </Text>
            </TouchableOpacity>
            <Text style={styles.registerText}>
              Already a user?{" "}
              <Link href="/" style={styles.registerLink}>
                Login
              </Link>
            </Text>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    margin: 10,
    alignItems: "center",
  },
  inputContainer: {
    flex: 2,
    paddingTop: 85,
    margin: 10,
    marginTop: 0,
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
  registerText: {
    textAlign: "center",
  },
  registerLink: {
    color: "#0086d4",
  },
});
