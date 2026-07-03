import { useEffect, useState } from "react";

import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import Loading from "../components/ui/Loading.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import { createRoom, getRooms } from "../services/roomService.js";

const initialRoomFormData = {
  room_number: "",
  price_per_night: "",
  room_status: "Available",
  room_type: "",
  max_occupancy: "",
  facilities: "",
};

function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState(initialRoomFormData);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");

async function refreshRooms() {
  const roomData = await getRooms();
  setRooms(roomData);
}

useEffect(() => {
  let isComponentActive = true;

  getRooms()
    .then((roomData) => {
      if (isComponentActive) {
        setRooms(roomData);
        setError("");
      }
    })
    .catch((err) => {
      if (isComponentActive) {
        setError(err.message || "Unable to load rooms.");
      }
    })
    .finally(() => {
      if (isComponentActive) {
        setIsLoading(false);
      }
    });

  return () => {
    isComponentActive = false;
  };
}, []);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  function validateRoomForm() {
    if (!formData.room_number.trim()) {
      return "Room number is required.";
    }

    if (!formData.price_per_night.trim()) {
      return "Price per night is required.";
    }

    const price = Number(formData.price_per_night);

    if (Number.isNaN(price) || price <= 0) {
      return "Price per night must be a valid positive number.";
    }

    if (!formData.room_status.trim()) {
      return "Room status is required.";
    }

    if (formData.max_occupancy.trim()) {
      const maxOccupancy = Number(formData.max_occupancy);

      if (!Number.isInteger(maxOccupancy) || maxOccupancy <= 0) {
        return "Max occupancy must be a valid positive whole number.";
      }
    }

    return "";
  }

  async function handleCreateRoom(event) {
    event.preventDefault();

    const validationError = validateRoomForm();

    if (validationError) {
      setCreateError(validationError);
      return;
    }

    const roomPayload = {
      room_number: formData.room_number.trim(),
      price_per_night: Number(formData.price_per_night),
      room_status: formData.room_status,
      room_type: formData.room_type.trim() || null,
      max_occupancy: formData.max_occupancy
        ? Number(formData.max_occupancy)
        : null,
      facilities: formData.facilities.trim() || null,
    };

    try {
      setIsCreating(true);
      setCreateError("");

      await createRoom(roomPayload);

      setFormData(initialRoomFormData);
      await refreshRooms();
    } catch (err) {
      setCreateError(err.message || "Unable to create room.");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <main className="rooms-page">
      <div className="rooms-header">
        <div>
          <h1 className="page-title">Rooms</h1>
          <p className="page-description">
            View all rooms currently registered in HelloStay.
          </p>
        </div>
      </div>

      <Card>
        <h2 className="section-title">Add New Room</h2>

        <form className="room-create-form" onSubmit={handleCreateRoom}>
          {createError && <ErrorMessage message={createError} />}

          <Input
            id="room_number"
            name="room_number"
            label="Room Number"
            type="text"
            value={formData.room_number}
            onChange={handleInputChange}
            placeholder="Example: 101"
            disabled={isCreating}
          />

          <Input
            id="room_type"
            name="room_type"
            label="Room Type"
            type="text"
            value={formData.room_type}
            onChange={handleInputChange}
            placeholder="Example: Deluxe"
            disabled={isCreating}
          />

          <Input
            id="price_per_night"
            name="price_per_night"
            label="Price Per Night"
            type="number"
            value={formData.price_per_night}
            onChange={handleInputChange}
            placeholder="Example: 2500"
            disabled={isCreating}
          />

          <Input
            id="max_occupancy"
            name="max_occupancy"
            label="Max Occupancy"
            type="number"
            value={formData.max_occupancy}
            onChange={handleInputChange}
            placeholder="Example: 2"
            disabled={isCreating}
          />

          <div className="form-field">
            <label className="form-label" htmlFor="room_status">
              Room Status
            </label>

            <select
              id="room_status"
              name="room_status"
              className="form-input"
              value={formData.room_status}
              onChange={handleInputChange}
              disabled={isCreating}
            >
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Reserved">Reserved</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          <Input
            id="facilities"
            name="facilities"
            label="Facilities"
            type="text"
            value={formData.facilities}
            onChange={handleInputChange}
            placeholder="Example: AC, Wi-Fi, TV"
            disabled={isCreating}
          />

          <Button type="submit" disabled={isCreating}>
            {isCreating ? "Creating Room..." : "Create Room"}
          </Button>
        </form>
      </Card>

      {isLoading && <Loading message="Loading rooms..." />}

      {!isLoading && error && <ErrorMessage message={error} />}

      {!isLoading && !error && rooms.length === 0 && (
        <Card>
          <h2>No rooms found</h2>
          <p className="page-description">
            No rooms are available in the system yet. Create your first room
            using the form above.
          </p>
        </Card>
      )}

      {!isLoading && !error && rooms.length > 0 && (
        <div className="rooms-grid">
          {rooms.map((room) => (
            <Card key={room.id}>
              <div className="room-card-header">
                <div>
                  <h2 className="room-title">Room {room.room_number}</h2>
                  <p className="room-subtitle">
                    {room.room_type || "Room type not set"}
                  </p>
                </div>

                <span className="room-status">{room.room_status}</span>
              </div>

              <dl className="room-details">
                <div>
                  <dt>Price per night</dt>
                  <dd>{room.price_per_night}</dd>
                </div>

                <div>
                  <dt>Max occupancy</dt>
                  <dd>{room.max_occupancy ?? "Not set"}</dd>
                </div>

                <div>
                  <dt>Facilities</dt>
                  <dd>{room.facilities || "No facilities listed"}</dd>
                </div>
              </dl>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}

export default RoomsPage;