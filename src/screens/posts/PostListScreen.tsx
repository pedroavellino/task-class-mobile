import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, View, StyleSheet, Pressable } from "react-native";
import { fetchPosts, searchPosts } from "../../api/posts";
import type { Post } from "../../types/post";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/RootNavigator";
import { useLayoutEffect } from "react";
import { Button } from "react-native";
import { useAuth } from "../../auth/AuthContext";
import React from "react";

function snippet(text: string, max = 120) {
  if (!text) return "";
  return text.length <= max ? text : text.slice(0, max).trimEnd() + "…";
}

export function PostsListScreen() {
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 10;

  const [search, setSearch] = useState("");
  const isSearching = useMemo(() => search.trim().length > 0, [search]);

  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const { role } = useAuth();

  useLayoutEffect(() => {
  navigation.setOptions({
    headerRight: () =>
      role === "admin" ? (
        <Button title="Gerenciar" onPress={() => navigation.navigate("PostsAdmin")} />
      ) : null,
  });
}, [navigation, role]);

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

  useFocusEffect(
  React.useCallback(() => {
    loadInitial();
  }, [search])
);

  async function loadMore() {
    if (loadingMore || loading || isSearching) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await fetchPosts({ limit, page: nextPage });
      if (data.length > 0) {
        setItems(prev => [...prev, ...data]);
        setPage(nextPage);
      }
    } finally {
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    const q = search.trim();
    const t = setTimeout(async () => {
      if (!q) {
        loadInitial();
        return;
      }
      setLoading(true);
      try {
        const data = await searchPosts(q);
        setItems(data);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    loadInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.muted}>Carregando posts…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Posts</Text>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Buscar por título ou conteúdo…"
        autoCapitalize="none"
        style={styles.input}
      />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={items.length === 0 ? styles.emptyContainer : undefined}
        ListEmptyComponent={<Text style={styles.muted}>Nenhum post encontrado.</Text>}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={loadingMore ? <ActivityIndicator style={{ marginVertical: 12 }} /> : null}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => navigation.navigate("PostDetail", { postId: item.id })}>
            <Text style={styles.cardTitle}>{item.titulo}</Text>
            <Text style={styles.cardMeta}>
              {item.autor} • {item.disciplina}{item.turma ? ` • ${item.turma}` : ""}
            </Text>
            <Text style={styles.cardBody}>{snippet(item.conteudo)}</Text>
          </Pressable>
        )}
      />
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
  card: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  cardMeta: { fontSize: 12, marginBottom: 8, color: "#666" },
  cardBody: { fontSize: 14, color: "#222" },
  muted: { color: "#666", marginTop: 8 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyContainer: { flexGrow: 1, alignItems: "center", justifyContent: "center" },
});
