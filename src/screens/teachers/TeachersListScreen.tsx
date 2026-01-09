import React, { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/RootNavigator";
import { deleteTeacher, fetchTeachers, type Teacher } from "../../api/teachers";
import { useAuth } from "../../auth/AuthContext";
import { theme } from "../../ui/theme";
import { HeaderActionButton } from "../../components/HeaderActionButton";

export function TeachersListScreen() {
  const { role } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const [items, setItems] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const limit = 10;

  const [refreshing, setRefreshing] = useState(false);

  async function onRefresh() {
    setRefreshing(true);
    try {
      await loadInitial();
    } finally {
      setRefreshing(false);
    }
  }

  if (role !== "admin") {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.title}>Acesso negado</Text>
        <Text style={styles.muted}>Somente professores (admin) podem administrar professores.</Text>
      </View>
    );
  }

useLayoutEffect(() => {
  navigation.setOptions({
    headerRight: () => (
      <HeaderActionButton title="Novo" onPress={() => navigation.navigate("CreateTeacher")} />
    ),
  });
}, [navigation]);


  async function loadInitial() {
    setLoading(true);
    try {
      const data = await fetchTeachers({ limit, page: 1 });
      setItems(data.items);
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
      const data = await fetchTeachers({ limit, page: nextPage });
      if (data.items.length > 0) {
        setItems((prev) => [...prev, ...data.items]);
        setPage(nextPage);
      }
    } finally {
      setLoadingMore(false);
    }
  }

  function confirmDelete(teacherId: string, email: string) {
    Alert.alert("Excluir professor", `Tem certeza que deseja excluir ${email}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTeacher(teacherId);
            setItems((prev) => prev.filter((t) => t.id !== teacherId));
          } catch {
            Alert.alert("Erro", "Não foi possível excluir o professor.");
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
      <Text style={styles.title}>Professores</Text>
      <Text style={styles.subtitle}>Listar, editar e excluir professores</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        contentContainerStyle={items.length === 0 ? styles.emptyContainer : undefined}
        ListEmptyComponent={<Text style={styles.muted}>Nenhum professor encontrado.</Text>}
        ListFooterComponent={loadingMore ? <ActivityIndicator style={{ marginVertical: 12 }} /> : null}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.email}</Text>

            <View style={styles.actionsRow}>
              <Pressable
                style={[styles.actionBtn, styles.editBtn]}
                onPress={() => navigation.navigate("EditTeacher", { teacherId: item.id })}
              >
                <Text style={styles.actionText}>Editar</Text>
              </Pressable>

              <Pressable
                style={[styles.actionBtn, styles.deleteBtn]}
                onPress={() => confirmDelete(item.id, item.email)}
              >
                <Text style={styles.deleteText}>Excluir</Text>
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
  center: { alignItems: "center", justifyContent: "center", padding: theme.spacing.md },

  title: { fontSize: theme.font.h2, fontWeight: "800", color: theme.colors.text, marginBottom: 6 },
  subtitle: { color: theme.colors.muted, marginBottom: theme.spacing.md },

  muted: { color: theme.colors.muted, marginTop: 8, textAlign: "center" },
  emptyContainer: { flexGrow: 1, alignItems: "center", justifyContent: "center" },

  card: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: { color: theme.colors.text, fontSize: 14, fontWeight: "800", marginBottom: 10 },

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
  deleteText: { fontWeight: "800", color: theme.colors.danger },
  actionText: { fontWeight: "800", color: theme.colors.text },
});
