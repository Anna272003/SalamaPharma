import React, { useState } from "react";
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import API from "../../src/api/api";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const router = useRouter();

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", {
        nom,
        email,
        mot_de_passe: password,
        telephone,
        adresse,
      });

      Alert.alert("Succès", "Compte créé avec succès");
      router.replace("/auth/login");
    } catch (err: any) {
      Alert.alert(
        "Erreur",
        err.response?.data?.message || "Erreur d'inscription"
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Image
        source={require("../../assets/images/login.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Créer un compte</Text>

      <View style={styles.form}>
        <TextInput placeholder="Nom complet" style={styles.input} onChangeText={setNom} />
        <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} />
        <TextInput
          placeholder="Mot de passe"
          secureTextEntry
          style={styles.input}
          onChangeText={setPassword}
        />
        <TextInput placeholder="Téléphone" style={styles.input} onChangeText={setTelephone} />
        <TextInput placeholder="Adresse" style={styles.input} onChangeText={setAdresse} />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>S’inscrire</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>
            Déjà un compte ? Se connecter
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 30,
  },
  form: {
    width: "100%",
  },
  input: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  button: {
    backgroundColor: "#1E3A8A",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  link: {
  marginTop: 20,
  textAlign: "center",
  color: "#1E3A8A",
  fontWeight: "600",
  textDecorationLine: "underline",
},

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
