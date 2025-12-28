import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../src/api/api";
import { useTheme } from "../../context/ThemeContext";
import { Colors } from "../../constants/theme";

type User = {
  id: number;
  nom: string;
  email: string;
  role: string;
};

export default function CommandeScreen() {
  const { isDark } = useTheme();
  const theme = isDark ? Colors.dark : Colors.light;

  const { pharmacieId, panier } = useLocalSearchParams();
  const router = useRouter();

  const produits = JSON.parse((panier as string) || "[]");

  const [user, setUser] = useState<User | null>(null);
  const [quantites, setQuantites] = useState<{ [key: number]: string }>(
    Object.fromEntries(produits.map((p: any) => [p.medicament_id, "1"]))
  );
  const [mode, setMode] = useState<"retrait" | "livraison" | null>(null);
  const [adresse, setAdresse] = useState("");
  const [showRecap, setShowRecap] = useState(false);
  const [commandeDetails, setCommandeDetails] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");

        if (!storedUser) {
          Alert.alert(
            "Session expirée",
            "Votre session a expiré. Veuillez vous reconnecter."
          );
          router.replace("/auth/login");
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        Alert.alert("Erreur", "Impossible de récupérer l’utilisateur.");
      }
    };

    loadUser();
  }, []);

  const total = produits.reduce(
    (sum: number, p: any) =>
      sum + parseFloat(p.prix) * parseFloat(quantites[p.medicament_id] || "1"),
    0
  );

  const validerCommande = async () => {
    if (!user) {
      Alert.alert("Erreur", "Utilisateur non connecté");
      return;
    }

    if (!mode) {
      Alert.alert("Choix requis", "Veuillez choisir un mode de réception");
      return;
    }

    if (mode === "livraison" && adresse.trim() === "") {
      Alert.alert("Adresse manquante", "Veuillez saisir l’adresse de livraison");
      return;
    }

    if (produits.length === 0) {
      Alert.alert("Panier vide", "Votre panier est vide");
      return;
    }

    const body = {
      utilisateur_id: user.id,
      pharmacie_id: parseInt(pharmacieId as string, 10),
      total,
      adresse_livraison: mode === "livraison" ? adresse : null,
      type_livraison: mode,
      produits: produits.map((p: any) => ({
        medicament_id: p.medicament_id,
        quantite: parseInt(quantites[p.medicament_id] || "1"),
        prix_unitaire: parseFloat(p.prix),
      })),
    };

    try {
      const res = await API.post("/commandes", body);
      setCommandeDetails({ id: res.data.id });
      setShowRecap(true);
      Alert.alert("Succès", "Votre commande a été enregistrée !");
    } catch (err: any) {
      Alert.alert(
        "Erreur",
        err.response?.data?.error || "Impossible d’enregistrer la commande."
      );
    }
  };

  const fermerRecap = () => {
    setShowRecap(false);
    setAdresse("");
    setQuantites(
      Object.fromEntries(produits.map((p: any) => [p.medicament_id, "1"]))
    );
    setMode(null);
    router.push("/(tabs)/pharmacies");
  };

  if (!user) return null;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={[styles.back, { color: theme.text }]}>←</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: theme.primary }]}>🛒 Récapitulatif de la commande</Text>

      {produits.map((p: any) => (
        <View key={p.medicament_id} style={[styles.item, { backgroundColor: theme.card }]}>
          <Text style={[styles.itemName, { color: theme.text }]}>{p.nom}</Text>
          <Text style={[styles.itemPrice, { color: theme.subText }]}>{p.prix} Ar / unité</Text>

          <TextInput
            style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
            keyboardType="numeric"
            value={quantites[p.medicament_id]}
            onChangeText={(val) =>
              setQuantites((prev) => ({ ...prev, [p.medicament_id]: val }))
            }
            placeholder="Quantité"
            placeholderTextColor={theme.subText}
          />
        </View>
      ))}

      <Text style={[styles.total, { color: theme.primary }]}>💰 Total : {total.toFixed(2)} Ar</Text>

      <Text style={[styles.subtitle, { color: theme.text }]}>Mode de réception :</Text>
      <View style={styles.modes}>
        <TouchableOpacity
          style={[styles.modeBtn, mode === "retrait" && { backgroundColor: theme.primary }]}
          onPress={() => setMode("retrait")}
        >
          <Text style={mode === "retrait" ? styles.activeText : styles.textMode}>🏥 Retrait</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeBtn, mode === "livraison" && { backgroundColor: theme.primary }]}
          onPress={() => setMode("livraison")}
        >
          <Text style={mode === "livraison" ? styles.activeText : styles.textMode}>🚚 Livraison</Text>
        </TouchableOpacity>
      </View>

      {mode === "livraison" && (
        <TextInput
          style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
          placeholder="Adresse de livraison"
          placeholderTextColor={theme.subText}
          value={adresse}
          onChangeText={setAdresse}
        />
      )}

      <TouchableOpacity style={[styles.btn, { backgroundColor: theme.primary }]} onPress={validerCommande}>
        <Text style={[styles.btnText, { color: theme.onPrimary }]}>Confirmer la commande</Text>
      </TouchableOpacity>

      {/* MODAL */}
      <Modal transparent visible={showRecap} animationType="slide">
        <View style={[styles.modalContainer, { backgroundColor: "rgba(0,0,0,0.5)" }]}>
          <View style={[styles.modalBox, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.primary }]}> Commande Confirmée !</Text>
            <Text style={[styles.modalSubtitle, { color: theme.text }]}>
              Merci {user.nom} pour votre confiance 💚
            </Text>

            <Text style={[styles.modalSection, { color: theme.text }]}>🧾 Détails :</Text>
            {produits.map((p: any) => (
              <Text key={p.medicament_id} style={[styles.modalText, { color: theme.text }]}>
                {p.nom} — {quantites[p.medicament_id]} x {p.prix} Ar
              </Text>
            ))}

            <Text style={[styles.modalTotal, { color: theme.primary }]}>Total : {total.toFixed(2)} Ar</Text>
            <Text style={[styles.modalMode, { color: theme.text }]}>
              Mode : {mode === "livraison" ? "Livraison 🚚" : "Retrait 🏥"}
            </Text>

            {mode === "livraison" && (
              <Text style={[styles.modalAdresse, { color: theme.subText }]}>📍 {adresse}</Text>
            )}

            {commandeDetails?.id && (
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#4CAF50" }]}
                onPress={() =>
                  router.push({
                    pathname: "/commandes/suivi",
                    params: { id: commandeDetails.id },
                  })
                }
              >
                <Text style={styles.modalBtnText}>Suivre ma commande</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.modalBtn} onPress={fermerRecap}>
              <Text style={styles.modalBtnText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 80 },
  back: { fontSize: 22, marginBottom: 12 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  item: { padding: 14, borderRadius: 12, marginVertical: 6, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 },
  itemName: { fontSize: 16, fontWeight: "bold" },
  itemPrice: { fontSize: 14 },
  input: { padding: 12, borderRadius: 10, borderWidth: 1, borderColor: "#ccc", marginVertical: 8 },
  total: { fontWeight: "bold", fontSize: 18, marginVertical: 12, textAlign: "center" },
  subtitle: { fontWeight: "600", fontSize: 16, marginTop: 20, marginBottom: 10 },
  modes: { flexDirection: "row", gap: 10, marginBottom: 10 },
  modeBtn: { padding: 14, backgroundColor: "#eee", borderRadius: 12, flex: 1, alignItems: "center" },
  activeText: { color: "#fff", fontWeight: "bold" },
  textMode: { color: "#333", fontWeight: "600" },
  btn: { padding: 16, borderRadius: 12, alignItems: "center", marginTop: 24 },
  btnText: { fontWeight: "bold", fontSize: 16 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalBox: { padding: 20, borderRadius: 15, width: "85%", alignItems: "center" },
  modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  modalSubtitle: { fontSize: 14, marginBottom: 10 },
  modalSection: { fontWeight: "bold", marginTop: 10, marginBottom: 5, alignSelf: "flex-start" },
  modalText: { fontSize: 14, alignSelf: "flex-start" },
  modalTotal: { fontWeight: "bold", marginTop: 10 },
  modalMode: { marginTop: 6 },
  modalAdresse: { marginTop: 4, fontStyle: "italic" },
  modalBtn: { backgroundColor: "#007AFF", marginTop: 14, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  modalBtnText: { color: "#fff", fontWeight: "bold" },
});
