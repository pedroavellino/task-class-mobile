import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/RootNavigator";
import { deletePost, fetchPosts } from "../../api/posts";
import type { Post } from "../../types/post";
import { useAuth } from "../../auth/AuthContext";
import { theme } from "../../ui/theme";

export function PostsAdminScreen() {
  const { role } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const limit = 10;

  if (role !== "admin") {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.title}>Acesso negado</Text>
        <Text style={styles.muted}>Somente professores (admin) podem administrar postagens.</Text>
      </View>
    );
  }

  async function loadInitial() {
    setLoading(true);
    try {
      const data = await fetchPosts({ limit, page: 1 });
      setItems(data);
      setPage(1);
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    if (loadingMore || loading) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await fetchPosts({ limit, page: nextPage });
      if (data.length > 0) {
        setItems((prev) => [...prev, ...data]);
        setPage(nextPage);
      }
    } finally {
      setLoadingMore(false);
    }
  }

  function confirmDelete(postId: string) {
    Alert.alert("Excluir post", "Tem certeza que deseja excluir este post?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePost(postId);
            setItems((prev) => prev.filter((p) => p.id !== postId));
          } catch {
            Alert.alert("Erro", "Não foi possível excluir o post.");
          }
        },
      },
    ]);
  }

  useEffect(() => {
    loadInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <Text style={styles.title}>Administração de Posts</Text>
      <Text style={styles.subtitle}>Crie, edite e exclua postagens</Text>

      <Pressable style={styles.primaryBtn} onPress={() => navigation.navigate("CreatePost")}>
        <Text style={styles.primaryBtnText}>Novo Post</Text>
      </Pressable>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        contentContainerStyle={items.length === 0 ? styles.emptyContainer : undefined}
        ListEmptyComponent={<Text style={styles.muted}>Nenhum post encontrado.</Text>}
        ListFooterComponent={loadingMore ? <ActivityIndicator style={{ marginVertical: 12 }} /> : null}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Pressable onPress={() => navigation.navigate("PostDetail", { postId: item.id })}>
              <Text style={styles.cardTitle}>{item.titulo}</Text>
              <Text style={styles.cardMeta}>{item.autor}</Text>
            </Pressable>

            <View style={styles.actionsRow}>
              <Pressable
                style={[styles.actionBtn, styles.editBtn]}
                onPress={() => navigation.navigate("EditPost", { postId: item.id })}
              >
                <Text style={styles.actionText}>Editar</Text>
              </Pressable>

              <Pressable
                style={[styles.actionBtn, styles.deleteBtn]}
                onPress={() => confirmDelete(item.id)}
              >
                <Text style={[styles.actionText, { color: theme.colors.danger }]}>Excluir</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
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
  center: { alignItems: "center", justifyContent: "center" },

  title: { fontSize: theme.font.h2, fontWeight: "800", color: theme.colors.text, marginBottom: 6 },
  subtitle: { color: theme.colors.muted, marginBottom: theme.spacing.md },

  muted: { color: theme.colors.muted, marginTop: 8, textAlign: "center" },
  emptyContainer: { flexGrow: 1, alignItems: "center", justifyContent: "center" },

  primaryBtn: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  primaryBtnText: { color: theme.colors.primary, fontSize: 16, fontWeight: "800" },

  card: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: { color: theme.colors.text, fontSize: 16, fontWeight: "800", marginBottom: 6 },
  cardMeta: { color: theme.colors.muted, fontSize: 12, marginBottom: 10 },

  actionsRow: { flexDirection: "row", gap: 10 },
  actionBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: theme.colors.card2,
  },
  editBtn: { borderColor: theme.colors.border },
  deleteBtn: { borderColor: theme.colors.danger },
  actionText: { fontWeight: "800", color: theme.colors.text },
});
