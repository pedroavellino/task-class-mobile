import Constants from "expo-constants";

type Extra = {
  API_URL: string;
};

export function getApiUrl() {
  const extra = Constants.expoConfig?.extra as Extra | undefined;
  return extra?.API_URL ?? "http://10.0.2.2:3000";
}
