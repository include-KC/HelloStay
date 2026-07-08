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

export async function updateRoom(roomId, roomData) {
  return apiRequest(`/rooms/${roomId}`, {
    method: "PUT",
    body: roomData,
  });
}

export async function deleteRoom(roomId) {
  return apiRequest(`/rooms/${roomId}`, {
    method: "DELETE",
  });
}