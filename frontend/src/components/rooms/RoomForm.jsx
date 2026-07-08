function RoomForm({
  formData,
  formErrors,
  mode,
  isSubmitting,
  onChange,
  onSubmit,
  onCancel,
}) {
  const isEditMode = mode === "edit";

  return (
    <form className="room-form" onSubmit={onSubmit}>
      <div className="section-heading">
        <div>
          <h2>{isEditMode ? "Edit room" : "Add new room"}</h2>
          <p>
            {isEditMode
              ? "Update the selected room details."
              : "Create a new room record for the hotel."}
          </p>
        </div>

        {isEditMode && (
          <button
            type="button"
            className="button button-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel edit
          </button>
        )}
      </div>

      <div className="room-form-grid">
        <div className="form-field">
          <label htmlFor="room_number">Room number</label>
          <input
            id="room_number"
            name="room_number"
            type="text"
            value={formData.room_number}
            onChange={onChange}
            placeholder="Example: 101"
          />
          {formErrors.room_number && (
            <p className="field-error">{formErrors.room_number}</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="room_type">Room type</label>
          <input
            id="room_type"
            name="room_type"
            type="text"
            value={formData.room_type}
            onChange={onChange}
            placeholder="Example: Deluxe"
          />
        </div>

        <div className="form-field">
          <label htmlFor="price_per_night">Price per night</label>
          <input
            id="price_per_night"
            name="price_per_night"
            type="number"
            value={formData.price_per_night}
            onChange={onChange}
            placeholder="Example: 2500"
            min="0"
          />
          {formErrors.price_per_night && (
            <p className="field-error">{formErrors.price_per_night}</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="max_occupancy">Max occupancy</label>
          <input
            id="max_occupancy"
            name="max_occupancy"
            type="number"
            value={formData.max_occupancy}
            onChange={onChange}
            placeholder="Example: 2"
            min="1"
          />
          {formErrors.max_occupancy && (
            <p className="field-error">{formErrors.max_occupancy}</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="room_status">Room status</label>
          <select
            id="room_status"
            name="room_status"
            value={formData.room_status}
            onChange={onChange}
          >
            <option value="">Select status</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Reserved">Reserved</option>
            <option value="Maintenance">Maintenance</option>
          </select>
          {formErrors.room_status && (
            <p className="field-error">{formErrors.room_status}</p>
          )}
        </div>

        <div className="form-field form-field-wide">
          <label htmlFor="facilities">Facilities</label>
          <textarea
            id="facilities"
            name="facilities"
            value={formData.facilities}
            onChange={onChange}
            placeholder="Example: Wi-Fi, AC, TV, Balcony"
            rows="3"
          />
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="button button-primary"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : isEditMode
              ? "Save changes"
              : "Create room"}
        </button>
      </div>
    </form>
  );
}

export default RoomForm;