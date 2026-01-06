import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View, ActivityIndicator } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/RootNavigator";
import { fetchPostById, updatePost } from "../../api/posts";
import { useAuth } from "../../auth/AuthContext";

type RouteProps = RouteProp<AppStackParamList, "EditPost">;

export function EditPostScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { role } = useAuth();

  const postId = route.params?.postId;

  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [autor, setAutor] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  if (role !== "admin") {
    return (
      <View style={styles.center}>
        <Text>Acesso negado</Text>
      </View>
    );
  }

  if (!postId) {
    return (
      <View style={styles.center}>
        <Text>Post inválido</Text>
      </View>
    );
  }

  useEffect(() => {
    (async () => {
      try {
        const post = await fetchPostById(postId);
        setTitulo(post.titulo);
        setConteudo(post.conteudo);
        setAutor(post.autor);
      } catch {
        Alert.alert("Erro", "Não foi possível carregar o post.");
      } finally {
        setLoading(false);
      }
    })();
  }, [postId]);

  async function onSubmit() {
    if (!titulo.trim() || !conteudo.trim() || !autor.trim()) {
      Alert.alert("Validação", "Preencha título, conteúdo e autor.");
      return;
    }

    setSaving(true);
    try {
      await updatePost(postId, {
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
        autor: autor.trim(),
      });

      Alert.alert("Sucesso", "Post atualizado!");
      navigation.goBack();
    } catch {
      Alert.alert("Erro", "Erro ao atualizar o post.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Post</Text>

      <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} placeholder="Título" />
      <TextInput
        style={[styles.input, styles.multiline]}
        value={conteudo}
        onChangeText={setConteudo}
        placeholder="Conteúdo"
        multiline
      />
      <TextInput style={styles.input} value={autor} onChangeText={setAutor} placeholder="Autor" />

      <Button title={saving ? "Salvando..." : "Salvar alterações"} onPress={onSubmit} disabled={saving} />
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
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
