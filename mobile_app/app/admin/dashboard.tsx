// app/admin/dashboard.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import API from "../../src/api/api"; // ton instance axios

export default function Dashboard({ navigation }: any) {
  const [stats, setStats] = useState({
    utilisateurs: 0,
    pharmacies: 0,
    medicaments: 0,
    commandes: 0,
  });
  const [commandesGraph, setCommandesGraph] = useState<number[]>([0, 0, 0]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await API.get("/dashboard/stats"); // backend à créer
      setStats(res.data.stats);
      setCommandesGraph([
        res.data.commandesGraph.today,
        res.data.commandesGraph.week,
        res.data.commandesGraph.month
      ]);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = [
    { title: "Utilisateurs", icon: "people", count: stats.utilisateurs },
    { title: "Pharmacies", icon: "local-pharmacy", count: stats.pharmacies },
    { title: "Médicaments", icon: "medication", count: stats.medicaments },
    { title: "Commandes", icon: "shopping-cart", count: stats.commandes},
  ];

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dashboard Admin</Text>
      <Text style={styles.subtitle}>Statistiques et gestion des données</Text>

      <View style={styles.cardsContainer}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.title}
            style={styles.card}
            
          >
            <MaterialIcons name={card.icon as any} size={40} color="#4CAF50" />
            <Text style={styles.cardText}>{card.title}</Text>
            <Text style={styles.cardCount}>{card.count}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.chartTitle}>Commandes</Text>
      <LineChart
        data={{
          labels: ["Aujourd'hui", "Cette semaine", "Ce mois"],
          datasets: [{ data: commandesGraph }],
        }}
        width={Dimensions.get("window").width - 40}
        height={220}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: "#f2f2f2",
          backgroundGradientFrom: "#f2f2f2",
          backgroundGradientTo: "#f2f2f2",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          style: { borderRadius: 12 },
          propsForDots: { r: "6", strokeWidth: "2", stroke: "#007AFF" },
        }}
        style={{ marginVertical: 20, borderRadius: 12 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#f2f2f2", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 6 },
  subtitle: { fontSize: 16, color: "#555", marginBottom: 20, textAlign: "center" },
  cardsContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", width: "100%" },
  card: {
    backgroundColor: "#fff",
    width: "45%",
    marginBottom: 15,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardText: { marginTop: 10, fontSize: 16, fontWeight: "bold" },
  cardCount: { fontSize: 20, fontWeight: "bold", marginTop: 4, color: "#007AFF" },
  chartTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});
