import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import PharmacieDetail from "../screens/PharmacieDetail";
import CommandeScreen from "../screens/CommandeScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Liste des pharmacies" }}
      />
      <Stack.Screen
        name="PharmacieDetail"
        component={PharmacieDetail}
        options={{ title: "Détails de la pharmacie" }}
      />
      <Stack.Screen
        name="Commande"
        component={CommandeScreen}
        options={{ title: "Commander un médicament" }}
      />
    </Stack.Navigator>
  );
}
