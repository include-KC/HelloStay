import { useEffect, useState } from "react";

import RoomForm from "../components/rooms/RoomForm.jsx";
import RoomTable from "../components/rooms/RoomTable.jsx";
import * as roomService from "../services/roomService.js";

const emptyRoomForm = {
  room_number: "",
  room_type: "",
  price_per_night: "",
  max_occupancy: "",
  room_status: "",
  facilities: "",
};

function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState(emptyRoomForm);
  const [formErrors, setFormErrors] = useState({});

  const [editingRoomId, setEditingRoomId] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingRoomId, setDeletingRoomId] = useState(null);

  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isEditMode = editingRoomId !== null;

  useEffect(() => {
    let shouldIgnoreResult = false;

    async function fetchRoomsOnPageLoad() {
      try {
        const roomData = await roomService.getRooms();

        if (!shouldIgnoreResult) {
          setRooms(roomData);
          setPageError("");
        }
      } catch (error) {
        if (!shouldIgnoreResult) {
          setPageError(error.message || "Unable to load rooms.");
        }
      } finally {
        if (!shouldIgnoreResult) {
          setIsLoading(false);
        }
      }
    }

    fetchRoomsOnPageLoad();

    return () => {
      shouldIgnoreResult = true;
    };
  }, []);

  async function refreshRooms() {
    const roomData = await roomService.getRooms();
    setRooms(roomData);
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));

    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));

    setFormError("");
    setSuccessMessage("");
  }

  function validateRoomForm() {
    const errors = {};

    if (!formData.room_number.trim()) {
      errors.room_number = "Room number is required.";
    }

    if (!formData.price_per_night) {
      errors.price_per_night = "Price per night is required.";
    } else if (Number(formData.price_per_night) <= 0) {
      errors.price_per_night = "Price must be greater than 0.";
    }

    if (!formData.max_occupancy) {
      errors.max_occupancy = "Max occupancy is required.";
    } else if (Number(formData.max_occupancy) <= 0) {
      errors.max_occupancy = "Max occupancy must be greater than 0.";
    }

    if (!formData.room_status) {
      errors.room_status = "Room status is required.";
    }

    return errors;
  }

  function buildRoomPayload() {
    return {
      room_number: formData.room_number.trim(),
      room_type: formData.room_type.trim() || null,
      price_per_night: Number(formData.price_per_night),
      max_occupancy: Number(formData.max_occupancy),
      room_status: formData.room_status,
      facilities: formData.facilities.trim() || null,
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const errors = validateRoomForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setFormError("");
    setSuccessMessage("");

    try {
      const payload = buildRoomPayload();

      if (isEditMode) {
        await roomService.updateRoom(editingRoomId, payload);
        setSuccessMessage("Room updated successfully.");
      } else {
        await roomService.createRoom(payload);
        setSuccessMessage("Room created successfully.");
      }

      await refreshRooms();
      resetForm();
    } catch (error) {
      setFormError(error.message || "Unable to save room.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEditRoom(room) {
    setEditingRoomId(room.id);

    setFormData({
      room_number: room.room_number || "",
      room_type: room.room_type || "",
      price_per_night: room.price_per_night || "",
      max_occupancy: room.max_occupancy || "",
      room_status: room.room_status || "",
      facilities: room.facilities || "",
    });

    setFormErrors({});
    setFormError("");
    setSuccessMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function resetForm() {
    setFormData(emptyRoomForm);
    setEditingRoomId(null);
    setFormErrors({});
    setFormError("");
  }

  async function handleDeleteRoom(room) {
    const confirmed = window.confirm(
      `Delete room ${room.room_number}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingRoomId(room.id);
    setPageError("");
    setSuccessMessage("");

    try {
      await roomService.deleteRoom(room.id);
      await refreshRooms();

      if (editingRoomId === room.id) {
        resetForm();
      }

      setSuccessMessage(`Room ${room.room_number} deleted successfully.`);
    } catch (error) {
      setPageError(error.message || "Unable to delete room.");
    } finally {
      setDeletingRoomId(null);
    }
  }

  return (
    <div className="rooms-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Rooms</p>
          <h1>Room Management</h1>
          <p>
            Manage room details, prices, occupancy, facilities, and operational
            status.
          </p>
        </div>
      </div>

      <div className="rooms-layout">
        <section className="card">
          {formError && <div className="alert alert-error">{formError}</div>}

          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}

          <RoomForm
            formData={formData}
            formErrors={formErrors}
            mode={isEditMode ? "edit" : "create"}
            isSubmitting={isSubmitting}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />
        </section>

        <section className="card">
          <div className="section-heading">
            <div>
              <h2>Room list</h2>
              <p>
                {rooms.length > 0
                  ? `${rooms.length} room${rooms.length === 1 ? "" : "s"} found.`
                  : "No rooms available yet."}
              </p>
            </div>
          </div>

          {isLoading && <p className="muted-text">Loading rooms...</p>}

          {!isLoading && pageError && (
            <div className="alert alert-error">{pageError}</div>
          )}

          {!isLoading && !pageError && rooms.length === 0 && (
            <div className="empty-state">
              <h3>No rooms added yet</h3>
              <p>
                Use the form above to create the first room for this hotel.
              </p>
            </div>
          )}

          {!isLoading && !pageError && rooms.length > 0 && (
            <RoomTable
              rooms={rooms}
              onEdit={handleEditRoom}
              onDelete={handleDeleteRoom}
              deletingRoomId={deletingRoomId}
            />
          )}
        </section>
      </div>
    </div>
  );
}

export default RoomsPage;