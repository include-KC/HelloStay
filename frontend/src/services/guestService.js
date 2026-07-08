import { apiRequest } from "./apiClient.js";

export async function getGuests() {
  return apiRequest("/guests");
}