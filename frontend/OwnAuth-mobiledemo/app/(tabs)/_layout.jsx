import { Tabs } from "expo-router"

export default () => {
    return(
        <Tabs>
            <Tabs.Screen name='homepage' options={{
                headerShown: false
            }}/>
            <Tabs.Screen name='search' options={{
                headerShown: false
            }} />
        </Tabs>
    )
}