import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/RootNavigator";
import { useAuth } from "../../auth/AuthContext";
import { theme } from "../../ui/theme";

export function AdminHomeScreen() {
  const { role } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  if (role !== "admin") {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Acesso negado</Text>
        <Text style={styles.muted}>Somente professores (admin) podem acessar a área administrativa.</Text>
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
  container: { flex: 1, padding: 16, paddingTop: 24, backgroundColor: theme.colors.bg },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16, backgroundColor: theme.colors.bg },

  title: { fontSize: 26, fontWeight: "900", marginBottom: 6, color: theme.colors.text },
  subtitle: { color: theme.colors.muted, marginBottom: 18 },

  card: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "900", marginBottom: 6, color: theme.colors.text },
  cardDesc: { color: theme.colors.muted },

  muted: { color: theme.colors.muted },
});
