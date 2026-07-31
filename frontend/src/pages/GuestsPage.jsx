import { useEffect, useState } from "react";

import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Loading from "../components/ui/Loading.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import Input from "../components/ui/Input.jsx";

import {
  createGuest,
  deleteGuest,
  getGuests,
  updateGuest,
} from "../services/guestService.js";

const EMPTY_GUEST_FORM = {
  guest_name: "",
  guest_phone_number: "",
  guest_address: "",
  id_proof_type: "",
  id_proof_number: "",
};

const GUEST_FIELD_NAMES = [
  "guest_name",
  "guest_phone_number",
  "guest_address",
  "id_proof_type",
  "id_proof_number",
];

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

function normalizeGuestForm(formData) {
  return {
    guest_name: formData.guest_name.trim(),
    guest_phone_number: formData.guest_phone_number.trim(),
    guest_address: formData.guest_address.trim(),
    id_proof_type: formData.id_proof_type.trim(),
    id_proof_number: formData.id_proof_number.trim(),
  };
}

function validateGuestData(formData) {
  const errors = {};

  if (!formData.guest_name) {
    errors.guest_name = "Guest name is required.";
  }

  if (!formData.guest_phone_number) {
    errors.guest_phone_number = "Phone number is required.";
  }

  if (!formData.guest_address) {
    errors.guest_address = "Guest address is required.";
  }

  if (!formData.id_proof_type) {
    errors.id_proof_type = "ID proof type is required.";
  }

  if (!formData.id_proof_number) {
    errors.id_proof_number = "ID proof number is required.";
  }

  return errors;
}

function getFirstValidationError(validationErrors) {
  return Object.values(validationErrors)[0] || "";
}

function getChangedGuestFields(formData, originalGuest) {
  return GUEST_FIELD_NAMES.reduce((changedFields, fieldName) => {
    const originalValue = originalGuest[fieldName] ?? "";

    if (formData[fieldName] !== originalValue) {
      changedFields[fieldName] = formData[fieldName];
    }

    return changedFields;
  }, {});
}

async function fetchGuestsFromBackend() {
  const guestsData = await getGuests();

  if (!Array.isArray(guestsData)) {
    throw new Error("Unexpected guest data received from the backend.");
  }

  return guestsData;
}

function GuestsPage() {
  const [guests, setGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [refreshError, setRefreshError] = useState("");

  const [guestForm, setGuestForm] = useState(EMPTY_GUEST_FORM);
  const [createError, setCreateError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [editingGuest, setEditingGuest] = useState(null);
  const [editFormData, setEditFormData] = useState(EMPTY_GUEST_FORM);
  const [editValidationErrors, setEditValidationErrors] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
  const [deletingGuestId, setDeletingGuestId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    let shouldIgnoreResult = false;

    async function loadInitialGuests() {
      try {
        const guestsData = await fetchGuestsFromBackend();

        if (shouldIgnoreResult) {
          return;
        }

        setGuests(guestsData);
        setLoadError("");
      } catch (requestError) {
        if (shouldIgnoreResult) {
          return;
        }

        setGuests([]);
        setLoadError(
          requestError.message ||
            "Unable to load guests. Please try again.",
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

  async function refreshGuests() {
    const guestsData = await fetchGuestsFromBackend();

    setGuests(guestsData);
    setLoadError("");
    setRefreshError("");
  }

  function handleCreateInputChange(event) {
    const { name, value } = event.target;

    setGuestForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setCreateError("");
  }

  async function handleCreateGuest(event) {
    event.preventDefault();

    const normalizedGuestData = normalizeGuestForm(guestForm);
    const validationErrors = validateGuestData(normalizedGuestData);

    if (Object.keys(validationErrors).length > 0) {
      setCreateError(getFirstValidationError(validationErrors));
      return;
    }

    try {
      setIsCreating(true);
      setCreateError("");
      setRefreshError("");

      await createGuest(normalizedGuestData);

      setGuestForm(EMPTY_GUEST_FORM);

      try {
        await refreshGuests();
      } catch (refreshRequestError) {
        setRefreshError(
          `The guest was created successfully, but the guest list could not be refreshed. ${
            refreshRequestError.message || "Please try again."
          }`,
        );
      }
    } catch (requestError) {
      setCreateError(
        requestError.message ||
          "Unable to create guest. Please try again.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  function handleStartEdit(guest) {
    setEditingGuest(guest);

    setEditFormData({
      guest_name: guest.guest_name ?? "",
      guest_phone_number: guest.guest_phone_number ?? "",
      guest_address: guest.guest_address ?? "",
      id_proof_type: guest.id_proof_type ?? "",
      id_proof_number: guest.id_proof_number ?? "",
    });

    setEditValidationErrors({});
    setUpdateError("");

    setDeleteConfirmationId(null);
    setDeleteError("");
  }

  function handleCancelEdit() {
    if (isUpdating) {
      return;
    }

    setEditingGuest(null);
    setEditFormData(EMPTY_GUEST_FORM);
    setEditValidationErrors({});
    setUpdateError("");
  }

  function handleEditInputChange(event) {
    const { name, value } = event.target;

    setEditFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));

    setEditValidationErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));

    setUpdateError("");
  }

  async function handleUpdateGuest(event) {
    event.preventDefault();

    if (!editingGuest) {
      return;
    }

    const normalizedFormData = normalizeGuestForm(editFormData);
    const validationErrors = validateGuestData(normalizedFormData);

    if (Object.keys(validationErrors).length > 0) {
      setEditValidationErrors(validationErrors);
      setUpdateError("");
      return;
    }

    const changedGuestData = getChangedGuestFields(
      normalizedFormData,
      editingGuest,
    );

    if (Object.keys(changedGuestData).length === 0) {
      setUpdateError("Make at least one change before saving.");
      return;
    }

    try {
      setIsUpdating(true);
      setUpdateError("");
      setEditValidationErrors({});
      setRefreshError("");

      await updateGuest(editingGuest.id, changedGuestData);

      setEditingGuest(null);
      setEditFormData(EMPTY_GUEST_FORM);

      try {
        await refreshGuests();
      } catch (refreshRequestError) {
        setRefreshError(
          `The guest was updated successfully, but the guest list could not be refreshed. ${
            refreshRequestError.message || "Please try again."
          }`,
        );
      }
    } catch (requestError) {
      setUpdateError(
        requestError.message ||
          "The guest could not be updated. Please try again.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  function handleRequestDelete(guestId) {
    setDeleteConfirmationId(guestId);
    setDeleteError("");
  }

  function handleCancelDelete() {
    if (deletingGuestId !== null) {
      return;
    }

    setDeleteConfirmationId(null);
    setDeleteError("");
  }

  async function handleConfirmDelete(guest) {
    try {
      setDeletingGuestId(guest.id);
      setDeleteError("");
      setRefreshError("");

      await deleteGuest(guest.id);

      if (editingGuest?.id === guest.id) {
        setEditingGuest(null);
        setEditFormData(EMPTY_GUEST_FORM);
        setEditValidationErrors({});
        setUpdateError("");
      }

      setDeleteConfirmationId(null);

      try {
        await refreshGuests();
      } catch (refreshRequestError) {
        setRefreshError(
          `The guest was deleted successfully, but the guest list could not be refreshed. ${
            refreshRequestError.message || "Please try again."
          }`,
        );
      }
    } catch (requestError) {
      setDeleteError(
        requestError.message ||
          "The guest could not be deleted. Please try again.",
      );
    } finally {
      setDeletingGuestId(null);
    }
  }

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Guest Management</p>

          <h1 className="page-title">Guests</h1>

          <p className="page-description">
            View, register, update, and remove guest profiles through the
            HelloStay backend.
          </p>
        </div>
      </div>

      <Card>
        <form className="guest-form" onSubmit={handleCreateGuest}>
          <div className="form-header">
            <h2>Add New Guest</h2>

            <p>
              Register a guest profile using basic contact and identity
              details.
            </p>
          </div>

          <div className="form-grid">
            <Input
              id="guest_name"
              name="guest_name"
              label="Guest Name"
              placeholder="Enter guest name"
              value={guestForm.guest_name}
              onChange={handleCreateInputChange}
              disabled={isCreating}
            />

            <Input
              id="guest_phone_number"
              name="guest_phone_number"
              label="Phone Number"
              placeholder="Enter phone number"
              value={guestForm.guest_phone_number}
              onChange={handleCreateInputChange}
              disabled={isCreating}
            />

            <Input
              id="guest_address"
              name="guest_address"
              label="Address"
              placeholder="Enter guest address"
              value={guestForm.guest_address}
              onChange={handleCreateInputChange}
              disabled={isCreating}
            />

            <Input
              id="id_proof_type"
              name="id_proof_type"
              label="ID Proof Type"
              placeholder="Aadhaar, Passport, PAN, etc."
              value={guestForm.id_proof_type}
              onChange={handleCreateInputChange}
              disabled={isCreating}
            />

            <Input
              id="id_proof_number"
              name="id_proof_number"
              label="ID Proof Number"
              placeholder="Enter ID proof number"
              value={guestForm.id_proof_number}
              onChange={handleCreateInputChange}
              disabled={isCreating}
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

      {editingGuest && (
        <Card>
          <div className="guest-edit-panel">
            <div className="guest-edit-panel__header">
              <div>
                <p className="page-eyebrow">Editing Guest</p>
                <h2>{editingGuest.guest_name}</h2>
              </div>

              <Button
                type="button"
                onClick={handleCancelEdit}
                disabled={isUpdating}
              >
                Cancel
              </Button>
            </div>

            <form className="guest-form" onSubmit={handleUpdateGuest}>
              <div className="form-grid">
                <div className="guest-form__field">
                  <Input
                    id="edit_guest_name"
                    name="guest_name"
                    label="Guest Name"
                    placeholder="Enter guest name"
                    value={editFormData.guest_name}
                    onChange={handleEditInputChange}
                    disabled={isUpdating}
                  />

                  {editValidationErrors.guest_name && (
                    <p className="field-error" role="alert">
                      {editValidationErrors.guest_name}
                    </p>
                  )}
                </div>

                <div className="guest-form__field">
                  <Input
                    id="edit_guest_phone_number"
                    name="guest_phone_number"
                    label="Phone Number"
                    placeholder="Enter phone number"
                    value={editFormData.guest_phone_number}
                    onChange={handleEditInputChange}
                    disabled={isUpdating}
                  />

                  {editValidationErrors.guest_phone_number && (
                    <p className="field-error" role="alert">
                      {editValidationErrors.guest_phone_number}
                    </p>
                  )}
                </div>

                <div className="guest-form__field">
                  <Input
                    id="edit_guest_address"
                    name="guest_address"
                    label="Address"
                    placeholder="Enter guest address"
                    value={editFormData.guest_address}
                    onChange={handleEditInputChange}
                    disabled={isUpdating}
                  />

                  {editValidationErrors.guest_address && (
                    <p className="field-error" role="alert">
                      {editValidationErrors.guest_address}
                    </p>
                  )}
                </div>

                <div className="guest-form__field">
                  <Input
                    id="edit_id_proof_type"
                    name="id_proof_type"
                    label="ID Proof Type"
                    placeholder="Aadhaar, Passport, PAN, etc."
                    value={editFormData.id_proof_type}
                    onChange={handleEditInputChange}
                    disabled={isUpdating}
                  />

                  {editValidationErrors.id_proof_type && (
                    <p className="field-error" role="alert">
                      {editValidationErrors.id_proof_type}
                    </p>
                  )}
                </div>

                <div className="guest-form__field">
                  <Input
                    id="edit_id_proof_number"
                    name="id_proof_number"
                    label="ID Proof Number"
                    placeholder="Enter ID proof number"
                    value={editFormData.id_proof_number}
                    onChange={handleEditInputChange}
                    disabled={isUpdating}
                  />

                  {editValidationErrors.id_proof_number && (
                    <p className="field-error" role="alert">
                      {editValidationErrors.id_proof_number}
                    </p>
                  )}
                </div>
              </div>

              {updateError && <ErrorMessage message={updateError} />}

              <div className="form-actions">
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving Changes..." : "Save Changes"}
                </Button>

                <Button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </Card>
      )}

      {isLoading && <Loading message="Loading guests..." />}

      {!isLoading && loadError && (
        <ErrorMessage message = {loadError} />
      )}

      {!isLoading && refreshError && (
        <ErrorMessage message={refreshError} />
      )}

      {!isLoading && !loadError && guests.length === 0 && (
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

      {!isLoading && !loadError && guests.length > 0 && (
        <div className="guest-grid">
          {guests.map((guest) => {
            const isConfirmingDelete =
              deleteConfirmationId === guest.id;

            const isDeletingThisGuest =
              deletingGuestId === guest.id;

            return (
              <Card key={guest.id}>
                <article className="guest-card">
                  <div className="guest-card__header">
                    <div className="guest-card__avatar">
                      {getGuestInitials(guest.guest_name)}
                    </div>

                    <div>
                      <h2 className="guest-card__name">
                        {guest.guest_name}
                      </h2>

                      <p className="guest-card__phone">
                        {guest.guest_phone_number}
                      </p>
                    </div>
                  </div>

                  <div className="guest-card__details">
                    <div>
                      <span className="guest-card__label">
                        ID Proof Type
                      </span>

                      <strong>{guest.id_proof_type}</strong>
                    </div>

                    <div>
                      <span className="guest-card__label">
                        ID Proof Number
                      </span>

                      <strong>{guest.id_proof_number}</strong>
                    </div>

                    <div>
                      <span className="guest-card__label">
                        Address
                      </span>

                      <strong>{guest.guest_address}</strong>
                    </div>
                  </div>

                  <div className="guest-card__actions">
                    <Button
                      type="button"
                      onClick={() => handleStartEdit(guest)}
                      disabled={
                        isUpdating || deletingGuestId !== null
                      }
                    >
                      Edit
                    </Button>

                    {!isConfirmingDelete && (
                      <Button
                        type="button"
                        onClick={() =>
                          handleRequestDelete(guest.id)
                        }
                        disabled={
                          isUpdating || deletingGuestId !== null
                        }
                        className="button-danger-outline"
                      >
                        Delete
                      </Button>
                    )}
                  </div>

                  {isConfirmingDelete && (
                    <div className="inline-delete-confirmation">
                      <p>
                        Delete{" "}
                        <strong>{guest.guest_name}</strong>? This action
                        cannot be undone.
                      </p>

                      <div className="inline-delete-confirmation__actions">
                        <Button
                          type="button"
                          onClick={() => handleConfirmDelete(guest)}
                          disabled={isDeletingThisGuest}
                          className="button-danger"
                        >
                          {isDeletingThisGuest
                            ? "Deleting..."
                            : "Confirm Delete"}
                        </Button>

                        <Button
                          type="button"
                          onClick={handleCancelDelete}
                          disabled={isDeletingThisGuest}
                        >
                          Cancel
                        </Button>
                      </div>

                      {deleteError && (
                        <ErrorMessage message={deleteError} />
                      )}
                    </div>
                  )}
                </article>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default GuestsPage;