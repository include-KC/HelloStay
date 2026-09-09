# M21 --- GuestStay Read-Only Foundation

## 1. Milestone Overview

**Milestone:** M21 --- GuestStay Read-Only Foundation\
**Status:** ✅ Complete\
**Scope:** First frontend integration of the `GuestStay` relationship
entity.

### Primary objective

Establish a read-only GuestStay feature with:

-   `GET /guest-stays`
-   a GuestStay frontend service
-   a `GuestStaysPage.jsx` page
-   protected route integration
-   dashboard navigation
-   loading state
-   error state
-   empty state
-   successful data state
-   read-only relationship display
-   shared/reusable UI styling

### Explicitly outside M21

The following are not part of M21:

-   GuestStay creation
-   GuestStay editing
-   GuestStay deletion
-   guest assignment workflow
-   changing primary-guest status
-   search
-   filtering
-   pagination
-   sorting
-   complex Guest/Stay lookup UI
-   additional state-management libraries
-   Electron main-process/preload changes
-   M24-style broader UX refinement

Future create/edit/delete functionality belongs to later GuestStay
milestones.

------------------------------------------------------------------------

# 2. Problem Analysis

## GuestStay is a relationship entity

Rooms, Guests, and Stays are independent domain entities. `GuestStay` is
different: it represents a relationship between an existing Guest and an
existing Stay.

``` text
Guest
  │
  │
  ▼
GuestStay
  │
  │
  ▼
Stay
```

The backend model contains:

``` text
GuestStay
├── id
├── guest_id
├── stay_id
└── is_primary_guest
```

The relationships are:

``` text
guest_id → guests.id
stay_id  → stays.stay_id
```

There is also a uniqueness constraint on:

``` text
guest_id + stay_id
```

so the same guest/stay pair cannot be represented twice.

### Why this matters

GuestStay should not be treated as "just another CRUD table." The
important domain concept is the relationship it represents.

For example:

``` text
Stay #7
   │
   ├── Guest #5
   ├── Guest #8
   └── Guest #11
```

and:

``` text
Guest #5
   │
   ├── Stay #7
   ├── Stay #18
   └── Stay #31
```

The relationship entity allows both sides to participate in multiple
relationships.

------------------------------------------------------------------------

# 3. Backend API Contract

The documented GuestStay API area is:

``` text
POST   /guest-stays
GET    /guest-stays
GET    /guest-stays/{guest_stay_id}
PUT    /guest-stays/{guest_stay_id}
DELETE /guest-stays/{guest_stay_id}
```

M21 uses only:

``` http
GET /guest-stays
```

The frontend should consume the actual backend contract rather than
inventing response fields.

The confirmed GuestStay data used by the M21 UI is:

``` text
id
guest_id
stay_id
is_primary_guest
```

Example representation:

``` json
{
  "id": 1,
  "guest_id": 4,
  "stay_id": 8,
  "is_primary_guest": true
}
```

The important discipline is:

> Backend contract first. Do not design the frontend around assumptions
> about fields the API does not provide.

------------------------------------------------------------------------

# 4. High-Level Architecture

The completed flow is:

``` text
React GuestStaysPage
        │
        ▼
guestStayService.js
        │
        ▼
apiClient.js
        │
        ▼
GET /guest-stays
        │
        ▼
FastAPI
        │
        ▼
GuestStay data
        │
        ▼
React state
        │
        ▼
Read-only table
```

The responsibility boundaries are:

  Layer               Responsibility
  ------------------- ---------------------------------
  React page          UI, state, lifecycle, rendering
  GuestStay service   GuestStay API operations
  `apiClient`         Shared HTTP communication
  FastAPI             Backend business/data layer
  Electron            Desktop responsibilities only

## Electron boundary

Ordinary FastAPI HTTP communication belongs to the React renderer.

M21 therefore does not require:

-   Electron main-process changes
-   preload changes
-   new IPC channels

The architecture remains:

``` text
Electron Main
    │
    └── Desktop responsibilities

Preload
    │
    └── No new M21 IPC

React Renderer
    │
    ├── GuestStaysPage
    ├── UI state
    └── guestStayService

FastAPI
    │
    └── GuestStay business/data
```

------------------------------------------------------------------------

# 5. Existing Project Patterns

M21 deliberately reuses the architecture already established by Rooms,
Guests, and Stays.

## Service pattern

The project already has:

``` text
Page
  ↓
Feature service
  ↓
apiClient
  ↓
FastAPI
```

For example, the Stays service uses a thin function such as:

``` js
export async function getStays() {
  return apiRequest("/stay");
}
```

GuestStay follows the same pattern:

``` text
GuestStaysPage
      ↓
guestStayService.js
      ↓
apiRequest()
      ↓
GET /guest-stays
```

### Important architectural rule

Do not put this directly inside the page:

``` js
apiRequest("/guest-stays")
```

The page should depend on the feature service instead.

This keeps HTTP communication separated from UI concerns.

------------------------------------------------------------------------

# 6. Frontend Files and Responsibilities

The M21 foundation involves:

``` text
src/
├── components/
│   └── ui/
│       ├── Card.jsx
│       ├── ErrorMessage.jsx
│       └── Loading.jsx
│
├── layouts/
│   └── DashboardLayout.jsx
│
├── pages/
│   └── GuestStaysPage.jsx
│
├── routes/
│   └── AppRoutes.jsx
│
├── services/
│   └── guestStayService.js
│
└── styles/
    └── global.css
```

### `guestStayService.js`

Owns the frontend API boundary for GuestStay operations.

M21 uses its read operation.

### `GuestStaysPage.jsx`

Owns:

-   UI state
-   initial data loading
-   error handling
-   empty-state rendering
-   successful rendering
-   read-only table presentation

### `AppRoutes.jsx`

Connects the page to:

``` text
/dashboard/guest-stays
```

### `DashboardLayout.jsx`

Provides the dashboard navigation entry:

``` text
Guest Stays
```

### `global.css`

Provides reusable visual foundations rather than unnecessary
module-specific duplication.

------------------------------------------------------------------------

# 7. M21.1 --- GuestStay Service

## Goal

Create a thin service layer for the GuestStay API.

Conceptually:

``` js
import { apiRequest } from "./apiClient";

export async function getGuestStays() {
  return apiRequest("/guest-stays");
}
```

## Why a service layer?

The page should not be responsible for knowing how HTTP communication
works.

The boundary becomes:

``` text
GuestStaysPage
      ↓
guestStayService
      ↓
apiClient
      ↓
FastAPI
```

This is consistent with the existing application architecture.

## Concepts involved

### Separation of concerns

The page answers:

> What should the user see?

The service answers:

> Which GuestStay API operation should be called?

The API client answers:

> How is the HTTP request performed?

------------------------------------------------------------------------

# 8. M21.2 --- GuestStaysPage Foundation

## Goal

Create a page that can load GuestStay records and represent the complete
basic request lifecycle.

The page state is conceptually:

``` js
const [guestStays, setGuestStays] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState("");
```

## Four important UI states

``` text
Loading
   ↓
Error / Empty / Success
```

More precisely:

``` text
Request in progress
       │
       ├── request fails → Error
       │
       └── request succeeds
              │
              ├── [] → Empty
              │
              └── records → Success
```

An empty array is a valid successful response.

It is not an API error.

------------------------------------------------------------------------

# 9. React `useState`

`useState` provides component state that React tracks.

Example:

``` js
const [guestStays, setGuestStays] = useState([]);
```

The two values mean:

``` text
guestStays
    ↓
current state

setGuestStays
    ↓
state update function
```

When:

``` js
setGuestStays(data);
```

is called, React knows the component's state changed and schedules a
render using the new data.

## Why not use a normal JavaScript variable?

A normal variable does not provide React's state-update/rendering
behavior.

For UI data that changes asynchronously, React state is the appropriate
mechanism.

------------------------------------------------------------------------

# 10. React `useEffect`

The initial GuestStay API request belongs in an effect.

Conceptually:

``` text
Component renders
       ↓
useEffect runs
       ↓
getGuestStays()
       ↓
API response
       ↓
setGuestStays(...)
       ↓
React renders the records
```

The empty dependency array:

``` js
}, []);
```

means the initial effect runs for that mounted page instance.

This follows the same fundamental pattern used by the existing Guests
and Stays pages.

------------------------------------------------------------------------

# 11. Asynchronous Requests and Cleanup

The page performs an asynchronous operation.

A cleanup mechanism is used so that a result does not get applied after
the component has been unmounted.

Conceptually:

``` text
Component mounted
      ↓
Request starts
      ↓
Component may unmount
      ↓
Request eventually resolves
      ↓
Check whether result should still be applied
```

This is a practical pattern for handling asynchronous effects safely.

## Important concept

The cleanup flag does not cancel the network request itself.

It prevents the completed result from being applied when the component
is no longer the relevant mounted instance.

------------------------------------------------------------------------

# 12. Defensive API Response Validation

The page validates that the returned data has the expected collection
shape.

Conceptually:

``` js
if (!Array.isArray(guestStaysData)) {
  throw new Error(
    "Unexpected GuestStay data received from the backend.",
  );
}
```

## Why?

The page expects a list.

Without validation, code could accidentally attempt to render an
unexpected object or other value as though it were an array.

This is a small but useful production-minded defensive check.

------------------------------------------------------------------------

# 13. Conditional Rendering

The page distinguishes between:

``` text
isLoading
error
empty data
non-empty data
```

This is conditional rendering.

The same component can therefore represent different UI states based on
current state.

### State model

``` text
isLoading = true
    → Loading

isLoading = false
error exists
    → Error

isLoading = false
no error
guestStays.length === 0
    → Empty

isLoading = false
no error
guestStays.length > 0
    → Success
```

This makes the UI behavior explicit instead of treating every API result
as success.

------------------------------------------------------------------------

# 14. M21.3 --- Route Integration

## Goal

Make the page reachable through React Router.

The intended URL is:

``` text
/dashboard/guest-stays
```

The page belongs inside the protected dashboard route hierarchy.

Conceptually:

``` text
Browser URL
    │
    │ /dashboard/guest-stays
    ▼
AppRoutes.jsx
    │
    ▼
ProtectedRoute
    │
    ▼
DashboardLayout
    │
    ▼
GuestStaysPage
```

## Why nested routing?

The existing dashboard uses nested routes such as:

``` text
/dashboard/rooms
/dashboard/guests
/dashboard/stays
```

The child route should therefore be:

``` jsx
path="guest-stays"
```

rather than repeating the parent path.

Conceptually:

``` text
/dashboard
+
guest-stays
=
/dashboard/guest-stays
```

## Concepts involved

### React Router

React Router decides which component corresponds to the current URL.

### Nested routes

A child route inherits the parent route hierarchy.

### Protected routes

Guest Stays is a dashboard feature and therefore remains within the
authenticated/protected dashboard structure.

------------------------------------------------------------------------

# 15. M21.4 --- Dashboard Navigation

## Goal

Expose the page through the dashboard sidebar.

The navigation item is conceptually:

``` js
{
  label: "Guest Stays",
  to: "/dashboard/guest-stays",
}
```

The resulting flow is:

``` text
Sidebar
   ↓
Guest Stays
   ↓
/dashboard/guest-stays
   ↓
GuestStaysPage
```

## `NavLink` and active navigation

The existing navigation system uses React Router navigation behavior and
active-route styling.

The important concepts are:

-   the `to` property controls the destination URL
-   `isActive` can determine whether the current route matches the
    navigation item
-   active navigation provides visual feedback about the current page

## Why not create a new navigation component?

The project already has a navigation system.

Good architecture favors:

``` text
Existing infrastructure
       ↓
Add one new navigation item
```

rather than:

``` text
New feature
       ↓
Create another navigation system
```

------------------------------------------------------------------------

# 16. M21.5 --- Read-Only GuestStay Data Display

## Goal

Replace the temporary success message with actual GuestStay records.

The table displays:

  -----------------------------------------------------------------------
  Field                               Meaning
  ----------------------------------- -----------------------------------
  GuestStay ID                        GuestStay relationship ID

  Guest ID                            Associated guest ID

  Stay ID                             Associated stay ID

  Primary Guest                       Whether the relationship identifies
                                      the primary guest
  -----------------------------------------------------------------------

Example:

``` text
GuestStay ID | Guest ID | Stay ID | Primary Guest
--------------------------------------------------
1            | 5        | 12      | Yes
2            | 8        | 12      | No
```

The page uses:

``` jsx
guestStays.map(...)
```

to render the records.

------------------------------------------------------------------------

# 17. `.map()` and Array Rendering

An API returns multiple GuestStay records.

React can render a collection by mapping over the array:

``` text
guestStays
   ↓
.map(...)
   ↓
one table row per GuestStay
```

Conceptually:

``` text
[
  GuestStay 1,
  GuestStay 2,
  GuestStay 3
]
        ↓ map()
[
  <row 1>,
  <row 2>,
  <row 3>
]
```

This is a fundamental React pattern for rendering API collections.

------------------------------------------------------------------------

# 18. React `key` Values

Each rendered row needs a stable React key.

The appropriate key is:

``` jsx
<tr key={guestStay.id}>
```

because `guestStay.id` represents the identity of the GuestStay record.

Do not use:

``` jsx
key={index}
```

when a stable domain identifier exists.

### Principle

``` text
Stable entity identity
        ↓
React key
```

rather than:

``` text
Array position
        ↓
React key
```

------------------------------------------------------------------------

# 19. Boolean Rendering

The backend value:

``` text
is_primary_guest
```

is Boolean.

The UI presents it as:

``` jsx
{guestStay.is_primary_guest ? "Yes" : "No"}
```

This uses JavaScript's ternary operator:

``` text
condition ? trueValue : falseValue
```

Therefore:

``` text
true  → Yes
false → No
```

For M21 this is intentionally simple and readable.

------------------------------------------------------------------------

# 20. Why We Did Not Fetch Guest Names and Stay Details

A key design decision was whether the GuestStay table should display
only IDs or make additional API requests.

## Approach A --- Display relationship IDs

``` text
GuestStay #12
Guest ID: 5
Stay ID: 7
Primary: Yes
```

### Advantages

-   simplest
-   requires only the GuestStay API
-   faithful to the backend response
-   low complexity
-   appropriate for the M21 foundation

### Disadvantage

-   less human-friendly

## Approach B --- Fetch Guests and Stays separately

Conceptually:

``` text
GET /guest-stays
GET /guests
GET /stay
```

Then map IDs to names.

### Advantages

-   more readable UI

### Disadvantages

-   multiple API calls
-   multiple loading/error concerns
-   relationship mapping complexity
-   unnecessary complexity for M21

## Approach C --- Backend returns nested relationships

Conceptually:

``` text
GuestStay
 ├── guest
 └── stay
```

### Advantages

-   richer UI
-   fewer frontend joins

### Disadvantage

This is valid only if the actual backend contract provides those nested
objects.

The frontend must not invent them.

## M21 decision

Start with the simplest representation supported by the actual backend
response.

------------------------------------------------------------------------

# 21. M21 UI/CSS Refinement

The goal of UI refinement was not a redesign.

The milestone plan separates:

``` text
M21 - GuestStay Read-Only Foundation
        ↓
M22 - GuestStay Create and Guest Assignment Foundation
        ↓
M23 - GuestStay Edit and Delete Foundation
        ↓
M24 - GuestStay UX Refinement and Code Cleanup
```

Therefore M21 refinement should only make the existing read-only table
fit the established HelloStay visual system.

## Reuse before creating

Before writing new CSS, inspect the existing shared CSS.

Look for reusable foundations such as:

``` text
.table-wrapper
.data-table
.empty-state
Card
Loading
ErrorMessage
```

The principle is:

``` text
Existing design system
        ↓
Reuse where possible
        ↓
Add only genuinely missing styling
```

## Separation of structure and presentation

JSX defines the structure:

> There is a GuestStay table.

CSS defines presentation:

> The table has spacing, borders, typography, overflow behavior, etc.

This keeps responsibilities separate.

## Feature-specific CSS

Feature-specific CSS is appropriate only when the shared design system
cannot satisfy a real GuestStay-specific requirement.

Avoid creating many unnecessary classes such as:

``` text
guest-stays-table
guest-stays-header
guest-stays-row
guest-stays-card
guest-stays-status
```

when shared styles already work.

## M21 CSS conclusion

The existing shared table foundation was sufficient for the current
GuestStay page.

Therefore:

``` text
New dedicated GuestStay CSS
        ↓
Not currently required
```

The page can reuse shared styling.

------------------------------------------------------------------------

# 22. Responsive Table Considerations

The existing Stays module established a useful precedent:

-   dedicated table styling
-   horizontal overflow protection
-   minimum table width
-   restrained presentation
-   reuse of shared Card/state components

Guest Stays should follow the same pattern rather than inventing a
separate design system.

Conceptually:

``` text
Card
  ↓
table-wrapper
  ↓
data-table
```

This keeps the table usable when the application window is resized.

------------------------------------------------------------------------

# 23. Industry and Engineering Practices Applied

## Backend contract first

Do not design React from assumptions.

## Service boundary

``` text
Page
 ↓
Service
 ↓
API Client
 ↓
Backend
```

## Explicit UI states

Treat these separately:

``` text
Loading
Error
Empty
Success
```

An empty collection is not an error.

## Stable identity

Use the domain ID as the React key.

## Minimal transformation

Keep backend values as backend values unless a presentation
transformation is actually needed.

## Reuse existing infrastructure

Do not create duplicate navigation, HTTP, or CSS systems for a new
feature.

## Minimal abstraction

M21 does not require:

-   Redux
-   Zustand
-   React Query
-   generic CRUD hooks
-   generic relationship engines

unless an actual project requirement later justifies them.

## Keep milestone boundaries

Do not implement future functionality early merely because it is
technically possible.

------------------------------------------------------------------------

# 24. Testing and Verification

The final verification covered the following.

## Guest Stays page

-   page opens successfully
-   GuestStay records load correctly
-   table renders correctly

## Loading state

The page displays the loading UI while the request is in progress.

## Error state

A backend/API failure is represented as an error state rather than a
crash.

## Empty state

When the backend returns:

``` json
[]
```

the page displays an empty state.

## Navigation

The dashboard sidebar contains:

``` text
Guest Stays
```

and navigates to:

``` text
/dashboard/guest-stays
```

The active navigation styling works.

## Responsive behavior

The page remains usable when the Electron window is resized.

## Regression testing

Existing:

``` text
Guests
Stays
Rooms
```

functionality remains unaffected.

------------------------------------------------------------------------

# 25. Final M21 Scope

## Included

``` text
GuestStay
├── Read
├── Display
├── Loading
├── Error
├── Empty state
├── Success state
├── Route
├── Dashboard navigation
└── Shared table styling
```

## Not included

``` text
GuestStay
├── Create       ❌
├── Edit         ❌
├── Delete       ❌
├── Assignment   ❌
├── Search       ❌
├── Filtering    ❌
├── Pagination   ❌
├── Sorting      ❌
└── Advanced UX  ❌
```

------------------------------------------------------------------------

# 26. M21 Completion Status

  M21 Step                                Status
  ------------------------------------- --------
  M21.1 --- GuestStay service                 ✅
  M21.2 --- GuestStaysPage foundation         ✅
  M21.3 --- Route integration                 ✅
  M21.4 --- Dashboard navigation              ✅
  M21.5 --- Read-only data display            ✅
  Loading state                               ✅
  Error state                                 ✅
  Empty state                                 ✅
  Successful list state                       ✅
  Stable React keys                           ✅
  Backend contract respected                  ✅
  Shared UI classes reused                    ✅
  New dedicated CSS required                  No
  Create functionality avoided                ✅
  Edit/delete avoided                         ✅
  Guest assignment avoided                    ✅
  Electron changes avoided                    ✅
  Final verification                          ✅

## Final status

**M21 --- GuestStay Read-Only Foundation: COMPLETE**

No further M21 feature expansion should be made unless the milestone
plan explicitly changes.

------------------------------------------------------------------------

# 27. Key Concepts to Remember

The most important learning points from M21 are:

1.  **GuestStay is a relationship entity**, not simply another
    independent CRUD entity.
2.  **Read the backend contract before designing the frontend.**
3.  **Pages should consume feature services instead of performing HTTP
    directly.**
4.  **`useState` stores UI data that changes over time.**
5.  **`useEffect` is used for the initial asynchronous data-loading side
    effect.**
6.  **Async effects need cleanup-aware result handling.**
7.  **Loading, error, empty, and success are separate UI states.**
8.  **An empty array is a successful response.**
9.  **`Array.isArray()` provides defensive response validation.**
10. **`.map()` renders API collections into React elements.**
11. **Stable domain IDs should be used as React keys.**
12. **Boolean backend values can be presented simply with a ternary
    expression.**
13. **Nested React Router routes inherit their parent path.**
14. **Navigation should reuse the existing dashboard infrastructure.**
15. **Reuse shared CSS before creating feature-specific CSS.**
16. **JSX handles structure; CSS handles presentation.**
17. **Electron IPC is unnecessary for ordinary renderer-to-FastAPI HTTP
    communication.**
18. **Keep milestone boundaries clear and avoid premature future
    functionality.**

------------------------------------------------------------------------

# 28. Small Quiz / Review Questions

Use these to check understanding rather than memorizing code.

1.  Why does `GuestStaysPage` call `getGuestStays()` instead of calling
    `fetch()` directly?
2.  Why is `[]` from `/guest-stays` a successful response rather than an
    error?
3.  Why does the table use `guestStay.id` as the React key?
4.  Why did M21 avoid fetching guest names and stay details?
5.  Which layer should change if `/guest-stays` changes?
6.  Which layer should change if the table's visual appearance changes?
7.  Why did M21 not require Electron main-process or preload changes?
8.  What is the difference between an entity and a relationship entity?
9.  Why is a service boundary useful?
10. Why should reusable CSS be preferred before creating
    feature-specific CSS?
11. What does the empty dependency array in `useEffect(..., [])`
    signify?
12. What does `isActive` provide in dashboard navigation?
13. Why should array indexes generally not be used as React keys when
    stable IDs exist?
14. What is the purpose of defensive `Array.isArray()` validation?
15. Why should M21 not implement GuestStay create/edit/delete
    functionality?

------------------------------------------------------------------------

# 29. Compact Architecture Reference

``` text
                    FastAPI
                       │
                       │ GET /guest-stays
                       ▼
                   apiClient
                       │
                       ▼
              guestStayService
                       │
                       ▼
              GuestStaysPage
                 │          │
                 │          └── UI state
                 │
                 ▼
          Loading / Error /
          Empty / Success
                 │
                 ▼
             Data Table
                 │
                 ▼
       /dashboard/guest-stays
                 │
                 ▼
          Dashboard Sidebar
```

The central principle is:

``` text
Understand the relationship
        ↓
Verify the backend contract
        ↓
Reuse the existing architecture
        ↓
Build the smallest read-only frontend foundation
        ↓
Verify every UI state
        ↓
Respect milestone boundaries
```

------------------------------------------------------------------------

# 30. Source Fidelity Note

This document is a comprehensive restructuring of the uploaded M21
session export.

It preserves the important technical implementation details, concepts,
reasoning, decisions, milestone boundaries, testing outcomes, and review
questions while removing conversational repetition such as repeated
confirmations and "tell me when you're done" prompts.

Where the source presented the same concept multiple times, the material
has been consolidated into a single clearer section rather than
duplicated verbatim.

The source export also contains historical intermediate statements such
as "M21 is not complete yet" from earlier stages. The final status is
based on the later verified completion state in the same source:

**M21 is complete.**
