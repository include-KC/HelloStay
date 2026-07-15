import { apiRequest } from "./apiClient";

export async function getGuests() {
  return apiRequest("/guests");
}

export async function createGuest(guestData) {
  return apiRequest("/guests", {
    method: "POST",
    body: guestData,
  });
}

export function updateGuest(guestId, guestData) {
  return apiRequest(`/guests/${guestId}`, {
    method: "PUT",
    body: guestData,
  });
}

export function deleteGuest(guestId) {
  return apiRequest(`/guests/${guestId}`, {
    method: "DELETE",
  });
}