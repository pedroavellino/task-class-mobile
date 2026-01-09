import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View, ActivityIndicator } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/RootNavigator";
import { fetchPostById, updatePost } from "../../api/posts";
import { useAuth } from "../../auth/AuthContext";
import { theme } from "../../ui/theme";

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
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.title}>Acesso negado</Text>
        <Text style={styles.muted}>Somente professores (admin) podem editar postagens.</Text>
      </View>
    );
  }

  if (!postId) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.title}>Post inválido</Text>
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
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator />
        <Text style={styles.muted}>Carregando…</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Editar Post</Text>
      <Text style={styles.subtitle}>Ajuste as informações e salve</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Título"
          placeholderTextColor={theme.colors.muted}
        />

        <Text style={[styles.label, { marginTop: 10 }]}>Conteúdo</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={conteudo}
          onChangeText={setConteudo}
          placeholder="Conteúdo"
          placeholderTextColor={theme.colors.muted}
          multiline
        />

        <Text style={[styles.label, { marginTop: 10 }]}>Autor</Text>
        <TextInput
          style={styles.input}
          value={autor}
          onChangeText={setAutor}
          placeholder="Autor"
          placeholderTextColor={theme.colors.muted}
          autoCapitalize="words"
        />

        <View style={{ marginTop: 12 }}>
          <Button title={saving ? "Salvando..." : "Salvar alterações"} onPress={onSubmit} disabled={saving} />
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
