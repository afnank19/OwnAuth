import { Keyboard, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Post = () => {
  return (
    <SafeAreaView style={styles.container}>
        
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Text style={styles.title}>Post</Text>
                <TextInput style={styles.input}></TextInput>
            </View>
        </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

export default Post

const styles = StyleSheet.create({
    title: {
        fontSize: 36,
        fontWeight: "bold",
    },
    container: {
        flex: 1,
        flexDirection: "column",
        padding: 15,
        backgroundColor: '#f7f7f8',
    },
    input: {
        flex: 1,
        maxHeight: 150,
        borderWidth: 1,
        borderRadius: 16,
        flexDirection: "row",
        marginVertical: 10
    }
})