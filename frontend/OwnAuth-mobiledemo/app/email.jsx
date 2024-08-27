import { View, Text, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback,Keyboard, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

const Email = () => {
    const [email, setEmail] = useState();


    async function StartEmailVerifcation() {

    }


    function HandleVerify() {
        try {
            
        } catch (error) {
            
        } finally {
            console.log("Moving to verify screen")
        }
    }
  return (
    <SafeAreaView style= {styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 
            <View style = {styles.container}>
                <View>
                    <Text style={styles.title} allowFontScaling={false}>Welcome to Qwitter</Text>
                    <Text style={styles.text}>Please enter your email</Text>
                    <TextInput style= {styles.input} placeholder='Email' placeholderTextColor="#808080" onChangeText={setEmail} value={email}></TextInput>
                </View>
                    <TouchableOpacity style = {styles.inputButton} onPress={() => {HandleVerify()}}>
                        <Text style = {styles.buttonText}>Verify</Text>
                    </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

export default Email;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 10,
      margin: 10,
      alignItems: "center",
      backgroundColor: '#f4f5f2',
      justifyContent: "space-between"
    },
    inputContainer: {
      flex: 2,
      marginTop: 0,
      paddingTop: 85
    },
    title: {
      fontSize: 24,
      color: "#3b4323",
      margin: 10,
      textAlign: "center"
    },
    text: {
        paddingTop: 20,
        fontSize: 18,
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

  });