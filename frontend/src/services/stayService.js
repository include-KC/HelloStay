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

export async function updateStay(stayId, stayData) {
  return apiRequest(`/stay/${stayId}`, {
    method: "PUT",
    body: stayData,
  });
}

export async function deleteStay(stayId) {
  return apiRequest(`/stay/${stayId}`, {
    method: "DELETE",
  });
}