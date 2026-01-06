import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CreatePostScreen } from "../screens/posts/CreatePostScreen";
import { EditPostScreen } from "../screens/posts/EditPostScreen";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { PostsListScreen } from "../screens/posts/PostListScreen";
import { PostDetailScreen } from "../screens/posts/PostDetailScreen";
import { useAuth } from "../auth/AuthContext";
import { PostsAdminScreen } from "../screens/posts/PostAdminScreen";

export type AppStackParamList = {
  PostsList: undefined;
  PostDetail: { postId: string };
  CreatePost: undefined;
  EditPost: { postId: string };
  PostsAdmin: undefined;
};

type AuthStackParamList = {
  Login: undefined;
};

const AppStack = createNativeStackNavigator<AppStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export function RootNavigator() {
  const { isSignedIn } = useAuth();

  return (
    <NavigationContainer>
      {isSignedIn ? (
        <AppStack.Navigator>
          <AppStack.Screen name="PostsList" component={PostsListScreen} options={{ title: "Posts" }} />
          <AppStack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: "Post" }} />
          <AppStack.Screen name="CreatePost" component={CreatePostScreen} options={{ title: "Novo Post" }} />
           <AppStack.Screen name="EditPost" component={EditPostScreen} options={{ title: "Editar Post" }} />
           <AppStack.Screen name="PostsAdmin" component={PostsAdminScreen} options={{ title: "Admin de Posts" }}/>
        </AppStack.Navigator>
      ) : (
        <AuthStack.Navigator>
          <AuthStack.Screen name="Login" component={LoginScreen} options={{ title: "Login" }} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}
