import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { Colors } from "../../constants/theme";

export default function ParametresScreen() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.back, { color: theme.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Paramètres
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.row, { backgroundColor: theme.card }]}>
          <Text style={[styles.label, { color: theme.text }]}>
            Mode sombre
          </Text>
          <Switch value={isDark} onValueChange={toggleTheme} />
        </View>

        <View style={[styles.row, { backgroundColor: theme.card }]}>
          <Text style={[styles.label, { color: theme.text }]}>
            Notifications
          </Text>
          <Switch value={true} />
        </View>

        <View style={[styles.infoBox, { backgroundColor: theme.card }]}>
          <Text style={{ color: theme.subText }}>
            D’autres paramètres seront disponibles prochainement.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, paddingTop: 60 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    elevation: 4,
  },
  back: { fontSize: 22, marginRight: 12 },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  container: { padding: 16 },
  row: {
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
  },
  label: { fontSize: 16, fontWeight: "500" },
  infoBox: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
  },
});
