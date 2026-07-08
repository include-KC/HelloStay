import { useEffect, useState } from "react";

import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Loading from "../components/ui/Loading.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import Input from "../components/ui/Input.jsx";

import { createGuest, getGuests } from "../services/guestService.js";

const emptyGuestForm = {
  guest_name: "",
  guest_phone_number: "",
  guest_address: "",
  id_proof_type: "",
  id_proof_number: "",
};

function getGuestInitials(guestName) {
  if (!guestName) {
    return "G";
  }

  return guestName
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((namePart) => namePart[0].toUpperCase())
    .join("");
}

function GuestsPage() {
  const [guests, setGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [guestForm, setGuestForm] = useState(emptyGuestForm);
  const [createError, setCreateError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  async function fetchGuests() {
    const guestsData = await getGuests();

    if (!Array.isArray(guestsData)) {
      throw new Error("Unexpected guest data received from the backend.");
    }

    return guestsData;
  }

  useEffect(() => {
    let shouldIgnoreResult = false;

    async function loadInitialGuests() {
      try {
        const guestsData = await fetchGuests();

        if (shouldIgnoreResult) {
          return;
        }

        setGuests(guestsData);
      } catch (requestError) {
        if (shouldIgnoreResult) {
          return;
        }

        setGuests([]);
        setError(
          requestError.message || "Unable to load guests. Please try again."
        );
      } finally {
        if (!shouldIgnoreResult) {
          setIsLoading(false);
        }
      }
    }

    loadInitialGuests();

    return () => {
      shouldIgnoreResult = true;
    };
  }, []);

  async function refreshGuestsAfterCreate() {
    try {
      setError("");

      const guestsData = await fetchGuests();

      setGuests(guestsData);
    } catch (requestError) {
      setGuests([]);
      setError(
        requestError.message || "Unable to refresh guests. Please try again."
      );
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    setGuestForm((currentForm) => {
      return {
        ...currentForm,
        [name]: value,
      };
    });
  }

  function validateGuestForm() {
    if (!guestForm.guest_name.trim()) {
      return "Guest name is required.";
    }

    if (!guestForm.guest_phone_number.trim()) {
      return "Guest phone number is required.";
    }

    if (!guestForm.guest_address.trim()) {
      return "Guest address is required.";
    }

    if (!guestForm.id_proof_type.trim()) {
      return "ID proof type is required.";
    }

    if (!guestForm.id_proof_number.trim()) {
      return "ID proof number is required.";
    }

    return "";
  }

  async function handleCreateGuest(event) {
    event.preventDefault();

    const validationError = validateGuestForm();

    if (validationError) {
      setCreateError(validationError);
      return;
    }

    try {
      setIsCreating(true);
      setCreateError("");

      const guestPayload = {
        guest_name: guestForm.guest_name.trim(),
        guest_phone_number: guestForm.guest_phone_number.trim(),
        guest_address: guestForm.guest_address.trim(),
        id_proof_type: guestForm.id_proof_type.trim(),
        id_proof_number: guestForm.id_proof_number.trim(),
      };

      await createGuest(guestPayload);

      setGuestForm(emptyGuestForm);

      await refreshGuestsAfterCreate();
    } catch (requestError) {
      setCreateError(
        requestError.message || "Unable to create guest. Please try again."
      );
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Guest Management</p>
          <h1 className="page-title">Guests</h1>
          <p className="page-description">
            View and register guest profiles from the HelloStay backend.
          </p>
        </div>
      </div>

      <Card>
        <form className="guest-form" onSubmit={handleCreateGuest}>
          <div className="form-header">
            <h2>Add New Guest</h2>
            <p>
              Register a guest profile using basic contact and identity details.
            </p>
          </div>

          <div className="form-grid">
            <Input
              id="guest_name"
              name="guest_name"
              label="Guest Name"
              placeholder="Enter guest name"
              value={guestForm.guest_name}
              onChange={handleInputChange}
            />

            <Input
              id="guest_phone_number"
              name="guest_phone_number"
              label="Phone Number"
              placeholder="Enter phone number"
              value={guestForm.guest_phone_number}
              onChange={handleInputChange}
            />

            <Input
              id="guest_address"
              name="guest_address"
              label="Address"
              placeholder="Enter guest address"
              value={guestForm.guest_address}
              onChange={handleInputChange}
            />

            <Input
              id="id_proof_type"
              name="id_proof_type"
              label="ID Proof Type"
              placeholder="Aadhaar, Passport, PAN, etc."
              value={guestForm.id_proof_type}
              onChange={handleInputChange}
            />

            <Input
              id="id_proof_number"
              name="id_proof_number"
              label="ID Proof Number"
              placeholder="Enter ID proof number"
              value={guestForm.id_proof_number}
              onChange={handleInputChange}
            />
          </div>

          {createError && <ErrorMessage message={createError} />}

          <div className="form-actions">
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Creating Guest..." : "Create Guest"}
            </Button>
          </div>
        </form>
      </Card>

      {isLoading && <Loading message="Loading guests..." />}

      {!isLoading && error && <ErrorMessage message={error} />}

      {!isLoading && !error && guests.length === 0 && (
        <Card>
          <div className="empty-state">
            <h2>No guests found</h2>
            <p>
              Guest records will appear here after they are added through the
              create-guest form.
            </p>
          </div>
        </Card>
      )}

      {!isLoading && !error && guests.length > 0 && (
        <div className="guest-grid">
          {guests.map((guest) => (
            <Card key={guest.id}>
              <article className="guest-card">
                <div className="guest-card__header">
                  <div className="guest-card__avatar">
                    {getGuestInitials(guest.guest_name)}
                  </div>

                  <div>
                    <h2 className="guest-card__name">{guest.guest_name}</h2>
                    <p className="guest-card__phone">
                      {guest.guest_phone_number}
                    </p>
                  </div>
                </div>

                <div className="guest-card__details">
                  <div>
                    <span className="guest-card__label">ID Proof Type</span>
                    <strong>{guest.id_proof_type}</strong>
                  </div>

                  <div>
                    <span className="guest-card__label">ID Proof Number</span>
                    <strong>{guest.id_proof_number}</strong>
                  </div>

                  <div>
                    <span className="guest-card__label">Address</span>
                    <strong>{guest.guest_address}</strong>
                  </div>
                </div>
              </article>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

export default GuestsPage;