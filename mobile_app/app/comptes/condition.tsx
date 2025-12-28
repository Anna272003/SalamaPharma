import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { Colors } from "../../constants/theme";

export default function ConditionsScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const theme = isDark ? Colors.dark : Colors.light;

  const conditions = [
    {
      number: "1",
      title: "Utilisation de l’application",
      text: "Cette application permet de commander des médicaments auprès de pharmacies partenaires.",
    },
    {
      number: "2",
      title: "Compte utilisateur",
      text: "Vous êtes responsable des informations fournies lors de votre inscription et de la confidentialité de votre compte.",
    },
    {
      number: "3",
      title: "Commandes",
      text: "Les commandes peuvent être annulées uniquement avant leur traitement par la pharmacie.",
    },
    {
      number: "4",
      title: "Données personnelles",
      text: "Vos données sont utilisées uniquement pour le bon fonctionnement du service et ne sont jamais vendues à des tiers.",
    },
    {
      number: "5",
      title: "Responsabilité",
      text: "L’application ne remplace en aucun cas les conseils d’un professionnel de santé.",
    },
  ];

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.background }]}>

      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.back, { color: theme.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Conditions d’utilisation
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.intro, { color: theme.subText }]}>
          En utilisant cette application, vous acceptez les conditions suivantes :
        </Text>

        {conditions.map((cond) => (
          <ConditionBlock key={cond.number} {...cond} theme={theme} />
        ))}

        <Text style={[styles.footer, { color: theme.subText }]}>
          Dernière mise à jour : 2025
        </Text>
      </ScrollView>
    </View>
  );
}

function ConditionBlock({ number, title, text, theme }) {
  return (
    <View style={[styles.block, { backgroundColor: theme.card }]}>
      <Text style={[styles.blockTitle, { color: theme.text }]}>
        {number}. {title}
      </Text>
      <Text style={[styles.blockText, { color: theme.subText }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, paddingTop: 60 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  back: { fontSize: 22, marginRight: 12 },
  headerTitle: { fontSize: 20, fontWeight: "bold" },

  container: { padding: 16, paddingBottom: 30 },
  intro: { fontSize: 14, marginBottom: 14, lineHeight: 20 },

  block: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  blockTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 6 },
  blockText: { fontSize: 14, lineHeight: 20 },

  footer: { textAlign: "center", fontSize: 12, marginTop: 20, marginBottom: 10 },
});
