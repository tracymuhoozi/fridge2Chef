import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { SavedProvider, useSaved } from './src/lib/store';
import HomeScreen from './src/screens/HomeScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import DetailScreen from './src/screens/DetailScreen';
import SavedScreen from './src/screens/SavedScreen';
import { colors } from './src/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  const { saved } = useSaved();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontWeight: '700' },
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: colors.line, height: 64, paddingBottom: 8, paddingTop: 6 },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={route.name === 'Fridge' ? 'restaurant' : 'heart'} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Fridge" component={HomeScreen} />
      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={{ tabBarBadge: saved.length || undefined, tabBarBadgeStyle: { backgroundColor: colors.primary } }}
      />
    </Tab.Navigator>
  );
}

const navTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.bg } };

export default function App() {
  return (
    <SafeAreaProvider>
      <SavedProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="auto" />
          <Stack.Navigator
            screenOptions={{
              headerTintColor: colors.ink,
              headerStyle: { backgroundColor: colors.bg },
              headerShadowVisible: false,
              headerBackTitle: '',
            }}
          >
            <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
            <Stack.Screen name="Results" component={ResultsScreen} options={{ title: '' }} />
            <Stack.Screen name="Detail" component={DetailScreen} options={{ title: '' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </SavedProvider>
    </SafeAreaProvider>
  );
}
