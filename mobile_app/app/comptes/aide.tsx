import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { Colors } from "../../constants/theme";

export default function AideScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const theme = isDark ? Colors.dark : Colors.light;

  const aideItems = [
    {
      icon: "📦",
      title: "Comment passer une commande ?",
      text: "Choisissez une pharmacie, ajoutez vos médicaments au panier, puis confirmez votre commande.",
    },
    {
      icon: "🚚",
      title: "Livraison ou retrait ?",
      text: "Vous pouvez choisir la livraison à domicile ou le retrait en pharmacie.",
    },
    {
      icon: "❌",
      title: "Annuler une commande",
      text: "Une commande peut être annulée tant qu’elle n’est pas encore en livraison.",
    },
    {
      icon: "📞",
      title: "Besoin d’aide ?",
      text: "support@pharmacie-app.com\nTéléphone : 034 00 000 00",
    },
  ];

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.background }]}>

      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.back, { color: theme.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Aide & Assistance</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {aideItems.map((item, index) => (
          <AideCard
            key={index}
            icon={item.icon}
            title={item.title}
            text={item.text}
            theme={theme}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function AideCard({ icon, title, text, theme }) {
  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <Text style={[styles.icon, { color: theme.primary }]}>{icon}</Text>
      <View style={styles.cardContent}>
        <Text style={[styles.question, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.answer, { color: theme.subText }]}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 60,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  back: {
    fontSize: 22,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },

  container: {
    padding: 16,
    paddingBottom: 30,
  },

  card: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  icon: {
    fontSize: 26,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  answer: {
    fontSize: 14,
    lineHeight: 20,
  },
});
