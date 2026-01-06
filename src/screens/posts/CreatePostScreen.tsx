import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { createPost } from "../../api/posts";
import { useAuth } from "../../auth/AuthContext";
import { useNavigation } from "@react-navigation/native";

export function CreatePostScreen() {
  const { role } = useAuth();
  const navigation = useNavigation();

  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [autor, setAutor] = useState("");
  const [loading, setLoading] = useState(false);

  if (role !== "admin") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Acesso negado</Text>
        <Text>Somente professores (admin) podem criar postagens.</Text>
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
    <View style={styles.container}>
      <Text style={styles.title}>Criar Post</Text>

      <TextInput style={styles.input} placeholder="Título" value={titulo} onChangeText={setTitulo} />
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Conteúdo"
        value={conteudo}
        onChangeText={setConteudo}
        multiline
      />
      <TextInput style={styles.input} placeholder="Autor" value={autor} onChangeText={setAutor} />

      <Button title={loading ? "Enviando..." : "Criar"} onPress={onSubmit} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 24 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  multiline: { height: 120, textAlignVertical: "top" },
});
