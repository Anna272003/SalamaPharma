import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import API from "../../src/api/api";
import { useTheme } from "../../context/ThemeContext";
import { Colors } from "../../constants/theme";

export default function SuiviCommandeScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isDark } = useTheme();
  const theme = isDark ? Colors.dark : Colors.light;

  const [commande, setCommande] = useState<any>(null);

  useEffect(() => {
    chargerCommande();
  }, []);

  const chargerCommande = async () => {
    try {
      const res = await API.get(`/commandes/${id}`);
      setCommande(res.data);
    } catch {
      Alert.alert("Erreur", "Impossible de charger la commande");
    }
  };

  const annulerCommande = async () => {
    try {
      await API.put(`/commandes/${id}/annuler`);
      Alert.alert("Succès", "La commande a été annulée avec succès");
      chargerCommande();
    } catch (err: any) {
      Alert.alert(
        "Erreur",
        err.response?.data?.message || "Annulation impossible"
      );
    }
  };

  if (!commande) return null;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={[styles.back, { color: theme.text }]}>←</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: theme.primary }]}>
        📦 Suivi de la commande
      </Text>

      <View
        style={[styles.userCard, { backgroundColor: theme.card }]}
      >
        <Text style={[styles.userName, { color: theme.primary }]}>
          👤 {commande.utilisateur_nom}
        </Text>
        <Text style={[styles.userInfo, { color: theme.text }]}>
          📞 {commande.utilisateur_tel}
        </Text>
        {commande.utilisateur_adresse && (
          <Text style={[styles.userInfo, { color: theme.subText }]}>
            🏠 {commande.utilisateur_adresse}
          </Text>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.subText }]}>Commande n°</Text>
        <Text style={[styles.value, { color: theme.text }]}>#{commande.id}</Text>

        <Text style={[styles.label, { color: theme.subText }]}>Statut</Text>
        <Text style={[styles.value, { color: theme.text }]}>{commande.statut}</Text>

        <Text style={[styles.label, { color: theme.subText }]}>Mode</Text>
        <Text style={[styles.value, { color: theme.text }]}>{commande.type_livraison}</Text>

        {commande.adresse_livraison && (
          <>
            <Text style={[styles.label, { color: theme.subText }]}>Adresse</Text>
            <Text style={[styles.value, { color: theme.text }]}>{commande.adresse_livraison}</Text>
          </>
        )}

        <Text style={[styles.label, { color: theme.subText }]}>Total</Text>
        <Text style={[styles.total, { color: theme.primary }]}>
          {commande.total} Ar
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.subtitle, { color: theme.text }]}>🧾 Médicaments</Text>
        {commande.details.map((d: any) => (
          <Text key={d.id} style={[styles.item, { color: theme.text }]}>
            {d.nom} × {d.quantite}
          </Text>
        ))}
      </View>

      {commande.statut === "confirmee" && (
        <TouchableOpacity
          style={[styles.cancelBtn, { backgroundColor: "#FF5252" }]}
          onPress={annulerCommande}
        >
          <Text style={styles.cancelText}>❌ Annuler la commande</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 80,
  },
  back: {
    fontSize: 22,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },
  label: {
    fontSize: 13,
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 6,
  },
  subtitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  item: {
    fontSize: 14,
    marginBottom: 4,
  },
  cancelBtn: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  cancelText: {
    color: "#fff",
    fontWeight: "bold",
  },
  userCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userInfo: {
    fontSize: 14,
    marginTop: 2,
  },
});
