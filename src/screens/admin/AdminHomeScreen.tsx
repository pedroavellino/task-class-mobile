import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/RootNavigator";
import { useAuth } from "../../auth/AuthContext";

export function AdminHomeScreen() {
  const { role } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  if (role !== "admin") {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Acesso negado</Text>
        <Text>Somente professores (admin) podem acessar a área administrativa.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin</Text>
      <Text style={styles.subtitle}>Gerencie conteúdos e usuários</Text>

      <Pressable style={styles.card} onPress={() => navigation.navigate("PostsAdmin")}>
        <Text style={styles.cardTitle}>Postagens</Text>
        <Text style={styles.cardDesc}>Criar, editar e excluir posts</Text>
      </Pressable>

      <Pressable style={styles.card} onPress={() => navigation.navigate("TeachersList")}>
        <Text style={styles.cardTitle}>Professores</Text>
        <Text style={styles.cardDesc}>Listar, cadastrar, editar e excluir</Text>
      </Pressable>

      <Pressable style={styles.card} onPress={() => navigation.navigate("StudentsList")}>
        <Text style={styles.cardTitle}>Alunos</Text>
        <Text style={styles.cardDesc}>Listar, cadastrar, editar e excluir</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 24 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  title: { fontSize: 26, fontWeight: "800", marginBottom: 6 },
  subtitle: { color: "#666", marginBottom: 18 },

  card: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "800", marginBottom: 6 },
  cardDesc: { color: "#666" },

  disabledCard: { opacity: 0.5 },
});
