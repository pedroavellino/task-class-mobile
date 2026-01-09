import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/RootNavigator";
import { updateStudent, fetchStudents } from "../../api/students";
import { useAuth } from "../../auth/AuthContext";
import { theme } from "../../ui/theme";

type RouteProps = RouteProp<AppStackParamList, "EditStudent">;

export function EditStudentScreen() {
  const { role } = useAuth();
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const studentId = route.params?.studentId;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  if (role !== "admin") {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.title}>Acesso negado</Text>
        <Text style={styles.muted}>Somente professores (admin) podem editar alunos.</Text>
      </View>
    );
  }

  if (!studentId) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.title}>Aluno inválido</Text>
        <Text style={styles.muted}>Não foi possível identificar o aluno.</Text>
      </View>
    );
  }

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchStudents({ limit: 100, page: 1 });
        const student = data.items.find((s) => s.id === studentId);
        if (!student) throw new Error();
        setEmail(student.email);
      } catch {
        Alert.alert("Erro", "Não foi possível carregar o aluno.");
      } finally {
        setLoading(false);
      }
    })();
  }, [studentId]);

  async function onSubmit() {
    const e = email.trim().toLowerCase();

    if (!e) {
      Alert.alert("Validação", "Preencha o e-mail.");
      return;
    }

    if (password && password.length < 6) {
      Alert.alert("Validação", "A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setSaving(true);
    try {
      await updateStudent(studentId, {
        email: e,
        password: password ? password : undefined,
      });

      Alert.alert("Sucesso", "Aluno atualizado!");
      navigation.goBack();
    } catch {
      Alert.alert("Erro", "Erro ao atualizar aluno.");
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
      <Text style={styles.title}>Editar Aluno</Text>
      <Text style={styles.subtitle}>Atualize o e-mail e/ou defina uma nova senha</Text>

      <View style={styles.card}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="email@exemplo.com"
          placeholderTextColor={theme.colors.muted}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <Text style={[styles.label, { marginTop: 10 }]}>Nova senha (opcional)</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="mínimo 6 caracteres"
          placeholderTextColor={theme.colors.muted}
          secureTextEntry
          style={styles.input}
        />

        <View style={{ marginTop: 12 }}>
          <Button title={saving ? "Salvando..." : "Salvar alterações"} onPress={onSubmit} disabled={saving} />
        </View>

        <Text style={styles.help}>
          Dica: se não quiser trocar a senha, deixe o campo em branco.
        </Text>
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
  muted: { color: theme.colors.muted, marginTop: 8, textAlign: "center" },

  card: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
  },

  label: { color: theme.colors.muted, fontSize: 12, marginBottom: 6, fontWeight: "700" },

  input: {
    backgroundColor: theme.colors.card2,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: theme.colors.text,
  },

  help: { marginTop: 12, color: theme.colors.muted, fontSize: 12, lineHeight: 16 },
});
