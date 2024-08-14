import { Keyboard, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Search = () => {

    const [searched, setSearched] = useState(null);

    useEffect(() => {
        if (searched != null)
            console.log("Searching in DB for: " + searched);
    }, [searched])

  return (
    <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <TextInput style={styles.input} placeholder='Search' onChangeText={setSearched} value={searched} />
            </View>
        </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

export default Search

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        padding: 20,
        backgroundColor: '#f7f7f8',
        alignItems: "center"
    },
    input: {
        height: 50,
        width: 320,
        margin: 10,
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        color: '#050506'
    }
})