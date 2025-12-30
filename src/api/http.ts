import axios from "axios";
import { getApiUrl } from "./env";

export const http = axios.create({
  baseURL: getApiUrl(),
  timeout: 15000,
});
