import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createTeacher } from "../../api/teachers";
import { useAuth } from "../../auth/AuthContext";

export function CreateTeacherScreen() {
  const { role } = useAuth();
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (role !== "admin") {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Acesso negado</Text>
        <Text>Somente professores (admin) podem cadastrar professores.</Text>
      </View>
    );
  }

  async function onSubmit() {
    const e = email.trim().toLowerCase();
    const p = password;

    if (!e || !p) {
      Alert.alert("Validação", "Preencha e-mail e senha.");
      return;
    }

    if (p.length < 6) {
      Alert.alert("Validação", "A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await createTeacher({ email: e, password: p });
      Alert.alert("Sucesso", "Professor cadastrado!");
      // @ts-ignore
      navigation.goBack();
    } catch (err) {
      Alert.alert("Erro", err instanceof Error ? err.message : "Erro ao cadastrar professor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Professor</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha (mín. 6)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title={loading ? "Salvando..." : "Cadastrar"} onPress={onSubmit} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 24 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
});
