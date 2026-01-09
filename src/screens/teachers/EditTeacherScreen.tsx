import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/RootNavigator";
import { fetchTeachers, updateTeacher } from "../../api/teachers";
import { useAuth } from "../../auth/AuthContext";
import { theme } from "../../ui/theme";

type RouteProps = RouteProp<AppStackParamList, "EditTeacher">;

export function EditTeacherScreen() {
  const { role } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route = useRoute<RouteProps>();

  const teacherId = route.params?.teacherId;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  if (role !== "admin") {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.title}>Acesso negado</Text>
        <Text style={styles.muted}>Somente professores (admin) podem editar professores.</Text>
      </View>
    );
  }

  if (!teacherId) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.title}>Professor inválido</Text>
        <Text style={styles.muted}>Não foi possível identificar o professor.</Text>
      </View>
    );
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const data = await fetchTeachers({ limit: 50, page: 1 }); 
        const teacher = data.items.find((t) => t.id === teacherId);

        if (!teacher) {
          Alert.alert("Erro", "Professor não encontrado.");
          navigation.goBack();
          return;
        }

        setEmail(teacher.email);
      } catch {
        Alert.alert("Erro", "Não foi possível carregar o professor.");
      } finally {
        setLoading(false);
      }
    })();
  }, [teacherId, navigation]);

  async function onSubmit() {
    const e = email.trim().toLowerCase();
    const p = password;

    if (!e) {
      Alert.alert("Validação", "Preencha o e-mail.");
      return;
    }

    if (p && p.length < 6) {
      Alert.alert("Validação", "A nova senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setSaving(true);
    try {
      await updateTeacher(teacherId, {
        email: e,
        password: p ? p : undefined,
      });

      Alert.alert("Sucesso", "Professor atualizado!");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Erro", err instanceof Error ? err.message : "Erro ao atualizar professor.");
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
      <Text style={styles.title}>Editar Professor</Text>
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

        <Text style={styles.help}>Se não quiser alterar a senha, deixe em branco.</Text>

        <View style={{ marginTop: 12 }}>
          <Button title={saving ? "Salvando..." : "Salvar alterações"} onPress={onSubmit} disabled={saving} />
        </View>
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

  label: { color: theme.colors.muted, fontSize: 12, marginBottom: 6 },
  input: {
    backgroundColor: theme.colors.card2,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: theme.colors.text,
  },
  help: { marginTop: 10, color: theme.colors.muted, fontSize: 12 },
});
