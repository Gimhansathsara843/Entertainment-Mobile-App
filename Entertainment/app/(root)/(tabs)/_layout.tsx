import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

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
          default: {},
        }),
      }}>
      {/* Songs Tab */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Songs',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="music.note" color={color} /> // Custom icon color based on state
          ),
        }}
      />

      {/* Artists Tab */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Artists',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.2.fill" color={color} /> // Custom icon color based on state
          ),
        }}
      />
    </Tabs>
  );
  
}
