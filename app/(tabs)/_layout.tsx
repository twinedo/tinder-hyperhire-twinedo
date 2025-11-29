import React from 'react';
import { Tabs } from 'expo-router';
import { Fontisto, Octicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#ff5864',
        tabBarInactiveTintColor: '#b9bec4',
        tabBarStyle: {
          backgroundColor: '#fff',
          height: 70,
          borderTopWidth: 0,
          paddingBottom: 12,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Fontisto name="tinder" size={30} color={color ?? '#ff5864'} />,
        }}
      />
      <Tabs.Screen
        name="likes"
        options={{
          title: 'Likes',
          tabBarIcon: ({ color }) => <Octicons name="sparkle-fill" size={30} color={color ?? '#b9bec4'} />,
        }}
      />
    </Tabs>
  );
}
