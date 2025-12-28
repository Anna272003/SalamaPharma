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

export default function MedicamentsAdmin() {
  const [medicaments, setMedicaments] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [prix, setPrix] = useState("");
  const [stock, setStock] = useState("");
  const [categorieId, setCategorieId] = useState("");

  /* ================= FETCH ================= */

  const fetchMedicaments = async () => {
    try {
      setLoading(true);
      const res = await API.get("/medicaments");
      setMedicaments(res.data);
    } catch (err) {
      Alert.alert("Erreur", "Impossible de charger les médicaments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicaments();
  }, []);

  /* ================= MODAL ================= */

  const resetForm = () => {
    setNom("");
    setDescription("");
    setPrix("");
    setStock("");
    setCategorieId("");
    setEditing(null);
  };

  const openModal = (medicament?: any) => {
    if (medicament) {
      setEditing(medicament);
      setNom(medicament.nom);
      setDescription(medicament.description || "");
      setPrix(String(medicament.prix));
      setStock(String(medicament.stock));
      setCategorieId(String(medicament.categorie_id || ""));
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  /* ================= SAVE ================= */

  const saveMedicament = async () => {
    if (!nom || !prix || !stock) {
      Alert.alert("Champs obligatoires", "Nom, prix et stock sont requis");
      return;
    }

    try {
      const body = {
        nom,
        description,
        prix: Number(prix),
        stock: Number(stock),
        categorie_id: categorieId ? Number(categorieId) : null,
      };

      if (editing) {
        await API.put(`/medicaments/${editing.id}`, body);
        Alert.alert("Succès", "Médicament modifié avec succès");
      } else {
        await API.post("/medicaments", body);
        Alert.alert("Succès", "Médicament ajouté avec succès");
      }

      setShowModal(false);
      resetForm();
      fetchMedicaments();
    } catch (err) {
      Alert.alert("Erreur", "Échec de l’enregistrement");
    }
  };

  /* ================= DELETE ================= */

  const deleteMedicament = (id: number) => {
    Alert.alert(
      "Confirmation",
      "Voulez-vous supprimer ce médicament ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await API.delete(`/medicaments/${id}`);
              Alert.alert("Succès", "Médicament supprimé");
              fetchMedicaments();
            } catch (err) {
              Alert.alert("Erreur", "Suppression impossible");
            }
          },
        },
      ]
    );
  };

  /* ================= UI ================= */

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addBtn} onPress={() => openModal()}>
        <Text style={styles.addBtnText}>+ Ajouter un médicament</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={medicaments}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.nom}</Text>
                <Text style={styles.text}>{item.description || "—"}</Text>
                <Text style={styles.meta}>💰 Prix : {item.prix} Ar</Text>
                <Text style={styles.meta}>📦 Stock : {item.stock}</Text>
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
                  onPress={() => deleteMedicament(item.id)}
                >
                  <Text style={styles.actionText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* ================= MODAL ================= */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {editing ? "Modifier" : "Ajouter"} un médicament
            </Text>

            <TextInput placeholder="Nom *" value={nom} onChangeText={setNom} style={styles.input} />
            <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
            <TextInput placeholder="Prix *" value={prix} onChangeText={setPrix} keyboardType="numeric" style={styles.input} />
            <TextInput placeholder="Stock *" value={stock} onChangeText={setStock} keyboardType="numeric" style={styles.input} />
            <TextInput placeholder="ID Catégorie" value={categorieId} onChangeText={setCategorieId} keyboardType="numeric" style={styles.input} />

            <TouchableOpacity style={styles.modalBtn} onPress={saveMedicament}>
              <Text style={styles.modalBtnText}>
                {editing ? "Modifier" : "Ajouter"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalClose} onPress={() => setShowModal(false)}>
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
  container: { flex: 1, padding: 12, backgroundColor: "#F4F6FA" },

  addBtn: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  addBtnText: { color: "#fff", textAlign: "center", fontWeight: "bold" },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    marginBottom: 12,
    elevation: 2,
  },

  title: { fontSize: 16, fontWeight: "bold" },
  text: { fontSize: 14, color: "#555", marginVertical: 4 },
  meta: { fontSize: 13, color: "#333" },

  actions: { justifyContent: "space-between" },
  editBtn: { backgroundColor: "#FFA500", padding: 8, borderRadius: 6, marginBottom: 6 },
  deleteBtn: { backgroundColor: "#FF3B30", padding: 8, borderRadius: 6 },
  actionText: { color: "#fff" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 14,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
  },

  modalBtn: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  modalBtnText: { color: "#fff", fontWeight: "bold" },
  modalClose: {
    marginTop: 10,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 8,
  },
});
