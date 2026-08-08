import { apiRequest } from "./apiClient";

export async function getStays() {
  return apiRequest("/stay");
}

export async function createStay(stayData) {
  return apiRequest("/stay", {
    method: "POST",
    body: stayData,
  });
}