import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../context/ThemeContext";
import { Colors } from "../../constants/theme";

type User = {
  id: number;
  nom: string;
  email: string;
  role: string;
  telephone?: string;
  adresse?: string;
};

export default function AccountScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const { isDark } = useTheme();
  const theme = isDark ? Colors.dark : Colors.light;

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (!storedUser) {
          Alert.alert("Session expirée", "Veuillez vous reconnecter");
          router.replace("/auth/login");
          return;
        }
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error(err);
        Alert.alert("Erreur", "Impossible de charger les informations utilisateur");
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Oui",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("user");
          Alert.alert("Succès", "Vous êtes déconnecté");
          router.replace("/auth/login");
        },
      },
    ]);
  };

  const goToSuiviCommande = () => {
    Alert.prompt(
      "Suivi de commande",
      "Entrez l'ID de la commande :",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Valider",
          onPress: (id) => {
            if (!id) {
              Alert.alert("Erreur", "ID de commande requis");
              return;
            }
            router.push({
              pathname: "/commandes/suivi",
              params: { id },
            });
          },
        },
      ],
      "plain-text"
    );
  };

  if (!user) return null;

  const settings = [
    { title: "Paramètres", route: "/comptes/parametre" },
    { title: "Aide / Assistance", route: "/comptes/aide" },
    { title: "Conditions d'utilisation", route: "/comptes/condition" },
    { title: "Suivi de commande", route: "/commandes/suivi" },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Image
          source={require("../../assets/images/avatar_ut.png")}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={[styles.name, { color: theme.onPrimary }]}>{user.nom}</Text>
          <Text style={[styles.email, { color: theme.onPrimary }]}>{user.email}</Text>
          {user.telephone && (
            <Text style={[styles.email, { color: theme.onPrimary }]}>
              📞 {user.telephone}
            </Text>
          )}
          {user.adresse && (
            <Text style={[styles.email, { color: theme.onPrimary }]}>
              🏠 {user.adresse}
            </Text>
          )}
        </View>
      </View>

      {/* MENU */}
      <View style={styles.section}>
        {settings.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.item, { backgroundColor: theme.card }]}
            onPress={() => router.push(item.route)}
          >
            <Text style={[styles.itemText, { color: theme.text }]}>{item.title}</Text>
          </TouchableOpacity>
        ))}

        {/* Bouton accès rapide suivi commande */}
        {/* <TouchableOpacity
          style={[styles.quickBtn, { backgroundColor: theme.primary }]}
          onPress={goToSuiviCommande}
        >
          <Text style={styles.quickBtnText}>🔍 Suivi de commande</Text>
        </TouchableOpacity> */}
      </View>

      {/* LOGOUT */}
      <TouchableOpacity
        style={[styles.logoutBtn, { backgroundColor: theme.danger }]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 20,
    elevation: 5,
  },
  avatar: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: "#fff", marginRight: 15 },
  userInfo: { flex: 1 },
  name: { fontSize: 22, fontWeight: "bold" },
  email: { fontSize: 16, marginTop: 4 },
  section: { paddingHorizontal: 16 },
  item: { paddingVertical: 15, marginBottom: 12, borderRadius: 12, paddingHorizontal: 16, elevation: 2 },
  itemText: { fontSize: 16 },
  quickBtn: { padding: 16, borderRadius: 12, alignItems: "center", marginBottom: 12, elevation: 3 },
  quickBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  logoutBtn: { marginHorizontal: 16, marginTop: 30, paddingVertical: 15, borderRadius: 12, alignItems: "center", elevation: 3 },
  logoutText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
