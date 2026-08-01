# M17 - Notes

## Part I — Stays Module Read-Only Foundation

### 1. Objective

Begin Milestone 17: Stays Module Read-Only Foundation without implementing the entire module at once.

This first checkpoint establishes:

- One consistent Stays page and /stays route.
- Removal or safe renaming of any old Bookings placeholder.
- A new stayService.js service boundary.
- A single getStays() function for GET /stay.
- Confirmation that the page remains protected and integrated with DashboardLayout.

We will not fetch or render stay records in this checkpoint. That will be the next focused step.

The backend contract uses the singular endpoint /stay, while the frontend feature uses the plural user-facing label Stays.

### 2. Problem Analysis

#### Why Stays comes after Rooms and Guests

Rooms and Guests are mostly master data.

Master data describes relatively stable entities:

- A Room represents an accommodation unit.
- A Guest represents a person known to the hotel.
- Their identity remains meaningful across multiple operations.

A Stay is transactional data.

Transactional data records something that happened operationally:

- A guest occupied a room.
- The room had a particular nightly price at that time.
- Check-in happened at a particular date and time.
- Check-out may happen later.
- The stay moves through an operational status.

A simplified relationship is:

```text
Room
  │
  │ referenced by room_id
  ▼
Stay
  │
  │ connected separately
  ▼
GuestStay
  │
  ▼
Guest
```

#### Why price_per_night belongs on Stay

The Stay stores a historical price snapshot.

Suppose:

Room 101 current price: 3,000

A guest checks in when the price is 3,000.

Later, the hotel changes the room price to 3,500.

The old stay must still remember that its agreed rate was 3,000. Therefore:

- Room.price_per_night = current/default room rate
- Stay.price_per_night = historical rate used for that stay

The frontend must display the stored Stay value. It should not replace it with the Room’s current price.

#### Why Stay stores room_id

The Stay should reference a Room instead of duplicating its full information:

```json
{
  "stay_id": 15,
  "room_id": 3
}
```

This avoids storing repeated room data in every stay record.

Later, the frontend can optionally load Rooms and derive:

room_id 3 → Room 204

However, the basic milestone will work with room_id directly.

#### Why check_out_datetime can be null

An active stay has begun but has not ended:

```json
{
  "check_in_datetime": "2026-08-01T12:30:00",
  "check_out_datetime": null,
  "stay_status": "Checked In"
}
```

null is meaningful. It does not automatically mean corrupted data. It means that no checkout time has been recorded yet.

#### Why GuestStay is separate

The Stay response does not directly include guests. Guest assignment is represented through the separate GuestStay relationship.

This design can support situations such as:

- Multiple guests staying in one room.
- One stay having a primary guest and accompanying guests.
- Relationship-specific information being stored later.

We will defer GuestStay because it introduces a second API, relationship mapping, additional loading states, and potentially guest-role rules. Those concerns should not complicate the first read-only Stay view.

### 3. High-Level Design

The final Milestone 17 data flow will be:

```text
React renderer
    │
    │ StaysPage calls getStays()
    ▼
stayService.js
    │
    │ apiRequest("/stay")
    ▼
apiClient.js
    │
    │ HTTP GET
    ▼
FastAPI GET /stay
    │
    ▼
SQLite through backend services/repositories
```

The Electron layers are not involved:

```text
Electron main process
    └── Creates and manages the desktop window
```

```text
Preload script
    └── Exposes approved native desktop capabilities
```

```text
React renderer
    └── Sends normal HTTP requests to FastAPI
```

Fetching Stays from FastAPI is an ordinary renderer-to-backend HTTP operation. It does not require IPC.

Your existing apiClient.js already centralizes URL construction, JSON parsing, network failures, HTTP errors, and request configuration.

### 4. Concepts Involved

#### Service boundary

A service file represents the frontend’s communication boundary with one backend resource.

Your current Guest service follows this pattern:

```text
GuestsPage
    ↓
guestService
    ↓
apiClient
    ↓
FastAPI
```

The page does not call fetch() directly.

Stays will use the same architecture:

```text
StaysPage
    ↓
stayService
    ↓
apiClient
    ↓
GET /stay
```

#### Singular backend route versus plural frontend feature

These are not required to have the same spelling:

- Frontend page:     Stays
- Frontend route:    /stays
- Backend endpoint:  /stay

The frontend route is designed for navigation and readability. The backend route is an existing API contract and must be used exactly as implemented.

#### Protected nested route

Because Stays belongs inside the authenticated dashboard:

```text
ProtectedRoute
    └── DashboardLayout
          └── StaysPage
```

Navigating directly to /stays while logged out should continue to trigger the project’s existing authentication protection.

### 5. Folder/File Changes

For this checkpoint, inspect or modify:

```text
frontend/
└── src/
    ├── pages/
    │   ├── BookingsPage.jsx     rename/remove if it exists
    │   └── StaysPage.jsx        establish one page
    │
    ├── routes/
    │   └── AppRoutes.jsx        use /stays
    │
    ├── layouts/
    │   └── DashboardLayout.jsx  sidebar link should use /stays
    │
    └── services/
        └── stayService.js       create
```

Do not modify:

- RoomsPage.jsx
- GuestsPage.jsx
- roomService.js
- guestService.js
- Electron main process
- preload script
- FastAPI backend

Your completed GuestsPage already contains the guarded asynchronous loading pattern that we will reuse in the next checkpoint.

### 6. Step-by-Step Explanation

#### Step 1: Inspect the pages folder

In the VS Code Explorer, open:

```text
frontend/src/pages/
```

Look for either:

```text
BookingsPage.jsx
```

or:

```text
StaysPage.jsx
```

There should ultimately be only one page for this feature:

```text
StaysPage.jsx
```

Do not keep both placeholder files.

#### Step 2: Inspect the route

Open:

```text
frontend/src/routes/AppRoutes.jsx
```

Search for:

- bookings
- BookingsPage
- stays
- StaysPage

Possible existing code might look like:

```jsx
import BookingsPage from "../pages/BookingsPage.jsx";
```

and:

```jsx
<Route path="bookings" element={<BookingsPage />} />
```

The final form should use:

```jsx
import StaysPage from "../pages/StaysPage.jsx";
```

and:

```jsx
<Route path="stays" element={<StaysPage />} />
```

The exact nesting must remain consistent with your current router structure. Do not rebuild the route tree.

#### Step 3: Inspect sidebar navigation

Open the component that owns the dashboard sidebar, probably:

```text
frontend/src/layouts/DashboardLayout.jsx
```

Find the existing Bookings or Stays link.

Change:

```jsx
<NavLink to="/bookings">Bookings</NavLink>
```

to:

```jsx
<NavLink to="/stays">Stays</NavLink>
```

Preserve the existing className callback or active-link logic.

For example, if your existing link uses:

```jsx
<NavLink
  to="/bookings"
  className={({ isActive }) =>
    isActive
      ? "dashboard-nav-link dashboard-nav-link-active"
      : "dashboard-nav-link"
  }
>
  Bookings
</NavLink>
```

only change the destination and label:

```jsx
<NavLink
  to="/stays"
  className={({ isActive }) =>
    isActive
      ? "dashboard-nav-link dashboard-nav-link-active"
      : "dashboard-nav-link"
  }
>
  Stays
</NavLink>
```

#### Step 4: Rename the page safely

Using the VS Code Explorer:

- Right-click BookingsPage.jsx.
- Select Rename.
- Rename it to:
- StaysPage.jsx

Then rename the component inside it:

```jsx
function BookingsPage() {
```

becomes:

```jsx
function StaysPage() {
```

And:

```jsx
export default BookingsPage;
```

becomes:

```jsx
export default StaysPage;
```

Update user-facing text from “Bookings” to “Stays.”

Do not rename anything related to future reservations that does not belong to this placeholder.

#### Step 5: Create the Stay service

Create:

```text
frontend/src/services/stayService.js
```

This file will contain backend communication related to Stay records.

The service should not:

- Format dates.
- Format prices.
- Manage React state.
- Render components.
- Know about Electron.
- Call guest APIs.
- Call room APIs.
- Add create, update, or delete functions yet.

### 7. Implementation

**File:** `src/services/stayService.js`

```js
import { apiRequest } from "./apiClient";

export async function getStays() {
  return apiRequest("/stay");
}
```

This is the complete service implementation needed for this checkpoint.

It follows the same boundary used by guestService.js, where API operations call the shared apiRequest() function instead of using fetch() directly.

#### Expected route adjustment

Use this only as the relevant portion of your existing route file:

```jsx
import StaysPage from "../pages/StaysPage.jsx";
```

Inside the existing protected dashboard route:

```jsx
<Route path="stays" element={<StaysPage />} />
```

Do not replace your complete AppRoutes.jsx with this fragment.

#### Temporary StaysPage.jsx

Keep the existing placeholder structure whenever possible. A minimal version could be:

```jsx
function StaysPage() {
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
          View active and completed hotel stay records.
        </p>
      </div>
    </section>
  );
}

export default StaysPage;
```

However, preserve the page-heading pattern already used by your actual placeholder. Do not introduce a second competing layout convention.

Your global stylesheet already contains dashboard page, table, card, overflow, empty-state, and status-badge foundations. We will add only Stay-specific selectors when the table is implemented.

### 8. Code Walkthrough

#### Importing apiRequest

```jsx
import { apiRequest } from "./apiClient";
```

This is a named import.

apiClient.js exports:

```jsx
export async function apiRequest(...) {
```

Therefore, it is imported using braces:

```json
{ apiRequest }
```

#### Declaring getStays

```jsx
export async function getStays() {
```

This creates a named exported asynchronous function.

Because it is exported, another module can write:

```jsx
import { getStays } from "../services/stayService.js";
```

#### Calling the correct endpoint

```jsx
return apiRequest("/stay");
```

No method is supplied, so apiRequest() uses its default:

```text
method = "GET"
```

The final request becomes:

```text
GET http://127.0.0.1:8000/stay
```

The shared client already:

- Builds the full URL.
- Adds the Accept header.
- Calls fetch.
- Parses JSON.
- Detects non-success responses.
- Converts network problems into ApiError.
- Returns the parsed response.

That is why stayService.js should remain small.

#### Why no try/catch is needed in the service

The service should allow errors to propagate:

```text
apiRequest throws
       ↓
getStays rejects
       ↓
StaysPage catches the error
       ↓
UI displays ErrorMessage
```

The service does not know how the user interface should represent an error. That decision belongs to the page.

### 9. Debugging Tips

#### Route shows a blank page

Check the browser console for an import error such as:

Failed to resolve import "../pages/BookingsPage.jsx"

This usually means the file was renamed but the import was not updated.

Search the complete frontend project for:

- BookingsPage
- /bookings
- Bookings

Any old feature references should be reviewed.

#### Sidebar opens /bookings

The page route may be correct while the sidebar link is stale.

Inspect the address bar after clicking the navigation item. It should show:

```text
/stays
```

#### Direct /stays navigation fails

Confirm that the route is nested in the same protected route structure as Rooms and Guests.

Do not create a separate top-level public route for Stays.

#### stayService.js produces an import error

Make sure the relative location is correct:

```text
services/
├── apiClient.js
└── stayService.js
```

Because the files are siblings, the import begins with:

"./apiClient"

not:

"../apiClient"

#### Verify the backend independently

Before integrating page loading, open FastAPI Swagger and run:

```text
GET /stay
```

Confirm that it returns either:

```text
[]
```

or an array of Stay records.

Frontend debugging becomes confusing when the backend endpoint itself is not working.

### 10. Common Mistakes

#### Calling /stays from the service

Incorrect:

```jsx
return apiRequest("/stays");
```

Correct:

```jsx
return apiRequest("/stay");
```

The frontend route and backend endpoint are intentionally different.

#### Calling fetch() inside StaysPage

Incorrect:

```jsx
fetch("http://127.0.0.1:8000/stay");
```

This bypasses the shared base URL, parsing, and error handling.

#### Creating unnecessary service functions

Do not add these yet:

- createStay()
- updateStay()
- deleteStay()
- checkInStay()
- checkOutStay()

A service should be built according to the current milestone, not speculative future requirements.

#### Keeping duplicate pages

Avoid:

- BookingsPage.jsx
- StaysPage.jsx

when both represent the same unfinished feature.

#### Moving the request into Electron

Do not add:

```jsx
ipcRenderer.invoke("get-stays")
```

Normal HTTP communication belongs in the React renderer through stayService.js.

#### Renaming the backend endpoint

The frontend should adapt to the existing API contract. Do not change /stay merely to make it match /stays.

### 11. Alternative Approaches

#### Keep /bookings

This would avoid a rename, but it would incorrectly imply that the current backend already implements a complete reservation or booking workflow.

It is not recommended for this milestone.

#### Add both /bookings and /stays

This can help during a large production URL migration, but HelloStay is still under active development. Maintaining two routes for one placeholder adds unnecessary ambiguity.

It is not recommended unless external links already depend on /bookings.

#### Call apiClient.get("/stay")

Your API client also exports:

apiClient.get(...)

Therefore, this would work:

```jsx
import { apiClient } from "./apiClient";
```

```jsx
export function getStays() {
  return apiClient.get("/stay");
}
```

However, your current guestService.js directly uses apiRequest(). Matching the established pattern keeps the service layer consistent.

### 12. Industry Best Practices

#### Use domain-accurate terminology

Names should describe what the software actually supports.

At this stage:

- Stay = operational occupancy record
- Booking = future reservation workflow

Calling a Stay a Booking would hide an important domain distinction.

#### Keep service functions narrow

A service function should express one backend operation:

```text
getStays()
```

It should not also transform dates, build table rows, or modify React state.

#### Preserve one source of truth

FastAPI remains the source of truth for:

- Stay records.
- Stay status.
- Check-in and checkout timestamps.
- Historical nightly price.
- Room reference.

The frontend is responsible for requesting and presenting that data.

#### Introduce features vertically

The safe sequence is:

```text
Route and terminology
        ↓
Service integration
        ↓
Initial loading states
        ↓
Read-only table
        ↓
Formatting and badges
        ↓
Verification
```

This makes errors easier to isolate than implementing the complete feature in one large change.

### 13. Summary

This checkpoint establishes the Stays feature boundary:

- Frontend feature name: Stays
- Frontend route:        /stays
- Frontend page:         StaysPage.jsx
- Frontend service:      stayService.js
- Backend request:       GET /stay

The service implementation is intentionally small:

```jsx
import { apiRequest } from "./apiClient";
```

```jsx
export async function getStays() {
  return apiRequest("/stay");
}
```

No Stay records are rendered yet. No creation, editing, deletion, GuestStay lookup, billing calculation, room-status update, or Electron IPC has been introduced.

### 14. Small Quizzes Related to This Session

#### Quiz 1

Why does the frontend use /stays while the service calls /stay?

#### Quiz 2

Which layer should contain getStays()?

- A. StaysPage.jsx
- B. stayService.js
- C. Electron main process
- D. FastAPI response model

#### Quiz 3

Why should an old Stay continue displaying its stored price_per_night after the Room’s current price changes?

#### Quiz 4

What does a null check_out_datetime usually mean for an active Stay?

#### Quiz 5

Why should Guest names not be guessed from room_id?

#### Quiz 6

What existing functionality would be bypassed if StaysPage called fetch() directly?

### 15. Suggested Next Step

Complete this checkpoint by creating stayService.js, establishing one StaysPage.jsx, changing the protected route to /stays, and updating the sidebar label.

Then upload or paste these current files:

- AppRoutes.jsx
- DashboardLayout.jsx
- StaysPage.jsx or BookingsPage.jsx
- stayService.js

The next checkpoint will connect StaysPage to getStays() and implement only the four initial request states: loading, error, empty, and success.

---

## Part II — Read-Only Stays Table Styling

### 1. Objective

Add only the CSS needed by the new read-only Stays table while reusing your existing dashboard, card, empty-state, and badge styles.

### 2. Problem Analysis

Your current stylesheet already provides:

- .dashboard-page and dashboard heading styles
- .ui-card
- .ui-loading
- .ui-error-message
- .empty-state
- .status-badge
- table styling for the Rooms module

However, the new StaysPage.jsx uses these class names, which are not currently defined:

- stays-table-card
- stays-table-wrapper
- stays-table
- stay-status-checked-in
- stay-status-checked-out

Your stylesheet also contains repeated definitions for selectors such as :root, body, .page-center, .rooms-page, .room-form, .form-field, .empty-state, and .button-danger. Because CSS follows the cascade, later definitions can override earlier ones. That duplication should eventually be cleaned up, but it is outside this focused read-only Stays step.

### 3. High-Level Design

We will use two levels of styling:

```text
Shared styles
├── .ui-card
├── .empty-state
└── .status-badge
```

```text
Stays-specific styles
├── .stays-table-card
├── .stays-table-wrapper
├── .stays-table
├── .stay-status-checked-in
└── .stay-status-checked-out
```

The generic badge provides the pill shape and typography. The Stay-specific classes only provide the meaning-specific colors.

### 4. Concepts Involved

#### Horizontal overflow

A desktop table can become wider than its container. This rule prevents it from breaking the Electron window:

overflow-x: auto;

When insufficient width is available, the table area becomes horizontally scrollable.

#### min-width

The table will contain six operational columns. Giving it a minimum width prevents the dates and labels from becoming excessively compressed:

min-width: 900px;

#### CSS cascade

Because you will place the new styles at the end of global.css, they will be evaluated after earlier rules. More specific Stay selectors will apply without changing Rooms or Guests.

### 5. Folder/File Changes

Edit:

```text
frontend/src/styles/global.css
```

Make one small adjustment in:

```text
frontend/src/pages/StaysPage.jsx
```

No other files need styling changes.

### 6. Step-by-Step Explanation

#### Step 1: Add a class to the table Card

Find this part in StaysPage.jsx:

```jsx
<Card>
  <div className="stays-table-wrapper">
```

Change it to:

```jsx
<Card className="stays-table-card">
  <div className="stays-table-wrapper">
```

The Card component already accepts and forwards a className, so this safely adds a feature-specific modifier.

#### Step 2: Append the Stay styles

Go to the very bottom of global.css, after:

```css
.button-danger-outline {
  border-color: var(--danger-color, #b42318);
  background: transparent;
  color: var(--danger-color, #b42318);
}
```

Add the following block.

### 7. Implementation

```css
/* =========================
   Milestone 17: Stays Read-Only
   ========================= */

.stays-table-card {
  padding: 0;
  overflow: hidden;
}

.stays-table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.stays-table {
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
}

.stays-table th,
.stays-table td {
  padding: 14px 16px;
  border-bottom: 1px solid #eaecf0;
  text-align: left;
  vertical-align: middle;
}

.stays-table th {
  color: #475467;
  background: #f9fafb;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}

.stays-table td {
  color: #344054;
  font-size: 14px;
}

.stays-table tbody tr:last-child td {
  border-bottom: 0;
}

.stays-table tbody tr:hover {
  background: #fcfcfd;
}

.stays-table .status-badge {
  white-space: nowrap;
}

.stay-status-checked-in {
  color: #175cd3;
  background: #eff8ff;
}

.stay-status-checked-out {
  color: #344054;
  background: #f2f4f7;
}
```

### 8. Code Walkthrough

#### Removing Card padding

```css
.stays-table-card {
  padding: 0;
  overflow: hidden;
}
```

Your shared .ui-card has substantial internal padding. That works well for forms and guest cards, but tables generally look cleaner when their header background reaches the card edges.

overflow: hidden ensures the table background respects the Card’s rounded corners.

#### Protecting the layout

```css
.stays-table-wrapper {
  width: 100%;
  overflow-x: auto;
}
```

The wrapper owns scrolling rather than the entire dashboard page.

Without it, a wide table could:

- Expand the dashboard content area.
- Push outside the Electron window.
- Cause the whole application to scroll horizontally.

#### Preserving readable columns

```css
.stays-table {
  width: 100%;
  min-width: 900px;
}
```

width: 100% fills the available card width.

min-width: 900px prevents the six columns from becoming too narrow. On smaller windows, the wrapper provides scrolling.

#### Combining borders

border-collapse: collapse;

This causes adjacent table borders to behave as one continuous border instead of separated cell boxes.

#### Column heading readability

```css
.stays-table th {
  white-space: nowrap;
}
```

Labels such as “Price per night” will remain on one line.

#### Removing the last border

```css
.stays-table tbody tr:last-child td {
  border-bottom: 0;
}
```

The card itself already provides an outer boundary, so the last row does not need an additional bottom line.

#### Status styling

The JSX produces two classes:

status-badge stay-status-checked-in

or:

status-badge stay-status-checked-out

The shared .status-badge provides:

- Rounded pill shape
- Padding
- Font size
- Font weight

The Stay-specific class supplies only the colors.

The Checked In status uses restrained blue because it is operationally active:

```css
.stay-status-checked-in {
  color: #175cd3;
  background: #eff8ff;
}
```

Checked Out uses neutral gray because it represents a completed record:

```css
.stay-status-checked-out {
  color: #344054;
  background: #f2f4f7;
}
```

These classes do not reuse room-status names such as .status-occupied, because Room and Stay statuses represent different domain concepts.

### 9. Debugging Tips

#### The table has large white spacing around it

Confirm that the Card contains:

```text
className="stays-table-card"
```

Without that class, the shared .ui-card padding remains active.

#### The page expands beyond the window

Inspect .stays-table-wrapper in DevTools and confirm:

overflow-x: auto;

Also verify that the JSX class name matches exactly:

```jsx
<div className="stays-table-wrapper">
```

#### Badges remain gray

Inspect the badge element in DevTools.

For a checked-in Stay, it should contain:

```text
class="status-badge stay-status-checked-in"
```

Check that the backend value is exactly:

Checked In

The status-to-class mapping is case-sensitive.

#### The table is unstyled

Confirm that the JSX uses:

```jsx
<table className="stays-table">
```

not:

```jsx
<table className="stay-table">
```

CSS class names must match exactly.

#### Test horizontal overflow

Reduce the Electron or browser window width. The table area should scroll horizontally while the sidebar and dashboard shell remain stable.

### 10. Common Mistakes

#### Using Room status classes

Avoid:

```text
className="status-badge status-occupied"
```

A checked-in Stay and an occupied Room are related, but they are not the same entity or status.

#### Removing min-width

Without a minimum width, date and price columns may become difficult to scan.

#### Applying overflow directly to the table

This is unreliable:

```css
.stays-table {
  overflow-x: auto;
}
```

Overflow should be applied to the wrapper element.

#### Creating another .status-badge definition

You already have a shared .status-badge. Do not duplicate the full selector. Add only Stay-specific color classes.

#### Cleaning the entire stylesheet now

The duplicate selectors deserve a later focused refactor, but removing them while introducing Stays could accidentally alter completed Rooms, Guests, authentication, or dashboard behavior.

### 11. Alternative Approaches

#### Reuse .room-table

You could write:

```jsx
<table className="room-table">
```

That would immediately reuse existing table styles, but it would make the Stays module depend on a Room-specific CSS class. That creates misleading coupling.

#### Create a generic .data-table

A future cleanup could introduce:

- .data-table
- .data-table-wrapper

Then Rooms and Stays could share them.

That is a reasonable future refactor, but it would require changing the completed Rooms module. It is unnecessary for this milestone.

### 12. Industry Best Practices

- Use feature-specific class names where domain meaning matters.
- Reuse shared presentation primitives such as Card and status-badge foundations.
- Put horizontal scrolling on a table wrapper.
- Keep status names aligned with backend terminology.
- Avoid using color as the only status indicator; the text still says “Checked In” or “Checked Out.”
- Keep hover effects restrained.
- Avoid broad stylesheet cleanup while introducing new behavior.
- Test the UI at realistic Electron window sizes.

### 13. Summary

Your existing global.css already contains most of the required visual foundation. Add only:

- .stays-table-card
- .stays-table-wrapper
- .stays-table
- .stay-status-checked-in
- .stay-status-checked-out

Also change the success Card in StaysPage.jsx to:

```jsx
<Card className="stays-table-card">
```

Do not remove or rewrite existing Rooms and Guests styles during this step.

### 14. Small Quizzes Related to This Session

- Why is overflow-x: auto applied to the wrapper rather than the table?
- What problem does min-width: 900px solve?
- Why should Stays not use .status-occupied?
- What does border-collapse: collapse do?
- Why is .status-badge combined with a second status-specific class?
- Why are we deferring the duplicated CSS cleanup?

### 15. Suggested Next Step

After adding these styles, test the page with one Checked In record, one Checked Out record, and enough records to verify row alignment and horizontal scrolling inside both the browser and Electron.

---

## Milestone Verification Status

**Status:** All checked.

Excellent. The Stays read-only flow is working correctly.

Milestone 17 now includes:

- Protected /dashboard/stays route
- Sidebar navigation to Stays
- stayService.js
- getStays() using GET /stay
- Initial loading state
- Backend/network error state
- Intentional empty state
- Successful table rendering
- Array-response validation
- Safe null checkout handling
- Human-readable date and time formatting
- Price formatting without a hardcoded currency
- Checked In and Checked Out badges
- Stable stay_id React keys
- Horizontal table overflow protection
- Browser and Electron verification

Before marking the milestone complete, run:

```bash
npm run lint
```

Then perform one final regression check:

- Login and logout
- Dashboard protected routing
- Rooms page
- Guests page
- Stays page
- Browser rendering
- Electron rendering

Do not add room-number lookup, GuestStay integration, creation, editing, deletion, check-in, checkout, billing, or lifecycle actions in this milestone. Those belong to later milestones.

Once ESLint and the regression checks pass, Milestone 17: Stays Module Read-Only Foundation is complete.
