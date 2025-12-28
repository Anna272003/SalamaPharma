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
} from "react-native";
import API from "../../src/api/api";

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [nom, setNom] = useState("");

  /* =========================
     FETCH CATEGORIES
  ========================= */
  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (error) {
      Alert.alert(
        "Erreur ❌",
        "Impossible de récupérer la liste des catégories."
      );
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* =========================
     OPEN MODAL
  ========================= */
  const openModal = (cat?: any) => {
    if (cat) {
      setEditing(cat);
      setNom(cat.nom);
    } else {
      setEditing(null);
      setNom("");
    }
    setShowModal(true);
  };

  /* =========================
     SAVE CATEGORY
  ========================= */
  const saveCategorie = async () => {
    if (!nom.trim()) {
      Alert.alert("Champ requis", "Veuillez saisir un nom de catégorie.");
      return;
    }

    try {
      if (editing) {
        await API.put(`/categories/${editing.id}`, { nom });
        Alert.alert(
          "Succès ✅",
          "La catégorie a été modifiée avec succès."
        );
      } else {
        await API.post("/categories", { nom });
        Alert.alert(
          "Succès ✅",
          "La catégorie a été ajoutée avec succès."
        );
      }

      setShowModal(false);
      fetchCategories();
    } catch (error) {
      Alert.alert(
        "Erreur ❌",
        "Impossible d’enregistrer la catégorie."
      );
    }
  };

  /* =========================
     DELETE CATEGORY
  ========================= */
  const deleteCategorie = (id: number) => {
    Alert.alert(
      "Confirmation",
      "Voulez-vous vraiment supprimer cette catégorie ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await API.delete(`/categories/${id}`);
              Alert.alert(
                "Supprimé 🗑️",
                "La catégorie a été supprimée avec succès."
              );
              fetchCategories();
            } catch (error) {
              Alert.alert(
                "Erreur ❌",
                "Impossible de supprimer cette catégorie."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📂 Gestion des catégories</Text>

      <TouchableOpacity style={styles.addBtn} onPress={() => openModal()}>
        <Text style={styles.addBtnText}>+ Ajouter une catégorie</Text>
      </TouchableOpacity>

      {categories.length === 0 ? (
        <Text style={styles.emptyText}>
          Aucune catégorie enregistrée.
        </Text>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.name}>{item.nom}</Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => openModal(item)}
                >
                  <Text style={styles.btnText}>Modifier</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => deleteCategorie(item.id)}
                >
                  <Text style={styles.btnText}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* =========================
           MODAL
      ========================= */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {editing ? "✏️ Modifier la catégorie" : "➕ Ajouter une catégorie"}
            </Text>

            <TextInput
              value={nom}
              onChangeText={setNom}
              placeholder="Nom de la catégorie"
              style={styles.input}
            />

            <TouchableOpacity style={styles.modalBtn} onPress={saveCategorie}>
              <Text style={styles.modalBtnText}>
                {editing ? "Enregistrer" : "Ajouter"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowModal(false)}
            >
              <Text style={{ color: "#555" }}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* =========================
   STYLES
========================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  addBtn: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#666",
  },
  row: {
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  editBtn: {
    backgroundColor: "#F59E0B",
    padding: 8,
    borderRadius: 8,
  },
  deleteBtn: {
    backgroundColor: "#EF4444",
    padding: 8,
    borderRadius: 8,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    width: "85%",
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalBtn: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalClose: {
    marginTop: 12,
    alignItems: "center",
  },
});
