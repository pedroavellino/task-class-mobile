import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PostsListScreen } from "../screens/posts/PostListScreen";
import { PostDetailScreen } from "../screens/posts/PostDetailScreen";
import { CreatePostScreen } from "../screens/posts/CreatePostScreen";

export type RootStackParamList = {
  PostsList: undefined;
  PostDetail: { postId: string };
  CreatePost: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="PostsList"
          component={PostsListScreen}
          options={{ title: "Posts" }}
        />
        <Stack.Screen
          name="PostDetail"
          component={PostDetailScreen}
          options={{ title: "Post" }}
        />
        <Stack.Screen
          name="CreatePost"
          component={CreatePostScreen}
          options={{ title: "Novo Post" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
