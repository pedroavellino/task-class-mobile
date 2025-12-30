import Constants from "expo-constants";

type Extra = {
  API_URL: string;
};

export function getApiUrl() {
  const extra = Constants.expoConfig?.extra as Extra | undefined;
  return extra?.API_URL ?? "http://localhost:3000";
}
