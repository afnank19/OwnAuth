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
  SafeAreaView,
  Alert,
} from "react-native";
import { Link, router } from "expo-router";
import * as SecureStore from 'expo-secure-store';

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [warning, setWarning] = useState("");
  const [canReg, setCanReg] = useState(false);
  const [color, setColor] = useState('3b4323');

  const [credentials, setCredentials] = useState({});

    //Add the error text if fields not filled
  const RegisterUser = async () => {
    //Send over credentials to API
    try {
        console.log(JSON.stringify(credentials) + "+]");

        const response = await fetch('http://192.168.100.13:3000/register', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                bio: bio
            })
        });

        const data = await response.json();

        if(response.ok) {
            console.log("registered with token => " + data.accessToken);
            SetAccessToken(data.accessToken);
            SetRefreshToken(data.refreshToken);
            router.replace('/homepage');
        }
        
    } catch (error) {
        console.log(error)
    }

    async function SetAccessToken(accessToken) {
        let key = 'accessToken'
        await SecureStore.setItemAsync(key , accessToken);
    }
    async function  SetRefreshToken(refreshToken) {
        let refreshKey = 'refreshToken';
        await SecureStore.setItemAsync(refreshKey, refreshToken);
    }  
  }

  async function CheckUsername() {
    try {
      console.log("Checking if user name is unique")
      if(username == ""){
        return;
      }

      const response = await fetch('http://192.168.100.13:3000/user/unique', {
        method: "GET",
        headers: {
            'api_key': '76c1f850-8851-415f-879c-53a598296235',
            'username': username
        },
      });

      const data = await response.json();

      if(response.ok) {
        console.log("Username Available");
        setColor('#7ec94f')
        setWarning("Username available");
        setCanReg(true);
        setTimeout(() => {
          setWarning("")
        }, 2000)
      }
      
      if(response.status == '400') {
        setColor('#ff584f')
        setCanReg(false)
        setWarning('Username unavailable')
      }

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" />
          <View>
            <Text style={styles.title} allowFontScaling={false}>Welcome to Qwitter </Text>
            <Text style={styles.text} allowFontScaling={false}>Sign up to see what your friends are talking about. </Text>
          </View>
          <KeyboardAvoidingView
            behavior="padding"
          >
            <Text  style={{color: color, textAlign: 'center'}}>{warning}</Text>
            <TextInput
              style={styles.input}
              onChangeText={setUsername}
              value={username}
              placeholder="Username"
              placeholderTextColor="#808080"
              onEndEditing={() => {CheckUsername()}}
            />
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
              onChangeText={setPassword}
              value={password}
              placeholder="Password"
              placeholderTextColor="#808080"
            />
            <TextInput
              style={styles.bioInput}
              onChangeText={setBio}
              value={bio}
              placeholder="Bio"
              placeholderTextColor="#808080"
              multiline={true}
            />
            <TouchableOpacity style={styles.inputButton}>
              <Text
                style={styles.buttonText}
                allowFontScaling={false}
                onPress={() => {
                  if(!email.includes('@gmail.com')) {
                    console.log(email);
                    Alert.alert("Please enter a valid Gmail Address")

                    return
                  }

                  if (email != "" && password != "" && username != "" && bio != "" && canReg) {
                    setCredentials({
                      username: username,
                      email: email,
                      password: password,
                    });

                    console.log("Registering")
                    RegisterUser();
                  } else {
                    setWarning("Please fill out all the fields")
                    setColor("ff584f")
                    setTimeout(() => {
                      setWarning("")
                    }, 3000)
                  }
                }}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
            <Text style={styles.registerText}>
              Already a user?{" "}
              <Link href="/" style={styles.registerLink}>
                Sign In
              </Link>
            </Text>
          </KeyboardAvoidingView>
        </SafeAreaView>
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
    backgroundColor: '#f4f5f2',
    justifyContent: "space-around"
  },
  inputContainer: {
    flex: 2,
    margin: 10,
    marginTop: 0,
    margin: "auto",
  },
  title: {
    fontSize: 24,
    color: "#3b4323",
    textAlign: "center"
  },
  text: {
    paddingTop: 10,
    marginHorizontal: 80,
    fontSize: 16,
    textAlign: "center"
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
  bioInput: {
    flex: 1,
        maxHeight: 100,
        maxWidth: 270,
        borderWidth: 2,
        borderColor: "#becb9a",
        borderRadius: 16,
        flexDirection: "row",
        marginVertical: 10,
        margin: 10,
        padding: 10,
        fontSize: 16,
    },
});
