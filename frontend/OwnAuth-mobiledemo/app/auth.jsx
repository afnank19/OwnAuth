import { View, Text } from 'react-native'
import React from 'react'
import * as SecureStore from 'expo-secure-store';

export function testImport() {
    console.log("hello from auth");
}

export async function RefreshResolve() {
    try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        console.log("refresh: "+refreshToken);
        const response = await fetch('http://192.168.100.13:3000/refresh', {
            method: "GET",
            headers: {
                'Authorization' : 'Bearer ' + refreshToken
            }
        });

        const data = await response.json();
        console.log(data);
        
        if(response.ok) {
            SetAccessToken(data.accessToken);
            SetRefreshToken(data.refreshToken);
            console.log("Setting new token");
            return true;
        }
        if(response.status == "401") {
            console.log("No refresh available, please login again! :)");
            return false;
        }
    } catch (error) {
        return false;
    }
}
async function SetAccessToken(accessToken) {
    let key = 'accessToken'
    await SecureStore.setItemAsync(key , accessToken);
}
async function  SetRefreshToken(refreshToken) {
    let refreshKey = 'refreshToken';
    await SecureStore.setItemAsync(refreshKey, refreshToken);
} 

const Auth = () => {

  return (
    <View>
      <Text>auth</Text>
    </View>
  )
}

export default Auth