import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet } from "react-native";
import Colors from "../src/constants/colors";

type Props = {
  item: any;
  onPress: (item: any) => void;
  category?: string;
};

export default function MedicamentCard({ item, onPress,category }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity onPress={() => onPress(item)}>
        <View style={styles.card}>
          <Text style={styles.title}>{item.nom}</Text>

          <Text style={styles.info}>💰 Prix : {item.prix ?? "-"}</Text>

          <Text
            style={[
              styles.info,
              item.stock > 0 ? styles.inStock : styles.outStock,
            ]}
          >
            {item.stock > 0
              ? `🟢 En stock (${item.stock})`
              : "🔴 Rupture de stock"}
          </Text>

          <Text style={styles.category}>
            🗂️ Catégorie : {item.categorie_nom ?? "-"}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 6,
  },
  info: { fontSize: 14, color: "#333", marginBottom: 4 },
  category: { fontSize: 13, color: "#666", marginTop: 6 },
  inStock: { color: "#00796B" },
  outStock: { color: "#D32F2F" },
});
