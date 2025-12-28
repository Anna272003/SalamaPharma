import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import API from "../api/api";

export default function TestAPI() {
  const [data, setData] = useState(null);

  const fetchPharmacies = async () => {
    try {
      const response = await API.get("/pharmacies");
      setData(response.data);
    } catch (error) {
      console.error("Erreur de connexion :", error);
    }
  };

  useEffect(() => {
    fetchPharmacies();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>📡 Test connexion au backend :</Text>
      {data ? (
        <Text>{JSON.stringify(data, null, 2)}</Text>
      ) : (
        <Text>Chargement...</Text>
      )}
    </View>
  );
}
