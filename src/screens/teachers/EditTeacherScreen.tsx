import React, { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View, ActivityIndicator } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/RootNavigator";
import { updateTeacher, fetchTeachers } from "../../api/teachers";
import { useAuth } from "../../auth/AuthContext";

type RouteProps = RouteProp<AppStackParamList, "EditTeacher">;

export function EditTeacherScreen() {
  const { role } = useAuth();
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const teacherId = route.params?.teacherId;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  if (role !== "admin") {
    return (
      <View style={styles.center}>
        <Text>Acesso negado</Text>
      </View>
    );
  }

  if (!teacherId) {
    return (
      <View style={styles.center}>
        <Text>Professor inválido</Text>
      </View>
    );
  }

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchTeachers({ limit: 50, page: 1 });
        const teacher = data.items.find((t) => t.id === teacherId);
        if (!teacher) throw new Error();
        setEmail(teacher.email);
      } catch {
        Alert.alert("Erro", "Não foi possível carregar o professor.");
      } finally {
        setLoading(false);
      }
    })();
  }, [teacherId]);

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
      await updateTeacher(teacherId, {
        email: e,
        password: password || undefined,
      });

      Alert.alert("Sucesso", "Professor atualizado!");
      navigation.goBack();
    } catch {
      Alert.alert("Erro", "Erro ao atualizar professor.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Professor</Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="E-mail"
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Nova senha (opcional)"
        secureTextEntry
      />

      <Button title={saving ? "Salvando..." : "Salvar alterações"} onPress={onSubmit} disabled={saving} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 24 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
});
