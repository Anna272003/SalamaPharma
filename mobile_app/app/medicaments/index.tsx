import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import Colors from "../../src/constants/colors";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  // 🔹 Fonction pour naviguer vers l'écran voulu
  const goToScreen = (screen: string) => {
    router.push(screen);
  };

  return (
    <ScrollView style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/pharmacie.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Pharmacie Madagascar</Text>
      </View>

      {/* 🔹 Carte de bienvenue */}
      <View style={styles.card}>
        <Text style={styles.welcomeText}>
          Bienvenue sur Pharmacie Madagascar !
        </Text>
        <Text style={styles.text}>
          Retrouvez facilement les pharmacies de garde et médicaments disponibles dans tout Madagascar.
        </Text>
      </View>

      {/* 🔹 Features */}
      <View style={styles.features}>

        {/* Rechercher Pharmacie */}
        <TouchableOpacity style={styles.featureCard} onPress={() => goToScreen("/pharmacies/list")}>
          <Text style={styles.featureTitle}>🔍 Rechercher Pharmacie</Text>
          <Text style={styles.featureText}>
            Trouvez rapidement une pharmacie de garde proche de vous.
          </Text>
        </TouchableOpacity>

        {/* Médicaments */}
        <TouchableOpacity style={styles.featureCard} onPress={() => goToScreen("/medicaments/list")}>
          <Text style={styles.featureTitle}>💊 Médicaments</Text>
          <Text style={styles.featureText}>
            Consultez les médicaments disponibles et leurs prix.
          </Text>
        </TouchableOpacity>

        {/* Localisation */}
        <TouchableOpacity style={styles.featureCard} onPress={() => goToScreen("/pharmacies/map")}>
          <Text style={styles.featureTitle}>📍 Localisation</Text>
          <Text style={styles.featureText}>
            Localisez facilement toutes les pharmacies sur la carte.
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  appName: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.primary,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: Colors.primary,
  },
  text: {
    fontSize: 16,
    color: Colors.text,
  },
  features: {
    marginBottom: 30,
  },
  featureCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: Colors.primary,
  },
  featureText: {
    fontSize: 14,
    color: "#555",
  },
});
