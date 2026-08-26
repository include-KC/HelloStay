# M20 - Notes

## Milestone
**M20 — Stays Module UX Refinement and Code Cleanup**

## Project Baseline
- M17: Stays read foundation — complete
- M18: Stays create foundation — complete
- M19: Stays edit + delete foundation — complete
- M20: UX refinement + code cleanup — in progress

## Core M20 Direction
- Treat the verified M19 CRUD implementation as the baseline.
- Inspect before editing.
- Preserve working behavior.
- Improve UX consistency and maintainability.
- Prefer small, testable refactors over large rewrites.
- Keep `StaysPage` as the feature coordinator.
- Keep `stayService.js` as the Stay HTTP/service boundary.
- Use Guests and Rooms as architectural references without blindly copying them.
- Avoid unnecessary abstractions and broad CSS cleanup.

## Reference Implementations
### Guests
Useful patterns:
- Separate create/edit/delete state
- Field-level validation
- Changed-field detection
- Non-blocking refresh errors
- Inline delete confirmation
- Mutation-specific errors

### Rooms
Useful patterns:
- CRUD page structure
- Separate submitting/deleting state
- Form errors and page errors
- Success feedback
- Refresh behavior

## M20 Process
1. Understand
2. Inspect / measure
3. Identify one concrete problem
4. Make the smallest useful change
5. Test
6. Review
7. Repeat

## M20 Step 1 — Extract `StayForm`
### Goal
Remove duplicated create/edit form markup without moving business orchestration out of `StaysPage`.

### Responsibility Boundary
**StaysPage**
- Owns state
- Owns validation
- Coordinates API operations
- Handles refresh
- Handles edit/delete orchestration
- Owns page-level feedback

**StayForm**
- Renders form fields
- Displays validation errors
- Renders buttons
- Handles browser interaction through callbacks
- Does not call Stay APIs directly

### Component
Create:
`src/components/stays/StayForm.jsx`

Use a simple `mode` prop:
- `mode="create"`
- `mode="edit"`

Create mode includes:
- Room
- Price per night
- Check-in
- Stay status
- Create Stay

Edit mode includes:
- Room
- Price per night
- Check-in
- Save Changes
- Cancel

Do not add `stay_status` to edit unless the backend contract explicitly permits it.

### Parent → Child Data Flow
Create:
- `formData={stayForm}`
- `onChange={handleFormChange}`
- `onSubmit={handleSubmit}`

Edit:
- `formData={editStayForm}`
- `onChange={handleEditFormChange}`
- `onSubmit={handleEditSubmit}`
- `onCancel={handleCancelEdit}`

The state remains in `StaysPage`.

## M20 Step 2 — Room Display Refinement
### Goal
Display a human-readable room number instead of only the raw `room_id`.

### Raw Data
Keep:
`stay.room_id`

Do not mutate Stay objects.

### Derived Lookup
Create a derived lookup from the existing `rooms` data:

```js
const roomNumberById = useMemo(() => {
  return Object.fromEntries(
    rooms.map((room) => [
      room.id,
      room.room_number,
    ]),
  );
}, [rooms]);
```

### Display Helper
Place this helper outside the `StaysPage` component alongside other small helpers:

```js
function getRoomDisplayName(roomId, roomNumberById) {
  const roomNumber = roomNumberById[roomId];

  if (roomNumber === undefined) {
    return `Room ID: ${roomId}`;
  }

  return `Room ${roomNumber}`;
}
```

### Table Usage
Replace raw room display with:

```jsx
{getRoomDisplayName(
  stay.room_id,
  roomNumberById,
)}
```

### Fallback
If the Room lookup is unavailable:
- Do not crash.
- Fall back to `Room ID: <id>`.

## Current Debugging Point
ESLint reported unused variables for:
- `getRoomDisplayName`
- `roomNumberById`
- `handleFormChange`
- additional truncated errors

The likely intended wiring is:
- Use `getRoomDisplayName(stay.room_id, roomNumberById)` in the Stay table.
- Pass `onChange={handleFormChange}` to the create `StayForm`.
- Pass `onChange={handleEditFormChange}` to the edit `StayForm`.
- Ensure `StayForm` uses its generic `formData` and `onChange` props rather than page-specific state names.

Do not delete these functions merely to silence ESLint; they are intended to be consumed by the refactored component/table.

## Testing Checklist
After each small change verify:
- Stays page loads
- Rooms load
- Stays load
- Create works
- Validation works
- Edit works
- Cancel works
- Delete works
- Room display shows the room number
- Missing room lookup falls back safely
- No React console errors
- ESLint is clean

## Important Architectural Rules
- Do not put API calls inside `StayForm`.
- Do not create generic CRUD/form abstractions without a demonstrated need.
- Do not mutate API Stay objects for display.
- Do not duplicate Room API logic inside `stayService.js`.
- Do not clean all of `global.css` prematurely.
- Do not rewrite the entire `StaysPage.jsx` when a small change is sufficient.

---

## Source Conversation Reference

The uploaded source is the working M20 project conversation. The notes above are a structured extraction of its project decisions, implementation steps, architectural boundaries, and current next actions.

Source file:
`ChatGPT-M20 — Stays Module UX Refinement and Code Cleanup-20260826-1516.md`
