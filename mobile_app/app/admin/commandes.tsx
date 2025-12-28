import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import API from "../../src/api/api";

export default function CommandesAdmin() {
  const [commandes, setCommandes] = useState<any[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  /* =======================
     RÉCUPÉRATION COMMANDES
     ======================= */
  const fetchCommandes = async () => {
    try {
      setLoading(true);
      const res = await API.get("/commandes");
      setCommandes(res.data);
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Impossible de charger les commandes. Vérifiez votre connexion."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommandes();
  }, []);

  /* =======================
     SUPPRESSION COMMANDE
     ======================= */
  const deleteCommande = (id: number) => {
    Alert.alert(
      "Confirmation",
      "Voulez-vous vraiment supprimer cette commande ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await API.delete(`/commandes/${id}`);
              Alert.alert("Succès", "Commande supprimée avec succès.");
              fetchCommandes();
            } catch {
              Alert.alert("Erreur", "Échec de la suppression de la commande.");
            }
          },
        },
      ]
    );
  };

  /* =======================
     DÉTAILS COMMANDE
     ======================= */
  const openDetails = async (commande: any) => {
    try {
      const res = await API.get(`/commandes/${commande.id}/details`);
      setDetails({ ...commande, produits: res.data });
      setShowDetails(true);
    } catch {
      Alert.alert("Erreur", "Impossible de charger les détails.");
    }
  };

  /* =======================
     MISE À JOUR STATUT
     ======================= */
  const updateStatus = async (id: number, statut: string) => {
    try {
      await API.put(`/commandes/${id}`, { statut });
      setDetails({ ...details, statut });
      fetchCommandes();
      Alert.alert(
        "Succès",
        `Statut mis à jour : ${statut.replace("_", " ")}`
      );
    } catch {
      Alert.alert("Erreur", "Impossible de modifier le statut.");
    }
  };

  /* =======================
     GÉNÉRATION PDF
     ======================= */
  const generateRecu = async () => {
    if (!details) return;

    try {
      const html = `
        <html>
          <body style="font-family: Arial; padding: 24px;">
            <h2 style="text-align:center;">REÇU - SalamaPharma</h2>
            <hr />

            <p><strong>Commande :</strong> #${details.id}</p>
            <p><strong>Client :</strong> ${details.utilisateur?.nom || "-"}</p>
            <p><strong>Adresse :</strong> ${details.adresse_livraison || "-"}</p>
            <p><strong>Livraison :</strong> ${details.type_livraison || "-"}</p>
            <p><strong>Statut :</strong> ${details.statut}</p>

            <h3>Produits</h3>
            <table width="100%" border="1" cellspacing="0" cellpadding="8">
              <tr>
                <th>Produit</th>
                <th>Qté</th>
                <th>Prix</th>
              </tr>
              ${details.produits
                .map(
                  (p: any) => `
                <tr>
                  <td>${p.medicament?.nom}</td>
                  <td align="center">${p.quantite}</td>
                  <td align="right">${p.prix_unitaire} Ar</td>
                </tr>`
                )
                .join("")}
            </table>

            <h3 style="text-align:right;">Total : ${details.total} Ar</h3>

            <p style="text-align:center; font-size:12px;">
              Merci pour votre confiance – SalamaPharma
            </p>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);

      Alert.alert("Succès", "Reçu PDF généré avec succès.");
    } catch {
      Alert.alert("Erreur", "Impossible de générer le reçu.");
    }
  };

  /* =======================
     BADGE STATUT
     ======================= */
  const StatusBadge = ({ statut }: { statut: string }) => (
    <View style={[styles.badge]}>
      <Text style={styles.badgeText}>{statut.replace("_", " ")}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>📦 Commandes – SalamaPharma</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" />
      ) : (
        <FlatList
          data={commandes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.orderId}>Commande #{item.id}</Text>
                <StatusBadge statut={item.statut} />
              </View>

              <Text>👤 {item.utilisateur?.nom || "Client inconnu"}</Text>
              <Text style={styles.total}>💰 {item.total} Ar</Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.btnPrimary}
                  onPress={() => openDetails(item)}
                >
                  <Text style={styles.btnText}>Détails</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btnDanger}
                  onPress={() => deleteCommande(item.id)}
                >
                  <Text style={styles.btnText}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* MODAL */}
      <Modal visible={showDetails} animationType="slide">
        <ScrollView style={styles.modal}>
          <Text style={styles.modalTitle}>Commande #{details?.id}</Text>

          {details?.produits?.map((p: any) => (
            <Text key={p.id}>
              • {p.medicament?.nom} ({p.quantite} × {p.prix_unitaire} Ar)
            </Text>
          ))}

          <View style={styles.statusGroup}>
            {["confirmee", "preparation", "en_livraison", "livree", "annulee"].map(
              (s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.statusBtn,
                    details?.statut === s && styles.statusActive,
                  ]}
                  onPress={() => updateStatus(details.id, s)}
                >
                  <Text style={{ color: details?.statut === s ? "#fff" : "#000" }}>
                    {s.replace("_", " ")}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>

          <TouchableOpacity style={styles.recuBtn} onPress={generateRecu}>
            <Text style={{ color: "#fff" }}>Générer le reçu PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setShowDetails(false)}
          >
            <Text style={{ color: "#fff" }}>Fermer</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
}

/* =======================
   STYLES
   ======================= */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F8FAFC" },
  pageTitle: { fontSize: 22, fontWeight: "700", marginBottom: 10 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderId: { fontWeight: "700" },
  total: { marginTop: 4, fontWeight: "600" },

  actions: { flexDirection: "row", gap: 10, marginTop: 12 },
  btnPrimary: {
    flex: 1,
    backgroundColor: "#2563EB",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  btnDanger: {
    flex: 1,
    backgroundColor: "#DC2626",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600" },

  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { color: "#fff", fontSize: 12 },
  badge_confirmee: { backgroundColor: "#2563EB" },
  badge_preparation: { backgroundColor: "#F59E0B" },
  badge_en_livraison: { backgroundColor: "#0EA5E9" },
  badge_livree: { backgroundColor: "#16A34A" },
  badge_annulee: { backgroundColor: "#DC2626" },

  modal: { padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 10 },

  statusGroup: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  statusBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
  },
  statusActive: { backgroundColor: "#2563EB", borderColor: "#2563EB" },

  recuBtn: {
    marginTop: 20,
    backgroundColor: "#16A34A",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  closeBtn: {
    marginTop: 12,
    backgroundColor: "#111827",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
});
