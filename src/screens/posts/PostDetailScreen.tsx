import React, { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View, Button } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/RootNavigator";
import type { Post } from "../../types/post";
import { deletePost, fetchPostById } from "../../api/posts";
import { useAuth } from "../../auth/AuthContext";
import { theme } from "../../ui/theme";

type RouteProps = RouteProp<AppStackParamList, "PostDetail">;

export function PostDetailScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { role } = useAuth();

  const postId = route.params?.postId;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  if (!postId) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Post inválido</Text>
      </View>
    );
  }

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPostById(postId);
        setPost(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [postId]);

  useLayoutEffect(() => {
    if (role !== "admin" || !post) return;

    navigation.setOptions({
      headerRight: () => (
        <Button title="Editar" onPress={() => navigation.navigate("EditPost", { postId })} />
      ),
    });
  }, [navigation, role, post, postId]);

  function onDelete() {
    Alert.alert("Excluir post", "Tem certeza que deseja excluir este post?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePost(postId);
            navigation.goBack();
          } catch {
            Alert.alert("Erro", "Não foi possível excluir o post.");
          }
        },
      },
    ]);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.muted}>Carregando…</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Post não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{post.titulo}</Text>
      <Text style={styles.meta}>por {post.autor}</Text>

      <View style={styles.contentCard}>
        <Text style={styles.content}>{post.conteudo}</Text>
      </View>

      {role === "admin" && (
        <View style={styles.adminActions}>
          <Button title="Excluir post" color={theme.colors.danger} onPress={onDelete} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: theme.colors.bg, flexGrow: 1 },

  title: { fontSize: 22, fontWeight: "900", marginBottom: 6, color: theme.colors.text },
  meta: { color: theme.colors.muted, marginBottom: 16 },

  contentCard: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: 16,
  },
  content: { fontSize: 16, lineHeight: 24, color: theme.colors.text, opacity: 0.95 },

  adminActions: { marginTop: 20 },

  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.bg, padding: 16 },
  muted: { marginTop: 8, color: theme.colors.muted },
  text: { color: theme.colors.text },
});
