import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient} from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const Profile = () => {
    //const { params } = useLocalSearchParams();
    const user = useLocalSearchParams();
    const gradientArray = ['#00b09b', '#96c93d'];
    const [metrics, setMetrics] = useState();
    
    async function GetUserMetrics() {
        try {
            const accessToken = await SecureStore.getItemAsync('accessToken');
            const response = await fetch('https://rowan-brass-humerus.glitch.me/user/metrics', {
                method: "GET",
                headers: {
                    'Authorization' : 'Bearer ' + accessToken
                }
            });

            const data = await response.json();
            if (response.ok) {
                console.log(data);

                setMetrics(data);
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

    async function SignOut() {
        console.log("Signing out! :(");
        
        try {
            await SecureStore.deleteItemAsync('refreshToken');
            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('username');

            router.replace('/');
        } catch (error) {
            console.error(error);
            console.log("Error Signing out");
        }
    }

    useEffect(() => {
        console.log(user);
    }, [])

    useFocusEffect(
        useCallback(() => {
            console.log("focused and calling metrics")
            GetUserMetrics();
        }, [])
    )


  return (
    <SafeAreaView style = { styles.container }>
        <LinearGradient colors={gradientArray} style={styles.userCard}>
            <View style= {styles.userBio}>
                <View>
                    <Text style = { styles.userName }>@{user.username} </Text>
                    <View style = { styles.follow}>
                        <Text style = {styles.followCount}> {metrics? metrics.followerCount : ""} Followers </Text>
                        <Text style = {styles.followCount}> {metrics? metrics.followingCount : ""} Following </Text>
                    </View>
                    <View>
                        <Text style = { styles.bioHeading }>Bio: </Text>
                        <Text style = { styles.bioContent }>{user.bio}</Text>
                    </View>
                </View>
                <TouchableOpacity style = { styles.signOut} onPress={() => {SignOut()}}>
                    <Text allowFontScaling={false}> Sign out </Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
        <View>
            <Text style ={ styles.aboutHeading }>About the project</Text>
            <Text allowFontScaling={false} style = { styles.aboutContent}>
                Qwitter is inspired by the film "The Social Network" where Mark Zuckerberg codes 
                Facebook in a week. I decided to do the same for fun. This project initially started
                out with just creating a backend Auth system, and I couldn't let my own custom Auth go to 
                waste, so Qwitter was born. It's still very premature, but hey, we can look past that. Hope you enjoy
                as much as I did in building this!
            </Text>
        </View>
        <View style= { styles.techStack}>
            <Ionicons name='logo-firebase' size={38} color='#F4B400' />
            <Ionicons name='logo-github' size={38} color='#20014a' />
            <Ionicons name='logo-nodejs' size={38} color='#93a857' />
            <Ionicons name='logo-react' size={38} color='#4285F4' />
        </View>
    </SafeAreaView>
  )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    userCard: {
        flex: 1,
        borderRadius: 24,
        overflow: "hidden",
        margin: 20,
        marginVertical: 30,
    },
    userBio: {
        flex: 1,
        borderRadius: 20,
        backgroundColor: "#222",
        margin: 10,
        overflow: 'hidden',
        padding: 16,
        justifyContent: 'space-between'
    },
    userName: {
        color: "white", 
        fontSize: 30,
        fontWeight: '600'
    },
    follow: {
        flexDirection: "row",
        marginTop: 5,
        marginBottom: 20
    },
    followCount: {
        color: "white",
    },
    bioHeading: {
        fontSize: 24,
        color: 'white',
        fontWeight: '600'
    },
    bioContent: {
        color: "#a8a8a8",
        fontSize: 16,
        marginVertical: 10
    },
    aboutHeading: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center', 
        margin: 10
    },
    aboutContent: {
        paddingHorizontal: 10,
        textAlign: "center"
    },
    techStack: {
        margin: 30,
        marginTop: 40,
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: "center",
        gap: 10
    },
    signOut: {
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 26,
        padding: 8,
        marginTop: 20
    }

})