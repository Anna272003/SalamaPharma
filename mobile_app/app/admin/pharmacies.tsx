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

export default function PharmaciesAdmin() {
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [nom, setNom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [telephone, setTelephone] = useState("");

  /* ================= FETCH ================= */

  const fetchPharmacies = async () => {
    try {
      setLoading(true);
      const res = await API.get("/pharmacies");
      setPharmacies(res.data);
    } catch (err) {
      Alert.alert("Erreur", "Impossible de charger les pharmacies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmacies();
  }, []);

  /* ================= MODAL ================= */

  const resetForm = () => {
    setNom("");
    setAdresse("");
    setTelephone("");
    setEditing(null);
  };

  const openModal = (pharmacie?: any) => {
    if (pharmacie) {
      setEditing(pharmacie);
      setNom(pharmacie.nom);
      setAdresse(pharmacie.adresse);
      setTelephone(pharmacie.telephone);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  /* ================= SAVE ================= */

  const savePharmacie = async () => {
    if (!nom || !adresse || !telephone) {
      Alert.alert(
        "Champs requis",
        "Veuillez remplir tous les champs"
      );
      return;
    }

    try {
      const body = { nom, adresse, telephone };

      if (editing) {
        await API.put(`/pharmacies/${editing.id}`, body);
        Alert.alert("Succès", "Pharmacie modifiée avec succès");
      } else {
        await API.post("/pharmacies", body);
        Alert.alert("Succès", "Pharmacie ajoutée avec succès");
      }

      setShowModal(false);
      resetForm();
      fetchPharmacies();
    } catch (err) {
      Alert.alert(
        "Erreur",
        "Impossible d’enregistrer la pharmacie"
      );
    }
  };

  /* ================= DELETE ================= */

  const deletePharmacie = (id: number) => {
    Alert.alert(
      "Confirmation",
      "Voulez-vous vraiment supprimer cette pharmacie ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await API.delete(`/pharmacies/${id}`);
              Alert.alert("Succès", "Pharmacie supprimée");
              fetchPharmacies();
            } catch (err) {
              Alert.alert("Erreur", "Suppression impossible");
            }
          },
        },
      ]
    );
  };

  /* ================= UI ================= */

  const renderPharmacie = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.nom}</Text>
        <Text style={styles.text}>{item.adresse}</Text>
        <Text style={styles.text}>📞 {item.telephone}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => openModal(item)}
        >
          <Text style={styles.actionText}>✏️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => deletePharmacie(item.id)}
        >
          <Text style={styles.actionText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addBtn} onPress={() => openModal()}>
        <Text style={styles.addBtnText}>+ Ajouter une pharmacie</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={pharmacies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPharmacie}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}

      {/* ================= MODAL ================= */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {editing ? "Modifier" : "Ajouter"} une pharmacie
            </Text>

            <TextInput
              placeholder="Nom de la pharmacie *"
              value={nom}
              onChangeText={setNom}
              style={styles.input}
            />

            <TextInput
              placeholder="Adresse *"
              value={adresse}
              onChangeText={setAdresse}
              style={styles.input}
            />

            <TextInput
              placeholder="Téléphone *"
              value={telephone}
              onChangeText={setTelephone}
              style={styles.input}
              keyboardType="phone-pad"
            />

            <TouchableOpacity style={styles.modalBtn} onPress={savePharmacie}>
              <Text style={styles.modalBtnText}>
                {editing ? "Modifier" : "Ajouter"}
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

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  text: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },

  actions: {
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
  actionText: {
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
