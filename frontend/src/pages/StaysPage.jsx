import { useEffect, useState } from "react";

import Card from "../components/ui/Card.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import Loading from "../components/ui/Loading.jsx";

import { getStays } from "../services/stayService.js";

const STAY_STATUS_CLASS_NAMES = {
  "Checked In": "stay-status-checked-in",
  "Checked Out": "stay-status-checked-out",
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