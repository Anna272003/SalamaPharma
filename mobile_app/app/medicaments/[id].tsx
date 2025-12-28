import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext"; // 🔥 AJOUT
import { Colors } from "../../constants/theme"; // 🔥 AJOUT
import API from "../../src/api/api";


type Medicament = {
  id: number;
  nom: string;
  description: string;
  prix: number;
  stock: number;
};

type Pharmacie = {
  id: number;
  nom: string;
  adresse: string;
  telephone: string;
};

export default function PharmacieDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { isDark } = useTheme();
  const theme = isDark ? Colors.dark : Colors.light;

  const [pharmacie, setPharmacie] = useState<Pharmacie | null>(null);
  const [medicaments, setMedicaments] = useState<Medicament[]>([]);
  const [panier, setPanier] = useState<Medicament[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* =======================
     CHARGEMENT DES DONNÉES
     ======================= */
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [resPharma, resMedocs] = await Promise.all([
          API.get(`/pharmacies/${id}`),
          API.get(`/pharmacies/${id}/medicaments`),
        ]);

        setPharmacie(resPharma.data);
        setMedicaments(resMedocs.data || []);
        setPanier([]);
      } catch {
        Alert.alert(
          "Erreur",
          "Impossible de charger les informations de la pharmacie."
        );
        setMedicaments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  /* =======================
     FILTRAGE
     ======================= */
  const filteredMedicaments = medicaments.filter((m) =>
    m.nom.toLowerCase().includes(search.toLowerCase())
  );

  /* =======================
     AJOUT AU PANIER
     ======================= */
  const addToCart = (medicament: Medicament) => {
    if (medicament.stock <= 0) {
      Alert.alert("Rupture de stock", `${medicament.nom} est indisponible.`);
      return;
    }

    if (panier.find((p) => p.id === medicament.id)) {
      Alert.alert("Déjà ajouté", `${medicament.nom} est déjà dans le panier.`);
      return;
    }

    setPanier((prev) => [...prev, medicament]);
    Alert.alert("Ajout réussi", `${medicament.nom} a été ajouté au panier.`);
  };

  /* =======================
     PASSER COMMANDE
     ======================= */
  const goToCommande = () => {
    if (panier.length === 0) {
      Alert.alert(
        "Panier vide",
        "Ajoutez au moins un médicament avant de continuer."
      );
      return;
    }

    router.push({
      pathname: "commandes/commande",
      params: {
        pharmacieId: id,
        panier: JSON.stringify(
          panier.map((m) => ({
            medicament_id: m.id,
            nom: m.nom,
            prix: m.prix,
          }))
        ),
      },
    });
  };

  /* =======================
     ÉTATS
     ======================= */
  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ marginTop: 10, color: theme.subText }}>
          Chargement des médicaments...
        </Text>
      </View>
    );
  }

  if (!pharmacie) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.background },
        ]}
      >
        <Text style={{ color: theme.subText }}>Pharmacie introuvable.</Text>
      </View>
    );
  }

  /* =======================
     RENDER ITEM
     ======================= */
  const renderItem = ({ item }: { item: Medicament }) => (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.name, { color: theme.text }]}>
          {item.nom}
        </Text>
        <Text style={[styles.desc, { color: theme.subText }]}>
          {item.description || "Aucune description disponible"}
        </Text>
        <Text style={[styles.price, { color: theme.primary }]}>
          {item.prix} Ar
        </Text>
        <Text style={{ color: item.stock > 0 ? "#22C55E" : theme.danger }}>
          {item.stock > 0
            ? `🟢 En stock (${item.stock})`
            : "🔴 Rupture de stock"}
        </Text>
      </View>

      {item.stock > 0 && (
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: theme.primary }]}
          onPress={() => addToCart(item)}
        >
          <Text style={{ color: theme.onPrimary, fontWeight: "bold" }}>
            + Panier
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <FlatList
        data={filteredMedicaments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.primary }]}>
                {pharmacie.nom}
              </Text>
              <Text style={{ color: theme.subText }}>
                {pharmacie.adresse}
              </Text>
              <Text style={{ color: theme.subText }}>
                📞 {pharmacie.telephone}
              </Text>
            </View>

            <TextInput
              placeholder="🔍 Rechercher un médicament"
              placeholderTextColor={theme.subText}
              style={[
                styles.searchInput,
                { backgroundColor: theme.card, color: theme.text },
              ]}
              value={search}
              onChangeText={setSearch}
            />

            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              💊 Médicaments disponibles
            </Text>

            {filteredMedicaments.length === 0 && (
              <Text style={{ textAlign: "center", color: theme.subText }}>
                Aucun médicament trouvé.
              </Text>
            )}
          </>
        }
      />

      <TouchableOpacity
        style={[styles.cartBtn, { backgroundColor: theme.primary }]}
        onPress={goToCommande}
      >
        <Text style={{ color: theme.onPrimary, fontSize: 16, fontWeight: "bold" }}>
          🛒 Voir le panier ({panier.length})
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* =======================
   STYLES (neutres)
   ======================= */
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 12,
    marginTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  searchInput: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 12,
    fontSize: 14,
  },
  card: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
    elevation: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  desc: {
    fontSize: 13,
    marginVertical: 2,
  },
  price: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: "600",
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "center",
    marginLeft: 10,
  },
  cartBtn: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
});
