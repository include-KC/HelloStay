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