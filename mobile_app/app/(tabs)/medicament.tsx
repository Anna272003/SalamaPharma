import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import API from "../../src/api/api";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import MedicamentCard from "../../components/MedicamentCard";
import { useTheme } from "../../context/ThemeContext"; // 🔥 AJOUT
import { Colors } from "../../constants/theme"; // 🔥 AJOUT

type Categorie = {
  id: number;
  nom: string;
};

export default function MedicamentsScreen() {
  const [medicaments, setMedicaments] = useState<any[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategorie, setSelectedCategorie] = useState<number | null>(null);
  const router = useRouter();

  /* 🔥 AJOUT – THEME */
  const { isDark } = useTheme();
  const theme = isDark ? Colors.dark : Colors.light;

  const fetchMedicaments = async () => {
    try {
      const res = await API.get("/medicaments");
      setMedicaments(res.data);
    } catch (err) {
      console.log("Erreur récupération médicaments :", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.log("Erreur récupération catégories :", err);
    }
  };

  const handleSearch = async (text: string) => {
    setSearch(text);
    if (text.trim() === "") {
      fetchMedicaments();
      return;
    }
    try {
      const res = await API.get(`/medicaments/nom/${text}`);
      setMedicaments(res.data);
    } catch {
      setMedicaments([]);
    }
  };

  const handleCategorieFilter = async (categorieId: number | null) => {
    setSelectedCategorie(categorieId);
    if (categorieId === null) {
      fetchMedicaments();
      return;
    }
    try {
      const res = await API.get(`/medicaments/categorie/${categorieId}`);
      setMedicaments(res.data);
    } catch {
      setMedicaments([]);
    }
  };

  const goToDetail = (medicament: any) => {
    router.push({
      pathname: "/medicaments/medicamentDetail",
      params: { medicament: JSON.stringify(medicament) },
    });
  };

  useEffect(() => {
    fetchMedicaments();
    fetchCategories();
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background }, // 🔥 MODIF
      ]}
    >
      <Text style={[styles.header, { color: theme.primary }]}>
        💊 Médicaments
      </Text>

      <Text style={[styles.subHeader, { color: theme.text }]}>
        Recherchez par nom ou filtrez par catégorie
      </Text>

      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: theme.card, // 🔥 MODIF
            borderColor: theme.primary, // 🔥 MODIF
          },
        ]}
      >
        <Feather
          name="search"
          size={20}
          color={theme.text} // 🔥 MODIF
          style={{ marginRight: 8 }}
        />
        <TextInput
          placeholder="Ex: paracétamol, antibiotique..."
          placeholderTextColor={isDark ? "#AAA" : "#555"} // 🔥 AJOUT
          value={search}
          onChangeText={handleSearch}
          style={[
            styles.input,
            { color: theme.text }, // 🔥 MODIF
          ]}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        <TouchableOpacity
          style={[
            styles.categoryChip,
            selectedCategorie === null && {
              backgroundColor: theme.primary, // 🔥 MODIF
            },
          ]}
          onPress={() => handleCategorieFilter(null)}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategorie === null && {
                color: "#fff",
                fontWeight: "bold",
              },
            ]}
          >
            Tous
          </Text>
        </TouchableOpacity>

        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryChip,
              {
                backgroundColor:
                  selectedCategorie === cat.id
                    ? theme.primary // 🔥 MODIF
                    : theme.card, // 🔥 MODIF
              },
            ]}
            onPress={() => handleCategorieFilter(cat.id)}
          >
            <Text
              style={[
                styles.categoryText,
                {
                  color:
                    selectedCategorie === cat.id
                      ? "#fff"
                      : theme.text, // 🔥 MODIF
                },
              ]}
            >
              {cat.nom}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {medicaments.length === 0 ? (
        <Text style={[styles.noResult, { color: theme.text }]}>
          Aucun médicament trouvé.
        </Text>
      ) : (
        <FlatList
          data={medicaments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MedicamentCard
              item={item}
              onPress={goToDetail}
              categorie={
                categories.find((c) => c.id === item.categorie_id)?.nom
              }
            />
          )}
          contentContainerStyle={{ paddingBottom: 30, paddingTop: 10 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
  },
  subHeader: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  categoriesContainer: {
    marginBottom: 10,
  },
 categoryChip: {
    height: 34,
    minWidth: 70,
    paddingHorizontal: 14,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "500",
  },
  noResult: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
});
