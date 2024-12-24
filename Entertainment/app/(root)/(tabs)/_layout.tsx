import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF6347', // Active icon and text color
        tabBarInactiveTintColor: '#808080', // Inactive icon and text color
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
        }),
      }}
    >
      {/* Songs Tab */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Songs',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="music" size={24} color={color} /> // Use the dynamic `color` prop
          ),
        }}
      />

      {/* Artists Tab */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Artists',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-music" size={30} color={color} /> // Use the dynamic `color` prop
          ),
        }}
      />
    </Tabs>
  );
}
