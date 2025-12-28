import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, Slot } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AdminLayout() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (path: string) => {
    setMenuOpen(false);
    router.push(path);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    router.replace("/auth/login");
  };

  return (
    <View style={styles.container}>
      {/* OVERLAY */}
      {menuOpen && (
        <Pressable style={styles.overlay} onPress={() => setMenuOpen(false)} />
      )}

      {/* SIDEBAR */}
      <View style={[styles.sidebar, menuOpen && styles.sidebarOpen]}>
        <Text style={styles.title}>Admin Panel</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* SECTION ADMIN */}
          <Section title="Administration">
            <SidebarButton
              icon="speedometer-outline"
              label="Dashboard"
              onPress={() => navigate("/admin/dashboard")}
            />
            <SidebarButton
              icon="people-outline"
              label="Utilisateurs"
              onPress={() => navigate("/admin/utilisateurs")}
            />
          </Section>

          {/* SECTION GESTION */}
          <Section title="Gestion">
            <SidebarButton
              icon="business-outline"
              label="Pharmacies"
              onPress={() => navigate("/admin/pharmacies")}
            />
            <SidebarButton
              icon="medkit-outline"
              label="Médicaments"
              onPress={() => navigate("/admin/medicaments")}
            />
            <SidebarButton
              icon="grid-outline"
              label="Catégories"
              onPress={() => navigate("/admin/categories")}
            />
            <SidebarButton
              icon="cart-outline"
              label="Commandes"
              onPress={() => navigate("/admin/commandes")}
            />
          </Section>

          {/* SECTION URGENCE */}
          
        </ScrollView>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      {/* CONTENU PRINCIPAL */}
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setMenuOpen(true)}>
            <Ionicons name="menu" size={28} color="#1E40AF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Administration</Text>
        </View>

        <Slot />
      </View>
    </View>
  );
}

/* ---------- COMPOSANTS ---------- */

function Section({ title, children }: any) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function SidebarButton({
  label,
  onPress,
  icon,
  danger = false,
}: {
  label: string;
  onPress: () => void;
  icon: any;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.btn, danger && styles.btnDanger]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={20} color="#fff" />
      <Text style={styles.btnText}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 9,
  },

  sidebar: {
    position: "absolute",
    zIndex: 10,
    width: "70%",
    height: "100%",
    backgroundColor: "#1E3A8A",
    paddingTop: 50,
    paddingHorizontal: 16,
    left: "-70%",
    transition: "left 0.3s",
  },

  sidebarOpen: {
    left: 0,
  },

  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    color: "#CBD5E1",
    fontSize: 13,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  btn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 10,
  },

  btnDanger: {
    backgroundColor: "#DC2626",
  },

  btnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 12,
  },

  logoutBtn: {
    flexDirection: "row",
    backgroundColor: "#EF4444",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },

  content: {
    flex: 1,
    paddingTop: 20,
  },

  header: {
    height: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    elevation: 4,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
    color: "#1E40AF",
  },
});
