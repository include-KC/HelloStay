function StayForm({
  mode,
  formData,
  formErrors,
  rooms,
  isLoadingRooms,
  isSubmitting,
  roomError,
  onChange,
  onSubmit,
  onCancel,
}) {
  const isCreateMode = mode === "create";

  return (
    <form className="stay-form" onSubmit={onSubmit}>
      <div className="stay-form-grid">
        <div className="form-field">
          <label htmlFor={`${mode}-stay-room`}>
            Room
          </label>

          <select
            id={`${mode}-stay-room`}
            name="room_id"
            value={formData.room_id}
            onChange={onChange}
            disabled={
              isLoadingRooms ||
              rooms.length === 0 ||
              isSubmitting
            }
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
          <label htmlFor={`${mode}-stay-price`}>
            Price per night
          </label>

          <input
            id={`${mode}-stay-price`}
            name="price_per_night"
            type="number"
            value={formData.price_per_night}
            onChange={onChange}
            min="0"
            step="0.01"
            placeholder="Enter price per night"
            disabled={isSubmitting}
          />

          {formErrors.price_per_night && (
            <p className="form-error">
              {formErrors.price_per_night}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor={`${mode}-stay-check-in`}>
            Check-in date and time
          </label>

          <input
            id={`${mode}-stay-check-in`}
            name="check_in_datetime"
            type="datetime-local"
            value={formData.check_in_datetime}
            onChange={onChange}
            disabled={isSubmitting}
          />

          {formErrors.check_in_datetime && (
            <p className="form-error">
              {formErrors.check_in_datetime}
            </p>
          )}
        </div>

        {isCreateMode && (
          <div className="form-field">
            <label htmlFor="create-stay-status">
              Stay status
            </label>

            <select
              id="create-stay-status"
              name="stay_status"
              value={formData.stay_status}
              onChange={onChange}
              disabled={isSubmitting}
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
        )}
      </div>

      <div className="stay-form-actions">
        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? isCreateMode
              ? "Creating stay..."
              : "Saving changes..."
            : isCreateMode
              ? "Create Stay"
              : "Save Changes"}
        </button>

        {!isCreateMode && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default StayForm;