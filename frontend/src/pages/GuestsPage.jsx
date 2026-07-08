import { useEffect, useState } from "react";

import Card from "../components/ui/Card.jsx";
import Loading from "../components/ui/Loading.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import { getGuests } from "../services/guestService.js";

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

  useEffect(() => {
    async function loadGuests() {
      try {
        setIsLoading(true);
        setError("");

        const guestsData = await getGuests();

        if (Array.isArray(guestsData)) {
          setGuests(guestsData);
        } else {
          setGuests([]);
          setError("Unexpected guest data received from the backend.");
        }
      } catch (requestError) {
        setGuests([]);
        setError(
          requestError.message || "Unable to load guests. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadGuests();
  }, []);

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Guest Management</p>
          <h1 className="page-title">Guests</h1>
          <p className="page-description">
            View registered guest profiles from the HelloStay backend.
          </p>
        </div>
      </div>

      {isLoading && <Loading message="Loading guests..." />}

      {!isLoading && error && <ErrorMessage message={error} />}

      {!isLoading && !error && guests.length === 0 && (
        <Card>
          <div className="empty-state">
            <h2>No guests found</h2>
            <p>
              Guest records will appear here after they are added through the
              backend or a future create-guest screen.
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