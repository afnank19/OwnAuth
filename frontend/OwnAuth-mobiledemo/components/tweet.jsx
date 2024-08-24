import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Tweet = (props) => {
  return (
    <View style={styles.tweetContainer}>
            <Text style={styles.tweetTitle}>@{props.username}</Text>
            <Text style={styles.tweetBody}>{props.body}</Text>
            <Text style={styles.tweetDate}>{props.timestamp}</Text>
    </View>
  )
}

export default Tweet

const styles = StyleSheet.create({
    tweetContainer: {
        backgroundColor: '#f2f5ef', //f7f2ed
        padding: 10,
        borderRadius: 16,
        marginVertical: 6,
        marginHorizontal: 7,
    },
    tweetTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 3,
        color: "#3b4323"
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