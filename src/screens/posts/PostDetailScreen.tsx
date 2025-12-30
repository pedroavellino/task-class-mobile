import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import type { RootStackParamList } from "../../navigation/RootStack";
import type { Post } from "../../types/post";
import { fetchPostById } from "../../api/posts";

type RouteProps = RouteProp<RootStackParamList, "PostDetail">;

export function PostDetailScreen() {
  const route = useRoute<RouteProps>();
  const postId = route.params?.postId;
  if (!postId) 
    return (
      <View>
        <Text>Post inválido</Text>
      </View>
    ) 

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

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
        {post.autor} • {post.disciplina} • {post.turma}
      </Text>
      <Text style={styles.content}>{post.conteudo}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  meta: { color: "#666", marginBottom: 16 },
  content: { fontSize: 16, lineHeight: 22 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
