import React from 'react'
import { Stack } from 'expo-router'

const RootLayout = () => {
  return (
    <Stack>
        <Stack.Screen name='index'options={{
            headerShown: false
        }}/>
        <Stack.Screen name='register' options={{
            headerShown: false
        }}/>
        <Stack.Screen name='email' options={{
            headerShown: false
        }} />
        <Stack.Screen name='(tabs)' options={{
            headerShown: false
        }} />
    </Stack>
  )
}

export default RootLayout