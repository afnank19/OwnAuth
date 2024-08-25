import { Tabs } from "expo-router"
import Ionicons from '@expo/vector-icons/Ionicons';

export default () => {
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
                title: "Home",
                tabBarIcon: ({color}) => <Ionicons name='home' size={20} color={color} />
            }} />
            <Tabs.Screen name='search' options={{
                headerShown: false,
                title: "Search",
                tabBarIcon: ({color}) => <Ionicons name='search' size={20} color={color} />
            }} />
            <Tabs.Screen name='post' options={{
                headerShown: false,
                title: "Post",
                tabBarIcon: ({color}) => <Ionicons name='pencil' size={20} color={color} />
            }} />
        </Tabs>
    )
}