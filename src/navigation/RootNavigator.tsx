import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CreatePostScreen } from "../screens/posts/CreatePostScreen";
import { EditPostScreen } from "../screens/posts/EditPostScreen";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { PostsListScreen } from "../screens/posts/PostListScreen";
import { PostDetailScreen } from "../screens/posts/PostDetailScreen";
import { useAuth } from "../auth/AuthContext";
import { AdminHomeScreen } from "../screens/admin/AdminHomeScreen";
import { PostsAdminScreen } from "../screens/posts/PostAdminScreen";
import { TeachersListScreen } from "../screens/teachers/TeachersListScreen";
import { CreateTeacherScreen } from "../screens/teachers/CreateTeacherScreen";
import { EditTeacherScreen } from "../screens/teachers/EditTeacherScreen";
import { StudentsListScreen } from "../screens/students/StudentsListScreen";
import { CreateStudentScreen } from "../screens/students/CreateStudentScreen";
import { EditStudentScreen } from "../screens/students/EditStudentScreen";


export type AppStackParamList = {
  PostsList: undefined;
  PostDetail: { postId: string };
  CreatePost: undefined;
  EditPost: { postId: string };
  PostsAdmin: undefined;
  TeachersList: undefined;
  CreateTeacher: undefined;
  EditTeacher: { teacherId: string };
  StudentsList: undefined;
  CreateStudent: undefined;
  EditStudent: { studentId: string };
  AdminHome: undefined;
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
          <AppStack.Screen name="AdminHome" component={AdminHomeScreen} options={{ title: "Admin" }} />
          <AppStack.Screen name="PostsAdmin" component={PostsAdminScreen} options={{ title: "Admin de Posts" }}/>
          <AppStack.Screen name="TeachersList" component={TeachersListScreen} options={{ title: "Professores" }} />
          <AppStack.Screen name="CreateTeacher" component={CreateTeacherScreen} options={{ title: "Novo Professor" }} />
          <AppStack.Screen name="EditTeacher" component={EditTeacherScreen} options={{ title: "Editar Professor" }} />
          <AppStack.Screen name="StudentsList" component={StudentsListScreen} options={{ title: "Alunos" }} />
          <AppStack.Screen name="CreateStudent" component={CreateStudentScreen} options={{ title: "Novo Aluno" }} />
          <AppStack.Screen name="EditStudent" component={EditStudentScreen} options={{ title: "Editar Aluno" }} />
        </AppStack.Navigator>
      ) : (
        <AuthStack.Navigator>
          <AuthStack.Screen name="Login" component={LoginScreen} options={{ title: "Login" }} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}
