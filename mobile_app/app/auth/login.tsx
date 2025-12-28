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
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        "Champs requis",
        "Veuillez saisir votre email et mot de passe."
      );
      return;
    }

    try {
      const res = await API.post("/auth/login", {
        email,
        mot_de_passe: password,
      });

      const user = res.data.user;

      await AsyncStorage.setItem("user", JSON.stringify(user));

      Alert.alert(
        "Connexion réussie ",
        `Bienvenue sur SalamaPharma, ${user.nom || "utilisateur"} !`,
        [
          {
            text: "Continuer",
            onPress: () => {
              // 🔄 Redirection selon rôle
              if (user.role === "admin") {
                router.replace("/admin/_layout");
              } else {
                router.replace("/(tabs)");
              }
            },
          },
        ]
      );

    } catch (err: any) {
      Alert.alert(
        "Erreur de connexion ❌",
        err.response?.data?.message ||
          "Email ou mot de passe incorrect."
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

      <Text style={styles.title}>SalamaPharma</Text>
      

      <View style={styles.form}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/auth/register")}>
          <Text style={styles.link}>
            Pas encore de compte ? S’inscrire
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
    fontSize: 30,
    fontWeight: "bold",
    color: "#1E3A8A",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 30,
    textAlign: "center",
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
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#1E3A8A",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
