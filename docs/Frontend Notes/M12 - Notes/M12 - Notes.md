# M12 - Notes

## Document Purpose

These notes convert the uploaded Milestone 12 text into a structured Markdown format. The original content has been preserved and reorganized with headings, lists, checklists, and fenced code blocks.

## Table of Contents

- [1. Objective](#1-objective)
- [2. Problem Analysis](#2-problem-analysis)
- [3. High-Level Design](#3-high-level-design)
- [4. Concepts Involved](#4-concepts-involved)
- [5. Folder/File Changes](#5-folderfile-changes)
- [6. Step-by-Step Explanation](#6-step-by-step-explanation)
- [7. Implementation](#7-implementation)
- [8. Code Walkthrough](#8-code-walkthrough)
- [9. Debugging Tips](#9-debugging-tips)
- [10. Common Mistakes](#10-common-mistakes)
- [11. Alternative Approaches](#11-alternative-approaches)
- [12. Industry Best Practices](#12-industry-best-practices)
- [13. Summary](#13-summary)
- [Additional Notes](#additional-notes)

---

> We’ll keep Milestone 12 focused on improving the already-working Rooms module, not adding new features. I’ll show a safe refactor path where behavior is preserved first, then visual polish is added in small steps.

> I checked the uploaded backend room contract. The frontend should still treat /rooms as the only Rooms API surface for this milestone: list, create, update, and delete remain backend-owned, while React only improves UI and structure.

> **Original processing note:** Thought for 1m 1s
## 1. Objective

Milestone 12 is a refinement milestone, not a feature milestone.

Your goal is to take the working Rooms module from Milestones 9–11 and make it:

- easier to read,
- easier to maintain,
- visually cleaner,
- less confusing for create/edit/delete flows,
- still fully connected to the backend,
- still beginner-friendly.

The backend already owns the real room operations: create, list, update, and delete through /rooms; React should only call those through roomService.js, not duplicate backend logic.

## 2. Problem Analysis

After Milestones 9, 10, and 11, RoomsPage.jsx probably contains many responsibilities:

- loading rooms,
- storing room list state,
- storing form state,
- validating form input,
- deciding create vs edit mode,
- calling backend services,
- rendering form UI,
- rendering room list UI,
- handling delete confirmation,
- showing loading/error/success messages.

That is normal.

A beginner mistake is thinking this means the code is “bad.” It does not. In real projects, engineers often build a feature in one file first, make sure it works, and then refactor once the shape of the feature becomes clear.

Refactoring means improving code structure without changing behavior.

It is different from rewriting.

Refactoring: “This works. Let me organize it better.”
Rewriting: “Throw everything away and build it again.”

For Milestone 12, we refactor only where it makes the code easier to understand.

## 3. High-Level Design

We will keep this structure:

```text
frontend/
  src/
    pages/
      RoomsPage.jsx

    components/
      rooms/
        RoomForm.jsx
        RoomTable.jsx

    services/
      roomService.js

    styles/
      global.css
```

The responsibility split should be:

**`RoomsPage.jsx`**
- Owns page-level state
- Calls roomService
- Decides create/edit mode
- Handles success/error/loading states

**`RoomForm.jsx`**
- Displays create/edit form
- Receives form values through props
- Sends user input back to RoomsPage

**`RoomTable.jsx`**
- Displays rooms
- Receives rooms through props
- Calls onEdit / onDelete when buttons are clicked

**`roomService.js`**
- Only place for room API calls

**`global.css`**
- Visual spacing and layout styles

React renderer owns this UI work. Electron does not need to be touched in Milestone 12.

## 4. Concepts Involved
### Refactoring

Refactoring is changing the internal structure of code while keeping the outside behavior the same.

**Example:**

**Before refactor:**

```jsx
function RoomsPage() {
  return (
    <>
      <form>...</form>
      <table>...</table>
    </>
  );
}
```

**After refactor:**

```jsx
function RoomsPage() {
  return (
    <>
      <RoomForm />
      <RoomTable />
    </>
  );
}
```

The user still sees the same feature, but the code is easier to read.

### Component extraction

Component extraction means taking one piece of UI and moving it into its own component.

A component should usually be extracted when:

- the JSX is long,
- the UI has a clear name,
- the same UI may be reused,
- the parent page is becoming hard to scan.

For this milestone, RoomForm and RoomTable are reasonable extractions because the form and list are separate mental areas.

### Props

Props are values passed from a parent component to a child component.

**Example:**

```jsx
<RoomForm formData={formData} onChange={handleInputChange} />
```

**Here:**

- RoomsPage is the parent.
- RoomForm is the child.
- formData is data.
- onChange is a function the child can call.

**The important idea:**

The child displays the UI, but the parent still owns the state.

That keeps the data flow easy to understand.

## 5. Folder/File Changes

**Create these files:**

- src/components/rooms/RoomForm.jsx
- src/components/rooms/RoomTable.jsx

**Edit these files:**

- src/pages/RoomsPage.jsx
- src/styles/global.css

**Do not change:**

- src/services/apiClient.js
- src/services/roomService.js
- electron/
- backend/

Unless your roomService.js is missing one of the existing CRUD functions, leave it alone.

## 6. Step-by-Step Explanation
### Step 1: Verify roomService.js

Your service should still be the only room API layer.

**Expected shape:**

```javascript
import { apiRequest } from "./apiClient";

export function getRooms() {
  return apiRequest("/rooms");
}

export function createRoom(roomData) {
  return apiRequest("/rooms", {
    method: "POST",
    body: roomData,
  });
}

export function updateRoom(roomId, roomData) {
  return apiRequest(`/rooms/${roomId}`, {
    method: "PUT",
    body: roomData,
  });
}

export function deleteRoom(roomId) {
  return apiRequest(`/rooms/${roomId}`, {
    method: "DELETE",
  });
}
```

Do not put fetch calls directly inside RoomsPage.jsx.

### Step 2: Create RoomForm.jsx

**Create:**

- `src/components/rooms/RoomForm.jsx`

**Use this code:**

```jsx
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
```
### Step 3: Create RoomTable.jsx

**Create:**

- `src/components/rooms/RoomTable.jsx`

**Use this code:**

```jsx
function formatPrice(value) {
  if (value === null || value === undefined || value === "") {
    return "Not set";
  }

  return `₹${Number(value).toLocaleString("en-IN")}`;
}

function getStatusClassName(status) {
  if (!status) {
    return "status-badge";
  }

  return `status-badge status-${status.toLowerCase().replaceAll(" ", "-")}`;
}

function RoomTable({ rooms, onEdit, onDelete, deletingRoomId }) {
  return (
    <div className="room-table-wrapper">
      <table className="room-table">
        <thead>
          <tr>
            <th>Room</th>
            <th>Type</th>
            <th>Price / night</th>
            <th>Occupancy</th>
            <th>Status</th>
            <th>Facilities</th>
            <th className="table-actions-column">Actions</th>
          </tr>
        </thead>

        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>
                <strong>Room {room.room_number}</strong>
              </td>

              <td>{room.room_type || "Not set"}</td>

              <td>{formatPrice(room.price_per_night)}</td>

              <td>
                {room.max_occupancy
                  ? `${room.max_occupancy} guest${
                      Number(room.max_occupancy) === 1 ? "" : "s"
                    }`
                  : "Not set"}
              </td>

              <td>
                <span className={getStatusClassName(room.room_status)}>
                  {room.room_status || "Unknown"}
                </span>
              </td>

              <td>{room.facilities || "No facilities listed"}</td>

              <td>
                <div className="table-actions">
                  <button
                    type="button"
                    className="button button-secondary button-small"
                    onClick={() => onEdit(room)}
                    disabled={deletingRoomId === room.id}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="button button-danger button-small"
                    onClick={() => onDelete(room)}
                    disabled={deletingRoomId === room.id}
                  >
                    {deletingRoomId === room.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RoomTable;
```

For a desktop hotel-management app, a table is a good choice because hotel staff can scan room number, price, status, and actions quickly.

### Step 4: Refactor RoomsPage.jsx

**Edit:**

- `src/pages/RoomsPage.jsx`

**Use this as your clean Milestone 12 target:**

```jsx
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
```
## 7. Implementation

Add these styles to the bottom of src/styles/global.css.

Do not delete your old CSS. Add this after the existing styles:

```css
.rooms-page {
  display: grid;
  gap: 24px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.page-header h1 {
  margin: 0;
  color: #172033;
  font-size: 32px;
  line-height: 1.2;
}

.page-header p {
  margin: 8px 0 0;
  color: #667085;
}

.eyebrow {
  margin: 0 0 8px;
  color: #475467;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.rooms-layout {
  display: grid;
  gap: 24px;
}

.card {
  border: 1px solid #e4e7ec;
  border-radius: 16px;
  background: #ffffff;
  padding: 24px;
  box-shadow: 0 12px 32px rgba(16, 24, 40, 0.06);
}

.section-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.section-heading h2 {
  margin: 0;
  color: #172033;
  font-size: 20px;
}

.section-heading p {
  margin: 6px 0 0;
  color: #667085;
}

.room-form {
  display: grid;
  gap: 20px;
}

.room-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.form-field {
  display: grid;
  gap: 8px;
}

.form-field-wide {
  grid-column: 1 / -1;
}

.form-field label {
  color: #344054;
  font-size: 14px;
  font-weight: 600;
}

.form-field input,
.form-field select,
.form-field textarea {
  width: 100%;
  border: 1px solid #d0d5dd;
  border-radius: 10px;
  padding: 10px 12px;
  color: #172033;
  background: #ffffff;
}

.form-field textarea {
  resize: vertical;
}

.field-error {
  margin: 0;
  color: #b42318;
  font-size: 13px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.button {
  border: 0;
  border-radius: 10px;
  padding: 10px 16px;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.button-primary {
  background: #172033;
  color: #ffffff;
}

.button-secondary {
  background: #f2f4f7;
  color: #344054;
}

.button-danger {
  background: #fee4e2;
  color: #b42318;
}

.button-small {
  padding: 8px 12px;
  font-size: 14px;
}

.alert {
  margin-bottom: 16px;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 14px;
}

.alert-error {
  border: 1px solid #fecdca;
  background: #fef3f2;
  color: #b42318;
}

.alert-success {
  border: 1px solid #abefc6;
  background: #ecfdf3;
  color: #067647;
}

.empty-state {
  border: 1px dashed #d0d5dd;
  border-radius: 14px;
  padding: 32px;
  text-align: center;
  background: #f9fafb;
}

.empty-state h3 {
  margin: 0;
  color: #172033;
}

.empty-state p {
  margin: 8px 0 0;
  color: #667085;
}

.muted-text {
  color: #667085;
}

.room-table-wrapper {
  overflow-x: auto;
}

.room-table {
  width: 100%;
  border-collapse: collapse;
}

.room-table th,
.room-table td {
  border-bottom: 1px solid #eaecf0;
  padding: 14px 12px;
  text-align: left;
  vertical-align: top;
}

.room-table th {
  color: #475467;
  background: #f9fafb;
  font-size: 13px;
  font-weight: 700;
}

.room-table td {
  color: #344054;
  font-size: 14px;
}

.table-actions-column {
  width: 180px;
}

.table-actions {
  display: flex;
  gap: 8px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 4px 10px;
  background: #f2f4f7;
  color: #344054;
  font-size: 12px;
  font-weight: 700;
}

.status-available {
  background: #ecfdf3;
  color: #067647;
}

.status-occupied {
  background: #eff8ff;
  color: #175cd3;
}

.status-reserved {
  background: #fffaeb;
  color: #b54708;
}

.status-maintenance {
  background: #fef3f2;
  color: #b42318;
}

@media (max-width: 900px) {
  .room-form-grid {
    grid-template-columns: 1fr;
  }

  .page-header,
  .section-heading {
    flex-direction: column;
  }

  .table-actions {
    flex-direction: column;
  }
}
```
## 8. Code Walkthrough
### RoomsPage.jsx

RoomsPage remains the smart component.

**It owns:**

- rooms
- formData
- formErrors
- editingRoomId
- isLoading
- isSubmitting
- deletingRoomId
- pageError
- formError
- successMessage

This is correct because these states affect the whole page.

### Why RoomForm does not own form state

**RoomForm receives:**

```jsx
formData={formData}
onChange={handleInputChange}
```

This means RoomsPage controls the form.

That matters because when the user clicks Edit, RoomsPage can fill the form with the selected room’s data.

### Why RoomTable does not call the API directly

**RoomTable receives:**

```jsx
onEdit={handleEditRoom}
onDelete={handleDeleteRoom}
```

**The table only says:**

“The user clicked edit/delete.”

It does not decide what API should run.

That keeps API behavior in the page and service layer, not inside display components.

### Why refreshRooms() exists

**After create, update, or delete, we call:**

```javascript
await refreshRooms();
```

That keeps the visible list synchronized with the backend.

This is important because FastAPI and SQLite remain the source of truth.

### Why errors are separated

**There are two error states:**

pageError
formError

Use pageError for loading/deleting list-level problems.

Use formError for create/edit submit problems.

This prevents one form error from breaking the whole page.

## 9. Debugging Tips

**Run the frontend:**

```bash
npm run dev
```

This starts the Vite React development server.

**Run Electron if needed:**

```bash
npm run desktop
```

This starts the React app and opens it inside the Electron desktop window.

**Verification checklist:**

- [ ] Open Rooms page.
- [ ] Confirm existing rooms load.
- [ ] Create a new room.
- [ ] Confirm success message appears.
- [ ] Confirm the room appears in the table.
- [ ] Click Edit.
- [ ] Confirm the form changes to edit mode.
- [ ] Click Cancel edit.
- [ ] Confirm the form returns to create mode.
- [ ] Edit a room and save.
- [ ] Confirm the table refreshes.
- [ ] Delete a room.
- [ ] Confirm the browser confirmation appears.
- [ ] Confirm the deleted room disappears.
- [ ] Stop the backend and refresh the page.
- [ ] Confirm the page shows a clean error instead of crashing.

**Use browser DevTools:**

- Console: check JavaScript errors.
- Network tab: confirm GET/POST/PUT/DELETE requests.
- React DevTools: inspect RoomsPage, RoomForm, and RoomTable props.
## 10. Common Mistakes
### Mistake 1: Moving API calls into RoomTable

**Avoid this:**

```javascript
roomService.deleteRoom(room.id);
```

inside RoomTable.

The table should render data, not manage backend behavior.

### Mistake 2: Forgetting event.preventDefault()

**Without this:**

```javascript
event.preventDefault();
```

the browser may reload the page when the form submits.

### Mistake 3: Not resetting edit mode

**After update, you must call:**

```javascript
resetForm();
```

Otherwise the form may remain stuck in edit mode.

### Mistake 4: Breaking controlled inputs

**Every input must have:**

```jsx
value={formData.fieldName}
onChange={onChange}
name="fieldName"
```

The name must match the key in formData.

### Mistake 5: Extracting too many components

**Do not create:**

- RoomStatusBadge.jsx
- RoomActions.jsx
- RoomEmptyState.jsx
- RoomFormField.jsx
- useRooms.js
- roomReducer.js

Not yet.

Those may be useful later, but right now they would make the project harder for a beginner to follow.

## 11. Alternative Approaches
### Option A: Keep everything in RoomsPage.jsx

Good if the file is still small.

Downside: after create/edit/delete, it may become hard to scan.

### Option B: Extract RoomForm and RoomTable

Recommended for Milestone 12.

It improves readability without adding complex architecture.

### Option C: Create custom hooks like useRooms

Not recommended yet.

A hook may be useful later, but right now it hides important learning details like loading state, error handling, and API flow.

### Option D: Use a modal for create/edit

Not recommended yet.

A modal can look polished, but it adds more UI state and keyboard/accessibility concerns. A simple page-level form is easier to understand for now.

## 12. Industry Best Practices

**For this milestone, follow these practices:**

- Keep backend as the source of truth.
- Keep API calls inside service files.
- Keep page components responsible for feature state.
- Keep feature components focused on display and user interaction.
- Refactor only after behavior works.
- Test after every small change.
- Prefer clear names over clever abstractions.
- Do not introduce global state until multiple pages truly need the same data.
- Do not introduce reducers until state transitions become difficult to manage.
- Keep UI professional, calm, and readable.

A good production UI is not the flashiest UI. It is the UI that hotel staff can understand quickly during real work.

## 13. Summary

Milestone 12 improves the Rooms module without changing its core behavior.

**You now have a cleaner structure:**

- RoomsPage.jsx
- Page state and API coordination

- RoomForm.jsx
- Create/edit form UI

- RoomTable.jsx
- Room list display and action buttons

- roomService.js
- Backend communication only

This is a strong step toward production-quality frontend engineering because you are learning how to improve working code safely instead of constantly rewriting.

---

## Additional Notes

### Safe Refactor Order

1. Confirm `roomService.js` already supports `getRooms`, `createRoom`, `updateRoom`, and `deleteRoom`.
2. Create `RoomForm.jsx` and move only the form JSX into it.
3. Create `RoomTable.jsx` and move only the table/list JSX into it.
4. Update `RoomsPage.jsx` to pass props into `RoomForm` and `RoomTable`.
5. Add the CSS at the bottom of `global.css` without deleting older styles.
6. Test create, edit, delete, loading, empty state, and backend-offline behavior.

### Mental Model

- `RoomsPage.jsx` is the controller for the Rooms feature.
- `RoomForm.jsx` is a controlled form view.
- `RoomTable.jsx` is a display table with action callbacks.
- `roomService.js` is the API boundary.
- `global.css` provides visual polish without changing logic.

### Suggested Commit Message

```text
Refactor rooms UI into form and table components
```
