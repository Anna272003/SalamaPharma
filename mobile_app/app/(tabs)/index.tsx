import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { Colors } from "../../constants/theme";

export default function HomeScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const theme = isDark ? Colors.dark : Colors.light;

  const goToScreen = (screen: string) => {
    router.push(screen);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/pharmacie.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.appName, { color: theme.primary }]}>
          SalamaPharma
        </Text>
      </View>

      {/* CARD */}
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.welcomeText, { color: theme.primary }]}>
          Bienvenue sur SalamaPharma !
        </Text>
        <Text style={[styles.text, { color: theme.text }]}>
          Retrouvez facilement les pharmacies de garde et médicaments disponibles
          pour votre urgence.
        </Text>
      </View>

      {/* FEATURES */}
      <View style={styles.features}>
        <TouchableOpacity
          style={[styles.featureCard, { backgroundColor: theme.card }]}
          onPress={() => goToScreen("/pharmacies")}
        >
          <Text style={[styles.featureTitle, { color: theme.primary }]}>
            🔍 Rechercher Pharmacie
          </Text>
          <Text style={[styles.featureText, { color: theme.subText }]}>
            Trouvez rapidement une pharmacie de garde proche de vous.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.featureCard, { backgroundColor: theme.card }]}
          onPress={() => goToScreen("/medicament")}
        >
          <Text style={[styles.featureTitle, { color: theme.primary }]}>
            💊 Médicaments
          </Text>
          <Text style={[styles.featureText, { color: theme.subText }]}>
            Consultez les médicaments disponibles et leurs prix.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.featureCard, { backgroundColor: theme.card }]}
          onPress={() => goToScreen("/pharmacies")}
        >
          <Text style={[styles.featureTitle, { color: theme.primary }]}>
            📍 Localisation
          </Text>
          <Text style={[styles.featureText, { color: theme.subText }]}>
            Localisez facilement les pharmacies sur la carte.
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
  },
  features: {
    marginBottom: 30,
  },
  featureCard: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  featureText: {
    fontSize: 14,
  },
});
