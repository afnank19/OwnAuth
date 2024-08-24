import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';

const UserPill = (props) => {
    const [result, setResult] = useState(null);


    async function FollowUser(result) {
        try {
            const accessToken = await SecureStore.getItemAsync('accessToken');
            const username = await SecureStore.getItemAsync('username');
            console.log(username);

            const response = await fetch(`http://192.168.100.13:3000/user/follower/${username}`, {
                method: "POST",
                headers: {
                    'Authorization' : 'Bearer ' + accessToken,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userID: result.userID,
                    username: result.username
                })
            });

            console.log(response.status);

            const data = await response.json();

            if(response.ok) {
                console.log(data);
            }
            if (response.status == "401"){
                console.log("Access Token Expired, fetching new token!")
                let areTokensSet = false
                areTokensSet = await RefreshResolve();
                if (areTokensSet == true) {
                    FollowUser();
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        console.log("effect:")
        console.log(props.result)
        setResult(props.result)
    },[])



  return (
    <View style={styles.userContainer}>
      <Text style={styles.username}>@{props.username}</Text>
      <TouchableOpacity style={styles.followBtn}>
        <Text
          style={styles.btnText}
          onPress={() => {
            //console.log(result?.isFollowed);
            //Change the button to following!
            setResult(prevResult => ({
                ...prevResult,
                isFollowed: !prevResult.isFollowed
            }))
            
            console.log(result?.isFollowed);
            if(result?.isFollowed != true) {
                console.log("Trying to follow")
                FollowUser(result);
            }
            
            //API call to follow the user
          }}
        >
          {result?.isFollowed? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserPill;

const styles = StyleSheet.create({
  userContainer: {
    backgroundColor: "#e6ecdf",
    textAlign: "left",
    flexDirection: "row",
    padding: 10,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 3,
    color: "#3b4323"
  },
  followBtn: {
    backgroundColor: "#5d7029",
    color: "#fff",
    padding: 7,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  btnText: {
    color: "#fff",
  },
});
