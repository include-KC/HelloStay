# M15 - Notes

## 1. Objective

Milestone 15 extends the existing Guests module from:

Read guests → Create guests

to:

Read guests → Create guests → Edit guests → Delete guests

The implementation should remain inside the React renderer:

```text
GuestsPage
    ↓
guestService
    ↓
apiClient
    ↓
FastAPI
    ↓
SQLAlchemy + SQLite
```

Electron’s main process and preload layer do not need changes. FastAPI remains responsible for validation, database writes, uniqueness constraints, and deciding whether an update or deletion is permitted. This matches the Milestone 15 scope and restrictions in your milestone specification.

## 2. Problem Analysis

### What already exists

From Milestones 13 and 14, GuestsPage should already contain:

- Guest list state.
- Initial guest loading.
- Loading, error, empty, and success states.
- A controlled create form.
- Frontend validation.
- A call to guestService.createGuest().
- Refetching after creation.

We should extend that implementation rather than replacing it.

### What the backend supports

The backend exposes:

- PUT /guests/{guest_id}
- DELETE /guests/{guest_id}

The update endpoint:

- Finds the guest.
- Returns 404 when the guest does not exist.
- Uses model_dump(exclude_unset=True).
- Applies only the fields present in the request.
- Commits and returns the updated guest.

The delete endpoint finds the guest, returns 404 when missing, deletes the record, commits, and returns a success message.

The GuestUpdate schema makes all five guest fields optional:

- guest_name: Optional[str] = None
- guest_phone_number: Optional[str] = None
- guest_address: Optional[str] = None
- id_proof_type: Optional[str] = None
- id_proof_number: Optional[str] = None

That is what allows partial updates.

### Important backend limitation

The database model marks both of these fields as unique:

- guest_phone_number
- id_proof_number

However, the uploaded guest routes do not catch SQLAlchemy integrity errors and convert them into a friendly 409 Conflict response. Depending on your global error handling, a duplicate update may currently appear as a generic server error rather than a specific duplicate-field message. The frontend should display a backend message when one exists, but it cannot manufacture a reliable duplicate-field explanation when the backend returns only a generic error.

### Frontend files not included

The backend files and Milestone 15 specification were uploaded, but the current GuestsPage.jsx, guestService.js, apiClient.js, Input.jsx, and Button.jsx were not included.

Therefore, the implementation below is an additive patch direction. Merge these pieces into the current Milestone 14 files instead of replacing the entire page blindly.

## 3. High-Level Design

We need three groups of state.

### Existing page state

- guests
- isLoading
- loadError
- createFormData
- isCreating
- createError

### New edit state

- editingGuest
- editFormData
- editValidationErrors
- isUpdating
- updateError

### New delete state

- deleteConfirmationId
- deletingGuestId
- deleteError

The complete interaction flow becomes:

```text
User clicks Edit
    ↓
Store selected guest in editingGuest
    ↓
Copy guest values into editFormData
    ↓
User changes controlled inputs
    ↓
Validate fields
    ↓
Find changed fields
    ↓
PUT /guests/{id}
    ↓
Refetch guests
    ↓
Close edit mode
```

Deletion becomes:

```text
User clicks Delete
    ↓
Show inline confirmation on that guest
    ↓
User confirms
    ↓
DELETE /guests/{id}
    ↓
Refetch guests
    ↓
Remove confirmation state
```

## 4. Concepts Involved

### Why edit and delete come after read and create

Edit and delete depend on the existing guest list.

Before a guest can be edited or deleted, the frontend must already know:

- The guest’s database ID.
- Their current field values.
- How guests are displayed.
- How errors are handled.
- How the list is refreshed.

Building CRUD in stages reduces the number of simultaneous problems.

### Why the project uses PUT

The backend contract defines:

PUT /guests/{guest_id}

The frontend must follow that contract.

Strictly speaking, many APIs use:

- PUT for replacing a complete resource.
- PATCH for changing only selected fields.

Your backend uses PUT while implementing partial-update behavior through exclude_unset=True. That is acceptable as a project API decision, provided the frontend and backend agree on it. FastAPI documents exclude_unset as a mechanism for receiving partial updates.

### What a partial update means

Suppose the current guest is:

```javascript
{
  guest_name: "Ravi Kumar",
  guest_phone_number: "9876543210",
  guest_address: "Delhi",
  id_proof_type: "Aadhaar",
  id_proof_number: "123456789012",
}
```

The user only changes the address.

A partial request can send:

```javascript
{
  guest_address: "New Delhi",
}
```

Because the backend uses exclude_unset=True, omitted fields are left unchanged.

For this milestone, we will keep all edit inputs visible and required but send only fields that actually changed.

### Controlled edit inputs

An edit input is controlled when React state owns its current value:

```jsx
<Input
  name="guest_name"
  value={editFormData.guest_name}
  onChange={handleEditInputChange}
/>
```

When the user types:

- onChange runs.
- State is updated.
- React renders again.
- The input receives the latest value from state.

React requires an onChange handler when an input is controlled using value.

### Why editingGuest is needed

editingGuest answers two questions:

- Which guest is currently being edited?
- What were that guest’s original values?

The original values help us:

- Pre-fill the form.
- Know which ID to update.
- Compare original and edited values.
- Detect when nothing changed.
- Close the correct edit session.

### Why delete confirmation is necessary

Deletion is destructive. A misplaced click should not immediately remove a guest.

An inline confirmation is appropriate because:

- It is easier than introducing modal infrastructure.
- The confirmation remains visually connected to the correct guest.
- It avoids modal state and focus-management complexity.
- It follows the milestone’s beginner-friendly direction.

## 5. Folder/File Changes

No new package is required.

Recommended changes:

```text
frontend/
└── src/
    ├── services/
    │   └── guestService.js       modify
    │
    ├── pages/
    │   └── GuestsPage.jsx        modify
    │
    └── styles/
        └── global.css            add small guest action styles
```

Do not modify:

- electron/
- DashboardLayout.jsx
- AppRoutes.jsx
- ProtectedRoute.jsx
- roomService.js
- RoomsPage.jsx
- FastAPI guest routes

A separate GuestForm.jsx is optional. Because the current frontend files were not uploaded, the safest milestone direction is to keep the edit additions in GuestsPage.jsx first. Extract them only when the page becomes difficult to read.

## 6. Step-by-Step Explanation

### Step 1 — Add service functions

guestService.js should own all guest endpoint paths.

GuestsPage should not contain:

fetch("http://localhost:8000/guests/1")

It should contain:

guestService.updateGuest(guestId, guestData)

This means URL construction and HTTP methods remain outside the UI.

### Step 2 — Add edit state

Add state for:

- The selected guest.
- The edit form values.
- Edit validation errors.
- Update loading.
- Update request errors.

Do not reuse creation loading and error state for editing. Creation and editing are separate operations and may occur at different times.

### Step 3 — Start editing

When Edit is clicked:

```javascript
setEditingGuest(guest);
setEditFormData({
  guest_name: guest.guest_name,
  ...
});
```

Create a new object rather than storing the guest object directly as editable form state.

This avoids accidentally treating list data and form data as the same object.

### Step 4 — Handle edit input changes

Use one change handler for all fields:

```javascript
const { name, value } = event.target;
```

Then update only the changed property using computed property syntax:

```javascript
[name]: value
```

### Step 5 — Validate

All five fields must contain non-whitespace text.

Frontend validation improves the user experience by catching obvious problems before a request. Backend validation remains authoritative because frontend code can be bypassed.

### Step 6 — Build a partial payload

Compare normalized form values against editingGuest.

Only include changed fields:

```javascript

{
  guest_address: "Updated address"
}
```

If nothing changed, do not send an unnecessary request.

### Step 7 — Submit the update

The handler should:

- Prevent normal form submission.
- Validate.
- Build the changed-field payload.
- Set update loading.
- Clear the previous update error.
- Call guestService.updateGuest().
- Refetch guests.
Exit edit mode.
Clear loading in finally.

### Step 8 — Add inline delete confirmation

One state variable tracks which guest is awaiting confirmation:

deleteConfirmationId

When its value equals a guest ID, show:

Delete Ravi Kumar?
[Confirm delete] [Cancel]

### Step 9 — Delete and refetch

When deletion succeeds:

- Refetch guests from FastAPI.
- Close confirmation.
- Close edit mode if the deleted guest was being edited.

Refetching is safer than manually removing the record because the server remains the source of truth.

### Step 10 — Verify in layers

Verify:

- Backend endpoints through Swagger.
- Service calls through the Network tab.
- UI state transitions.
- Data persistence after page refresh.

## 7. Implementation

### 7.1 Modify guestService.js

Keep the existing imports, getGuests(), and createGuest().

Add only these two functions.

The following assumes your existing apiClient accepts an object as body and serializes it, which should already be true if Milestone 14’s createGuest() works.

```javascript
import { apiRequest } from "./apiClient.js";

// Keep your existing getGuests function.
export function getGuests() {
  return apiRequest("/guests");
}

// Keep your existing createGuest function.
export function createGuest(guestData) {
  return apiRequest("/guests", {
    method: "POST",
    body: guestData,
  });
}

export function updateGuest(guestId, guestData) {
  return apiRequest(`/guests/${guestId}`, {
    method: "PUT",
    body: guestData,
  });
}

export function deleteGuest(guestId) {
  return apiRequest(`/guests/${guestId}`, {
    method: "DELETE",
  });
}
```

Your project may instead export a service object:

```javascript
const guestService = {
  getGuests,
  createGuest,
  updateGuest,
  deleteGuest,
};

export default guestService;
```

Follow the export style that GuestsPage already uses. Do not mix default and named imports unnecessarily.

### Verification after Step 1

The frontend should still compile.

Open Browser DevTools and run the existing application. At this point, no PUT or DELETE request should happen because the UI does not call the functions yet.

### 7.2 Add reusable guest helpers to GuestsPage.jsx

Place these outside GuestsPage, near the top of the file.

```javascript
const GUEST_FIELD_NAMES = [
  "guest_name",
  "guest_phone_number",
  "guest_address",
  "id_proof_type",
  "id_proof_number",
];

const EMPTY_GUEST_FORM = {
  guest_name: "",
  guest_phone_number: "",
  guest_address: "",
  id_proof_type: "",
  id_proof_number: "",
};

function normalizeGuestForm(formData) {
  return {
    guest_name: formData.guest_name.trim(),
    guest_phone_number: formData.guest_phone_number.trim(),
    guest_address: formData.guest_address.trim(),
    id_proof_type: formData.id_proof_type.trim(),
    id_proof_number: formData.id_proof_number.trim(),
  };
}

function validateGuestForm(formData) {
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

function getChangedGuestFields(formData, originalGuest) {
  return GUEST_FIELD_NAMES.reduce((changedFields, fieldName) => {
    if (formData[fieldName] !== originalGuest[fieldName]) {
      changedFields[fieldName] = formData[fieldName];
    }

    return changedFields;
  }, {});
}
```

If Milestone 14 already has EMPTY_GUEST_FORM, normalization, or validation helpers, reuse them rather than creating duplicates.

For example, both create and edit submission can call:

```javascript
const normalizedForm = normalizeGuestForm(formData);
const validationErrors = validateGuestForm(normalizedForm);
```

### 7.3 Add edit and delete state

Inside GuestsPage:

```javascript
const [editingGuest, setEditingGuest] = useState(null);
const [editFormData, setEditFormData] = useState(EMPTY_GUEST_FORM);
const [editValidationErrors, setEditValidationErrors] = useState({});
const [isUpdating, setIsUpdating] = useState(false);
const [updateError, setUpdateError] = useState("");

const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
const [deletingGuestId, setDeletingGuestId] = useState(null);
const [deleteError, setDeleteError] = useState("");
```

### Why use deletingGuestId instead of only isDeleting?

Because an ID lets the UI identify the exact guest whose delete button should display:

Deleting...

### 7.4 Add edit handlers

```javascript
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
}
```

The functional state form:

setEditFormData((currentFormData) => ...)

uses the most recent state value. It is safer when updates may be batched.

### 7.5 Add the update handler

Use the existing loadGuests() function from Milestone 13.

```javascript
async function handleUpdateGuest(event) {
  event.preventDefault();

  if (!editingGuest) {
    return;
  }

  const normalizedFormData = normalizeGuestForm(editFormData);
  const validationErrors = validateGuestForm(normalizedFormData);

  if (Object.keys(validationErrors).length > 0) {
    setEditValidationErrors(validationErrors);
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

    await guestService.updateGuest(editingGuest.id, changedGuestData);
    await loadGuests();

    setEditingGuest(null);
    setEditFormData(EMPTY_GUEST_FORM);
  } catch (error) {
    setUpdateError(
      error.message || "The guest could not be updated. Please try again.",
    );
  } finally {
    setIsUpdating(false);
  }
}
```

This sends only changed fields.

For example:

```javascript
{
  guest_phone_number: "9999999999",
}
```

It does not send the guest ID in the request body because the ID is already part of the URL:

/guests/7

### 7.6 Add the edit panel JSX

Place this near the existing create panel or immediately above the guest list.

```jsx
{editingGuest && (
  <Card className="guest-edit-panel">
    <div className="guest-edit-panel__header">
      <div>
        <p className="section-eyebrow">Editing guest</p>
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
      <Input
        id="edit-guest-name"
        name="guest_name"
        label="Guest name"
        value={editFormData.guest_name}
        onChange={handleEditInputChange}
        disabled={isUpdating}
        error={editValidationErrors.guest_name}
      />

      <Input
        id="edit-guest-phone-number"
        name="guest_phone_number"
        label="Phone number"
        value={editFormData.guest_phone_number}
        onChange={handleEditInputChange}
        disabled={isUpdating}
        error={editValidationErrors.guest_phone_number}
      />

      <Input
        id="edit-guest-address"
        name="guest_address"
        label="Address"
        value={editFormData.guest_address}
        onChange={handleEditInputChange}
        disabled={isUpdating}
        error={editValidationErrors.guest_address}
      />

      <Input
        id="edit-id-proof-type"
        name="id_proof_type"
        label="ID proof type"
        value={editFormData.id_proof_type}
        onChange={handleEditInputChange}
        disabled={isUpdating}
        error={editValidationErrors.id_proof_type}
      />

      <Input
        id="edit-id-proof-number"
        name="id_proof_number"
        label="ID proof number"
        value={editFormData.id_proof_number}
        onChange={handleEditInputChange}
        disabled={isUpdating}
        error={editValidationErrors.id_proof_number}
      />

      {updateError && <ErrorMessage message={updateError} />}

      <div className="guest-form__actions">
        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? "Saving changes..." : "Save changes"}
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
  </Card>
)}
```

Your existing Input might use a prop such as:

errorMessage={...}

or:

helperText={...}

instead of error. Use the API already defined by your Input.jsx. Do not change the global component merely to match this example.

The same applies to Button variants. Use the existing Button API.

### 7.7 Add delete handlers

```javascript
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

    await guestService.deleteGuest(guest.id);
    await loadGuests();

    if (editingGuest?.id === guest.id) {
      setEditingGuest(null);
      setEditFormData(EMPTY_GUEST_FORM);
      setEditValidationErrors({});
      setUpdateError("");
    }

    setDeleteConfirmationId(null);
  } catch (error) {
    setDeleteError(
      error.message || "The guest could not be deleted. Please try again.",
    );
  } finally {
    setDeletingGuestId(null);
  }
}
```

We pass the complete guest object to the confirm handler so that we have both:

guest.id
guest.guest_name

available to the UI and handler.

### 7.8 Add actions to each guest card or row

Inside the existing guest .map():

```jsx
{guests.map((guest) => {
  const isConfirmingDelete = deleteConfirmationId === guest.id;
  const isDeletingThisGuest = deletingGuestId === guest.id;

  return (
    <Card key={guest.id} className="guest-card">
      {/* Keep the existing guest details here. */}

      <div className="guest-card__actions">
        <Button
          type="button"
          onClick={() => handleStartEdit(guest)}
          disabled={isUpdating || deletingGuestId !== null}
        >
          Edit
        </Button>

        {!isConfirmingDelete && (
          <Button
            type="button"
            onClick={() => handleRequestDelete(guest.id)}
            disabled={isUpdating || deletingGuestId !== null}
            className="button-danger-outline"
          >
            Delete
          </Button>
        )}
      </div>

      {isConfirmingDelete && (
        <div className="inline-delete-confirmation">
          <p>
            Delete <strong>{guest.guest_name}</strong>? This action cannot be
            undone.
          </p>

          <div className="inline-delete-confirmation__actions">
            <Button
              type="button"
              onClick={() => handleConfirmDelete(guest)}
              disabled={isDeletingThisGuest}
              className="button-danger"
            >
              {isDeletingThisGuest ? "Deleting..." : "Confirm delete"}
            </Button>

            <Button
              type="button"
              onClick={handleCancelDelete}
              disabled={isDeletingThisGuest}
            >
              Cancel
            </Button>
          </div>

          {deleteError && <ErrorMessage message={deleteError} />}
        </div>
      )}
    </Card>
  );
})}
```

### Small improvement for error placement

The current deleteError is shared by the page. Because only one confirmation can be open, this is acceptable for Milestone 15.

Do not introduce an object such as:

deleteErrorsByGuestId

yet. That would add complexity without providing meaningful value.

### 7.9 Add minimal CSS

Add these styles to the appropriate existing stylesheet. Do not replace your current guest styles.

```css
.guest-edit-panel {
  display: grid;
  gap: 20px;
}

.guest-edit-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.guest-card__actions,
.guest-form__actions,
.inline-delete-confirmation__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.guest-card__actions {
  margin-top: 18px;
}

.inline-delete-confirmation {
  display: grid;
  gap: 12px;
  margin-top: 16px;
  padding: 14px;
  border: 1px solid var(--danger-border, #f1aeb5);
  border-radius: 10px;
  background: var(--danger-surface, #fff5f5);
}

.inline-delete-confirmation p {
  margin: 0;
}

.button-danger {
  border-color: var(--danger-color, #b42318);
  background: var(--danger-color, #b42318);
  color: #ffffff;
}

.button-danger-outline {
  border-color: var(--danger-color, #b42318);
  background: transparent;
  color: var(--danger-color, #b42318);
}
```

Prefer existing design tokens where available. Do not create competing color systems if global.css already defines danger colors.

### 7.10 Verification

No new dependency installation is required.

Run the backend using the existing command from your backend milestones. A typical command is:

```bash
uvicorn app.main:app --reload
```

This starts FastAPI and reloads it when Python files change.

Run the React frontend from the frontend directory:

```bash
npm run dev
```

This starts the Vite development server.

Use the existing desktop command only after browser verification succeeds:

```bash
npm run desktop
```

The browser is easier for this milestone because its Network panel clearly exposes PUT and DELETE requests.

Test these scenarios:

- Edit only the address.
- Verify the PUT request body contains only guest_address.
- Refresh the page and confirm the address persisted.
- Open edit mode and cancel.
- Open edit mode without changing anything and submit.
- Empty each required field and verify frontend errors.
- Change phone number to another guest’s phone number.
- Delete a guest and confirm the inline warning appears first.
- Cancel deletion.
- Confirm deletion and refresh the page.
- Attempt to delete an already-deleted guest through Swagger and confirm 404.
- Stop the backend and verify update/delete show an error rather than crashing the page.

## 8. Code Walkthrough

### Service functions

export function updateGuest(guestId, guestData)
- guestId identifies the resource.
- guestData is the update payload.
- Template literals generate /guests/7.
- method: "PUT" selects the backend update route.
- export function deleteGuest(guestId)
- Uses the same ID.
- Sends no body.
- Selects DELETE.

### Pre-filling edit state

setEditingGuest(guest);
setEditFormData({ ... });

These perform different jobs.

editingGuest is the original server record.

editFormData is the editable working copy.

Conceptually:

editingGuest = snapshot before changes
editFormData = values currently visible in inputs

### Controlled form change handler

```javascript
setEditFormData((currentFormData) => ({
  ...currentFormData,
  [name]: value,
}));
```

The spread operator copies existing fields.

The computed property:

[name]

updates whichever input emitted the event.

For example, when:

name === "guest_address"

the result becomes:

```javascript
{
  ...currentFormData,
  guest_address: value,
}
```

### Changed field detection

if (formData[fieldName] !== originalGuest[fieldName])

This compares the edited value against the original value.

Only changed properties are added to changedFields.

### Async update handling

```javascript
try {
  ...
} catch (error) {
  ...
} finally {
  ...
}
```

try contains the operation that may fail.
catch handles request failures.
finally always restores loading state.

### Why await loadGuests()

The update response already contains the updated guest, so we could replace the matching item locally.

However, refetching is better for this milestone because:

FastAPI remains the source of truth.
The server may normalize or transform values.
It matches the create and Rooms patterns.
It avoids array replacement bugs.
It is easier to verify.

### Why not optimistic updates

An optimistic update changes the UI before the backend confirms success.

That can feel faster, but it introduces rollback logic:

```text
Update UI immediately
    ↓
Request fails
    ↓
Restore old guest
    ↓
Restore edit state
    ↓
Explain failure
```

That complexity is not appropriate until the basic server-confirmed flow is stable.

## 9. Debugging Tips

### PUT request never appears

Open DevTools:

Network → Fetch/XHR

Check whether clicking Save creates:

PUT /guests/{id}

When no request appears, inspect:

- Did onSubmit={handleUpdateGuest} get added?
- Is the save button type="submit"?
- Is validation returning early?
- Is editingGuest still null?
- Did the form submit handler throw before the service call?

### The browser sends POST instead of PUT

Check guestService.updateGuest().

It must contain:

method: "PUT"

Also verify handleUpdateGuest calls:

guestService.updateGuest(...)

and not:

guestService.createGuest(...)

### Request URL contains undefined

A request such as:

/guests/undefined

means the selected object does not contain the expected ID.

Inspect:

console.log(editingGuest);

The backend response field is named:

id

not:

guest_id

### FastAPI returns 422

Open the failed request and inspect:

- Network → Request Payload
- Network → Response

Compare payload field names against GuestUpdate:

- guest_name
- guest_phone_number
- guest_address
- id_proof_type
- id_proof_number

The frontend field names must match the backend schema exactly.

### Duplicate values fail with an unclear error

The database has unique constraints, but the route does not currently catch and convert integrity errors. Inspect:

- FastAPI terminal traceback.
- Browser response status.
- Response body.
- Existing apiClient error parsing.

Do not hardcode this frontend message solely by checking for status 500:

Phone number already exists

A 500 could represent many unrelated problems.

Backend hardening should later convert uniqueness violations into a predictable response such as:

```json
{
  "detail": "A guest with this phone number already exists."
}
```

### Delete fails for a guest linked to a stay

The junction table declares ondelete="CASCADE" for guest_id, and SQLite foreign-key enforcement is explicitly enabled. This indicates that deleting a guest is intended to remove associated junction records. Test this behavior through Swagger before relying on it in the UI.

If deletion still fails, inspect the FastAPI terminal and SQLAlchemy relationship configuration. Keep the frontend behavior simple: display the backend error and leave the guest visible.

### UI remains in edit mode after delete

After successful deletion, verify this condition exists:

```javascript
if (editingGuest?.id === guest.id) {
  setEditingGuest(null);
}
```

### React warning about controlled inputs

Every controlled input should always receive a string:

guest.guest_name ?? ""

Avoid passing undefined initially and a string later.

## 10. Common Mistakes

### Mutating the selected guest

Do not do:

editingGuest.guest_name = value;

React state should be replaced with a new object.

### Using one form state for create and edit without a clear mode

This can accidentally:

- Clear the creation form when edit is cancelled.
- Submit to the wrong endpoint.
- Show update errors inside creation.
- Keep stale values when switching modes.

A reusable GuestForm can come later. Separate create/edit state is clearer for the current milestone.

### Sending the ID in the body unnecessarily

Avoid:

```javascript
{
  id: editingGuest.id,
  guest_name: "...",
}
```

The backend receives the ID through the URL.

### Forgetting preventDefault

Without:

event.preventDefault();

the browser may perform a traditional form submission and reload the page.

### Clearing edit mode before the request succeeds

Do not close the form immediately after clicking Save.

The user should retain their values if the backend rejects the request.

### Using array index as the React key

Avoid:

key={index}

Use:

key={guest.id}

The database ID identifies the guest across refetches.

### Deleting immediately from the first click

A destructive action must require confirmation.

### Calling FastAPI directly from Electron main

Guest CRUD belongs in:

React renderer → service → apiClient → FastAPI

The Electron main process should remain responsible for desktop lifecycle and native capabilities, not hotel business operations.

## 11. Alternative Approaches

### Reuse one GuestForm component

A reusable form might accept:

```jsx
<GuestForm
  title="Edit guest"
  formData={editFormData}
  errors={editValidationErrors}
  isSubmitting={isUpdating}
  submitLabel="Save changes"
  onChange={handleEditInputChange}
  onSubmit={handleUpdateGuest}
  onCancel={handleCancelEdit}
/>
```

Advantages:

- Less duplicated JSX.
- Consistent create/edit fields.
- Easier future field additions.

Disadvantages:

- More props for a beginner to understand.
- Requires safely refactoring working creation code.
- Can hide differences between create and edit workflows.

Recommendation: Keep the current create form stable and add the edit panel first. Extract GuestForm during the next Guests UX cleanup milestone.

### Modal editing

Advantages:

- Keeps the page compact.
- Visually isolates editing.

Disadvantages:

- Requires overlay, focus, Escape-key, scrolling, and accessibility handling.
- Adds more UI complexity than the milestone needs.

Recommendation: Use an inline edit panel.

### Local state replacement instead of refetching

You could update one guest locally:

```javascript
setGuests((currentGuests) =>
  currentGuests.map((guest) =>
    guest.id === updatedGuest.id ? updatedGuest : guest,
  ),
);
```

And delete locally:

```javascript
setGuests((currentGuests) =>
  currentGuests.filter((guest) => guest.id !== deletedGuestId),
);
```

This saves requests but requires more frontend correctness.

Recommendation: Continue refetching in Milestone 15.

### Send every field during update

This is simpler:

await guestService.updateGuest(editingGuest.id, normalizedFormData);

It will work with the current backend.

However, building a changed-field payload demonstrates the backend’s partial-update contract and avoids sending unchanged data.

## 12. Industry Best Practices

### Keep HTTP knowledge in services

Pages should express user intent:

updateGuest(id, data)

They should not repeatedly reconstruct URLs and request options.

### Separate operation states

Use different state for:

- Initial loading.
- Creation.
- Updating.
- Deleting.

This prevents one operation from disabling unrelated parts of the interface.

### Preserve user input after failure

When an update fails, keep:

- Edit mode open.
- Current form values.
- The backend error visible.

Do not force the user to re-enter everything.

### Disable duplicate submissions

Disable Save while isUpdating and Confirm Delete while the matching guest is deleting.

### Prefer server-confirmed mutations first

Optimistic behavior should be introduced only after:

- API errors are predictable.
- Rollback behavior is designed.
- Automated tests cover state restoration.

### Improve backend error contracts later

A production backend should normally:

- Catch IntegrityError.
- Roll back the session.
- Identify the violated constraint.
- Return a consistent 409 Conflict.
- Provide a user-safe detail.

This is backend hardening and should not be mixed into the frontend milestone unless update testing proves it is necessary.

### Preserve module boundaries

React:
Forms, selected guest, loading, errors, confirmation UI

guestService:
Guest endpoint functions

apiClient:
Base URL, headers, authentication, JSON parsing, normalized request errors

FastAPI:
Guest validation, persistence, uniqueness, authorization, relationships

Electron:
Desktop lifecycle and secure native integration

## 13. Summary

Milestone 15 should add:

- guestService.updateGuest().
- guestService.deleteGuest().
- Selected guest state.
- Pre-filled controlled edit form.
- Shared guest validation.
- Partial update payload construction.
- Update loading and error states.
- Edit cancellation.
- Edit and Delete actions on each guest.
- Inline delete confirmation.
- Per-guest delete loading.
- Refetching after successful update and delete.
- Clear backend failure display.

Do not add:

- Guest stay history.
- Booking integration.
- Search or pagination.
- Modal infrastructure.
- Optimistic updates.
- Electron CRUD logic.
- Advanced component abstractions.

## 14. Suggested Next Step

Implement only the two service functions first and verify that the frontend still compiles. Then add the edit state and edit panel before introducing deletion. This keeps update and delete debugging separate and makes the milestone easier to understand.

---

## Follow-up Code Review: Pasted code.js

JavaScript
Is this code is correct, If not the give me the complete corrected code
Worked for 1m 21s

### Objective

The uploaded code is not correct yet. The main problems are:

- React Hooks are declared outside GuestsPage, which causes an invalid Hook call.
- EMPTY_GUEST_FORM is used before it is declared.
- Two different functions are named validateGuestForm.
- updateGuest and deleteGuest are not imported.
- guestService is referenced but never imported or declared.
- loadGuests() does not exist.
- The guest list is mapped twice, creating duplicate cards and invalid JSX.
- emptyGuestForm and EMPTY_GUEST_FORM duplicate the same object.

Replace the relevant files with the following corrected versions.

### 1. Corrected guestService.js

Keep using the same apiRequest pattern that already works for GET and POST.

```javascript
import { apiRequest } from "./apiClient.js";

export function getGuests() {
  return apiRequest("/guests");
}

export function createGuest(guestData) {
  return apiRequest("/guests", {
    method: "POST",
    body: guestData,
  });
}

export function updateGuest(guestId, guestData) {
  return apiRequest(`/guests/${guestId}`, {
    method: "PUT",
    body: guestData,
  });
}

export function deleteGuest(guestId) {
  return apiRequest(`/guests/${guestId}`, {
    method: "DELETE",
  });
}
```

Do not use both named exports and a guestService object unless the rest of your project already follows that pattern.

### 2. Complete Corrected GuestsPage.jsx

```jsx
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
  const [error, setError] = useState("");

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
      } catch (requestError) {
        if (shouldIgnoreResult) {
          return;
        }

        setGuests([]);
        setError(
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
    setError("");
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

      await createGuest(normalizedGuestData);

      setGuestForm(EMPTY_GUEST_FORM);

      try {
        await refreshGuests();
      } catch (refreshError) {
        setError(
          refreshError.message ||
            "The guest was created, but the guest list could not be refreshed.",
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

      await updateGuest(editingGuest.id, changedGuestData);

      setEditingGuest(null);
      setEditFormData(EMPTY_GUEST_FORM);

      try {
        await refreshGuests();
      } catch (refreshError) {
        setError(
          refreshError.message ||
            "The guest was updated, but the guest list could not be refreshed.",
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
      } catch (refreshError) {
        setError(
          refreshError.message ||
            "The guest was deleted, but the guest list could not be refreshed.",
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
```

### 3. CSS Additions

Add these styles to the stylesheet that currently contains the Guests module styles. Do not replace the existing CSS.

```css
.guest-edit-panel {
  display: grid;
  gap: 20px;
}

.guest-edit-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.guest-form__field {
  display: grid;
  gap: 6px;
}

.field-error {
  margin: 0;
  color: #b42318;
  font-size: 0.875rem;
}

.guest-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.inline-delete-confirmation {
  display: grid;
  gap: 12px;
  margin-top: 16px;
  padding: 14px;
  border: 1px solid #f1aeb5;
  border-radius: 10px;
  background: #fff5f5;
}

.inline-delete-confirmation p {
  margin: 0;
}

.inline-delete-confirmation__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.button-danger {
  border-color: #b42318;
  background: #b42318;
  color: #ffffff;
}

.button-danger-outline {
  border-color: #b42318;
  background: transparent;
  color: #b42318;
}
```

### Verification

After replacing the code:

- Create a guest and confirm the list refreshes.
- Click Edit and verify the current values appear.
- Change one value and save.
- Open DevTools → Network and confirm a PUT /guests/{id} request.
- Click Delete and verify deletion does not happen immediately.
- Confirm deletion and verify a DELETE /guests/{id} request.
- Refresh the browser and verify the changes remain.

### Small Quiz

- Why must useState be inside GuestsPage?
- Why do we store both editingGuest and editFormData?
- Why is the guest list mapped only once?
- Why does the delete flow require confirmation?
