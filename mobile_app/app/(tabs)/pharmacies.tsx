import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import API from "../../src/api/api";
import { useTheme } from "../../context/ThemeContext";
import { Colors } from "../../constants/theme";

type Pharmacie = {
  id: number;
  nom: string;
  adresse: string;
  telephone: string;
  latitude?: number;
  longitude?: number;
  est_ouverte_24h?: number;
  distance?: number;
};

export default function PharmaciesScreen() {
  const [pharmacies, setPharmacies] = useState<Pharmacie[]>([]);
  const [search, setSearch] = useState("");
  const [userLocation, setUserLocation] =
    useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedPharmacy, setSelectedPharmacy] =
    useState<Pharmacie | null>(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<MapView>(null);
  const router = useRouter();

  /* 🔥 AJOUT – THEME */
  const { isDark } = useTheme();
  const theme = isDark ? Colors.dark : Colors.light;

  const getUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission de localisation refusée");
      setLoading(false);
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    setUserLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  const fetchPharmacies = async () => {
    try {
      const res = await API.get("/pharmacies");
      setPharmacies(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (text: string) => {
    setSearch(text);
    if (text.trim() === "") {
      fetchPharmacies();
      return;
    }
    try {
      const res = await API.get(`/pharmacies/search/${text}`);
      setPharmacies(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const focusOnPharmacy = (pharmacie: Pharmacie) => {
    if (!pharmacie.latitude || !pharmacie.longitude) return;
    setSelectedPharmacy(pharmacie);
    mapRef.current?.animateToRegion(
      {
        latitude: Number(pharmacie.latitude),
        longitude: Number(pharmacie.longitude),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
  };

  const openDirections = (lat: number, lng: number) => {
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    );
  };

  const callNumber = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  useEffect(() => {
    const init = async () => {
      await getUserLocation();
      await fetchPharmacies();
    };
    init();
  }, []);

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.background }, // 🔥 MODIF
        ]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.text }}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background }, // 🔥 MODIF
      ]}
    >
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.card, // 🔥 MODIF
            color: theme.text, // 🔥 MODIF
            borderColor: theme.primary, // 🔥 MODIF
          },
        ]}
        placeholder="🔍 Rechercher une pharmacie"
        placeholderTextColor={isDark ? "#AAA" : "#555"} // 🔥 AJOUT
        value={search}
        onChangeText={handleSearch}
      />

      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: userLocation?.latitude || -18.8792,
          longitude: userLocation?.longitude || 47.5079,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
      >
        {pharmacies.map(
          (p) =>
            p.latitude &&
            p.longitude && (
              <Marker
                key={p.id}
                coordinate={{
                  latitude: Number(p.latitude),
                  longitude: Number(p.longitude),
                }}
                pinColor={
                  selectedPharmacy?.id === p.id
                    ? theme.primary
                    : "red"
                }
                onPress={() => focusOnPharmacy(p)}
              />
            )
        )}

        {userLocation && selectedPharmacy && (
          <Polyline
            coordinates={[
              userLocation,
              {
                latitude: Number(selectedPharmacy.latitude),
                longitude: Number(selectedPharmacy.longitude),
              },
            ]}
            strokeColor={theme.primary} // 🔥 MODIF
            strokeWidth={3}
          />
        )}
      </MapView>

      <FlatList
        data={pharmacies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.card, // 🔥 MODIF
                borderColor:
                  selectedPharmacy?.id === item.id
                    ? theme.primary
                    : "transparent",
              },
            ]}
          >
            <Text style={[styles.title, { color: theme.primary }]}>
              {item.nom}
            </Text>

            <Text style={{ color: theme.text }}>{item.adresse}</Text>

            <TouchableOpacity onPress={() => callNumber(item.telephone)}>
              <Text style={{ color: theme.text }}>
                📞 {item.telephone}
              </Text>
            </TouchableOpacity>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#ccc" }]}
                onPress={() =>
                  openDirections(
                    Number(item.latitude),
                    Number(item.longitude)
                  )
                }
              >
                <Text>🗺️ Itinéraire</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.btn,
                  { backgroundColor: theme.primary },
                ]}
                onPress={() =>
                  router.push({
                    pathname: "/medicaments/[id]",
                    params: { id: String(item.id) },
                  })
                }
              >
                <Text style={{ color: "#fff" }}>👁️ Détails</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
  map: {
    width: Dimensions.get("window").width - 32,
    height: 250,
    borderRadius: 10,
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
});
