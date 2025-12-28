// import React, { useEffect, useState, useRef } from "react";
// import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
// import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
// import * as Location from "expo-location";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import Colors from "../../src/constants/colors";

// export default function SuiviLivraison() {
//   const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
//   const [livreurLocation, setLivreurLocation] = useState<{ latitude: number; longitude: number } | null>(null);
//   const [progress, setProgress] = useState(0);
//   const mapRef = useRef<MapView>(null);

//   const { mode, pharmacie } = useLocalSearchParams();
//   const router = useRouter();

//   useEffect(() => {
//     const getLocation = async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") return;
//       const loc = await Location.getCurrentPositionAsync({});
//       setUserLocation({
//         latitude: loc.coords.latitude,
//         longitude: loc.coords.longitude,
//       });

//       // Position initiale du livreur (simulée)
//       setLivreurLocation({
//         latitude: loc.coords.latitude - 0.02,
//         longitude: loc.coords.longitude - 0.02,
//       });
//     };

//     getLocation();
//   }, []);

//   // Simuler le déplacement du livreur vers le client
//   useEffect(() => {
//     if (!livreurLocation || !userLocation) return;

//     const interval = setInterval(() => {
//       setProgress((prev) => {
//         const next = prev + 0.05;
//         if (next >= 1) {
//           clearInterval(interval);
//           return 1;
//         }
//         // interpolation entre départ et arrivée
//         const newLat =
//           livreurLocation.latitude + (userLocation.latitude - livreurLocation.latitude) * next;
//         const newLon =
//           livreurLocation.longitude + (userLocation.longitude - livreurLocation.longitude) * next;
//         setLivreurLocation({ latitude: newLat, longitude: newLon });
//         return next;
//       });
//     }, 2000);

//     return () => clearInterval(interval);
//   }, [livreurLocation, userLocation]);

//   if (!userLocation || !livreurLocation) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text>Chargement de la carte...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <MapView
//         ref={mapRef}
//         provider={PROVIDER_GOOGLE}
//         style={styles.map}
//         initialRegion={{
//           latitude: userLocation.latitude,
//           longitude: userLocation.longitude,
//           latitudeDelta: 0.05,
//           longitudeDelta: 0.05,
//         }}
//       >
//         <Marker coordinate={userLocation} title="Vous" pinColor="green" />
//         <Marker coordinate={livreurLocation} title="Livreur" pinColor="blue" />
//         <Polyline
//           coordinates={[livreurLocation, userLocation]}
//           strokeColor={Colors.primary}
//           strokeWidth={4}
//         />
//       </MapView>

//       <View style={styles.infoBox}>
//         <Text style={styles.title}>Suivi de votre livraison</Text>
//         <Text style={styles.text}>Pharmacie : {pharmacie || "—"}</Text>
//         <Text style={styles.text}>Mode : {mode}</Text>
//         <Text style={styles.text}>
//           État :{" "}
//           {progress < 1 ? "🚴‍♂️ En cours de livraison..." : "✅ Livraison effectuée"}
//         </Text>

//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => router.push(`/(tabs)/index`)}
//         >
//           <Text style={styles.buttonText}>Retour à l’accueil</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.background },
//   loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
//   map: {
//     width: Dimensions.get("window").width,
//     height: Dimensions.get("window").height * 0.6,
//   },
//   infoBox: {
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//     elevation: 6,
//   },
//   title: { fontSize: 20, fontWeight: "bold", color: Colors.primary, marginBottom: 10 },
//   text: { fontSize: 16, marginBottom: 6, color: Colors.text },
//   button: {
//     backgroundColor: Colors.primary,
//     paddingVertical: 12,
//     borderRadius: 10,
//     marginTop: 15,
//     alignItems: "center",
//   },
//   buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
// });
