import { View, Text, StatusBar, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RefreshResolve } from '../auth';
import Tweet from '../../components/tweet';

const Homepage = () => {
    [username, setUsername] = useState('Loading..');

    async function fetchUser() {
        try {
            const accessToken = await SecureStore.getItemAsync('accessToken');
            console.log("token: " + accessToken);
            const response = await fetch('http://192.168.100.13:3000/homepage', {
                method: "GET",
                headers: {
                    'Authorization' : 'Bearer ' + accessToken
                }
            });

            const data = await response.json();
            if (response.ok) {
                console.log(data);

                setUsername(data.username);
            }
            if (response.status == "401") {
                //const refreshToken = await SecureStore.getItemAsync('refreshToken');
                console.log("Access Token Expired, fetching new token!")
                let areTokensSet = false
                areTokensSet = await RefreshResolve();
                if (areTokensSet == true) {
                    fetchUser();
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    // useEffect(() => {
    //     fetchUser();
    // },[])

  return (
    <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.title}>BadTwitter</Text>
        <Text>Welcome {username} work plsssssssss.....</Text>

        <Tweet />
        <Tweet />

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 36,
        fontWeight: "bold",
    },
    container: {
        flex: 1,
        flexDirection: "column",
        padding: 20,
        backgroundColor: '#f7f7f8',
    },
    tweetContainer: {
        backgroundColor: '#e3e3e8',
        padding: 10,
        borderRadius: 16,
        marginVertical: 7
    },
    tweetTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 3
    },
    tweetBody: {
        fontSize: 16,
        fontWeight: '400',
        marginBottom: 8
    },
    tweetDate: {
        fontSize: 14,
        fontWeight: '300',
        color: '#554c67'
    }
})

export default Homepage;