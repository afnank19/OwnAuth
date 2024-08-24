import { Keyboard, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View, StatusBar, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { RefreshResolve } from '../auth';
import * as SecureStore from 'expo-secure-store';
import UserPill from '../../components/userPill';

const Search = () => {

    const [searched, setSearched] = useState(null);
    const [test, setTest] = useState(true);
    const [result, setResult] = useState(null);

    async function SearchUsers(username) {
        console.log("Attempting to search")
        try {
            const accessToken = await SecureStore.getItemAsync('accessToken');

            const response = await fetch(`http://192.168.100.13:3000/user/search/${username}`, {
                method: "GET",
                headers: {
                    'Authorization' : 'Bearer ' + accessToken
                }
            });

            console.log(response.status);

            const data = await response.json();

            if(response.ok) {
                console.log(data);
                setResult(data);
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

    useEffect(() => {
        if (searched != null && searched != ""){
            setResult(null);
            SearchUsers(searched);
            console.log("Searching "+ searched)
        }
            
    }, [searched])

  return (
    <SafeAreaView style={styles.container}>

            <View>
                <Text style={styles.title}>Search</Text>
                <TextInput style={styles.input} placeholder='Search' onChangeText={setSearched} value={searched} />
                <ScrollView keyboardShouldPersistTaps="handled">
                {result? (
                    result.map((res, index) => (
                        <UserPill key={index} username={res.username} result={res}/>
                    ))
                    ) : (
                        <View style={styles.loader}> 
                            {searched != null && searched != ""? (
                                <ActivityIndicator />
                            ) : null}
                        </View>
                    )}
                </ScrollView>
            </View>

    </SafeAreaView>
  )
}

export default Search

const styles = StyleSheet.create({
    title: {
        fontSize: 28,
        fontWeight: "400",
        textAlign: "center",
        color: "#3b4323",
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f4f5f2',
        alignItems: "center",
    },
    input: {
        height: 50,
        width: 320,
        margin: 10,
        borderWidth: 2,
        borderColor: "#becb9a",
        borderRadius: 16,
        padding: 10,
        color: '#050506',
        alignSelf: "center",
    },
    userContainer: {
        backgroundColor: '#e3e3e8',
        textAlign: "left",
        flexDirection: "row",
        padding: 10,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 5
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 3,
    },
    followBtn: {
        backgroundColor: "#7d7290",
        color: "#fff",
        padding: 7,
        paddingHorizontal: 12,
        borderRadius: 12
    },
    btnText: {
        color: "#fff",
    },
    loader: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        flexDirection: "column"
    }
})