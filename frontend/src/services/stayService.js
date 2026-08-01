import { apiRequest } from "./apiClient";

export async function getStays() {
  return apiRequest("/stay");
}