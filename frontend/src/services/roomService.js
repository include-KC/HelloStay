import { apiRequest } from "./apiClient";

export function getRooms() {
  return apiRequest("/rooms");
}

export function createRoom(roomData) {
  return apiRequest("/rooms", {
    method: "POST",
    body: roomData,
  });
}