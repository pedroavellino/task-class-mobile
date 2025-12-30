import { StatusBar } from "expo-status-bar";
import { PostsListScreen } from "./src/screens/posts/PostsListScreen";

export default function App() {
  return (
    <>
      <PostsListScreen />
      <StatusBar style="auto" />
    </>
  );
}
