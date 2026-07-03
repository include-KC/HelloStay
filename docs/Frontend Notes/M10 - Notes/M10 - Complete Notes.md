# M10 - Complete Notes

## Working Context

The uploaded Milestone 10 prompt is treated as the working milestone brief and continues from Milestone 9 rather than redesigning the module.

This milestone stays focused on **room creation only**:

- Service-layer `POST` call
- Inline room creation form
- Basic frontend validation
- Form submission
- Room list refresh after successful creation

---

# Part 1: Milestone 10 — Create Room Foundation

## 1. Objective

Milestone 10 adds the **create room foundation** to the existing Rooms module.

In Milestone 9, `RoomsPage` already read rooms from the backend using:

```http
GET /rooms
```

Milestone 10 adds the next natural operation:

```http
POST /rooms
```

The backend already exposes `POST /rooms`, receives a `RoomCreate` schema, saves the room using SQLAlchemy, and returns a `RoomResponse`.

The create endpoint maps these fields into a new `Room` record:

- `room_number`
- `room_type`
- `price_per_night`
- `max_occupancy`
- `facilities`
- `room_status`

---

## 2. Problem Analysis

Right now, the frontend can only display rooms.

That is useful, but hotel staff also need to add new room records.

Example room data:

```text
Room Number: 101
Room Type: Deluxe
Price Per Night: 2500
Max Occupancy: 2
Facilities: AC, Wi-Fi, TV
Room Status: Available
```

React should **not** save this directly to local state as the source of truth.

### Correct Flow

```text
User fills form
   ↓
React validates basic input
   ↓
RoomsPage calls roomService.createRoom()
   ↓
roomService calls apiClient
   ↓
apiClient sends POST /rooms
   ↓
FastAPI validates and saves to SQLite
   ↓
React refreshes GET /rooms
   ↓
Updated room list appears
```

FastAPI remains the **source of truth**.

React only:

- Collects user input
- Sends it to the backend
- Displays the result

---

## 3. High-Level Design

For this milestone, keep the design simple.

```text
RoomsPage.jsx
 ├─ Add Room panel / form
 ├─ Existing rooms list
 ├─ Loading state for fetching rooms
 ├─ Error state for fetching rooms
 ├─ Creating state for submitting form
 └─ Form validation state

roomService.js
 ├─ getRooms()
 └─ createRoom(roomData)
```

### Not Included in This Milestone

Do **not** add:

- Modal
- Edit
- Delete
- Inline status update
- Booking availability logic

An inline card/panel is better for now because it is easier to understand than a modal and fits the beginner-friendly milestone goal.

---

## 4. Concepts Involved

## 4.1 Controlled Components

A controlled component means React state controls the value of an input.

### Example

```jsx
const [roomNumber, setRoomNumber] = useState("");

<input
  value={roomNumber}
  onChange={(event) => setRoomNumber(event.target.value)}
/>
```

The input does not manage its value alone.

React stores the value in state. This gives control over:

- Validation
- Form reset
- Submission

---

## 4.2 Form State

Instead of creating separate state variables for every field, store all form values inside one object.

```jsx
const [formData, setFormData] = useState({
  room_number: "",
  price_per_night: "",
  room_status: "Available",
  room_type: "",
  max_occupancy: "",
  facilities: "",
});
```

This is useful because all fields belong to one form.

---

## 4.3 `onSubmit`

The form uses:

```jsx
<form onSubmit={handleCreateRoom}>
```

When the user clicks the submit button or presses Enter, `handleCreateRoom` runs.

---

## 4.4 `preventDefault`

By default, HTML forms reload the page when submitted.

In React apps, we do not want that.

So we write:

```jsx
event.preventDefault();
```

This stops the browser reload and lets React handle the submission.

---

## 4.5 Frontend Validation vs Backend Validation

Frontend validation improves user experience.

Example:

```text
Room number is required.
```

This can be shown before sending the request.

Backend validation protects the real system.

Even if someone bypasses the frontend, FastAPI still validates the request using the `RoomCreate` schema.

The schema expects:

### Required Fields

- `room_number`
- `price_per_night`
- `room_status`

### Optional Fields

- `room_type`
- `max_occupancy`
- `facilities`

Frontend validation is helpful.

Backend validation is mandatory.

---

## 5. Folder/File Changes

Only two files should change in this milestone:

```text
frontend/
  src/
    services/
      roomService.js        ← add createRoom()

    pages/
      RoomsPage.jsx         ← add create form and submit logic
```

Do not touch Electron files.

Room API logic belongs in React’s service layer, not in the Electron main process.

---

# 6. Step-by-Step Explanation

## Step 1: Update `roomService.js`

The service layer is responsible for API communication.

Your current file probably has something like this:

```js
import { apiRequest } from "./apiClient";

export function getRooms() {
  return apiRequest("/rooms");
}
```

Now add `createRoom`.

```js
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
```

The important idea:

- `RoomsPage` should not know fetch details.
- `RoomsPage` should only call `roomService.createRoom()`.

That keeps the page cleaner and keeps all room API calls in one place.

---

## Step 2: Add Form State in `RoomsPage.jsx`

Inside `RoomsPage`, add initial form state:

```jsx
const initialRoomFormData = {
  room_number: "",
  price_per_night: "",
  room_status: "Available",
  room_type: "",
  max_occupancy: "",
  facilities: "",
};
```

Then inside the component:

```jsx
const [formData, setFormData] = useState(initialRoomFormData);
const [createError, setCreateError] = useState("");
const [isCreating, setIsCreating] = useState(false);
```

Keep fetch loading separate from create loading:

```text
isLoading   → loading rooms list
isCreating  → submitting new room
```

This avoids confusing the user.

The room list may already be visible while only the create button is loading.

---

## Step 3: Add a Reusable Input Change Handler

```jsx
function handleInputChange(event) {
  const { name, value } = event.target;

  setFormData((currentData) => ({
    ...currentData,
    [name]: value,
  }));
}
```

This works because each input has a `name` matching the backend field:

```jsx
<Input name="room_number" />
<Input name="price_per_night" />
<Input name="room_type" />
```

The square bracket syntax:

```jsx
[name]: value
```

means: use the value of the `name` variable as the object key.

So if `name` is `"room_number"`, React updates:

```jsx
room_number: value
```

---

## Step 4: Validate Before Submitting

Create a validation function:

```jsx
function validateRoomForm() {
  if (!formData.room_number.trim()) {
    return "Room number is required.";
  }

  if (!formData.price_per_night.trim()) {
    return "Price per night is required.";
  }

  const price = Number(formData.price_per_night);

  if (Number.isNaN(price) || price <= 0) {
    return "Price per night must be a valid positive number.";
  }

  if (!formData.room_status.trim()) {
    return "Room status is required.";
  }

  if (formData.max_occupancy.trim()) {
    const occupancy = Number(formData.max_occupancy);

    if (!Number.isInteger(occupancy) || occupancy <= 0) {
      return "Max occupancy must be a valid positive whole number.";
    }
  }

  return "";
}
```

Notice that `max_occupancy` is optional in the backend schema.

So we only validate it if the user entered a value.

---

## Step 5: Prepare Request Data

Form values come from inputs as strings.

Example:

```js
price_per_night: "2500"
max_occupancy: "2"
```

But the backend expects numeric values for price and occupancy.

Before sending, convert them:

```jsx
const roomPayload = {
  room_number: formData.room_number.trim(),
  price_per_night: Number(formData.price_per_night),
  room_status: formData.room_status,
  room_type: formData.room_type.trim() || null,
  max_occupancy: formData.max_occupancy
    ? Number(formData.max_occupancy)
    : null,
  facilities: formData.facilities.trim() || null,
};
```

Using `null` for empty optional fields is clearer than sending empty strings.

---

# 7. Implementation

## 7.1 `frontend/src/services/roomService.js`

Update the file like this:

```js
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
```

---

## 7.2 `frontend/src/pages/RoomsPage.jsx`

Adapt this into the current Milestone 9 `RoomsPage`.

Do not rewrite unrelated routing or layout code.

```jsx
import { useEffect, useState } from "react";

import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import Input from "../components/ui/Input.jsx";
import Loading from "../components/ui/Loading.jsx";
import { createRoom, getRooms } from "../services/roomService.js";

const initialRoomFormData = {
  room_number: "",
  price_per_night: "",
  room_status: "Available",
  room_type: "",
  max_occupancy: "",
  facilities: "",
};

function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [roomsError, setRoomsError] = useState("");

  const [formData, setFormData] = useState(initialRoomFormData);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  async function loadRooms() {
    try {
      setIsLoading(true);
      setRoomsError("");

      const roomsData = await getRooms();
      setRooms(roomsData);
    } catch (error) {
      setRoomsError(error.message || "Unable to load rooms.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadRooms();
  }, []);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function validateRoomForm() {
    if (!formData.room_number.trim()) {
      return "Room number is required.";
    }

    if (!formData.price_per_night.trim()) {
      return "Price per night is required.";
    }

    const price = Number(formData.price_per_night);

    if (Number.isNaN(price) || price <= 0) {
      return "Price per night must be a valid positive number.";
    }

    if (!formData.room_status.trim()) {
      return "Room status is required.";
    }

    if (formData.max_occupancy.trim()) {
      const occupancy = Number(formData.max_occupancy);

      if (!Number.isInteger(occupancy) || occupancy <= 0) {
        return "Max occupancy must be a valid positive whole number.";
      }
    }

    return "";
  }

  async function handleCreateRoom(event) {
    event.preventDefault();

    const validationError = validateRoomForm();

    if (validationError) {
      setCreateError(validationError);
      return;
    }

    const roomPayload = {
      room_number: formData.room_number.trim(),
      price_per_night: Number(formData.price_per_night),
      room_status: formData.room_status,
      room_type: formData.room_type.trim() || null,
      max_occupancy: formData.max_occupancy
        ? Number(formData.max_occupancy)
        : null,
      facilities: formData.facilities.trim() || null,
    };

    try {
      setIsCreating(true);
      setCreateError("");

      await createRoom(roomPayload);

      setFormData(initialRoomFormData);
      await loadRooms();
    } catch (error) {
      setCreateError(error.message || "Unable to create room.");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <main className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Rooms</h1>
          <p className="page-description">
            Manage hotel rooms and view their current operational status.
          </p>
        </div>
      </div>

      <Card>
        <h2 className="section-title">Add New Room</h2>

        <form className="form-grid" onSubmit={handleCreateRoom}>
          {createError && <ErrorMessage message={createError} />}

          <Input
            id="room_number"
            name="room_number"
            label="Room Number"
            type="text"
            value={formData.room_number}
            onChange={handleInputChange}
            placeholder="Example: 101"
            disabled={isCreating}
          />

          <Input
            id="room_type"
            name="room_type"
            label="Room Type"
            type="text"
            value={formData.room_type}
            onChange={handleInputChange}
            placeholder="Example: Deluxe"
            disabled={isCreating}
          />

          <Input
            id="price_per_night"
            name="price_per_night"
            label="Price Per Night"
            type="number"
            value={formData.price_per_night}
            onChange={handleInputChange}
            placeholder="Example: 2500"
            disabled={isCreating}
          />

          <Input
            id="max_occupancy"
            name="max_occupancy"
            label="Max Occupancy"
            type="number"
            value={formData.max_occupancy}
            onChange={handleInputChange}
            placeholder="Example: 2"
            disabled={isCreating}
          />

          <div className="form-field">
            <label className="form-label" htmlFor="room_status">
              Room Status
            </label>

            <select
              id="room_status"
              name="room_status"
              className="form-input"
              value={formData.room_status}
              onChange={handleInputChange}
              disabled={isCreating}
            >
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Reserved">Reserved</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          <Input
            id="facilities"
            name="facilities"
            label="Facilities"
            type="text"
            value={formData.facilities}
            onChange={handleInputChange}
            placeholder="Example: AC, Wi-Fi, TV"
            disabled={isCreating}
          />

          <div>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Creating Room..." : "Create Room"}
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <h2 className="section-title">Room List</h2>

        {isLoading && <Loading message="Loading rooms..." />}

        {roomsError && <ErrorMessage message={roomsError} />}

        {!isLoading && !roomsError && rooms.length === 0 && (
          <p className="empty-state">
            No rooms found. Create your first room using the form above.
          </p>
        )}

        {!isLoading && !roomsError && rooms.length > 0 && (
          <div className="room-list">
            {rooms.map((room) => (
              <article className="room-card" key={room.id}>
                <div>
                  <h3>Room {room.room_number}</h3>
                  <p>{room.room_type || "Room type not specified"}</p>
                </div>

                <div>
                  <strong>₹{room.price_per_night}</strong>
                  <p>{room.room_status}</p>
                </div>

                <div>
                  <p>
                    Max Occupancy:{" "}
                    {room.max_occupancy || "Not specified"}
                  </p>
                  <p>{room.facilities || "No facilities listed"}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </Card>
    </main>
  );
}

export default RoomsPage;
```

---

## 7.3 Optional CSS Additions for `global.css`

Only add these if the current styles do not already have similar classes.

```css
.page-content {
  display: grid;
  gap: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.section-title {
  margin: 0 0 16px;
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text, #172033);
}

.form-grid {
  display: grid;
  gap: 16px;
}

.form-field {
  display: grid;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text, #172033);
}

.form-input {
  width: 100%;
  border: 1px solid var(--color-border, #d9deea);
  border-radius: 10px;
  padding: 10px 12px;
  background: #ffffff;
  color: var(--color-text, #172033);
}

.empty-state {
  margin: 0;
  color: var(--color-muted, #65708a);
}

.room-list {
  display: grid;
  gap: 12px;
}

.room-card {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 16px;
  align-items: center;
  border: 1px solid var(--color-border, #d9deea);
  border-radius: 14px;
  padding: 16px;
  background: #ffffff;
}

.room-card h3,
.room-card p {
  margin: 0;
}

.room-card p {
  color: var(--color-muted, #65708a);
}
```

---

# 8. Code Walkthrough

## 8.1 `createRoom(roomData)`

```js
export function createRoom(roomData) {
  return apiRequest("/rooms", {
    method: "POST",
    body: roomData,
  });
}
```

This function hides the API details from `RoomsPage`.

`RoomsPage` should not care whether the app uses `fetch`, Axios, or something else internally.

It only says:

```js
await createRoom(roomPayload);
```

That is clean separation.

---

## 8.2 `formData`

```jsx
const [formData, setFormData] = useState(initialRoomFormData);
```

This stores all form inputs in one object.

### Why This Is Useful

- All room form values belong together.
- Resetting the form is easy.
- Preparing the backend payload is easy.
- Validation is centralized.

---

## 8.3 `handleInputChange`

```jsx
function handleInputChange(event) {
  const { name, value } = event.target;

  setFormData((currentData) => ({
    ...currentData,
    [name]: value,
  }));
}
```

This allows one function to update all inputs.

Important part:

```jsx
...currentData
```

This copies the existing form data.

Without it, every input change would delete the other fields.

---

## 8.4 `handleCreateRoom`

```jsx
async function handleCreateRoom(event) {
  event.preventDefault();
}
```

This prevents page reload.

Then:

```jsx
const validationError = validateRoomForm();
```

This validates before calling the backend.

Then:

```jsx
await createRoom(roomPayload);
```

This sends the `POST` request.

Then:

```jsx
setFormData(initialRoomFormData);
await loadRooms();
```

The form is cleared, and the room list is refreshed from the backend.

---

# 9. Debugging Tips

## 9.1 If the Form Does Not Type Correctly

Check that each input has:

```jsx
value={formData.fieldName}
onChange={handleInputChange}
name="fieldName"
```

The `name` must match the key in `formData`.

---

## 9.2 If the `POST` Request Fails

Open Browser DevTools:

```text
Right click app → Inspect
Go to Network tab
Submit the form
Click the /rooms request
Check:
  - Request Payload
  - Status Code
  - Response Body
```

If the backend returns `422`, it usually means the request body does not match the Pydantic schema.

---

## 9.3 If the Room Is Created but Does Not Appear

Check whether this line runs after creation:

```jsx
await loadRooms();
```

If this is forgotten, the backend may have saved the room, but the frontend list may still show old state.

---

## 9.4 If a CORS Error Appears

The backend currently allows the React dev server origin:

```text
http://localhost:5173
```

Confirm that Vite is still running on:

```text
http://localhost:5173
```

If the frontend port changes, CORS may block the request.

---

# 10. Common Mistakes

## Mistake 1: Calling `/rooms` Directly Inside `RoomsPage`

Avoid this:

```js
fetch("http://localhost:8000/rooms")
```

Use:

```js
createRoom(roomPayload)
```

API calls should stay inside `roomService.js`.

---

## Mistake 2: Using `localStorage` as the Source of Truth

Do not do this:

```js
localStorage.setItem("rooms", JSON.stringify(rooms));
```

Rooms belong in the backend database.

React should fetch them from FastAPI.

---

## Mistake 3: Forgetting `event.preventDefault()`

Without this, the page refreshes and React state resets.

---

## Mistake 4: Sending Numeric Fields as Empty Strings

Avoid sending:

```js
max_occupancy: ""
```

Send:

```js
max_occupancy: null
```

for optional empty fields.

---

## Mistake 5: Adding Edit/Delete Too Early

This milestone is only about create foundation.

Edit/delete will need their own:

- State
- Confirmation UX
- Backend calls
- Error handling

---

# 11. Alternative Approaches

## Approach 1: Inline Form

Recommended for this milestone.

### Pros

- Easy to understand
- Easy to debug
- No modal state
- Good for learning controlled forms

### Cons

- Takes more page space
- Less polished for large modules

---

## Approach 2: Modal Form

Better later.

### Pros

- Cleaner page
- Closer to many admin dashboards
- Good when create/edit share the same UI

### Cons

- Requires modal state
- Requires accessibility handling
- More complexity too early

For Milestone 10, use the inline form.

---

## Approach 3: Optimistic Update

Optimistic update means adding the room to the frontend list immediately before refetching.

Example:

```jsx
const newRoom = await createRoom(roomPayload);
setRooms((currentRooms) => [...currentRooms, newRoom]);
```

This is faster, but it should not be used yet.

For now, refetching is safer:

```jsx
await createRoom(roomPayload);
await loadRooms();
```

This guarantees the UI matches the backend database.

---

# 12. Industry Best Practices

For HelloStay, the best practice is:

- React handles UI.
- `roomService` handles room API calls.
- `apiClient` handles common request behavior.
- FastAPI handles validation and database writes.
- Electron does not handle room business logic.

This separation keeps the project maintainable.

A production-quality frontend usually separates concerns like this:

```text
Page component
  ↓
Service function
  ↓
API client
  ↓
Backend endpoint
  ↓
Database
```

This is exactly the pattern being built now.

---

# 13. Summary

In Milestone 10, the first write operation is added to the Rooms module.

You will:

- Add `createRoom()` to `roomService.js`
- Add controlled form state to `RoomsPage.jsx`
- Validate `room_number`, `price_per_night`, `room_status`, and `max_occupancy`
- Submit room data to `POST /rooms`
- Clear the form after success
- Refresh the room list after success
- Keep edit/delete/status updates for later milestones

This milestone is important because it teaches the full frontend-to-backend write flow.

---

# 14. Small Quizzes

1. Why should `createRoom()` be placed inside `roomService.js` instead of directly inside `RoomsPage.jsx`?
2. Why do we call `event.preventDefault()` inside `handleCreateRoom`?
3. What is the difference between frontend validation and backend validation?
4. Why do we refresh the room list after successful creation instead of manually trusting the old frontend state?
5. Why should the Electron main process not contain `POST /rooms` logic?

---

# 15. Suggested Next Step

Implement Step 1 first:

```text
Update roomService.js with createRoom().
```

Then run the app and confirm there are no import/export errors before editing `RoomsPage.jsx`.

---

# Part 2: Backend Terminal Error — Duplicate Room Number

## 1. Objective

The backend terminal error is not a frontend bug.

The room creation request reached the backend correctly.

The backend error says a room was created with a `room_number` that already exists:

```text
UNIQUE constraint failed: rooms.room_number
```

The failed insert was for room number `101`:

```text
[parameters: ('101', 'Single', 2000.0, 1, 'AC, TV, WIFI', 'Available')]
```

SQLite rejected it because `rooms.room_number` must be unique.

---

## 2. Problem Analysis

The backend `Room` model defines `room_number` like this:

```python
room_number: Mapped[str] = mapped_column(
    String(20),
    nullable=False,
    unique=True
)
```

That means two rooms cannot have the same room number.

This is correct for a hotel system because there should not be two different Room 101 records.

So the request failed because Room 101 already exists in the database.

---

## 3. What to Do Now

For Milestone 10 verification, try creating a room with a new room number.

Example:

```text
Room Number: 102
Room Type: Single
Price Per Night: 2000
Max Occupancy: 1
Facilities: AC, TV, WIFI
Room Status: Available
```

### Expected Result

- `POST /rooms` succeeds.
- Form clears.
- Room 102 appears in the room list.
- Page refresh still shows Room 102.

---

## 4. Important Learning Point

This is actually a good sign.

It proves:

- Frontend form is submitting correctly.
- `POST /rooms` is reaching FastAPI.
- FastAPI is trying to save the room.
- SQLite is protecting `room_number` uniqueness.

The only bad part is that the backend returns:

```text
500 Internal Server Error
```

A duplicate room number is not really a server crash.

It is a user/business validation error.

In a production-quality app, the backend should return something like:

```text
400 Bad Request
```

or:

```text
409 Conflict
```

with a clear message like:

```text
Room number already exists.
```

---

## 5. Should the Backend Be Fixed Now?

For Milestone 10 frontend verification, continue by using a new room number.

But for production quality, the backend should handle this more cleanly.

The simplest backend fix is to check whether the room number already exists before creating the room.

In:

```text
backend/app/api/room.py
```

inside `create_room`, add this before creating `new_room`:

```python
existing_room = db.query(Room)\
    .filter(Room.room_number == room.room_number)\
    .first()

if existing_room is not None:
    raise HTTPException(
        status_code=400,
        detail="Room number already exists."
    )
```

So the `create_room` function becomes:

```python
@router.post("/rooms", response_model=RoomResponse)
def create_room(
    room: RoomCreate,
    db: Session = Depends(get_db)
):
    existing_room = db.query(Room)\
        .filter(Room.room_number == room.room_number)\
        .first()

    if existing_room is not None:
        raise HTTPException(
            status_code=400,
            detail="Room number already exists."
        )

    new_room = Room(
        room_number=room.room_number,
        room_type=room.room_type,
        price_per_night=room.price_per_night,
        max_occupancy=room.max_occupancy,
        facilities=room.facilities,
        room_status=room.room_status
    )

    db.add(new_room)
    db.commit()
    db.refresh(new_room)

    return new_room
```

The `HTTPException` import already exists in the room API file, so this should fit the current backend pattern.

---

## 6. Why This Backend Fix Is Better

### Before

```text
Duplicate room number
  ↓
Database rejects insert
  ↓
SQLAlchemy raises IntegrityError
  ↓
FastAPI returns 500
  ↓
User sees unclear error
```

### After

```text
Duplicate room number
  ↓
Backend checks first
  ↓
FastAPI returns 400
  ↓
Frontend can show "Room number already exists."
```

This gives a much better user experience.

---

## 7. What to Do Immediately

Do this first:

1. Keep the frontend code unchanged.
2. Try creating Room 102 instead of Room 101.
3. Confirm creation succeeds.

Then, as a backend polish step, add the duplicate-room check above.

---

## 8. Summary

The Milestone 10 frontend is working enough to reach the backend.

The error happened because Room 101 already exists, and the database correctly blocks duplicate room numbers.

Next:

1. Test with a unique room number like 102.
2. Improve the backend response so duplicate rooms return a clear validation error instead of a `500` server error.
