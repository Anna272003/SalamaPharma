// src/components/ScreenWrapper.tsx
import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";

export default function ScreenWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 50,             // padding global
        // centre horizontalement
    backgroundColor: "#f2f2f2",
  },
});
