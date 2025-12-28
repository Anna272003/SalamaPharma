import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

export default function PharmacieDetail({ route, navigation }) {
  const { pharmacie } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.nom}>{pharmacie.nom}</Text>
      <Text style={styles.info}>Adresse : {pharmacie.adresse}</Text>
      <Text style={styles.info}>Téléphone : {pharmacie.telephone}</Text>
      <Text style={styles.info}>
        Ouverte 24h/24 : {pharmacie.est_ouverte_24h ? "Oui" : "Non"}
      </Text>
      <Button
        title="Commander un médicament"
        onPress={() => navigation.navigate("Commande")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  nom: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  info: { fontSize: 16, marginBottom: 5 },
});
