import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { Colors } from "../../constants/theme";

export default function MedicamentDetail() {
  const { isDark } = useTheme();
  const theme = isDark ? Colors.dark : Colors.light;

  const params = useLocalSearchParams();
  let medicament = null;

  try {
    medicament = params.medicament ? JSON.parse(params.medicament as string) : null;
  } catch (err) {
    Alert.alert("Erreur", "Impossible de charger les détails du médicament");
  }

  if (!medicament) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.noResult, { color: theme.text }]}>
          Aucun médicament sélectionné.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.imageContainer, { backgroundColor: theme.card }]}>
        <Image
          source={require("../../assets/images/medoc.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.title, { color: theme.primary }]}>{medicament.nom}</Text>
        <Text style={[styles.description, { color: theme.text }]}>
          {medicament.description ?? "Pas de description disponible."}
        </Text>
        <Text style={[styles.info, { color: theme.text }]}>
          Prix : <Text style={[styles.highlight, { color: theme.primary }]}>{medicament.prix ?? "-"} €</Text>
        </Text>
        <Text style={[styles.info, { color: theme.text }]}>
          Stock : <Text style={[styles.highlight, { color: theme.primary }]}>{medicament.stock ?? "-"}</Text>
        </Text>
      </View>

      {medicament.code_barre && (
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.info, { color: theme.text }]}>
            Code barre : <Text style={[styles.highlight, { color: theme.primary }]}>{medicament.code_barre}</Text>
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 16,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  image: { width: 150, height: 150, borderRadius: 16 },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  description: { fontSize: 16, marginBottom: 12 },
  info: { fontSize: 16, marginBottom: 4 },
  highlight: { fontWeight: "bold" },
  noResult: { textAlign: "center", marginTop: 50, fontSize: 16 },
});
