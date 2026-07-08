# M11 - Notes

## Source Context

I’ll treat your uploaded Milestone 11 prompt as the source for this step and continue from the Milestone 10 rooms create/read foundation. Since your current RoomsPage.jsx and roomService.js were not uploaded, I’ll teach the implementation using the expected Milestone 10 structure and clearly mark what to adapt.

I confirmed the backend already supports the exact room operations needed for this milestone: PUT /rooms/{room_id} for partial updates and DELETE /rooms/{room_id} for deletion. The backend also uses RoomUpdate, so the frontend should send only editable room fields, not database logic.

---

## 1. Objective

Milestone 11 adds **edit** and **delete** support to the existing Rooms module.

### Existing Room Module Features

- Read rooms from backend.
- Create rooms through `POST /rooms`.
- Loading, error, and empty states.

### New Features Added in Milestone 11

- `updateRoom(roomId, roomData)` in `roomService.js`.
- `deleteRoom(roomId)` in `roomService.js`.
- Edit button per room.
- Pre-filled edit form.
- Cancel edit mode.
- Delete button per room.
- Inline delete confirmation.
- Update/delete loading and error states.

This continues the uploaded Milestone 11 plan and stays limited to **room edit/delete only**.

---

## 2. Problem Analysis

The backend already supports what the frontend needs:

- `PUT /rooms/{room_id}` updates an existing room.
- `DELETE /rooms/{room_id}` deletes an existing room.
- If the room does not exist, the backend returns `404`.
- The backend uses `RoomUpdate` and `model_dump(exclude_unset=True)`, which means partial updates are supported.

### Editable Room Fields

The room update schema allows these editable fields:

- `room_number`
- `price_per_night`
- `room_status`
- `room_type`
- `max_occupancy`
- `facilities`

The uploaded backend schema confirms `RoomUpdate` makes these fields optional, so the backend can accept partial update data.

For this beginner-friendly milestone, the frontend will still send the full form payload during edit because the form is pre-filled with the current room values. True “send only changed fields” can come later.

---

## 3. High-Level Design

### Data Flow

```text
User clicks Edit/Delete
        ↓
RoomsPage state changes
        ↓
RoomsPage calls roomService.js
        ↓
roomService.js calls apiClient.js
        ↓
FastAPI backend updates SQLite database
        ↓
RoomsPage refreshes room list
```

### Responsibility Separation

#### React Renderer

- Form state
- Edit mode
- Delete confirmation
- Loading and error UI

#### Service Layer

- `updateRoom()`
- `deleteRoom()`
- API endpoint details

#### FastAPI Backend

- Validation
- Database update/delete
- `404` errors
- Source of truth

#### Electron Main Process

- No room logic
- No API logic
- No database logic

---

## 4. Concepts Involved

### Edit Mode

For editing, React needs to remember which room is being edited.

```jsx
const [editingRoomId, setEditingRoomId] = useState(null);
```

- When `editingRoomId` is `null`, the form is in create mode.
- When `editingRoomId` has a room id, the form is in edit mode.

### Pre-Filled Form

When the user clicks **Edit**, copy the selected room’s values into the form state.

```jsx
setFormData({
  room_number: room.room_number,
  room_type: room.room_type,
  price_per_night: room.price_per_night,
  max_occupancy: room.max_occupancy,
  facilities: room.facilities,
  room_status: room.room_status,
});
```

This is the same controlled component idea from the create form, but now the initial values come from an existing room.

### Delete Confirmation

Delete is destructive. The user should not lose data because of one accidental click.

Instead of a modal, use beginner-friendly inline confirmation:

```text
Delete → Are you sure? Yes / No
```

This needs state like:

```jsx
const [deleteConfirmId, setDeleteConfirmId] = useState(null);
```

Only the selected room row/card enters confirmation mode.

---

## 5. Folder/File Changes

For this milestone, update only these files:

```text
frontend/
  src/
    services/
      roomService.js

    pages/
      RoomsPage.jsx

    styles/
      global.css    optional, only if styling is missing
```

Do not touch Electron files.

Do not touch backend files for this milestone.

---

## 6. Step-by-Step Explanation

### Step 1 — Update `roomService.js`

The service layer keeps API details out of the page component.

The page should not directly know this:

```text
PUT /rooms/5
DELETE /rooms/5
```

Instead, the page should call readable functions:

```js
updateRoom(5, roomData);
deleteRoom(5);
```

### Step 2 — Add Edit State in `RoomsPage.jsx`

The page needs to know:

- Are we creating or editing?
- Which room is being edited?
- What data is currently inside the form?

That means the create form from Milestone 10 becomes a create/edit form.

### Step 3 — Add Delete Confirmation State

The page needs to know:

- Which room is waiting for delete confirmation?
- Which room is currently being deleted?
- Did delete fail?

This gives safe destructive action handling.

### Step 4 — Refresh List After Update/Delete

After update or delete succeeds, refetch rooms from the backend.

This is simpler than manually updating local state because the backend remains the source of truth.

---

## 7. Implementation

### File 1: `frontend/src/services/roomService.js`

Keep your existing `getRooms()` and `createRoom()` functions. Add the two new functions below them.

```js
import { apiRequest } from "./apiClient.js";

export async function getRooms() {
  return apiRequest("/rooms");
}

export async function createRoom(roomData) {
  return apiRequest("/rooms", {
    method: "POST",
    body: roomData,
  });
}

export async function updateRoom(roomId, roomData) {
  return apiRequest(`/rooms/${roomId}`, {
    method: "PUT",
    body: roomData,
  });
}

export async function deleteRoom(roomId) {
  return apiRequest(`/rooms/${roomId}`, {
    method: "DELETE",
  });
}
```

This matches the backend routes: `PUT /rooms/{room_id}` and `DELETE /rooms/{room_id}`.

### File 2: `frontend/src/pages/RoomsPage.jsx`

Use this as the Milestone 11 version of your page. If your current file already has extra CSS classes from Milestone 10, keep your styling and merge the logic carefully.

```jsx
import { useEffect, useState } from "react";

import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import Input from "../components/ui/Input.jsx";
import Loading from "../components/ui/Loading.jsx";
import {
  createRoom,
  deleteRoom,
  getRooms,
  updateRoom,
} from "../services/roomService.js";

const INITIAL_ROOM_FORM = {
  room_number: "",
  room_type: "",
  price_per_night: "",
  max_occupancy: "",
  facilities: "",
  room_status: "Available",
};

const ROOM_STATUS_OPTIONS = [
  "Available",
  "Occupied",
  "Reserved",
  "Maintenance",
];

function normalizeRoomToForm(room) {
  return {
    room_number: room.room_number ?? "",
    room_type: room.room_type ?? "",
    price_per_night: String(room.price_per_night ?? ""),
    max_occupancy: String(room.max_occupancy ?? ""),
    facilities: room.facilities ?? "",
    room_status: room.room_status ?? "Available",
  };
}

function buildRoomPayload(formData) {
  return {
    room_number: formData.room_number.trim(),
    room_type: formData.room_type.trim() || null,
    price_per_night: Number(formData.price_per_night),
    max_occupancy: Number(formData.max_occupancy),
    facilities: formData.facilities.trim() || null,
    room_status: formData.room_status,
  };
}

function validateRoomForm(formData) {
  const price = Number(formData.price_per_night);
  const maxOccupancy = Number(formData.max_occupancy);

  if (!formData.room_number.trim()) {
    return "Room number is required.";
  }

  if (!Number.isFinite(price) || price <= 0) {
    return "Price per night must be greater than 0.";
  }

  if (!Number.isInteger(maxOccupancy) || maxOccupancy <= 0) {
    return "Maximum occupancy must be a positive whole number.";
  }

  if (!formData.room_status) {
    return "Room status is required.";
  }

  return "";
}

function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [roomsError, setRoomsError] = useState("");

  const [formData, setFormData] = useState(INITIAL_ROOM_FORM);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [isSavingRoom, setIsSavingRoom] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deletingRoomId, setDeletingRoomId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const isEditMode = editingRoomId !== null;

  useEffect(() => {
    let isActive = true;

    async function fetchInitialRooms() {
      try {
        const roomsData = await getRooms();

        if (isActive) {
          setRooms(roomsData);
          setRoomsError("");
        }
      } catch (error) {
        if (isActive) {
          setRoomsError(error.message || "Unable to load rooms.");
        }
      } finally {
        if (isActive) {
          setIsLoadingRooms(false);
        }
      }
    }

    fetchInitialRooms();

    return () => {
      isActive = false;
    };
  }, []);

  async function refreshRooms() {
    const roomsData = await getRooms();
    setRooms(roomsData);
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  function handleEditRoom(room) {
    setEditingRoomId(room.id);
    setFormData(normalizeRoomToForm(room));
    setSaveError("");
    setDeleteError("");
  }

  function handleCancelEdit() {
    setEditingRoomId(null);
    setFormData(INITIAL_ROOM_FORM);
    setSaveError("");
  }

  async function handleSubmitRoom(event) {
    event.preventDefault();

    const validationError = validateRoomForm(formData);

    if (validationError) {
      setSaveError(validationError);
      return;
    }

    setIsSavingRoom(true);
    setSaveError("");

    try {
      const roomPayload = buildRoomPayload(formData);

      if (isEditMode) {
        await updateRoom(editingRoomId, roomPayload);
      } else {
        await createRoom(roomPayload);
      }

      await refreshRooms();
      handleCancelEdit();
    } catch (error) {
      setSaveError(error.message || "Unable to save room.");
    } finally {
      setIsSavingRoom(false);
    }
  }

  function handleAskDelete(roomId) {
    setDeleteConfirmId(roomId);
    setDeleteError("");
  }

  function handleCancelDelete() {
    setDeleteConfirmId(null);
    setDeleteError("");
  }

  async function handleConfirmDelete(roomId) {
    setDeletingRoomId(roomId);
    setDeleteError("");

    try {
      await deleteRoom(roomId);
      await refreshRooms();

      if (editingRoomId === roomId) {
        handleCancelEdit();
      }

      setDeleteConfirmId(null);
    } catch (error) {
      setDeleteError(error.message || "Unable to delete room.");
    } finally {
      setDeletingRoomId(null);
    }
  }

  return (
    <main className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Rooms</p>
          <h1 className="page-title">Manage Rooms</h1>
          <p className="page-description">
            Create, edit, and delete hotel room records from one place.
          </p>
        </div>
      </header>

      <Card>
        <div className="section-header">
          <div>
            <h2>{isEditMode ? "Edit Room" : "Add New Room"}</h2>
            <p>
              {isEditMode
                ? "Update the selected room details."
                : "Add a new room to the hotel inventory."}
            </p>
          </div>

          {isEditMode && (
            <Button type="button" onClick={handleCancelEdit}>
              Cancel Edit
            </Button>
          )}
        </div>

        {saveError && <ErrorMessage message={saveError} />}

        <form className="room-form" onSubmit={handleSubmitRoom}>
          <Input
            id="room_number"
            name="room_number"
            label="Room Number"
            value={formData.room_number}
            onChange={handleInputChange}
            placeholder="Example: 101"
          />

          <Input
            id="room_type"
            name="room_type"
            label="Room Type"
            value={formData.room_type}
            onChange={handleInputChange}
            placeholder="Example: Deluxe"
          />

          <Input
            id="price_per_night"
            name="price_per_night"
            label="Price Per Night"
            type="number"
            value={formData.price_per_night}
            onChange={handleInputChange}
            placeholder="Example: 2500"
          />

          <Input
            id="max_occupancy"
            name="max_occupancy"
            label="Maximum Occupancy"
            type="number"
            value={formData.max_occupancy}
            onChange={handleInputChange}
            placeholder="Example: 2"
          />

          <Input
            id="facilities"
            name="facilities"
            label="Facilities"
            value={formData.facilities}
            onChange={handleInputChange}
            placeholder="Example: Wi-Fi, AC, TV"
          />

          <div className="form-field">
            <label htmlFor="room_status">Room Status</label>
            <select
              id="room_status"
              name="room_status"
              value={formData.room_status}
              onChange={handleInputChange}
            >
              {ROOM_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <Button type="submit" disabled={isSavingRoom}>
              {isSavingRoom
                ? "Saving..."
                : isEditMode
                  ? "Update Room"
                  : "Create Room"}
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <div className="section-header">
          <div>
            <h2>Rooms List</h2>
            <p>View, edit, or delete existing rooms.</p>
          </div>
        </div>

        {deleteError && <ErrorMessage message={deleteError} />}

        {isLoadingRooms && <Loading message="Loading rooms..." />}

        {!isLoadingRooms && roomsError && <ErrorMessage message={roomsError} />}

        {!isLoadingRooms && !roomsError && rooms.length === 0 && (
          <div className="empty-state">
            <h3>No rooms found</h3>
            <p>Create your first room using the form above.</p>
          </div>
        )}

        {!isLoadingRooms && !roomsError && rooms.length > 0 && (
          <div className="rooms-table-wrapper">
            <table className="rooms-table">
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Occupancy</th>
                  <th>Status</th>
                  <th>Facilities</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td>{room.room_number}</td>
                    <td>{room.room_type || "—"}</td>
                    <td>₹{room.price_per_night}</td>
                    <td>{room.max_occupancy || "—"}</td>
                    <td>
                      <span className="status-pill">{room.room_status}</span>
                    </td>
                    <td>{room.facilities || "—"}</td>
                    <td>
                      {deleteConfirmId === room.id ? (
                        <div className="inline-confirm">
                          <span>Delete?</span>

                          <Button
                            type="button"
                            disabled={deletingRoomId === room.id}
                            onClick={() => handleConfirmDelete(room.id)}
                          >
                            {deletingRoomId === room.id ? "Deleting..." : "Yes"}
                          </Button>

                          <Button
                            type="button"
                            disabled={deletingRoomId === room.id}
                            onClick={handleCancelDelete}
                          >
                            No
                          </Button>
                        </div>
                      ) : (
                        <div className="row-actions">
                          <Button
                            type="button"
                            onClick={() => handleEditRoom(room)}
                          >
                            Edit
                          </Button>

                          <Button
                            type="button"
                            onClick={() => handleAskDelete(room.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </main>
  );
}

export default RoomsPage;
```

### Optional CSS Additions

Add these only if your existing CSS does not already cover the layout.

```css
.section-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
}

.section-header p {
  margin: 6px 0 0;
  color: #667085;
}

.room-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.form-field {
  display: grid;
  gap: 8px;
}

.form-field label {
  font-weight: 600;
  color: #344054;
}

.form-field select {
  min-height: 42px;
  border: 1px solid #d0d5dd;
  border-radius: 10px;
  padding: 8px 12px;
  background: #ffffff;
}

.form-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-start;
}

.rooms-table-wrapper {
  overflow-x: auto;
}

.rooms-table {
  width: 100%;
  border-collapse: collapse;
}

.rooms-table th,
.rooms-table td {
  padding: 14px 12px;
  border-bottom: 1px solid #eaecf0;
  text-align: left;
}

.rooms-table th {
  font-size: 13px;
  color: #667085;
  font-weight: 700;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 4px 10px;
  background: #f2f4f7;
  font-size: 13px;
  font-weight: 600;
}

.row-actions,
.inline-confirm {
  display: flex;
  align-items: center;
  gap: 8px;
}

.empty-state {
  padding: 32px;
  text-align: center;
  border: 1px dashed #d0d5dd;
  border-radius: 14px;
  background: #f9fafb;
}

.empty-state h3 {
  margin: 0;
}

.empty-state p {
  margin: 8px 0 0;
  color: #667085;
}
```

---

## 8. Code Walkthrough

### `updateRoom(roomId, roomData)`

```js
export async function updateRoom(roomId, roomData) {
  return apiRequest(`/rooms/${roomId}`, {
    method: "PUT",
    body: roomData,
  });
}
```

This sends updated room data to the backend.

Example:

```js
updateRoom(3, {
  room_number: "103",
  price_per_night: 3000,
  room_status: "Available",
});
```

The backend receives this at:

```text
PUT /rooms/3
```

### `deleteRoom(roomId)`

```js
export async function deleteRoom(roomId) {
  return apiRequest(`/rooms/${roomId}`, {
    method: "DELETE",
  });
}
```

This tells the backend to delete the room with that id.

Example:

```js
deleteRoom(3);
```

The backend receives:

```text
DELETE /rooms/3
```

### `editingRoomId`

```jsx
const [editingRoomId, setEditingRoomId] = useState(null);
```

This tells React whether the form is currently creating or editing.

```jsx
const isEditMode = editingRoomId !== null;
```

- When `isEditMode` is `false`, submit means create.
- When `isEditMode` is `true`, submit means update.

### `handleEditRoom(room)`

```jsx
function handleEditRoom(room) {
  setEditingRoomId(room.id);
  setFormData(normalizeRoomToForm(room));
}
```

This does two things:

- Stores the room id.
- Copies the selected room values into the form.

That is how the edit form becomes pre-filled.

### `handleConfirmDelete(roomId)`

```jsx
await deleteRoom(roomId);
await refreshRooms();
```

After deletion, the frontend does not guess what the new room list should be. It asks the backend again.

That is safer for beginners and keeps FastAPI as the source of truth.

---

## 9. Debugging Tips

### Check PUT Request

Open browser DevTools:

```text
Right click page → Inspect → Network tab
```

Then edit a room and submit.

Check:

- Request Method: `PUT`
- Request URL: `http://localhost:8000/rooms/{id}`
- Payload: `room_number`, `room_type`, `price_per_night`, `max_occupancy`, `facilities`, `room_status`
- Status: `200`

If you get `422`, the request body does not match the backend schema.

If you get `404`, the room id does not exist.

### Check DELETE Request

Click **Delete → Yes**.

In the Network tab, check:

- Request Method: `DELETE`
- Request URL: `http://localhost:8000/rooms/{id}`
- Status: `200`

If delete fails because the room is connected to stays/bookings later, the backend may return an integrity error. That is not part of this milestone yet, but it will matter once booking/stay integration begins.

### Check Backend Logs

Because your SQLAlchemy engine has `echo=True`, backend terminal logs will show SQL queries. That helps confirm whether `UPDATE` or `DELETE` actually reached the database.

---

## 10. Common Mistakes

### Mistake 1: Putting API URLs Directly Inside `RoomsPage.jsx`

Avoid this:

```js
fetch("http://localhost:8000/rooms/1", { method: "DELETE" });
```

Use this instead:

```js
deleteRoom(1);
```

The page should not manage endpoint details.

### Mistake 2: Forgetting to Reset Edit Mode

After update succeeds, call:

```js
handleCancelEdit();
```

Otherwise the form may stay in edit mode and the next submit may accidentally update the old room.

### Mistake 3: Sending String Numbers Without Conversion

Inputs always give values as strings.

So this:

```js
price_per_night: formData.price_per_night
```

is actually a string.

Better:

```js
price_per_night: Number(formData.price_per_night)
```

### Mistake 4: Deleting Without Confirmation

Never perform destructive actions immediately from a single click.

Bad:

```jsx
onClick={() => deleteRoom(room.id)}
```

Better:

```text
Delete → Yes / No
```

### Mistake 5: Moving Room Logic Into Electron

Electron should not update rooms.

React should call FastAPI through the service layer. FastAPI should update SQLite.

---

## 11. Alternative Approaches

### Approach 1: Refetch After Update/Delete

This milestone uses this.

#### Advantages

- Simple.
- Beginner-friendly.
- Backend remains source of truth.
- Avoids stale frontend data.

#### Disadvantage

- Extra `GET` request after every mutation.

Recommended for Milestone 11.

### Approach 2: Update Local State Manually

Example:

```jsx
setRooms((currentRooms) =>
  currentRooms.map((room) =>
    room.id === updatedRoom.id ? updatedRoom : room
  )
);
```

#### Advantages

- Faster UI.
- Fewer network requests.

#### Disadvantage

- More logic.
- More chances for bugs.
- Harder for beginners.

Save this for later.

### Approach 3: Optimistic Update

The UI updates before the backend confirms success.

#### Advantages

- Feels instant.

#### Disadvantage

- If backend fails, frontend must rollback.
- More complex error handling.

Not recommended yet.

---

## 12. Industry Best Practices

For HelloStay V1, use these rules:

- Keep API calls inside service files.
- Keep backend as source of truth.
- Use controlled forms for create/edit.
- Add frontend validation for user experience.
- Trust backend validation for real data safety.
- Use confirmation for destructive actions.
- Refetch after mutation until the app needs more advanced state management.
- Keep Electron out of hotel business logic.
- Avoid premature abstractions.
- Add room-specific components only when `RoomsPage.jsx` becomes difficult to read.

---

## 13. Summary

Milestone 11 adds the missing update/delete pieces to the Rooms module.

You now have the full basic room CRUD flow:

```text
Create → POST /rooms
Read   → GET /rooms
Update → PUT /rooms/{room_id}
Delete → DELETE /rooms/{room_id}
```

This completes the Rooms module foundation, but not the full future room system.

### Still Deferred

- Booking-based availability.
- Room status automation.
- Search/filter/pagination.
- Room images.
- Advanced room forms.
- Optimistic updates.
- Modal system.
- Role-based room permissions.

### Small Quiz

1. Why do we store `editingRoomId` instead of only storing `isEditing`?
2. Why should delete actions require confirmation?
3. Why is refetching rooms after update/delete safer for beginners?
4. Why should Electron not contain room update/delete logic?
