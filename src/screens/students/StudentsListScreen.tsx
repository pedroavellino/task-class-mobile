import React, { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/RootNavigator";
import { deleteStudent, fetchStudents, type Student } from "../../api/students";
import { useAuth } from "../../auth/AuthContext";
import { theme } from "../../ui/theme";

export function StudentsListScreen() {
  const { role } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const [items, setItems] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const limit = 10;

  if (role !== "admin") {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.title}>Acesso negado</Text>
        <Text style={styles.muted}>Somente professores (admin) podem administrar alunos.</Text>
      </View>
    );
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button title="Novo" onPress={() => navigation.navigate("CreateStudent")} />,
    });
  }, [navigation]);

  async function loadInitial() {
    setLoading(true);
    try {
      const data = await fetchStudents({ limit, page: 1 });
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
      const data = await fetchStudents({ limit, page: nextPage });
      if (data.items.length > 0) {
        setItems((prev) => [...prev, ...data.items]);
        setPage(nextPage);
      }
    } finally {
      setLoadingMore(false);
    }
  }

  function confirmDelete(studentId: string, email: string) {
    Alert.alert("Excluir aluno", `Tem certeza que deseja excluir ${email}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteStudent(studentId);
            setItems((prev) => prev.filter((s) => s.id !== studentId));
          } catch {
            Alert.alert("Erro", "Não foi possível excluir o aluno.");
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
      <Text style={styles.title}>Alunos</Text>
      <Text style={styles.subtitle}>Listar, editar e excluir alunos</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={<Text style={styles.muted}>Nenhum aluno encontrado.</Text>}
        ListFooterComponent={loadingMore ? <ActivityIndicator style={{ marginVertical: 12 }} /> : null}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.email}</Text>

            <View style={styles.actionsRow}>
              <Pressable
                style={[styles.actionBtn, styles.editBtn]}
                onPress={() => navigation.navigate("EditStudent", { studentId: item.id })}
              >
                <Text style={styles.actionText}>Editar</Text>
              </Pressable>

              <Pressable
                style={[styles.actionBtn, styles.deleteBtn]}
                onPress={() => confirmDelete(item.id, item.email)}
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

  card: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 14, fontWeight: "800", color: theme.colors.text, marginBottom: 10 },

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
