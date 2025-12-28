import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import API from "../../src/api/api";
import Colors from "../../src/constants/colors";

export default function CommandeDetail() {
  const { id } = useLocalSearchParams();
  const [commande, setCommande] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    API.get(`/commandes/${id}`)
      .then(res => setCommande(res.data))
      .catch(() => Alert.alert("Erreur chargement commande"));
  }, [id]);

  const annulerCommande = async () => {
    try {
      await API.put(`/commandes/${id}/annuler`);
      Alert.alert("Commande annulée");
      router.replace("/commandes");
    } catch {
      Alert.alert("Impossible d’annuler");
    }
  };

  if (!commande) return <Text style={{ padding: 20 }}>Chargement...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Commande #{commande.id}</Text>
      <Text>Statut : {commande.statut}</Text>
      <Text>Total : {commande.total} Ar</Text>

      {commande.statut === "confirmee" && (
        <TouchableOpacity style={styles.cancelBtn} onPress={annulerCommande}>
          <Text style={styles.cancelText}>❌ Annuler la commande</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  cancelBtn: {
    backgroundColor: "#FF6B6B",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  cancelText: { color: "#fff", fontWeight: "bold" },
});
