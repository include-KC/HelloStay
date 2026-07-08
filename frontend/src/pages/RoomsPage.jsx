import { useEffect, useState } from "react";

import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import Input from "../components/ui/Input.jsx";
import Loading from "../components/ui/Loading.jsx";
import {
  createRoom,
  deleteRoom,
  getRooms,
  updateRoom,
} from "../services/roomService.js";

const INITIAL_ROOM_FORM = {
  room_number: "",
  room_type: "",
  price_per_night: "",
  max_occupancy: "",
  facilities: "",
  room_status: "Available",
};

const ROOM_STATUS_OPTIONS = [
  "Available",
  "Occupied",
  "Reserved",
  "Maintenance",
];

function normalizeRoomToForm(room) {
  return {
    room_number: room.room_number ?? "",
    room_type: room.room_type ?? "",
    price_per_night: String(room.price_per_night ?? ""),
    max_occupancy: String(room.max_occupancy ?? ""),
    facilities: room.facilities ?? "",
    room_status: room.room_status ?? "Available",
  };
}

function buildRoomPayload(formData) {
  return {
    room_number: formData.room_number.trim(),
    room_type: formData.room_type.trim() || null,
    price_per_night: Number(formData.price_per_night),
    max_occupancy: Number(formData.max_occupancy),
    facilities: formData.facilities.trim() || null,
    room_status: formData.room_status,
  };
}

function validateRoomForm(formData) {
  const price = Number(formData.price_per_night);
  const maxOccupancy = Number(formData.max_occupancy);

  if (!formData.room_number.trim()) {
    return "Room number is required.";
  }

  if (!Number.isFinite(price) || price <= 0) {
    return "Price per night must be greater than 0.";
  }

  if (!Number.isInteger(maxOccupancy) || maxOccupancy <= 0) {
    return "Maximum occupancy must be a positive whole number.";
  }

  if (!formData.room_status) {
    return "Room status is required.";
  }

  return "";
}

function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [roomsError, setRoomsError] = useState("");

  const [formData, setFormData] = useState(INITIAL_ROOM_FORM);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [isSavingRoom, setIsSavingRoom] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deletingRoomId, setDeletingRoomId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const isEditMode = editingRoomId !== null;

  useEffect(() => {
    let isActive = true;

    async function fetchInitialRooms() {
      try {
        const roomsData = await getRooms();

        if (isActive) {
          setRooms(roomsData);
          setRoomsError("");
        }
      } catch (error) {
        if (isActive) {
          setRoomsError(error.message || "Unable to load rooms.");
        }
      } finally {
        if (isActive) {
          setIsLoadingRooms(false);
        }
      }
    }

    fetchInitialRooms();

    return () => {
      isActive = false;
    };
  }, []);

  async function refreshRooms() {
    const roomsData = await getRooms();
    setRooms(roomsData);
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  function handleEditRoom(room) {
    setEditingRoomId(room.id);
    setFormData(normalizeRoomToForm(room));
    setSaveError("");
    setDeleteError("");
  }

  function handleCancelEdit() {
    setEditingRoomId(null);
    setFormData(INITIAL_ROOM_FORM);
    setSaveError("");
  }

  async function handleSubmitRoom(event) {
    event.preventDefault();

    const validationError = validateRoomForm(formData);

    if (validationError) {
      setSaveError(validationError);
      return;
    }

    setIsSavingRoom(true);
    setSaveError("");

    try {
      const roomPayload = buildRoomPayload(formData);

      if (isEditMode) {
        await updateRoom(editingRoomId, roomPayload);
      } else {
        await createRoom(roomPayload);
      }

      await refreshRooms();
      handleCancelEdit();
    } catch (error) {
      setSaveError(error.message || "Unable to save room.");
    } finally {
      setIsSavingRoom(false);
    }
  }

  function handleAskDelete(roomId) {
    setDeleteConfirmId(roomId);
    setDeleteError("");
  }

  function handleCancelDelete() {
    setDeleteConfirmId(null);
    setDeleteError("");
  }

  async function handleConfirmDelete(roomId) {
    setDeletingRoomId(roomId);
    setDeleteError("");

    try {
      await deleteRoom(roomId);
      await refreshRooms();

      if (editingRoomId === roomId) {
        handleCancelEdit();
      }

      setDeleteConfirmId(null);
    } catch (error) {
      setDeleteError(error.message || "Unable to delete room.");
    } finally {
      setDeletingRoomId(null);
    }
  }

  return (
    <main className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Rooms</p>
          <h1 className="page-title">Manage Rooms</h1>
          <p className="page-description">
            Create, edit, and delete hotel room records from one place.
          </p>
        </div>
      </header>

      <Card>
        <div className="section-header">
          <div>
            <h2>{isEditMode ? "Edit Room" : "Add New Room"}</h2>
            <p>
              {isEditMode
                ? "Update the selected room details."
                : "Add a new room to the hotel inventory."}
            </p>
          </div>

          {isEditMode && (
            <Button type="button" onClick={handleCancelEdit}>
              Cancel Edit
            </Button>
          )}
        </div>

        {saveError && <ErrorMessage message={saveError} />}

        <form className="room-form" onSubmit={handleSubmitRoom}>
          <Input
            id="room_number"
            name="room_number"
            label="Room Number"
            value={formData.room_number}
            onChange={handleInputChange}
            placeholder="Example: 101"
          />

          <Input
            id="room_type"
            name="room_type"
            label="Room Type"
            value={formData.room_type}
            onChange={handleInputChange}
            placeholder="Example: Deluxe"
          />

          <Input
            id="price_per_night"
            name="price_per_night"
            label="Price Per Night"
            type="number"
            value={formData.price_per_night}
            onChange={handleInputChange}
            placeholder="Example: 2500"
          />

          <Input
            id="max_occupancy"
            name="max_occupancy"
            label="Maximum Occupancy"
            type="number"
            value={formData.max_occupancy}
            onChange={handleInputChange}
            placeholder="Example: 2"
          />

          <Input
            id="facilities"
            name="facilities"
            label="Facilities"
            value={formData.facilities}
            onChange={handleInputChange}
            placeholder="Example: Wi-Fi, AC, TV"
          />

          <div className="form-field">
            <label htmlFor="room_status">Room Status</label>
            <select
              id="room_status"
              name="room_status"
              value={formData.room_status}
              onChange={handleInputChange}
            >
              {ROOM_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <Button type="submit" disabled={isSavingRoom}>
              {isSavingRoom
                ? "Saving..."
                : isEditMode
                  ? "Update Room"
                  : "Create Room"}
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <div className="section-header">
          <div>
            <h2>Rooms List</h2>
            <p>View, edit, or delete existing rooms.</p>
          </div>
        </div>

        {deleteError && <ErrorMessage message={deleteError} />}

        {isLoadingRooms && <Loading message="Loading rooms..." />}

        {!isLoadingRooms && roomsError && <ErrorMessage message={roomsError} />}

        {!isLoadingRooms && !roomsError && rooms.length === 0 && (
          <div className="empty-state">
            <h3>No rooms found</h3>
            <p>Create your first room using the form above.</p>
          </div>
        )}

        {!isLoadingRooms && !roomsError && rooms.length > 0 && (
          <div className="rooms-table-wrapper">
            <table className="rooms-table">
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Occupancy</th>
                  <th>Status</th>
                  <th>Facilities</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td>{room.room_number}</td>
                    <td>{room.room_type || "—"}</td>
                    <td>₹{room.price_per_night}</td>
                    <td>{room.max_occupancy || "—"}</td>
                    <td>
                      <span className="status-pill">{room.room_status}</span>
                    </td>
                    <td>{room.facilities || "—"}</td>
                    <td>
                      {deleteConfirmId === room.id ? (
                        <div className="inline-confirm">
                          <span>Delete?</span>

                          <Button
                            type="button"
                            disabled={deletingRoomId === room.id}
                            onClick={() => handleConfirmDelete(room.id)}
                          >
                            {deletingRoomId === room.id ? "Deleting..." : "Yes"}
                          </Button>

                          <Button
                            type="button"
                            disabled={deletingRoomId === room.id}
                            onClick={handleCancelDelete}
                          >
                            No
                          </Button>
                        </div>
                      ) : (
                        <div className="row-actions">
                          <Button
                            type="button"
                            onClick={() => handleEditRoom(room)}
                          >
                            Edit
                          </Button>

                          <Button
                            type="button"
                            onClick={() => handleAskDelete(room.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </main>
  );
}

export default RoomsPage;