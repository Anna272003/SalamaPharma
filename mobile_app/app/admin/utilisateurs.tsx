import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import API from "../../src/api/api";

export default function UtilisateursAdmin() {
  const [users, setUsers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [role, setRole] = useState("client");

  /* ================= FETCH ================= */

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/utilisateurs");
      setUsers(res.data);
    } catch (err) {
      Alert.alert("Erreur", "Impossible de charger les utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= MODAL ================= */

  const resetForm = () => {
    setNom("");
    setEmail("");
    setMotDePasse("");
    setRole("client");
    setEditingUser(null);
  };

  const openModal = (user?: any) => {
    if (user) {
      setEditingUser(user);
      setNom(user.nom);
      setEmail(user.email);
      setRole(user.role);
      setMotDePasse("");
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  /* ================= SAVE ================= */

  const saveUser = async () => {
    if (!nom || !email) {
      Alert.alert("Champs requis", "Nom et email sont obligatoires");
      return;
    }

    if (!editingUser && !motDePasse) {
      Alert.alert("Mot de passe requis", "Veuillez définir un mot de passe");
      return;
    }

    try {
      if (editingUser) {
        await API.put(`/utilisateurs/${editingUser.id}`, {
          nom,
          email,
          role,
          mot_de_passe: motDePasse || undefined,
        });
        Alert.alert("Succès", "Utilisateur modifié avec succès");
      } else {
        await API.post("/utilisateurs", {
          nom,
          email,
          role,
          mot_de_passe: motDePasse,
        });
        Alert.alert("Succès", "Utilisateur ajouté avec succès");
      }

      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (err: any) {
      Alert.alert(
        "Erreur",
        err?.response?.data?.message ||
          "Impossible d’enregistrer l’utilisateur"
      );
    }
  };

  /* ================= DELETE ================= */

  const deleteUser = (id: number) => {
    Alert.alert(
      "Confirmation",
      "Voulez-vous vraiment supprimer cet utilisateur ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await API.delete(`/utilisateurs/${id}`);
              Alert.alert("Succès", "Utilisateur supprimé");
              fetchUsers();
            } catch (err) {
              Alert.alert("Erreur", "Suppression impossible");
            }
          },
        },
      ]
    );
  };

  /* ================= UI ================= */

  const renderUser = ({ item }: { item: any }) => (
    <View style={styles.userCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.userName}>{item.nom}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userRole}>Rôle : {item.role}</Text>
      </View>

      <View style={styles.actionBtns}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => openModal(item)}
        >
          <Text style={styles.btnText}>✏️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => deleteUser(item.id)}
        >
          <Text style={styles.btnText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addBtn} onPress={() => openModal()}>
        <Text style={styles.addBtnText}>+ Ajouter un utilisateur</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF"/>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUser}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}

      {/* ================= MODAL ================= */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {editingUser ? "Modifier" : "Ajouter"} un utilisateur
            </Text>

            <TextInput
              placeholder="Nom *"
              value={nom}
              onChangeText={setNom}
              style={styles.input}
            />

            <TextInput
              placeholder="Email *"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
            />

            <TextInput
              placeholder={
                editingUser
                  ? "Nouveau mot de passe (optionnel)"
                  : "Mot de passe *"
              }
              value={motDePasse}
              onChangeText={setMotDePasse}
              style={styles.input}
              secureTextEntry
            />

            <TextInput
              placeholder="Rôle (admin / client)"
              value={role}
              onChangeText={setRole}
              style={styles.input}
            />

            <TouchableOpacity style={styles.modalBtn} onPress={saveUser}>
              <Text style={styles.modalBtnText}>
                {editingUser ? "Modifier" : "Ajouter"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalBtnClose}
              onPress={() => setShowModal(false)}
            >
              <Text>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F4F6FA",
  },

  addBtn: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 3,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },

  userCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },

  userName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  userEmail: { fontSize: 14, color: "#666", marginTop: 4 },
  userRole: { fontSize: 13, color: "#888", marginTop: 4 },

  actionBtns: {
    flexDirection: "row",
    gap: 8,
  },

  editBtn: {
    backgroundColor: "#FFA500",
    padding: 8,
    borderRadius: 8,
  },
  deleteBtn: {
    backgroundColor: "#FF3B30",
    padding: 8,
    borderRadius: 8,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    backgroundColor: "#fafafa",
  },

  modalBtn: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  modalBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalBtnClose: {
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#eee",
  },
});
