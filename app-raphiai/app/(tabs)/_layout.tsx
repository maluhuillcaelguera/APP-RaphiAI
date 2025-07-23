import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePathname } from 'expo-router';

export default function TabLayout() {
  const pathname = usePathname();

  const shouldHideTabBar = pathname === '/camera';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0)',
        headerShown: false,
        tabBarStyle: shouldHideTabBar ? { display: 'none' } : {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarItemStyle: {
          borderRadius: 25,
          marginHorizontal: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              name="home" 
              size={24} 
              color="white"
              style={{
                backgroundColor: focused ? '#53B175' : '#53B175',
                borderRadius: 25,
                padding: 12,
                width: 50,
                height: 50,
                textAlign: 'center',
                textAlignVertical: 'center',
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              name="camera" 
              size={24} 
              color="white"
              style={{
                backgroundColor: focused ? '#53B175' : '#53B175',
                borderRadius: 25,
                padding: 12,
                width: 50,
                height: 50,
                textAlign: 'center',
                textAlignVertical: 'center',
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              name="menu" 
              size={24} 
              color="white"
              style={{
                backgroundColor: focused ? '#53B175' : '#53B175',
                borderRadius: 25,
                padding: 12,
                width: 50,
                height: 50,
                textAlign: 'center',
                textAlignVertical: 'center',
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}