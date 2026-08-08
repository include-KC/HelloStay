import { useEffect, useState } from "react";

import Card from "../components/ui/Card.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import Loading from "../components/ui/Loading.jsx";

import { createStay, getStays } from "../services/stayService.js";
import { getRooms } from "../services/roomService.js";

const STAY_STATUS_CLASS_NAMES = {
  "Checked In": "stay-status-checked-in",
  "Checked Out": "stay-status-checked-out",
};

const emptyStayForm = {
  room_id: "",
  price_per_night: "",
  check_in_datetime: "",
  stay_status: "",
};

function formatDateTime(dateTimeValue, emptyFallback = "Not available") {
  if (!dateTimeValue) {
    return emptyFallback;
  }

  const parsedDate = new Date(dateTimeValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
}

function formatPrice(priceValue) {
  if (
    priceValue === null ||
    priceValue === undefined ||
    priceValue === ""
  ) {
    return "Not available";
  }

  const numericPrice = Number(priceValue);

  if (!Number.isFinite(numericPrice)) {
    return "Not available";
  }

  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericPrice);
}

function getStayStatusClassName(stayStatus) {
  return STAY_STATUS_CLASS_NAMES[stayStatus] || "";
}

function StaysPage() {
  const [stays, setStays] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [stayForm, setStayForm] = useState(emptyStayForm);
  const [formErrors, setFormErrors] = useState({});

  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [rooms, setRooms] = useState([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [roomError, setRoomError] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let shouldIgnoreResult = false;

    async function loadInitialStays() {
      try {
        const staysData = await getStays();

        if (!Array.isArray(staysData)) {
          throw new Error(
            "Unexpected stay data received from the backend.",
          );
        }

        if (shouldIgnoreResult) {
          return;
        }

        setStays(staysData);
      } catch (requestError) {
        if (shouldIgnoreResult) {
          return;
        }

        setStays([]);
        setError(
          requestError.message ||
            "Unable to load stays. Please try again.",
        );
      } finally {
        if (!shouldIgnoreResult) {
          setIsLoading(false);
        }
      }
    }

    loadInitialStays();

    return () => {
      shouldIgnoreResult = true;
    };
  }, []);

  useEffect(() => {
    let shouldIgnoreResult = false;

    async function loadRooms() {
      try {
        const roomsData = await getRooms();

        if (!Array.isArray(roomsData)) {
          throw new Error(
            "Unexpected room data received from the backend."
          );
        }

        if (shouldIgnoreResult) {
          return;
        }

        setRooms(roomsData);
        setRoomError("");
      } catch (requestError) {
        if (shouldIgnoreResult) {
          return;
        }

        setRooms([]);
        setRoomError(
          requestError.message ||
            "Unable to load rooms. Please try again."
        );
      } finally {
        if (!shouldIgnoreResult) {
          setIsLoadingRooms(false);
        }
      }
    }

    loadRooms();

    return () => {
      shouldIgnoreResult = true;
    };
  }, []);

  function handleFormChange(event) {
    const { name, value } = event.target;

    setStayForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));

    setSuccessMessage("");
    setFormError("");
  }

  function validateStayForm() {
    const errors = {};

    if (!stayForm.room_id) {
      errors.room_id = "Room is required.";
    }

    if (!stayForm.price_per_night) {
      errors.price_per_night = "Price per night is required.";
    } else if (Number(stayForm.price_per_night) <= 0) {
        errors.price_per_night =
          "Price must be greater than 0.";
    }

    if (!stayForm.check_in_datetime) {
      errors.check_in_datetime =
        "Check-in date and time is required.";
    }

    if (!stayForm.stay_status) {
      errors.stay_status = "Stay status is required.";
    }

    return errors;
  }

  function buildStayPayload() {
    return {
      room_id: Number(stayForm.room_id),
      price_per_night: Number(stayForm.price_per_night),
      check_in_datetime: stayForm.check_in_datetime,
      stay_status: stayForm.stay_status,
    };
  }

 async function handleSubmit(event) {
    event.preventDefault();

    const errors = validateStayForm();

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const payload = buildStayPayload();

    setIsSubmitting(true);
    setFormError("");
    setSuccessMessage("");

    try {
      await createStay(payload);

      await refreshStays();

      resetStayForm();

      setSuccessMessage("Stay created successfully.");
    } catch (requestError) {
      setFormError(
        requestError.message ||
          "Unable to create stay. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function refreshStays() {
    const staysData = await getStays();

    if (!Array.isArray(staysData)) {
      throw new Error(
        "Unexpected stay data received from the backend."
      );
    }

    setStays(staysData);
  }

  function resetStayForm() {
    setStayForm(emptyStayForm);
    setFormErrors({});
  }

  return (
    <section className="dashboard-page">
      <div className="dashboard-page-header">
        <div>
          <p className="dashboard-page-eyebrow">
            Stay Management
          </p>

          <h1 className="dashboard-page-title">
            Stays
          </h1>
        </div>

        <p className="dashboard-page-description">
          View active and completed hotel stay records from the
          HelloStay backend.
        </p>
      </div>
    <Card>
      <div className="section-heading">
        <div>
          <h2>Create stay</h2>
          <p>
            Enter the details required to create a new hotel stay.
          </p>
        </div>
      </div>

      {formError && (
        <ErrorMessage message={formError} />
      )}

      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}

      <form
        className="stay-form"
        onSubmit={handleSubmit}
      >
        <div className="stay-form-grid">
          <div className="form-field">
            <label htmlFor="stay-room">
              Room
            </label>

            <select
              id="stay-room"
              name="room_id"
              value={stayForm.room_id}
              onChange={handleFormChange}
              disabled={isLoadingRooms || rooms.length === 0}
            >
              <option value="">
                {isLoadingRooms
                  ? "Loading rooms..."
                  : rooms.length === 0
                    ? "No rooms available"
                    : "Select a room"}
              </option>

              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  Room {room.room_number}
                </option>
              ))}
            </select>

            {formErrors.room_id && (
              <p className="form-error">
                {formErrors.room_id}
              </p>
            )}

            {roomError && (
              <p className="form-error">
                {roomError}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="stay-price">
              Price per night
            </label>

            <input
              id="stay-price"
              name="price_per_night"
              type="number"
              value={stayForm.price_per_night}
              onChange={handleFormChange}
              min="0"
              step="0.01"
              placeholder="Enter price per night"
            />

            {formErrors.price_per_night && (
              <p className="form-error">
                {formErrors.price_per_night}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="stay-check-in">
              Check-in date and time
            </label>

            <input
              id="stay-check-in"
              name="check_in_datetime"
              type="datetime-local"
              value={stayForm.check_in_datetime}
              onChange={handleFormChange}
            />

            {formErrors.check_in_datetime && (
              <p className="form-error">
                {formErrors.check_in_datetime}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="stay-status">
              Stay status
            </label>

            <select
              id="stay-status"
              name="stay_status"
              value={stayForm.stay_status}
              onChange={handleFormChange}
            >
              <option value="">
                Select stay status
              </option>

              <option value="Checked In">
                Checked In
              </option>

              <option value="Checked Out">
                Checked Out
              </option>
            </select>

            {formErrors.stay_status && (
              <p className="form-error">
                {formErrors.stay_status}
              </p>
            )}
          </div>
        </div>

        <div className="stay-form-actions">
          <button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating stay..." : "Create Stay"}
          </button>
        </div>
      </form>    
  </Card>

      {isLoading && <Loading message="Loading stays..." />}

      {!isLoading && error && (
        <ErrorMessage message={error} />
      )}

      {!isLoading && !error && stays.length === 0 && (
        <Card>
          <div className="empty-state">
            <h2>No stays found</h2>

            <p>
              Stay records will appear here after they are created
              through the hotel stay workflow.
            </p>
          </div>
        </Card>
      )}

      {!isLoading && !error && stays.length > 0 && (
        <Card className="stays-table-card">
          <div className="stays-table-wrapper">
            <table className="stays-table">
              <thead>
                <tr>
                  <th scope="col">Stay ID</th>
                  <th scope="col">Room</th>
                  <th scope="col">Status</th>
                  <th scope="col">Check-in</th>
                  <th scope="col">Check-out</th>
                  <th scope="col">Price per night</th>
                </tr>
              </thead>

              <tbody>
                {stays.map((stay) => {
                  const displayedStatus =
                    stay.stay_status || "Unknown";

                  const statusClassName =
                    getStayStatusClassName(displayedStatus);

                  return (
                    <tr key={stay.stay_id}>
                      <td>
                        {stay.stay_id ?? "Not available"}
                      </td>

                      <td>
                        {stay.room_id === null ||
                        stay.room_id === undefined
                          ? "Not available"
                          : `Room ID: ${stay.room_id}`}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${statusClassName}`.trim()}
                        >
                          {displayedStatus}
                        </span>
                      </td>

                      <td>
                        {formatDateTime(
                          stay.check_in_datetime,
                        )}
                      </td>

                      <td>
                        {formatDateTime(
                          stay.check_out_datetime,
                          "Not checked out",
                        )}
                      </td>

                      <td>
                        {formatPrice(stay.price_per_night)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </section>
  );
}

export default StaysPage;