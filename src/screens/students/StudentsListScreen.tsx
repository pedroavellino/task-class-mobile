import React, { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/RootNavigator";
import { deleteStudent, fetchStudents, type Student } from "../../api/students";
import { useAuth } from "../../auth/AuthContext";

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
      <View style={styles.center}>
        <Text style={styles.title}>Acesso negado</Text>
        <Text>Somente professores (admin) podem administrar alunos.</Text>
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
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.muted}>Carregando…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alunos</Text>

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
  title: { fontSize: 22, fontWeight: "800", marginBottom: 12 },
  muted: { color: "#666", marginTop: 8 },

  card: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 14, fontWeight: "700", marginBottom: 10 },

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
