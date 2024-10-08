import React, { useEffect, useState } from "react";
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
  Alert,
} from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, router, useRootNavigationState } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { RefreshResolve } from "./auth";
//Test login credentials: admin, abc@mail.com, 123

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [credentials, setCredentials] = useState({});
  const [fieldsFilled, setFieldsFilled] = useState(true);
  const [displayLogin, setDisplayLogin] = useState(false);

  async function VerifyLogin() {
    //Send credentials to API for verification
    console.log(password);

    try {
      const response = await fetch("https://rowan-brass-humerus.glitch.me/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if(response.status == "400") {
        Alert.alert("Password did not match");
        return
      }
      if(response.status == '500') {
        Alert.alert("Couldn't find user or server error :P")
      }

      const data = await response.json();
      //Route to homepage if successful verification
      if (response.ok) {
        console.log("logged in");
        SetAccessToken(data.accessToken);
        SetRefreshToken(data.refreshToken);
        router.replace("/homepage");
      }
      console.log(response.status);


    } catch (error) {
      console.error(error);
    }

    async function SetAccessToken(accessToken) {
      let key = "accessToken";
      await SecureStore.setItemAsync(key, accessToken);
    }
    async function SetRefreshToken(refreshToken) {
      let refreshKey = "refreshToken";
      await SecureStore.setItemAsync(refreshKey, refreshToken);
    }

    //Handle Sessions
  }

  async function CheckSession() {
    try {
      let sessionValid = false;
      sessionValid = await RefreshResolve();

      if (sessionValid == true) {
        //Move to the homepage
        router.replace("/homepage");
      } else if (sessionValid == false) {
        setDisplayLogin(true);
      }
    } catch (error) {
        console.log(error);
        setDisplayLogin(true);
    }
  }

  useState(() => {
    CheckSession();
  }, [])

  //testing function
  function moveToHomePage() {
    router.replace("/homepage");
  }

  return (
    <>
      {displayLogin ? (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.container}>
              <Text style={styles.title} allowFontScaling={false}>Login</Text>
            </View>
            <KeyboardAvoidingView
              style={styles.inputContainer}
              behavior="padding"
            >
              {fieldsFilled ? null : (
                <Text style={styles.errorText}>
                  Please fill out all the fields
                </Text>
              )}
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#808080"
                onChangeText={setEmail}
                value={email}
              />
              <TextInput
                secureTextEntry={true}
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#808080"
                onChangeText={setPassword}
                value={password}
              />
              <TouchableOpacity style={styles.inputButton}>
                <Text
                  style={styles.buttonText}
                  allowFontScaling={false}
                  onPress={() => {
                    if (email != "" && password != "") {
                      setFieldsFilled(true);
                      setCredentials({ email: email, password: password });
                      console.log("Wawawa");
                      VerifyLogin();
                      //moveToHomePage();
                    } else {
                      setFieldsFilled(false);
                    }
                  }}
                >
                  Sign In 
                </Text>
              </TouchableOpacity>
              <Text style={styles.registerText}>
                New to Qwitter?{" "}
                <Link href="/register" style={styles.registerLink}>
                  Sign Up 
                </Link>
              </Text>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <View style={styles.launcher}>
          <Ionicons name='logo-nodejs' size={46} color='#93a857' />
          <View style={styles.iconContainter}>
            <Text>Powered by </Text>
            <Ionicons name='logo-google' size={18} color='#4285F4' />
            <Ionicons name='logo-firebase' size={18} color='#F4B400' />
          </View>
        </View>
      )}
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    margin: 10,
    alignItems: "center",
    backgroundColor: '#f4f5f2',
  },
  inputContainer: {
    flex: 1,
    paddingTop: 0,
    margin: 10,
    margin: "auto",
  },
  title: {
    fontSize: 36,
    padding: 100,
    color: "#3b4323"
  },
  input: {
    height: 50,
    width: 270,
    margin: 10,
    borderWidth: 2,
    borderRadius: 14,
    padding: 10,
    borderColor: "#becb9a"
  },
  inputText: {
    textAlign: "left",
    marginLeft: 14,
    marginBottom: 0,
    color: "#3b4323"
  },
  inputButton: {
    height: 50,
    width: 270,
    margin: 10,
    borderRadius: 14,
    backgroundColor: "#5d7029",
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
    color: "#5d7029",
  },
  errorText: {
    textAlign: "center",
    color: "red",
    padding: 10,
  },
  launcher: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20
  },
  iconContainter: {
    flexDirection: "row",
    gap: 5
  }
});
