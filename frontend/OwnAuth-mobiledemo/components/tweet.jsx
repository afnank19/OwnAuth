import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Tweet = () => {
  return (
    <View style={styles.tweetContainer}>
            <Text style={styles.tweetTitle}>@afnank19</Text>
            <Text style={styles.tweetBody}>Javascript se bakwaas tareen cheez aaj tak nhi dekhi</Text>
            <Text style={styles.tweetDate}>5:54 PM August 14, 2024</Text>
    </View>
  )
}

export default Tweet

const styles = StyleSheet.create({
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