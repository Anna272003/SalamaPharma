import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import API from "../../src/api/api";
import Colors from "../../src/constants/colors";

export default function CommandesScreen() {
  const [commandes, setCommandes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    API.get("/commandes/user/1")
      .then(res => setCommandes(res.data))
      .catch(() => console.log("Erreur chargement commandes"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Text style={{ padding: 20 }}>Chargement...</Text>;
  }

  if (commandes.length === 0) {
    return <Text style={{ padding: 20 }}>Aucune commande</Text>;
  }

  return (
    <FlatList
      data={commandes}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push(`/commandes/${item.id}`)}
        >
          <Text style={styles.title}>Commande #{item.id}</Text>
          <Text>Total : {item.total} Ar</Text>
          <Text style={styles.status}>Statut : {item.statut}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
  },
  title: { fontWeight: "bold", fontSize: 16 },
  status: { marginTop: 6, color: Colors.primary },
});
