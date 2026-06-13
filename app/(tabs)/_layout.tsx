import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#000066',
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          borderTopWidth: 0,
          height: 75,
          paddingBottom: 12,
          paddingTop: 12,
          position: 'absolute',
          elevation: 0,
        },
        tabBarActiveTintColor: '#00D4FF',
        tabBarInactiveTintColor: '#FFFFFF',
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Skanuj',
          tabBarIcon: ({ color }) => <Ionicons name="camera-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="statystyki"
        options={{
          title: 'statystyki',
          // Идеальное совпадение со скриншотом - три вертикальные полоски
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="chart-bar" size={30} color={color} />,
        }}
      />
      <Tabs.Screen
        name="wydatki"
        options={{
          title: 'wydatki',
          tabBarIcon: ({ color }) => <Ionicons name="clipboard-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'profil',
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="my_profile"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="manual"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}