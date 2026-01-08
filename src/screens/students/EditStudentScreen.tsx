import React, { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View, ActivityIndicator } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/RootNavigator";
import { updateStudent, fetchStudents } from "../../api/students";
import { useAuth } from "../../auth/AuthContext";

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
      <View style={styles.center}>
        <Text>Acesso negado</Text>
      </View>
    );
  }

  if (!studentId) {
    return (
      <View style={styles.center}>
        <Text>Aluno inválido</Text>
      </View>
    );
  }

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchStudents({ limit: 50, page: 1 });
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
        password: password || undefined,
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
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Aluno</Text>

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
