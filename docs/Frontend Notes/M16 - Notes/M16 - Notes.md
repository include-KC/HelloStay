# M16 - Notes

## Frontend Milestone 16: Guests Module UX Refinement and Code Cleanup

**Status:** In Progress  
**Primary goal:** Improve the existing Guests module without changing its completed CRUD behavior.

---

## 1. Milestone Objective

Milestone 16 is a **controlled refactoring and UX-improvement milestone**, not a feature-development milestone.

The work should:

- Preserve guest loading, creation, updating, and deletion.
- Make `GuestsPage` easier to understand and maintain.
- Separate page coordination from reusable guest presentation only where it improves clarity.
- Improve create, edit, delete, loading, error, and empty-state experiences.
- Keep the design consistent with the completed Rooms module and `DashboardLayout`.
- Protect the existing backend contract.
- Avoid replacing working code based on assumptions.

Because the latest working frontend source was not included in the original milestone brief, the correct first step is to inspect the actual implementation before changing it.

---

## 2. Scope and Boundaries

### In Scope

- Guest CRUD UX refinement
- Code cleanup and duplication removal
- Operation-specific loading and error states
- Form-validation consistency
- Component extraction where justified
- Accessibility improvements
- CSS cleanup directly related to the Guests module
- Browser and Electron regression testing
- ESLint verification

### Out of Scope

Do not add:

- `GuestStay` integration
- Booking relationships
- Stay history
- Pagination
- Advanced filtering
- Search unless separately approved
- File uploads or OCR
- New backend endpoints
- Electron backend-startup logic
- New database behavior
- Unrelated Rooms-module changes

---

## 3. Refactoring Principles

### Refactoring

Refactoring changes the internal structure of code while preserving externally visible behavior.

Example:

- Before refactoring, clicking **Edit** opens a populated form.
- After refactoring, clicking **Edit** must still open the same populated form.
- The form code may move into `GuestForm.jsx`, but the behavior must remain unchanged.

### Refactoring vs. Rewriting

A rewrite discards much of the existing implementation and recreates it.

That is risky because the Guests module already includes:

- Initial loading
- Guest creation
- Guest editing
- Partial update payloads
- Delete confirmation
- Mutation-specific loading states
- API error handling
- Collection refreshes

A rewrite could silently remove one of these working behaviors.

### Refactoring vs. Feature Development

Adding search, pagination, modals, stay history, uploads, or guest-booking relationships would expand the module’s capabilities. Those are new features, not cleanup.

### Safe Refactoring Sequence

```text
Verify current behavior
        ↓
Make one small structural change
        ↓
Run the same verification again
        ↓
Commit the working step
        ↓
Continue to the next improvement
```

---

## 4. Backend Contract

### Guest Fields

The backend uses these fields:

- `guest_name`
- `guest_phone_number`
- `guest_address`
- `id_proof_type`
- `id_proof_number`

### API Endpoints

```text
GET    /guests
POST   /guests
GET    /guests/{guest_id}
PUT    /guests/{guest_id}
DELETE /guests/{guest_id}
```

### Create Contract

`GuestCreate` requires all five guest fields.

```json
{
  "guest_name": "Aarav Sharma",
  "guest_phone_number": "9876543210",
  "guest_address": "Jaipur, Rajasthan",
  "id_proof_type": "Aadhaar",
  "id_proof_number": "1234-5678-9012"
}
```

### Update Contract

`GuestUpdate` makes every field optional. The frontend may send only changed fields.

```json
{
  "guest_address": "Udaipur, Rajasthan"
}
```

Do not include:

- `id`
- UI flags
- Error state
- Loading state
- The complete selected guest object unless every field genuinely changed

Although the route uses `PUT`, the backend applies only supplied fields through:

```python
model_dump(exclude_unset=True)
```

The frontend should preserve this finalized behavior rather than changing HTTP semantics during this milestone.

### Duplicate-Field Limitation

The database declares these values as unique:

- `guest_phone_number`
- `id_proof_number`

However, the create and update routes may not convert SQLAlchemy `IntegrityError` exceptions into a structured `400` or `409` response.

Therefore:

- Test duplicate phone and ID values.
- Inspect the Network response body.
- Display a field-specific message only when the response identifies the field.
- Do not assume every generic `500` response means a duplicate phone number.
- Record backend error translation as a separate hardening issue when necessary.

---

## 5. Architecture

### Responsibility Flow

```text
React Renderer
┌───────────────────────────────────────────────┐
│ GuestsPage                                    │
│ - Fetches guests                              │
│ - Coordinates create, update, and delete      │
│ - Owns page-level operation state             │
│                                               │
│  ├── GuestForm                                │
│  │   - Renders controlled inputs              │
│  │   - Displays field errors                  │
│  │   - Emits submit and cancel callbacks      │
│  │                                            │
│  └── GuestList                                │
│      └── GuestCard                            │
│          - Displays one guest                 │
│          - Emits edit and delete callbacks    │
└───────────────────┬───────────────────────────┘
                    │
                    ▼
             guestService.js
                    │
                    ▼
              apiClient.js
                    │ HTTP
                    ▼
             FastAPI Backend
                    │
                    ▼
                 SQLite
```

### Process Boundaries

**Electron main process**

- Creates the desktop window.
- Controls the application lifecycle.
- Does not own guest CRUD logic.

**Preload**

- Exposes approved desktop capabilities when required.
- Does not render or validate guest forms.

**React renderer**

- Displays the Guests interface.
- Owns controlled form state and UI feedback.
- Coordinates guest actions.

**FastAPI**

- Owns validation, database operations, business rules, and API contracts.
- Remains the source of truth for guest data.

---

## 6. Recommended File Structure

```text
frontend/src/
├── pages/
│   └── GuestsPage.jsx
├── components/
│   ├── guests/
│   │   ├── GuestForm.jsx
│   │   ├── GuestList.jsx
│   │   └── GuestCard.jsx
│   └── ui/
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── ErrorMessage.jsx
│       ├── Input.jsx
│       └── Loading.jsx
├── services/
│   ├── apiClient.js
│   └── guestService.js
└── styles/
    └── global.css
```

This structure is a direction, not an automatic requirement.

Do not create a separate `GuestActions.jsx` for only two buttons. Extract it only when the action and confirmation markup becomes substantial enough to justify an independent responsibility.

### Files to Audit Before Editing

```text
frontend/src/pages/GuestsPage.jsx
frontend/src/services/guestService.js
frontend/src/services/apiClient.js
frontend/src/components/ui/Input.jsx
frontend/src/components/ui/Button.jsx
frontend/src/components/ui/Card.jsx
frontend/src/components/ui/ErrorMessage.jsx
frontend/src/styles/global.css
```

Useful comparison files:

```text
frontend/src/pages/RoomsPage.jsx
frontend/src/components/rooms/*
```

The Rooms module is a consistency reference, not an implementation to copy blindly.

---

## 7. Component Responsibilities

### `GuestsPage.jsx`

Owns:

- Guest collection state
- Initial loading
- Blocking load error
- Non-blocking refresh warning
- Create-form orchestration
- Selected guest for editing
- Update orchestration
- Delete confirmation identity
- Collection refresh after mutations

Does not own:

- Low-level HTTP configuration
- Database validation
- Shared input internals
- Electron main-process behavior

### `GuestForm.jsx`

Receives explicit props such as:

- `title`
- `description`
- `formData`
- `validationErrors`
- `apiError`
- `isSubmitting`
- `submitLabel`
- `submittingLabel`
- `onChange`
- `onSubmit`
- `onCancel`

Renders:

- Five controlled guest fields
- Submit action
- Optional cancel action
- Field-specific validation
- Operation-specific API feedback

The same component may support create and edit modes because both use the same guest fields. The parent should still own state and API orchestration.

Avoid replacing a readable five-field form with a configuration-heavy generic form system.

### `GuestList.jsx`

Receives:

- `guests`
- Mutation state
- Delete-confirmation state
- Edit and delete callbacks

Renders:

- The guest collection layout
- One `GuestCard` per guest

### `GuestCard.jsx`

Receives:

- One guest
- Whether that guest is being deleted
- Whether its confirmation is open
- Edit and delete callbacks
- Any card-specific delete error

Renders:

- Initials
- Name
- Phone number
- Address
- ID-proof information
- Edit and delete actions
- Inline delete confirmation

`GuestCard` should not call the backend directly.

### `guestService.js`

Owns all guest HTTP operations:

```javascript
getGuests()
createGuest(guestData)
updateGuest(guestId, guestData)
deleteGuest(guestId)
```

It should not manage React state or render user messages.

---

## 8. Core React Concepts

### Cohesion

A cohesive `GuestCard`:

- Displays one guest.
- Displays that guest’s actions.
- Displays that guest’s inline delete confirmation.

A poorly cohesive `GuestCard` might also:

- Fetch the complete guest collection.
- Call Rooms APIs.
- Manage navigation.
- Store global authentication state.

### Coupling

Good dependency:

```text
GuestCard → shared Button component
```

Unnecessary dependency:

```text
GuestCard → RoomCard implementation
```

Guests and Rooms may share generic UI primitives, but feature components should not import each other merely because they look similar.

### Props and Callback Props

```jsx
<GuestCard
  guest={guest}
  onEdit={handleStartEdit}
  onDelete={handleRequestDelete}
/>
```

Inside the card:

```jsx
onClick={() => onEdit(guest)}
```

The child reports the user action. The parent decides what the action means.

### Lifting State Up

When both the form and cards need to know which guest is being edited, the state should usually live in their closest shared parent.

```text
          GuestsPage
          editingGuest
           /       \
          /         \
   GuestForm       GuestCard
```

### Controlled Inputs

```jsx
<Input
  name="guest_name"
  value={formData.guest_name}
  onChange={onChange}
/>
```

Controlled state supports:

- Edit pre-filling
- Create-form clearing
- Validation
- Submission disabling
- Predictable cancellation

### Derived State

Prefer:

```javascript
const isEditing = editingGuest !== null;
```

Avoid storing `isEditing` separately unless it has an independent meaning. Otherwise, `editingGuest` and `isEditing` can disagree.

### Stable Keys

Use:

```jsx
guests.map((guest) => (
  <GuestCard key={guest.id} guest={guest} />
))
```

Do not use array indexes. Deleting a guest changes indexes and may cause React to reuse the wrong card instance.

---

## 9. State and Error Model

### Operation-Specific Errors

Keep distinct states for distinct failures:

- `loadError`: Initial guest-list request failed.
- `refreshError`: A later collection refresh failed.
- `createError`: Guest creation failed.
- `updateError`: Guest update failed.
- `deleteError`: Guest deletion failed.
- `validationErrors`: Client-side field validation failed.

Combining all failures into one state can make an update error hide the entire guest list.

### Operation-Specific Loading States

Prefer:

- `isInitialLoading`
- `isCreating`
- `isUpdating`
- `deletingGuestId`

Avoid one global flag:

```javascript
const [isLoading, setIsLoading] = useState(false);
```

A single flag can disable the entire page while only one guest is being deleted.

---

## 10. Frontend Architecture Decision 16

### Separate Blocking Load Errors from Non-Blocking Refresh Errors

**Status:** Accepted

### Context

The Guests page performs:

1. An initial `GET /guests`
2. A later collection refresh after successful create, update, or delete operations

Using one general error state for both cases created an inaccurate UI. A failed post-mutation refresh could hide guest data that had already loaded successfully.

### Decision

Maintain separate collection-level error states:

```text
loadError
refreshError
```

**`loadError`**

- Represents failure of the initial collection request.
- Is blocking because no reliable guest collection was received.

**`refreshError`**

- Represents failure of a later refresh after a successful mutation.
- Is non-blocking because the previous guest collection remains usable.

The guest list and empty state should depend on the absence of `loadError`. They should not depend on the absence of `refreshError`.

### Expected Behavior

#### Initial Load Failure

- Loading ends.
- A backend connection or request error appears.
- No guest collection is displayed.
- The empty state is not displayed because the collection is unknown.

#### Post-Mutation Refresh Failure

- The successful mutation remains successful.
- A refresh warning appears.
- Existing guest cards remain visible.
- The interface explains that the visible collection may be stale.

#### Later Successful Refresh

- The collection is replaced with the latest backend data.
- `loadError` is cleared.
- `refreshError` is cleared.

### Rationale

This decision:

- Preserves usable data.
- Accurately identifies which operation failed.
- Prevents a recoverable refresh failure from blanking the page.
- Supports future retry behavior.
- Keeps collection, create, update, and delete errors isolated.

### Trade-Off

The page may temporarily display stale data after a failed refresh. The warning must clearly communicate this possibility.

---

## 11. Refactoring Plan

### Step 1: Establish a Behavioral Baseline

Verify before changing code:

- Guests load.
- The empty state works.
- Create works.
- Invalid create is handled.
- Edit opens the correct guest.
- Edit values are pre-filled.
- Cancel exits edit mode.
- Update works.
- Delete cancellation works.
- Delete confirmation works.
- Existing routes still work.
- Electron layout remains correct.

Record pre-existing defects separately so they are not mistaken for refactoring regressions.

### Step 2: Audit Responsibilities

Read `GuestsPage.jsx` from top to bottom and identify:

- Constants
- Utilities
- Collection state
- Create state
- Edit state
- Delete state
- Initial fetching
- Create handlers
- Edit handlers
- Delete handlers
- Conditional rendering
- Guest-card rendering

Warning signs:

- Multiple copies of the empty form object
- Duplicate create and edit validation
- Repeated field markup
- Multiple `.map()` blocks for the same collection
- Direct `apiClient` calls mixed with service calls
- Handlers controlling unrelated UI
- State that can be derived
- Refresh failures calling `setGuests([])`

### Step 3: Remove Safe Duplication

Before extracting components:

- Keep one `EMPTY_GUEST_FORM`.
- Keep one field-name list only if it is genuinely useful.
- Keep one normalization function.
- Keep one validation function that accepts form data.
- Remove unused imports.
- Remove unreachable handlers.

Re-run CRUD verification immediately.

### Step 4: Extract the Form When Justified

The create and edit forms contain the same five fields. A shared `GuestForm` can remove meaningful duplication.

After extraction, verify:

- Create submission
- Create validation
- Edit pre-fill
- Edit validation
- Cancel behavior
- Submit loading states
- API error placement

### Step 5: Extract Guest Presentation

Extract `GuestCard` when the card contains substantial identity details, actions, and confirmation markup.

The card should emit actions such as:

```javascript
onEdit(guest)
onRequestDelete(guest.id)
onConfirmDelete(guest)
onCancelDelete()
```

Verify that every action applies to the correct guest.

### Step 6: Isolate Failure States

A failed mutation or refresh should not erase successfully loaded data.

Expected outcomes:

| Failure | Expected UI |
|---|---|
| Initial GET fails | Show blocking load error |
| Create fails | Keep existing collection; show create error near create form |
| Update fails | Keep list and edit form open; show update error |
| Delete fails | Keep guest visible; show error near its confirmation |
| Refresh after mutation fails | Keep existing cards; show non-blocking warning |

### Step 7: Refine Visual Hierarchy

Recommended page order:

1. Page heading
2. Create-guest surface
3. Create feedback
4. Edit surface, when active
5. Guest-list heading and count
6. Collection feedback
7. Guest grid or empty state

Create and edit should look related but distinct.

**Create**

- “Add new guest”
- Neutral primary surface

**Edit**

- “Editing guest”
- Selected guest’s name
- Clear Cancel action
- Stronger visual boundary

### Step 8: Accessibility Pass

Check:

- Every field has a visible label.
- Create and edit input IDs are unique.
- Non-submit buttons use `type="button"`.
- Errors appear near the failed operation.
- Disabled controls remain understandable.
- Keyboard focus is not trapped.
- Edit mode receives sensible focus where practical.
- Delete confirmation names the affected guest.
- Error text is readable by assistive technology where supported.

### Step 9: Full Regression Verification

Run the complete browser and Electron verification matrix after each significant structural change.

---

## 12. Verification Matrix

| Behavior | Before Refactor | After Each Step |
|---|---|---|
| Initial guest load | Pass/Fail | Pass/Fail |
| Empty state | Pass/Fail | Pass/Fail |
| Create guest | Pass/Fail | Pass/Fail |
| Invalid create | Pass/Fail | Pass/Fail |
| Enter edit mode | Pass/Fail | Pass/Fail |
| Edit pre-fill | Pass/Fail | Pass/Fail |
| Cancel edit | Pass/Fail | Pass/Fail |
| Update guest | Pass/Fail | Pass/Fail |
| Cancel deletion | Pass/Fail | Pass/Fail |
| Delete guest | Pass/Fail | Pass/Fail |
| Rooms route | Pass/Fail | Pass/Fail |
| Electron layout | Pass/Fail | Pass/Fail |
| ESLint | Pass/Fail | Pass/Fail |

### Initial Commands

From the frontend directory:

```bash
npm run
```

Use the listed scripts instead of guessing the Electron development command.

Run lint:

```bash
npm run lint
```

Start the browser version with the project’s established Vite command:

```bash
npm run dev
```

Start Electron using the exact script shown by `npm run`.

---

## 13. Non-Blocking Refresh-Failure Test

### Objective

Verify that a failed collection refresh after a successful update does not hide existing guest cards.

### Why Simulation Is Useful

The sequence is difficult to reproduce manually:

```text
PUT /guests/{id} succeeds
        ↓
Immediate GET /guests fails
```

Stopping the backend between the two requests is usually unreliable. A temporary controlled failure makes the state repeatable.

### Temporary Test Flag

Place near the guest constants:

```javascript
const SIMULATE_REFRESH_FAILURE = true;
```

### Temporary `refreshGuests` Implementation

```javascript
async function refreshGuests() {
  if (SIMULATE_REFRESH_FAILURE) {
    throw new Error("Temporary test: guest refresh failed.");
  }

  const guestsData = await fetchGuestsFromBackend();

  setGuests(guestsData);
  setLoadError("");
  setRefreshError("");
}
```

The initial load should continue to call `fetchGuestsFromBackend()` directly so the simulation affects only post-mutation refreshes.

### Test Procedure

1. Keep FastAPI running.
2. Start the React frontend.
3. Reload the Guests page.
4. Confirm guests load normally.
5. Edit an existing guest.
6. Change one field.
7. Save the update.

Expected sequence:

```text
PUT /guests/{guest_id} succeeds
        ↓
Edit mode closes
        ↓
refreshGuests() throws the temporary error
        ↓
refreshError is displayed
        ↓
Existing guest cards remain visible
```

### Pass Criteria

The test passes only when:

- The refresh warning appears.
- Existing guest cards remain visible.
- The page does not become blank.
- “No guests found” does not appear.
- The initial-load error does not appear.
- The edit form closes because the update succeeded.
- The backend terminal shows a successful `PUT`.
- The visible card may temporarily show the old value.

The stale card value is expected because the refresh was deliberately prevented.

### Network Verification

Open the Network panel before saving.

Expected request:

```text
PUT /guests/{guest_id} → 200
```

No later `GET /guests` appears when the temporary exception is thrown before the request.

### Cleanup

Restore:

```javascript
async function refreshGuests() {
  const guestsData = await fetchGuestsFromBackend();

  setGuests(guestsData);
  setLoadError("");
  setRefreshError("");
}
```

Remove:

```javascript
const SIMULATE_REFRESH_FAILURE = true;
```

Then run:

```bash
npm run lint
```

Reload the Guests page and verify normal create, update, and delete refreshes.

### Alternative: Browser Request Blocking

Another option:

1. Load the page normally.
2. Open DevTools → Network.
3. Find the successful `GET /guests`.
4. Block that request URL.
5. Update a guest.
6. Confirm `PUT` succeeds while the following `GET` is blocked.
7. Remove the block after testing.

The temporary code flag is generally easier to reproduce.

---

## 14. Mutation Behavior

### Create

Before creation:

- Set `isCreating`.
- Clear the previous create error.
- Clear any old refresh warning.

After successful creation:

- Clear the create form.
- Refresh the guest collection.

If creation succeeds but refresh fails:

- Keep the creation result successful.
- Show a non-blocking refresh warning.
- Preserve existing guest cards.

### Update

Before updating:

- Set `isUpdating`.
- Clear update errors.
- Clear edit validation errors.
- Clear any old refresh warning.

After successful update:

- Exit edit mode.
- Clear edit-form state.
- Refresh the collection.

If updating succeeds but refresh fails:

- Do not report the update as failed.
- Show a refresh warning.
- Keep existing cards visible.

### Delete

Before deletion:

- Store the active guest ID.
- Clear delete errors.
- Clear any old refresh warning.

After successful deletion:

- Close confirmation.
- Clear matching edit state when necessary.
- Refresh the collection.

If deletion succeeds but refresh fails:

- Keep the deletion result successful.
- Show a refresh warning.
- Preserve the previously loaded collection until a later successful refresh.

---

## 15. Debugging Guide

### React DevTools

Inspect:

- `GuestsPage` state
- Selected editing guest
- Props passed to `GuestForm`
- Guest passed to each `GuestCard`
- Whether mutation flags affect only the intended card

### Browser Network Panel

For every mutation, inspect:

- Request URL
- HTTP method
- Request payload
- Response status
- Response body
- Number of requests

Watch for accidental duplicate requests, especially during development with React Strict Mode.

### FastAPI Terminal

Use the backend terminal to inspect:

- SQL statements
- Validation failures
- Tracebacks
- SQLite integrity errors
- Requests reaching the wrong endpoint

A frontend message explains what the browser observed. The backend traceback explains why the server failed.

### Electron Debugging

**Renderer or React error**

- Electron DevTools console

**Electron lifecycle or `BrowserWindow` error**

- Electron main-process terminal

**FastAPI or database error**

- Backend terminal

---

## 16. Common Mistakes

### Clearing Existing Guests After Refresh Failure

Avoid:

```javascript
catch (error) {
  setGuests([]);
  setLoadError(error.message);
}
```

If guests were already loaded, this destroys usable UI because a later refresh failed.

### Using One Global Loading Flag

A global flag can disable create, edit, delete, and navigation when only one guest is being deleted.

### Duplicating Edit State

Avoid storing overlapping values such as:

- `editingGuest`
- `editFormData`
- `isEditing`
- `selectedGuestId`

unless each has a clear and independent purpose.

### Mutating the Selected Guest

Avoid:

```javascript
editingGuest.guest_name = value;
```

Update React state immutably.

### Calling a Callback During Rendering

Wrong:

```jsx
onClick={onEdit(guest)}
```

Correct:

```jsx
onClick={() => onEdit(guest)}
```

### Using Index Keys

Wrong:

```jsx
key={index}
```

Correct:

```jsx
key={guest.id}
```

### Incomplete Cancel Cleanup

Cancel should reset:

- Selected guest
- Edit form values
- Edit validation errors
- Update API error

It should not:

- Alter backend data
- Clear the create form
- Remove the guest collection

### Guessing Duplicate Errors

Do not convert every server failure into:

```text
Phone number already exists.
```

Show a field-specific message only when the API response supports that conclusion.

### Breaking the Initial Load During Simulation

Do not place the temporary refresh error inside `fetchGuestsFromBackend()`. That would break both the initial load and later refreshes.

### Hiding Cards on `refreshError`

Do not add `!refreshError` to the guest-list rendering condition. That would recreate the original bug.

### Leaving Test Code Enabled

Temporary failure simulation must be removed before committing.

---

## 17. Alternative Approaches

### Keep Everything in `GuestsPage`

**Advantage**

- Fewer files
- Less prop passing

**Disadvantage**

- Form, list, cards, validation, API orchestration, and delete confirmation may become difficult to scan

Suitable only while the page remains reasonably small.

### Extract `GuestForm` and `GuestCard`

**Advantage**

- Removes meaningful JSX duplication
- Keeps state ownership clear
- Improves readability

**Disadvantage**

- Requires callback props

This is the most likely fit for the current module.

### Create a `useGuests` Hook

**Advantage**

- Could isolate data and mutation logic

**Disadvantage**

- Adds abstraction for logic currently used by one page

Not recommended unless simpler extractions still leave the page difficult to understand.

### Introduce `useReducer`

**Advantage**

- Centralizes complex state transitions

**Disadvantage**

- Adds action types, reducer logic, and indirect state updates

Not justified unless transitions have become genuinely difficult to reason about.

### Add a Form Library

A library such as React Hook Form can reduce boilerplate, but this milestone should preserve the controlled-form learning path and avoid adding a dependency for five fields.

---

## 18. Industry Best Practices

- Refactor in small, testable commits.
- Keep API contracts separate from UI state.
- Name state after the operation it represents.
- Preserve visible data when a recoverable refresh fails.
- Keep destructive confirmation close to the affected record.
- Use backend validation as the authority.
- Use frontend validation for immediate usability.
- Maintain one source of truth for edit mode.
- Prefer explicit props over configuration-heavy objects.
- Extract components based on responsibility, not line count.
- Use semantic elements such as `section`, `article`, headings, forms, and buttons.
- Verify desktop layouts at wide and constrained Electron window sizes.
- Keep React logic in the renderer and business logic in FastAPI.
- Resolve lint issues rather than suppressing them without investigation.
- Remove all temporary test code before committing.

---

## 19. Current Progress

### Completed

- Reviewed the Guests-module architecture and responsibility boundaries.
- Confirmed guest HTTP operations should remain centralized in `guestService.js`.
- Confirmed creation requires all five guest fields.
- Confirmed updates may send only changed fields.
- Confirmed stable database IDs should be used as React keys.
- Confirmed edit cancellation must safely clear edit state.
- Confirmed deletion requires explicit confirmation.
- Separated blocking initial-load errors from non-blocking refresh errors.
- Verified backend-unavailable behavior during initial loading.
- Verified that a failed refresh after a successful update preserves existing cards.
- Removed the temporary refresh-failure simulation after testing.

### Verified Architecture Boundaries

React owns:

- Guest page rendering
- Controlled form state
- Loading states
- Validation feedback
- Edit selection
- Delete confirmation
- Error presentation

`guestService.js` owns:

- `GET /guests`
- `POST /guests`
- `PUT /guests/{guest_id}`
- `DELETE /guests/{guest_id}`

FastAPI owns:

- Validation
- Business rules
- Database operations
- API contracts
- Persistent guest data

Electron main and preload do not own guest CRUD logic.

---

## 20. Remaining Work

Before Milestone 16 can be marked complete:

- Add field-specific validation to the create form.
- Make create and edit validation presentation consistent.
- Decide whether to extract `GuestForm.jsx`.
- Decide whether substantial card markup justifies `GuestCard.jsx`.
- Improve create, edit, cancel, and delete button hierarchy.
- Add or correct guest-specific CSS selectors.
- Remove directly related duplicate CSS without rewriting unrelated styles.
- Improve operation-specific control disabling.
- Improve shared input and error accessibility.
- Verify duplicate phone-number feedback.
- Verify duplicate ID-proof-number feedback.
- Complete create, edit, delete, browser, Electron, route-regression, and ESLint checks.

---

## 21. Milestone Summary

Milestone 16 should follow this sequence:

```text
Baseline verification
        ↓
Current-code audit
        ↓
Remove duplication and dead code
        ↓
Extract only justified components
        ↓
Separate operation states and errors
        ↓
Refine visual hierarchy
        ↓
Accessibility pass
        ↓
Browser and Electron regression testing
        ↓
ESLint verification
```

The preferred direction is:

- Keep `GuestsPage` as the feature coordinator.
- Extract `GuestForm` and `GuestCard` only when they remove meaningful complexity.
- Keep `guestService.js` as the only guest HTTP layer.
- Keep FastAPI as the source of truth.
- Treat initial-load failures as blocking.
- Treat post-mutation refresh failures as non-blocking.
- Preserve visible guest data during recoverable failures.

The collection error-state refinement is complete. The full milestone remains in progress until validation consistency, component decisions, accessibility, CSS cleanup, and the complete regression matrix are finished.

---

## 22. Review Questions

1. What is the main difference between refactoring and rewriting?
2. Why should `isEditing` usually be derived from `editingGuest`?
3. Why should an update failure not clear the guest collection?
4. Which component should call `guestService.updateGuest()`?
5. Why is `guest.id` a better key than the array index?
6. What is the difference between `validationErrors` and `updateError`?
7. Why can the frontend not reliably identify a duplicate phone number from every generic `500` response?
8. Which process owns guest form rendering?
9. Why does the initial load still work during refresh-failure simulation?
10. Why might a guest card temporarily show an old value after a successful update?
11. Did the update fail when only the later refresh warning appears?
12. Why must temporary failure-simulation code be removed?

---

## 23. Suggested Next Step

Review the current versions of:

```text
GuestsPage.jsx
guestService.js
apiClient.js
Input.jsx
Button.jsx
Card.jsx
ErrorMessage.jsx
global.css
```

Also review any existing files under:

```text
frontend/src/components/guests/
```

Perform a responsibility-by-responsibility audit of the actual working implementation before making the next small refactor.
