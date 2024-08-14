import { View, Text, StatusBar, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RefreshResolve } from './auth';

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
    useEffect(() => {
        fetchUser();
    },[])

  return (
    <SafeAreaView>
        <StatusBar barStyle="dark-content" />
      <Text>Welcome {username} work plsssssssss.....</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    
})

export default Homepage;