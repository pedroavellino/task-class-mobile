import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View, ActivityIndicator } from "react-native";
import { useAuth } from "../../auth/AuthContext";
import { theme } from "../../ui/theme";

export function LoginScreen() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    if (!email.trim() || !password) {
      Alert.alert("Validação", "Informe e-mail e senha.");
      return;
    }

    setLoading(true);
    try {
      await signIn({ email: email.trim(), password });
    } catch (e) {
      Alert.alert("Login", e instanceof Error ? e.message : "Erro ao logar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>TaskClass</Text>
        <Text style={styles.subtitle}>Acesso à plataforma</Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="E-mail"
          placeholderTextColor={theme.colors.muted}
          style={styles.input}
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Senha"
          placeholderTextColor={theme.colors.muted}
          style={styles.input}
        />

        {loading ? (
          <ActivityIndicator style={{ marginTop: 8 }} />
        ) : (
          <Button title="Entrar" onPress={onSubmit} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },

  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: theme.colors.text,
    marginBottom: 4,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: theme.colors.muted,
    marginBottom: 20,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.inputBg,
    color: theme.colors.text,
    borderRadius: theme.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
});
