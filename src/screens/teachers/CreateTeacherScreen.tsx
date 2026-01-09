import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createTeacher } from "../../api/teachers";
import { useAuth } from "../../auth/AuthContext";
import { theme } from "../../ui/theme";

export function CreateTeacherScreen() {
  const { role } = useAuth();
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (role !== "admin") {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.title}>Acesso negado</Text>
        <Text style={styles.muted}>Somente professores (admin) podem cadastrar professores.</Text>
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
    <View style={styles.screen}>
      <Text style={styles.title}>Novo Professor</Text>
      <Text style={styles.subtitle}>Crie um login de professor (admin)</Text>

      <View style={styles.card}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="ex: professor@escola.com"
          placeholderTextColor={theme.colors.muted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={[styles.label, { marginTop: 10 }]}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="mínimo 6 caracteres"
          placeholderTextColor={theme.colors.muted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={{ marginTop: 6 }}>
          <Button title={loading ? "Salvando..." : "Cadastrar"} onPress={onSubmit} disabled={loading} />
        </View>

        <Text style={styles.help}>
          Dica: use um e-mail realista e uma senha simples para o vídeo de apresentação.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    padding: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  center: { alignItems: "center", justifyContent: "center", padding: theme.spacing.md },

  title: { fontSize: theme.font.h2, fontWeight: "800", color: theme.colors.text, marginBottom: 6 },
  subtitle: { color: theme.colors.muted, marginBottom: theme.spacing.md },
  muted: { color: theme.colors.muted, marginTop: 8, textAlign: "center" },

  card: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: 16,
  },

  label: { color: theme.colors.muted, fontWeight: "700", marginBottom: 6 },

  input: {
    backgroundColor: theme.colors.card2,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: theme.colors.text,
  },

  help: { marginTop: 12, color: theme.colors.muted, fontSize: 12, lineHeight: 16 },
});
