import { Fontisto, Octicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#ff5864',
        tabBarInactiveTintColor: '#b9bec4',
        tabBarStyle: {
          backgroundColor: '#fff',
          height: 80,
          borderTopWidth: 0,
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
          title: '',
          tabBarIcon: ({ color }) => <Fontisto name="tinder" size={30} color={color ?? '#ff5864'} />,
        }}
      />
      <Tabs.Screen
        name="likes"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <Octicons name="sparkle-fill" size={30} color={color ?? '#b9bec4'} />,
        }}
      />
    </Tabs>
  );
}
