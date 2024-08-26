import { View, Text, StatusBar, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RefreshResolve } from '../auth';
import Tweet from '../../components/tweet';
import { s, vs, ms, mvs } from 'react-native-size-matters';

const Homepage = () => {
    const [username, setUsername] = useState('Loading..');
    const [tweets, setTweets] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

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
                console.log(data.username);

                //setUsername(data.username);
                await SecureStore.setItemAsync('username', data.username)
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

    async function getTweets() {
        try {
            const accessToken = await SecureStore.getItemAsync('accessToken');
            const username = await SecureStore.getItemAsync('username');
            console.log(username);

            console.log("fetching tweets");
            const response = await fetch('http://192.168.100.13:3000/user/tweets', {
                method: "GET",
                headers: {
                    'Authorization' : 'Bearer ' + accessToken,
                    'Username' : username
                }
            });
            
            console.log(response.status);
            const data = await response.json();
            if(response.ok) {
                console.log(data);
                setTweets(data);
            }
            if (response.status == "401"){
                console.log("Access Token Expired, fetching new token!")
                let areTokensSet = false
                areTokensSet = await RefreshResolve();
                if (areTokensSet == true) {
                    getTweets();
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const onRefresh = async() => {
        setRefreshing(true);
        getTweets();
        
        try {
            await getTweets();
        } catch (error) {
            console.log(error);
        } finally {
            setRefreshing(false);
        }
        // setTimeout(() => {
        //     console.log('Function called on pull down');
        //     setRefreshing(false);
        // }, 2000);
    }

    useEffect(() => {
        fetchUser();
        getTweets();
    },[])

  return (
    <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.title} allowFontScaling={false}>Qwitter</Text>
        {/* <Tweet username={tweets[0].username} body={tweets[0].body} timestamp={tweets[0].timeStamp}/>
        <Tweet username={tweets[1].username} body={tweets[1].body}/> */}
        
            {tweets? (
                <ScrollView style={styles.scrollView}  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                {tweets.map((tweet, index) => (
                    <Tweet key={index} username={tweet.username} body={tweet.body} timestamp={tweet.timeStamp}/>
                ))}
                </ScrollView>
            ) : (
                <ActivityIndicator />
            )}
        

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 36,
        fontWeight: "400",
        marginBottom: 30,
        textAlign: "center",
        color: "#3b4323",
    },
    container: {
        flex: 1,
        flexDirection: "column",
        padding: 20,
        backgroundColor: '#f4f5f2', //e2cdb6
    },
    scrollView: {
        backgroundColor: '#e6ecdf',
        borderRadius: 16
    },
    // tweetContainer: {
    //     backgroundColor: '#fff',
    //     padding: 10,
    //     borderRadius: 16,
    //     marginVertical: 7
    // },
    // tweetTitle: {
    //     fontSize: 16,
    //     fontWeight: 'bold',
    //     marginBottom: 3
    // },
    // tweetBody: {
    //     fontSize: 16,
    //     fontWeight: '400',
    //     marginBottom: 8
    // },
    // tweetDate: {
    //     fontSize: 14,
    //     fontWeight: '300',
    //     color: '#554c67'
    // }
})

export default Homepage;