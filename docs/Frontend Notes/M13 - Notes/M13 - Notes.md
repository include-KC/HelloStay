# M13 - Notes

I’ll treat your attached milestone prompt as the working requirement for Milestone 13 and keep this step read-only: service layer, GET /guests, page states, and a simple guest display.

> Thought for 25s
## 1. Objective

Milestone 13 builds the Guests Module Read-Only Foundation.

**The goal is simple:**

**Create a safe frontend path from:**

```text
GuestsPage.jsx
   ↓
guestService.getGuests()
   ↓
apiClient.js
   ↓
FastAPI GET /guests
   ↓
SQLite guest records
```

This milestone must only read guests. No create, edit, delete, modals, forms, stay history, booking integration, or activity timeline yet. Your attached milestone prompt also clearly says the current task is limited to GET /guests, loading/error/empty/success states, and a simple read-only guest display.

## 2. Problem Analysis

Right now, GuestsPage exists only as a dashboard placeholder from Milestone 8. The backend already has guest functionality, but the frontend has not connected to it yet.

The backend route file confirms that the guest router uses this prefix:

```text
prefix = "/guests"
```

and exposes:

```python
@router.get("", response_model = list[GuestResponse])
def get_guest(...)
```

So the frontend should call:

```http
GET /guests
```

not:

```http
GET /guest
GET /guests/
GET /api/guests
```

unless your existing apiClient.js adds a prefix automatically.

The backend is already included in main.py through:

```python
app.include_router(guest_router)
```

and CORS allows the React dev server at http://localhost:5173, so the React app is allowed to call the backend during development.

## 3. High-Level Design

We will create one service file and update one page.

```text
frontend/src/services/guestService.js
frontend/src/pages/GuestsPage.jsx
```

**Data flow:**

```text
React component loads
   ↓
useEffect runs once
   ↓
GuestsPage calls loadGuests()
   ↓
loadGuests() calls guestService.getGuests()
   ↓
guestService calls apiRequest("/guests")
   ↓
apiClient sends request to FastAPI
   ↓
FastAPI returns guest list
   ↓
GuestsPage stores result in state
   ↓
UI renders loading, error, empty, or guest cards
```

This follows the same architectural pattern you already used in Rooms.

## 4. Concepts Involved
### Feature service file

A service file is a frontend file that groups API functions for one feature.

**For example:**

```text
roomService.js → room API calls
guestService.js → guest API calls
authService.js → auth API calls
```

We do this because GuestsPage.jsx should focus on UI behavior, not low-level HTTP request details.

**Bad pattern:**

```javascript
fetch("http://localhost:8000/guests")
```

directly inside GuestsPage.

**Better pattern:**

```javascript
guestService.getGuests()
```

inside GuestsPage.

This keeps the code cleaner and easier to change later.

### useState

useState stores values that can change while the component is visible.

For this page, we need:

```javascript
const [guests, setGuests] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState("");
```

**Meaning:**

```text
guests     → the guest list from backend
isLoading  → whether the request is currently running
error      → request failure message, if any
```
### useEffect

useEffect lets React run code after the component appears on screen.

In this milestone, we use it to fetch guests when GuestsPage loads.

```javascript
useEffect(() => {
  loadGuests();
}, []);
```

**The empty dependency array means:**

Run this once when the page first renders.
### UI states

Every production API page should handle at least four states:

```text
Loading → backend request is still running
Error   → backend request failed
Empty   → request succeeded, but no guests exist
Success → request succeeded and guests are displayed
```

This is what makes the app feel professional instead of fragile.

## 5. Folder/File Changes

**Create:**

```text
frontend/src/services/guestService.js
```

**Edit:**

```text
frontend/src/pages/GuestsPage.jsx
```

**Optional CSS addition:**

```text
frontend/src/styles/global.css
```

**Do not create these yet:**

```text
components/guests/GuestForm.jsx
components/guests/GuestModal.jsx
components/guests/GuestHistory.jsx
```

Those belong to later milestones.

## 6. Step-by-Step Explanation
### Step 1: Create guestService.js

This file belongs in:

```text
frontend/src/services/guestService.js
```

Its job is only to talk to guest-related backend endpoints.

For Milestone 13, it needs only one function:

```javascript
getGuests()
```
### Step 2: Update GuestsPage.jsx

**The page will:**

import React hooks,
import reusable UI components,
import guestService,
create state for guests/loading/error,
fetch guests on page load,
render the correct UI state.
### Step 3: Add simple guest-card UI

A guest card is better than a table for this beginner milestone because it is readable and easier to style.

**Each card should show:**

```text
Initials
Guest name
Phone number
ID proof type
ID proof number
Address
```
### Step 4: Verify in browser and backend

**You will verify:**

```text
/guests route opens inside dashboard
Network tab shows GET /guests
Backend terminal shows GET /guests
Guests display correctly
Empty state works if no guests exist
Error state works if backend is stopped
```
## 7. Implementation
### File 1: frontend/src/services/guestService.js

**Create this new file:**

```javascript
import { apiRequest } from "./apiClient.js";

export async function getGuests() {
  return apiRequest("/guests");
}
```

This keeps the API call small and readable.

Important: use "/guests" because the backend guest router has the prefix /guests.

### File 2: frontend/src/pages/GuestsPage.jsx

**Replace your current placeholder GuestsPage.jsx with this:**

```jsx
import { useEffect, useState } from "react";

import Card from "../components/ui/Card.jsx";
import Loading from "../components/ui/Loading.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import { getGuests } from "../services/guestService.js";

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

  useEffect(() => {
    async function loadGuests() {
      try {
        setIsLoading(true);
        setError("");

        const guestsData = await getGuests();

        if (Array.isArray(guestsData)) {
          setGuests(guestsData);
        } else {
          setGuests([]);
          setError("Unexpected guest data received from the backend.");
        }
      } catch (requestError) {
        setGuests([]);
        setError(
          requestError.message || "Unable to load guests. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadGuests();
  }, []);

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Guest Management</p>
          <h1 className="page-title">Guests</h1>
          <p className="page-description">
            View registered guest profiles from the HelloStay backend.
          </p>
        </div>
      </div>

      {isLoading && <Loading message="Loading guests..." />}

      {!isLoading && error && <ErrorMessage message={error} />}

      {!isLoading && !error && guests.length === 0 && (
        <Card>
          <div className="empty-state">
            <h2>No guests found</h2>
            <p>
              Guest records will appear here after they are added through the
              backend or a future create-guest screen.
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
### File 3: optional CSS addition

**Append this to your existing global CSS file. Do not replace your old CSS.**

```css
.guest-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.guest-card {
  display: grid;
  gap: 20px;
}

.guest-card__header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.guest-card__avatar {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #eef2ff;
  color: #273469;
  font-weight: 700;
}

.guest-card__name {
  margin: 0;
  font-size: 18px;
  color: #172033;
}

.guest-card__phone {
  margin: 4px 0 0;
  color: #667085;
  font-size: 14px;
}

.guest-card__details {
  display: grid;
  gap: 14px;
}

.guest-card__details div {
  display: grid;
  gap: 4px;
}

.guest-card__label {
  font-size: 12px;
  font-weight: 600;
  color: #667085;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.empty-state {
  display: grid;
  gap: 8px;
  text-align: center;
  padding: 28px;
}

.empty-state h2 {
  margin: 0;
  color: #172033;
}

.empty-state p {
  margin: 0;
  color: #667085;
}
```
## 8. Code Walkthrough
### guestService.js
```javascript
import { apiRequest } from "./apiClient.js";
```

This imports your common API helper from Milestone 5.

```javascript
export async function getGuests() {
  return apiRequest("/guests");
}
```

This creates a reusable guest API function.

**Later milestones can expand this file like this:**

```javascript
createGuest()
updateGuest()
deleteGuest()
```

But not now.

### GuestsPage.jsx
```javascript
const [guests, setGuests] = useState([]);
```

This stores the list of guests.

```javascript
const [isLoading, setIsLoading] = useState(true);
```

This starts as true because the page should immediately begin loading guest data.

```javascript
const [error, setError] = useState("");
```

This stores an error message when the request fails.

```javascript
useEffect(() => {
  async function loadGuests() {
    ...
  }

  loadGuests();
}, []);
```

The effect runs after the component appears.

We define loadGuests inside the effect because it is only needed there.

```javascript
const guestsData = await getGuests();
```

This calls the service layer instead of calling the backend directly from the page.

```javascript
if (Array.isArray(guestsData)) {
  setGuests(guestsData);
}
```

This is defensive coding. The backend should return a list, but the frontend still checks the shape before trusting it.

```jsx
{guests.map((guest) => (
  <Card key={guest.id}>
```

React needs a stable key when rendering lists. guest.id is the correct key because it comes from the database and uniquely identifies the guest.

## 9. Debugging Tips
### If the page shows an error

**Open browser DevTools → Network tab.**

**Check the request to:**

```http
GET /guests
```

**Look at:**

Status code
Request URL
Response body
Console errors

**Common status meanings:**

```text
200 → request worked
404 → wrong endpoint path
500 → backend error
CORS error → backend CORS config issue or wrong frontend origin
Failed to fetch → backend is probably not running
```
### If guests do not appear

**Open FastAPI Swagger UI and test:**

```http
GET /guests
```

If Swagger returns guests but React does not, the problem is likely in frontend API calling or rendering.

If Swagger also returns an empty list, the frontend is correct; your database simply has no guests yet.

### If you get an import error

**Check spelling carefully:**

```text
guestService.js
GuestsPage.jsx
```

**These are different:**

```text
guestService.js
GuestService.js
guestservice.js
```

On some systems, casing differences can break imports.

## 10. Common Mistakes
### Mistake 1: Calling fetch directly in GuestsPage

**Avoid this:**

```javascript
fetch("http://localhost:8000/guests");
```

**Use this:**

```javascript
getGuests();
```

The service layer keeps your architecture clean.

### Mistake 2: Adding create/edit/delete too early

This milestone is read-only. Adding forms now would mix too many concepts at once.

### Mistake 3: Using localStorage for guests

The backend is the source of truth. React should read guests from FastAPI.

### Mistake 4: Fetching guests from Electron main process

Electron main process manages desktop concerns. Guest data belongs to FastAPI and React renderer communication through HTTP.

**Correct responsibility split:**

```text
FastAPI       → guest business logic and database
React         → guest screen and UI state
apiClient     → HTTP request handling
Electron main → app window and desktop lifecycle
```
## 11. Alternative Approaches
### Option A: Guest cards

Best for this milestone.

**Pros:**

Simple
Readable
Good for beginner learning
Professional enough for V1 foundation

**Cons:**

Less compact when there are many guests
### Option B: Table

Good later when you add search, filters, sorting, and pagination.

**Pros:**

Compact
Admin-style
Good for large data

**Cons:**

Slightly more code
Harder to make visually clean at beginner stage
### Recommendation

Use cards for Milestone 13. Move to table or table-card hybrid later only after guest CRUD and search requirements become clearer.

## 12. Industry Best Practices

**Keep this pattern consistent across modules:**

```text
Page component      → owns screen state and rendering
Service file        → owns feature API calls
apiClient           → owns low-level HTTP behavior
Reusable UI         → owns common visual building blocks
Backend             → owns validation and database logic
```

This is a professional separation of concerns.

**Also, build feature modules in this order:**

```text
Read list
Read details
Create
Edit
Delete
Search/filter
Pagination
Advanced relationships
```

That is why Guests comes after Rooms and starts with read-only GET/list first. You already proved the pattern in Rooms, so now you are applying it to a second module.

## 13. Summary

**In Milestone 13, you should complete only this:**

```text
Create guestService.js
Add getGuests()
Connect GuestsPage to GET /guests
Add loading state
Add error state
Add empty state
Display guests in read-only cards
Keep Electron out of guest API logic
Do not add create/edit/delete yet
```

**Backend endpoint to use:**

```http
GET /guests
```

**Expected guest fields:**

```text
id
guest_name
guest_phone_number
guest_address
id_proof_type
id_proof_number
```
