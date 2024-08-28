import { Tabs } from "expo-router"
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';

export default () => {
    const [user, setUser] = useState({});

    async function initUser() {
        try {
            const accessToken = await SecureStore.getItemAsync('accessToken');
            const response = await fetch('https://rowan-brass-humerus.glitch.me/user', {
                method: "GET",
                headers: {
                    'Authorization' : 'Bearer ' + accessToken
                }
            });

            const data = await response.json();
            if (response.ok) {
                console.log(data);

                setUser(data);
                //setUsername(data.username);
                //await SecureStore.setItemAsync('username', data.username)
            }
            if (response.status == "401") {
                //const refreshToken = await SecureStore.getItemAsync('refreshToken');
                console.log("Access Token Expired, fetching new token!")
                let areTokensSet = false
                areTokensSet = await RefreshResolve();
                if (areTokensSet == true) {
                    initUser();
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        console.log("Fetching user info before tweets")
        initUser();
    }, [])


    return(
        <Tabs screenOptions={
            {tabBarActiveTintColor: '#93a857',
                // tabBarIcon: ({ focused, color, size }) => {
                //     let iconName;
        
                //     if (route.name === 'Home') {
                //       iconName = focused ? 'home' : 'home-outline';
                //     } else if (route.name === 'Settings') {
                //       iconName = focused ? 'settings' : 'settings-outline';
                //     }
        
                //     // You can return any component that you like here!
                //     return <Ionicons name={iconName} size={size} color={color} />;
                //   }
        }}>
            <Tabs.Screen name='homepage' options={{
                headerShown: false,
                title: "Home ",
                tabBarIcon: ({color}) => <Ionicons name='home' size={20} color={color} />
            }} />
            <Tabs.Screen name='search' options={{
                headerShown: false,
                title: "Search ",
                tabBarIcon: ({color}) => <Ionicons name='search' size={20} color={color} />
            }} />
            <Tabs.Screen name='post' options={{
                headerShown: false,
                title: "Post ",
                tabBarIcon: ({color}) => <Ionicons name='pencil' size={20} color={color} />
            }} />
            <Tabs.Screen name='profile' options={{
                headerShown: false,
                title: "Profile ",
                tabBarIcon: ({color}) => <Ionicons name='person-circle-outline' size={20} color={color} />
            }} initialParams={ user }/>
        </Tabs>
    )
}