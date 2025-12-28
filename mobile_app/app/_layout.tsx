import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "../context/ThemeContext";

export default function RootLayout() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const u = await AsyncStorage.getItem("user");
      setUser(u ? JSON.parse(u) : null);
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) return null;

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {!user && <Stack.Screen name="auth/login" />}
        {user?.role === "admin" && <Stack.Screen name="admin" />}
        {user?.role === "client" && <Stack.Screen name="(tabs)" />}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
