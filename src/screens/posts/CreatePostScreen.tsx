import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { createPost } from "../../api/posts";
import { useAuth } from "../../auth/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../ui/theme";

export function CreatePostScreen() {
  const { role } = useAuth();
  const navigation = useNavigation();

  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [autor, setAutor] = useState("");
  const [loading, setLoading] = useState(false);

  if (role !== "admin") {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.title}>Acesso negado</Text>
        <Text style={styles.muted}>Somente professores (admin) podem criar postagens.</Text>
      </View>
    );
  }

  async function onSubmit() {
    if (!titulo.trim() || !conteudo.trim() || !autor.trim()) {
      Alert.alert("Validação", "Preencha título, conteúdo e autor.");
      return;
    }

    setLoading(true);
    try {
      await createPost({
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
        autor: autor.trim(),
      });

      Alert.alert("Sucesso", "Post criado!");
      // @ts-ignore
      navigation.goBack();
    } catch (e) {
      Alert.alert("Erro", e instanceof Error ? e.message : "Erro ao criar post");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Criar Post</Text>
      <Text style={styles.subtitle}>Preencha os campos abaixo para publicar</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          selectionColor={theme.colors.primary}
          placeholder="Ex.: Atividade de Matemática"
          placeholderTextColor={theme.colors.muted}
          value={titulo}
          onChangeText={setTitulo}
        />

        <Text style={[styles.label, { marginTop: 10 }]}>Conteúdo</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          selectionColor={theme.colors.primary}
          placeholder="Descreva a atividade..."
          placeholderTextColor={theme.colors.muted}
          value={conteudo}
          onChangeText={setConteudo}
          multiline
        />

        <Text style={[styles.label, { marginTop: 10 }]}>Autor</Text>
        <TextInput
          style={styles.input}
          selectionColor={theme.colors.primary}
          placeholder="Ex.: Professor Pedro"
          placeholderTextColor={theme.colors.muted}
          value={autor}
          onChangeText={setAutor}
        />

        <View style={{ marginTop: 12 }}>
          <Button title={loading ? "Enviando..." : "Criar"} onPress={onSubmit} disabled={loading} />
        </View>
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
  muted: { color: theme.colors.muted, textAlign: "center", marginTop: 8 },

  card: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
  },

  label: { color: theme.colors.muted, fontSize: 12, marginBottom: 6 },
  input: {
    backgroundColor: theme.colors.card2,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: theme.colors.text,
  },
  multiline: { height: 120, textAlignVertical: "top" },
});
