# M14 - Notes

## Milestone 14: Add Guest Creation to the Guests Module

### Objective

Milestone 14 adds **guest creation** to the Guests module.

Milestone 13 allowed the frontend to read guests using:

```http
GET /guests
```

Milestone 14 adds the next small capability:

```http
POST /guests
```

After a guest is created, the frontend should refresh the guest list.

The backend already defines `POST /guests` through the guests router. The route creates a `Guest` using:

- `guest_name`
- `guest_phone_number`
- `guest_address`
- `id_proof_type`
- `id_proof_number`

The request schema confirms that `GuestCreate` requires all five fields.

### Milestone Scope

This milestone should stay focused on:

- Adding `createGuest`
- Adding a simple guest creation form
- Validating required fields
- Showing loading and error states
- Clearing the form after success
- Refreshing the guests list after creation

Do **not** add the following in this milestone:

- Edit guest
- Delete guest
- Guest stay history
- Bookings integration
- OCR
- Upload
- Filters
- Pagination
- Electron backend startup
- Packaging

---

## 1. Problem Analysis

A hotel receptionist needs to register a guest before that guest can later be connected to stays, bookings, billing, or history.

However, the app should not jump directly to full guest management.

A professional frontend usually grows like this:

```text
Read list first
   ↓
Create new record
   ↓
Edit existing record
   ↓
Delete record
   ↓
Connect to other modules
```

That is why Milestone 13 was read-only, and Milestone 14 is only for creating guests.

### Data Flow

```text
User fills guest form
   ↓
React stores form values in state
   ↓
Frontend validates required fields
   ↓
GuestsPage calls guestService.createGuest(formData)
   ↓
guestService calls apiClient
   ↓
apiClient sends POST /guests to FastAPI
   ↓
FastAPI validates and saves guest in SQLite
   ↓
React clears the form
   ↓
React reloads GET /guests
   ↓
Updated guest list appears
```

### Responsibility Split

| Layer | Responsibility |
|---|---|
| React | UI, form state, user interaction, frontend validation |
| FastAPI | Backend validation, database writes, duplicate constraints, final guest record |
| SQLite | Data persistence |
| Electron | Desktop shell only; does not participate in guest creation |

Electron does not participate in this feature.

---

## 2. High-Level Design

Only two main files should be modified:

```text
frontend/src/services/guestService.js
frontend/src/pages/GuestsPage.jsx
```

Optional CSS may be added only if the current Guests page does not already have suitable layout classes.

### Service Layer

```text
guestService.js
  ├── getGuests()
  └── createGuest(guestData)
```

### Page Layer

```text
GuestsPage.jsx
  ├── guests state
  ├── loading state for fetching guests
  ├── error state for fetching guests
  ├── formData / guestForm state for the create form
  ├── formError / createError state for validation and backend create errors
  ├── isCreating state for create button loading
  ├── fetchGuests()
  ├── refreshGuestsAfterCreate()
  ├── handleInputChange()
  ├── validateGuestForm()
  └── handleCreateGuest()
```

### Refetching After Create

Use refetching after create instead of optimistic updates.

```text
POST /guests succeeds
   ↓
Call GET /guests again
```

This is simpler and safer for a beginner milestone because the backend response and database remain the source of truth.

---

## 3. Concepts Involved

### Controlled Components

A controlled component means the input value is controlled by React state.

Example:

```jsx
const [formData, setFormData] = useState({
  guest_name: "",
});

<Input
  value={formData.guest_name}
  onChange={handleInputChange}
/>
```

The input does not privately manage its own value. React owns the value.

### Controlled Component Flow

```text
User types
   ↓
onChange runs
   ↓
React updates state
   ↓
Input shows latest state value
```

This allows validation, clearing the form, disabling submit, and sending clean data to the backend.

### useState

`useState` stores values that can change over time.

In this milestone, state is needed for:

| State | Purpose |
|---|---|
| `guests` | Guest list from backend |
| `isLoading` / `isLoadingGuests` | `GET /guests` loading state |
| `error` / `guestsError` | `GET /guests` error message |
| `guestForm` / `formData` | Form input values |
| `createError` / `formError` | Create-form validation or backend error |
| `isCreating` / `isCreatingGuest` | `POST /guests` loading state |

### onSubmit

A form uses `onSubmit` when the user clicks the submit button or presses Enter.

```jsx
<form onSubmit={handleCreateGuest}>
```

The handler receives an event object:

```jsx
function handleCreateGuest(event) {
  event.preventDefault();
}
```

`preventDefault()` stops the browser from refreshing the page.

Without it, the React app would reload and lose state.

### Frontend Validation vs Backend Validation

Frontend validation improves user experience.

Example:

```text
Guest name is empty
   ↓
Show "Guest name is required"
   ↓
Do not send request
```

Backend validation protects the actual application.

Even if the frontend validates, someone could still send a request manually through Swagger, Postman, or browser DevTools. Therefore, FastAPI and the database remain the final source of truth.

The backend model also marks `guest_phone_number` and `id_proof_number` as unique, meaning duplicates can be rejected by the database.

---

## 4. Folder and File Changes

Keep the milestone changes small:

```text
frontend/
  src/
    services/
      guestService.js        ← edit

    pages/
      GuestsPage.jsx         ← edit

    styles/
      global.css             ← optional small CSS additions only if needed
```

Do not create `GuestForm.jsx` yet unless `GuestsPage.jsx` becomes too large.

The recommended approach for this milestone is to keep the form inside `GuestsPage.jsx`.

---

## 5. Backend Contract

### Endpoint

```http
POST /guests
```

### Request Body

```json
{
  "guest_name": "Amit Sharma",
  "guest_phone_number": "9876543210",
  "guest_address": "Mumbai, Maharashtra",
  "id_proof_type": "Aadhaar",
  "id_proof_number": "1234-5678-9012"
}
```

### Response Body

```json
{
  "id": 1,
  "guest_name": "Amit Sharma",
  "guest_phone_number": "9876543210",
  "guest_address": "Mumbai, Maharashtra",
  "id_proof_type": "Aadhaar",
  "id_proof_number": "1234-5678-9012"
}
```

The backend route creates the SQLAlchemy `Guest`, commits it, refreshes it, and returns the new record.

---

## 6. Implementation

## File 1: `frontend/src/services/guestService.js`

Open:

```text
frontend/src/services/guestService.js
```

The file likely already has `getGuests()` from Milestone 13.

Update it like this:

```js
import { apiRequest } from "./apiClient";

export async function getGuests() {
  return apiRequest("/guests");
}

export async function createGuest(guestData) {
  return apiRequest("/guests", {
    method: "POST",
    body: guestData,
  });
}
```

This assumes `apiClient.js` already converts `body` to JSON.

### Why Use the Service Layer?

Do not write this directly inside `GuestsPage.jsx`:

```js
fetch("http://localhost:8000/guests", ...);
```

Instead:

```text
GuestsPage.jsx
   ↓
guestService.createGuest()
   ↓
apiClient
   ↓
FastAPI
```

Pages should not know low-level API details.

### Verification After Step 1

1. Save `guestService.js`.
2. Run the frontend.
3. Check the terminal for import/export errors.

Do not test the form yet. At this stage, only the service function has been added.

---

## File 2: `frontend/src/pages/GuestsPage.jsx`

Because the exact Milestone 13 `GuestsPage.jsx` may already have a guest list layout, merge the form-related parts instead of blindly replacing everything.

The fixed version below avoids the React Hooks lint issue caused by synchronous `setState` inside `useEffect`.

```jsx
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
```

### Component Prop Note

If `ErrorMessage` uses children instead of a `message` prop, change this:

```jsx
<ErrorMessage message={createError} />
```

to this:

```jsx
<ErrorMessage>{createError}</ErrorMessage>
```

If `Loading` uses children instead of a `message` prop, adjust it the same way.

---

## 7. Optional CSS Additions

Only add these if the current CSS does not already have similar classes.

Open:

```text
frontend/src/styles/global.css
```

Add this near the other module/page styles:

```css
.module-page {
  display: grid;
  gap: 24px;
}

.module-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.module-header h1 {
  margin: 0;
  font-size: 32px;
  line-height: 1.2;
}

.eyebrow-text {
  margin: 0 0 8px;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.module-grid {
  display: grid;
  grid-template-columns: minmax(320px, 420px) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.section-header {
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0 0 6px;
  font-size: 20px;
}

.section-header p {
  margin: 0;
  color: #64748b;
}

.form-grid {
  display: grid;
  gap: 16px;
}

.form-actions {
  display: flex;
  justify-content: flex-start;
  padding-top: 4px;
}

.guest-list {
  display: grid;
  gap: 16px;
}

.guest-card {
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 16px;
  background: #ffffff;
}

.guest-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.guest-card-header h3 {
  margin: 0;
  font-size: 17px;
}

.guest-card-header p {
  margin: 4px 0 0;
  color: #64748b;
}

.guest-avatar {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: #eef2ff;
  color: #3730a3;
  font-weight: 800;
}

.guest-details {
  display: grid;
  gap: 8px;
}

.guest-details p {
  margin: 0;
  color: #475569;
}

.empty-state {
  border: 1px dashed #cbd5e1;
  border-radius: 16px;
  padding: 24px;
  background: #f8fafc;
}

.empty-state h3 {
  margin: 0 0 6px;
}

.empty-state p {
  margin: 0;
  color: #64748b;
}

@media (max-width: 900px) {
  .module-grid {
    grid-template-columns: 1fr;
  }
}
```

This keeps the design desktop-first but still usable on smaller screens.

---

## 8. Code Walkthrough

### `emptyGuestForm`

```jsx
const emptyGuestForm = {
  guest_name: "",
  guest_phone_number: "",
  guest_address: "",
  id_proof_type: "",
  id_proof_number: "",
};
```

This gives one clean object for the default form state.

It is reused when initializing state:

```jsx
const [guestForm, setGuestForm] = useState(emptyGuestForm);
```

It is also reused after successful creation:

```jsx
setGuestForm(emptyGuestForm);
```

This avoids repeating the same object in multiple places.

### `handleInputChange`

```jsx
function handleInputChange(event) {
  const { name, value } = event.target;

  setGuestForm((currentForm) => {
    return {
      ...currentForm,
      [name]: value,
    };
  });
}
```

This is a reusable input handler.

The important part is:

```jsx
[name]: value
```

If the input has:

```jsx
name="guest_name"
```

React updates:

```js
guest_name: value
```

If the input has:

```jsx
name="id_proof_number"
```

React updates:

```js
id_proof_number: value
```

This is why the `name` attribute must exactly match the backend field name.

### `validateGuestForm`

```jsx
function validateGuestForm() {
  if (!guestForm.guest_name.trim()) {
    return "Guest name is required.";
  }

  return "";
}
```

This function returns an error string when invalid.

If everything is valid, it returns an empty string.

Frontend validation gives faster feedback and avoids unnecessary API requests. Backend validation still remains the final authority.

### `handleCreateGuest`

```jsx
async function handleCreateGuest(event) {
  event.preventDefault();
}
```

This prevents browser refresh.

Then validation runs:

```jsx
const validationError = validateGuestForm();

if (validationError) {
  setCreateError(validationError);
  return;
}
```

This stops the submit if a required field is missing.

Then the API call runs:

```jsx
await createGuest(guestPayload);
```

After that:

```jsx
setGuestForm(emptyGuestForm);
await refreshGuestsAfterCreate();
```

This clears the form and refreshes the list.

---

## 9. Why Refetch Instead of Manually Updating State?

You could manually add the new guest to the existing array:

```jsx
setGuests([...guests, newGuest]);
```

That is not necessarily wrong, but it assumes the frontend already has the final backend truth.

For this milestone, refetching is safer:

```jsx
await createGuest(guestPayload);
await refreshGuestsAfterCreate();
```

### Benefits

- Simple
- Reliable
- Backend remains source of truth
- Avoids stale frontend assumptions
- Avoids optimistic update complexity

Optimistic updates are useful later when performance matters more, but they add complexity.

---

## 10. React Hooks Lint Issue and Fix

### Problem

The earlier implementation used:

```jsx
useEffect(() => {
  loadGuests();
}, []);
```

But `loadGuests()` immediately called:

```jsx
setIsLoading(true);
setError("");
```

React ESLint sees this as:

```text
useEffect runs
  ↓
loadGuests() runs immediately
  ↓
setState runs immediately inside the effect
  ↓
lint error
```

React’s lint rule warns against synchronous `setState` inside an effect because it can cause extra render passes and performance issues.

### Correct Fix

Split the logic into two parts:

```text
fetchGuests()
  → only fetches and returns data
  → no setState

useEffect()
  → calls fetchGuests()
  → updates state only after await

refreshGuestsAfterCreate()
  → used after creating a guest
  → can update state because it is called from an event handler
```

This keeps the linter happy and keeps the code beginner-friendly.

### What Changed

The old version did this:

```jsx
useEffect(() => {
  loadGuests();
}, []);
```

And `loadGuests()` immediately called:

```jsx
setIsLoading(true);
setError("");
```

The fixed version does this:

```jsx
useEffect(() => {
  async function loadInitialGuests() {
    const guestsData = await fetchGuests();
    setGuests(guestsData);
    setIsLoading(false);
  }

  loadInitialGuests();
}, []);
```

The key improvement:

```text
No setState happens immediately when useEffect runs.
State updates happen after the async request completes.
```

That satisfies the React Hooks lint rule.

### Why `shouldIgnoreResult` Was Added

This part:

```jsx
let shouldIgnoreResult = false;
```

and this cleanup:

```jsx
return () => {
  shouldIgnoreResult = true;
};
```

protects the component.

Scenario:

```text
GuestsPage opens
  ↓
GET /guests request starts
  ↓
User navigates away before request finishes
  ↓
Request finishes
  ↓
React tries to update state on an unmounted page
```

The cleanup flag prevents that.

---

## 11. Debugging Tips

### Problem: Form Submits but Page Refreshes

Cause:

```jsx
event.preventDefault();
```

is missing.

Fix:

```jsx
async function handleCreateGuest(event) {
  event.preventDefault();
}
```

### Problem: Backend Receives Empty Fields

Check whether every input has the correct `name`.

Example:

```jsx
name="guest_phone_number"
```

must match:

```js
guest_phone_number
```

Do not use:

```js
phoneNumber
```

The backend expects snake_case fields because `GuestCreate` uses snake_case names.

### Problem: Create Request Fails

Open browser DevTools:

1. Right click page.
2. Click **Inspect**.
3. Open the **Network** tab.
4. Submit the form.
5. Click `POST /guests`.
6. Check **Request Payload**.
7. Check **Response**.

Look for:

| Status | Meaning |
|---|---|
| 200 / 201-ish | Success |
| 422 | Validation error from FastAPI |
| 500 | Possible backend/database issue |

The current backend route does not catch database duplicate errors manually. If a duplicate phone number or duplicate ID proof number is submitted, SQLite/SQLAlchemy may produce a backend error rather than a clean `409 Conflict`.

That is acceptable for this frontend milestone. Show the returned error clearly and improve backend duplicate handling in a later backend cleanup milestone.

### Problem: CORS Error

The backend currently allows the React dev server origin:

```text
http://localhost:5173
```

Check that:

- Frontend is running on `http://localhost:5173`
- Backend is running on the expected FastAPI port
- `apiClient` base URL points to the backend

---

## 12. Common Mistakes

### Mistake 1: Calling `POST /guests` Directly in `GuestsPage.jsx`

Avoid:

```js
fetch("http://localhost:8000/guests");
```

Prefer:

```js
await createGuest(guestPayload);
```

Reason: pages should not know low-level API details.

### Mistake 2: Using camelCase Fields

Avoid:

```js
guestName: "Amit"
```

Use:

```js
guest_name: "Amit"
```

The backend schema expects `guest_name`, not `guestName`.

### Mistake 3: Mutating State Directly

Avoid:

```js
guests.push(newGuest);
setGuests(guests);
```

React may not detect the change correctly because the array reference is reused.

Prefer refetching:

```js
await refreshGuestsAfterCreate();
```

or later:

```js
setGuests((currentGuests) => [...currentGuests, newGuest]);
```

For this milestone, use refetching.

### Mistake 4: Adding Edit/Delete Now

Do not add:

- Edit button
- Delete button
- Guest details modal
- Guest stay history
- Booking connection

Those are separate milestones.

### Mistake 5: Moving Guest Logic into Electron

Do not put guest creation in:

- `electron/main.js`
- `electron/preload.js`
- IPC handlers

For this milestone:

```text
React renderer → apiClient → FastAPI
```

Electron only provides the desktop shell. It should not own hotel business logic.

---

## 13. Alternative Approaches

### Approach A: Inline Form inside `GuestsPage.jsx`

Recommended now.

Pros:

- Beginner-friendly
- Easy to see full data flow
- No premature abstraction
- Matches Milestone 14 scope

Cons:

- `GuestsPage.jsx` becomes larger
- Later refactor may be needed

### Approach B: Separate `GuestForm.jsx`

Useful later.

Pros:

- Cleaner `GuestsPage`
- Reusable for edit form later
- Easier to test

Cons:

- More files
- Props become harder for beginners
- Can hide the data flow too early

For Milestone 14, use Approach A unless the file becomes uncomfortable to read.

### Approach C: Modal Form

Not recommended now.

Pros:

- Cleaner page layout
- Common admin UI pattern

Cons:

- Adds modal state
- Adds accessibility concerns
- Adds more UI complexity

The milestone brief prefers a beginner-friendly inline form or panel first.

---

## 14. Industry Best Practices

For this milestone, the professional decisions are:

- Keep API logic in service files
- Keep React focused on UI state
- Keep FastAPI as source of truth
- Validate on frontend for UX
- Validate on backend for correctness
- Refetch after create for reliability
- Do not over-abstract too early
- Do not mix Electron with guest CRUD

Use clear state names:

```js
isLoadingGuests
isCreatingGuest
guestsError
formError
```

These names are better than vague names like:

```js
loading
error
```

because this page has two different async operations:

- Loading guests
- Creating guest

---

## 15. Verification Checklist

After implementing the changes:

1. Save `guestService.js`.
2. Confirm `createGuest` is exported correctly.
3. Save `GuestsPage.jsx`.
4. Check if the ESLint error disappears.
5. Run the frontend.
6. Open the Guests page.
7. Confirm the guest list loads.
8. Submit an empty form and confirm validation appears.
9. Create a valid guest.
10. Confirm the form clears after success.
11. Confirm the new guest appears after creation.
12. Try one duplicate phone/ID case.
13. Inspect the browser Network tab if the request fails.

---

## 16. Summary

Milestone 14 adds only the guest creation foundation.

You will:

1. Add `createGuest()` in `guestService.js`.
2. Add controlled form state in `GuestsPage.jsx`.
3. Validate required fields before submit.
4. Submit `POST /guests` through `guestService`.
5. Show create loading and error states.
6. Clear the form after success.
7. Refresh `GET /guests` after success.

You will not add edit, delete, stay history, booking integration, OCR, upload, filtering, pagination, Electron backend startup, or packaging.

---

## 17. Suggested Next Step

Implement `guestService.createGuest()` first.

Then add only the form state and submit handler in `GuestsPage.jsx`.

After that, test:

- One successful guest creation
- One duplicate phone/ID case from the browser Network tab

The next check should be whether `guestService.js` correctly exports `createGuest`.
