import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PostsListScreen } from "../screens/posts/PostListScreen";
import { PostDetailScreen } from "../screens/posts/PostDetailScreen";

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
