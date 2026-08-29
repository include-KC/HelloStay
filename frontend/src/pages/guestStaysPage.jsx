import { useEffect, useState } from "react";

import Card from "../components/ui/Card.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import Loading from "../components/ui/Loading.jsx";

import { getGuestStays } from "../services/guestStayService.js";

function GuestStaysPage() {
  const [guestStays, setGuestStays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let shouldIgnoreResult = false;

    async function loadInitialGuestStays() {
      try {
        const guestStaysData = await getGuestStays();

        if (!Array.isArray(guestStaysData)) {
          throw new Error(
            "Unexpected GuestStay data received from the backend.",
          );
        }

        if (shouldIgnoreResult) {
          return;
        }

        setGuestStays(guestStaysData);
        setError("");
      } catch (requestError) {
        if (shouldIgnoreResult) {
          return;
        }

        setGuestStays([]);
        setError(
          requestError.message ||
            "Unable to load guest stays. Please try again.",
        );
      } finally {
        if (!shouldIgnoreResult) {
          setIsLoading(false);
        }
      }
    }

    loadInitialGuestStays();

    return () => {
      shouldIgnoreResult = true;
    };
  }, []);

  return (
    <section className="dashboard-page">
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">Guest Stays</h1>

          <p className="dashboard-page-description">
            View guest and stay relationships recorded in the HelloStay backend.
          </p>
        </div>
      </div>

      {isLoading && <Loading message="Loading guest stays..." />}

      {!isLoading && error && <ErrorMessage message={error} />}

      {!isLoading && !error && guestStays.length === 0 && (
        <Card>
          <div className="empty-state">
            <h2>No guest stays found</h2>

            <p>
              Guest and stay relationships will appear here after they are
              recorded.
            </p>
          </div>
        </Card>
      )}
      {!isLoading && !error && guestStays.length > 0 && (
        <Card>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">GuestStay ID</th>
                  <th scope="col">Guest ID</th>
                  <th scope="col">Stay ID</th>
                  <th scope="col">Primary Guest</th>
                </tr>
              </thead>

              <tbody>
                {guestStays.map((guestStay) => (
                  <tr key={guestStay.id}>
                    <td>{guestStay.id}</td>
                    <td>{guestStay.guest_id}</td>
                    <td>{guestStay.stay_id}</td>
                    <td>{guestStay.is_primary_guest ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </section>
  );
}

export default GuestStaysPage;
