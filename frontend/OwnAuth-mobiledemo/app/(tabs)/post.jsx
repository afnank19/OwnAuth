import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as SecureStore from 'expo-secure-store';
import { s, vs, ms, mvs } from 'react-native-size-matters';

const Post = () => {
    const [wordLimit, setWordLimit] = useState(0);
    const [body, setBody] = useState("");
    const [status, setStatus] = useState("");

    function handleText(newText) {
        setBody(newText);
        setWordLimit(newText.length);
    }

    async function PostQwit() {
        console.log("Attempting to post a qwit")
        try {
            const accessToken = await SecureStore.getItemAsync('accessToken');
            const username = await SecureStore.getItemAsync('username');
            console.log(username);

            const response = await fetch(`http://192.168.100.13:3000/user/tweet`, {
                method: "POST",
                headers: {
                    'Authorization' : 'Bearer ' + accessToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    body: body,
                    username: username
                })
            });

            console.log(response.status);

            const data = await response.json();

            if(response.ok) {
                console.log("Posted Successfully")
                //Prolly some frontend to tell you
            }
            if (response.status == "401"){
                console.log("Access Token Expired, fetching new token!")
                let areTokensSet = false
                areTokensSet = await RefreshResolve();
                if (areTokensSet == true) {
                    SearchUsers();
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <SafeAreaView style={styles.container}>
        <Text style={styles.title} allowFontScaling={false}>Post</Text>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <TextInput style={styles.input} multiline={true} maxLength={280} onChangeText={newText => {handleText(newText)}} value={body}></TextInput>

                <View style={styles.btnContainer}>
                    <Text style={styles.charLimit} allowFontScaling={false}>{wordLimit}/280 </Text>
                    <TouchableOpacity 
                    style={styles.postBtn}
                    onPress={async () => {
                        if (body != "") {
                            handleText("");
                            try {
                                setStatus("Attempting to post your opinion")
                                await PostQwit();
                            } catch (error) {
                                console.log(error);
                                setStatus("Failed to post tweet :(")
                            } finally {
                                setStatus("Posted successfully")
                                setTimeout(() => {
                                    setStatus("")
                                }, 2000)
                            }
                        } else {
                            setStatus("Nothing to Qwit :|");

                            setTimeout(() => {
                                setStatus("")
                            }, 2000)
                        }
                    }}
                    >
                        <Text style={styles.btnText} allowFontScaling={false}>Post </Text>
                    </TouchableOpacity>
                </View>
                <Text>{status}</Text>
            </View>
        </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

export default Post

const styles = StyleSheet.create({
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        fontWeight: "400",
        color: "#3b4323",
    },
    container: {
        flex: 1,
        flexDirection: "column",
        padding: 20,
        backgroundColor: '#f7f7f8',
    },
    input: {
        flex: 1,
        maxHeight: 150,
        borderWidth: 2,
        borderColor: "#becb9a",
        borderRadius: 16,
        flexDirection: "row",
        marginVertical: 10,
        padding: 10,
        fontSize: 16
    },
    postBtn: {
        backgroundColor: "#5d7029",
        color: "#fff",
        padding: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
      },
    btnText: {
        color: "#fff",
        fontSize: ms(16),
        fontWeight: "600"
    },
    btnContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 10,
        marginVertical: 6
    },
    charLimit: {
        color: "#999999",
        fontSize: 14,
        margin: 4,
    }
})