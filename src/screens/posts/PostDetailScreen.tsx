import { useEffect, useState, useLayoutEffect } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View, Button } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/RootNavigator";
import type { Post } from "../../types/post";
import { deletePost, fetchPostById } from "../../api/posts";
import { useAuth } from "../../auth/AuthContext";

type RouteProps = RouteProp<AppStackParamList, "PostDetail">;

export function PostDetailScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { role } = useAuth();

  const postId = route.params?.postId;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  if (!postId) {
    return (
      <View style={styles.center}>
        <Text>Post inválido</Text>
      </View>
    );
  }

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPostById(postId);
        setPost(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [postId]);

  useLayoutEffect(() => {
    if (role !== "admin" || !post) return;

    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Editar"
          onPress={() => navigation.navigate("EditPost", { postId })}
        />
      ),
    });
  }, [navigation, role, post, postId]);

  async function onDelete() {
    Alert.alert(
      "Excluir post",
      "Tem certeza que deseja excluir este post?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePost(postId);
              navigation.goBack();
            } catch {
              Alert.alert("Erro", "Não foi possível excluir o post.");
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.center}>
        <Text>Post não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{post.titulo}</Text>

      <Text style={styles.meta}>
        {post.autor}
        {post.disciplina ? ` • ${post.disciplina}` : ""}
        {post.turma ? ` • ${post.turma}` : ""}
      </Text>

      <Text style={styles.content}>{post.conteudo}</Text>

      {role === "admin" && (
        <View style={styles.adminActions}>
          <Button title="Excluir post" color="#c00" onPress={onDelete} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  meta: { color: "#666", marginBottom: 16 },
  content: { fontSize: 16, lineHeight: 22 },
  adminActions: { marginTop: 24 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
