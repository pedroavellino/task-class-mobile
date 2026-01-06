import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/RootNavigator";
import { deletePost, fetchPosts } from "../../api/posts";
import type { Post } from "../../types/post";
import { useAuth } from "../../auth/AuthContext";

export function PostsAdminScreen() {
  const { role } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const limit = 10;

  // Bloqueio simples no mobile
  if (role !== "admin") {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Acesso negado</Text>
        <Text>Somente professores (admin) podem administrar postagens.</Text>
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
            // Atualiza lista local sem refetch
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
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.muted}>Carregando…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Administração de Posts</Text>

      <Pressable style={styles.primaryBtn} onPress={() => navigation.navigate("CreatePost")}>
        <Text style={styles.primaryBtnText}>Novo Post</Text>
      </Pressable>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
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
                <Text style={styles.actionText}>Excluir</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 24 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  muted: { color: "#666", marginTop: 8 },

  primaryBtn: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  primaryBtnText: { fontSize: 16, fontWeight: "700" },

  card: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  cardMeta: { fontSize: 12, marginBottom: 10, color: "#666" },

  actionsRow: { flexDirection: "row", gap: 10 },
  actionBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  editBtn: { borderColor: "#ddd" },
  deleteBtn: { borderColor: "#c00" },
  actionText: { fontWeight: "700" },
});
