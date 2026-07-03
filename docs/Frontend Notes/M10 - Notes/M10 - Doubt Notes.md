# M10 - Doubt Notes

## Objective

Understand what state means in React and why it is important for building HelloStay screens like login, rooms list, forms, loading messages, and error messages.

---

## Problem Analysis

In normal JavaScript, we can store data in variables:

```js
let count = 0;
```

But React does not automatically update the screen when a normal variable changes.

React needs a special kind of data that says:

> “This value belongs to the UI, and when it changes, React should show the updated UI.”

That special data is called **state**.

---

## What is State in React?

**State is data that a React component remembers and uses to control what appears on the screen.**

For example, in HelloStay:

| UI situation | Possible state |
|---|---|
| Login form username | `username` |
| Login form password | `password` |
| Rooms loaded from backend | `rooms` |
| API request running | `isLoading` |
| API failed | `error` |
| Sidebar open or closed | `isSidebarOpen` |

So state is not just “data”. It is data that affects the UI.

---

## Simple Example

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <p>Count is: {count}</p>
      <button onClick={handleClick}>Increase</button>
    </div>
  );
}

export default Counter;
```

---

## Code Walkthrough

```jsx
const [count, setCount] = useState(0);
```

This creates state.

- `count` is the current value.
- `setCount` is the function used to update the value.
- `useState(0)` means the initial value is `0`.

When this runs:

```jsx
setCount(count + 1);
```

React updates `count`, then re-renders the component.

**Re-render** means React runs the component again and updates the visible UI.

---

## Normal Variable vs React State

### Normal Variable

```jsx
function Counter() {
  let count = 0;

  function handleClick() {
    count = count + 1;
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

This changes the JavaScript variable, but React does not know that the screen should update.

### React State

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

Here React knows the value changed, so it updates the UI.

---

## HelloStay Example

In the Rooms module, we may have state like this:

```jsx
const [rooms, setRooms] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState("");
```

Meaning:

### `rooms`

Stores the list of rooms coming from the backend.

### `isLoading`

Controls whether we show “Loading rooms...”.

### `error`

Stores an error message if the backend request fails.

A screen can then decide what to display:

```jsx
if (isLoading) {
  return <p>Loading rooms...</p>;
}

if (error) {
  return <p>{error}</p>;
}

return (
  <ul>
    {rooms.map((room) => (
      <li key={room.id}>{room.room_number}</li>
    ))}
  </ul>
);
```

This is the main idea:

> **State controls what the user sees.**

---

## Concepts Involved

### 1. Component Memory

React components are functions. Normally, when a function finishes running, its local variables disappear.

But React state is remembered between renders.

That is why this works:

```jsx
const [username, setUsername] = useState("");
```

React remembers the latest `username` value even when the component re-renders.

---

### 2. Re-rendering

When state changes, React re-renders the component.

Example:

```jsx
setUsername("admin");
```

React says:

> “The data changed. I should run this component again and update the UI.”

---

### 3. State Should Not Be Changed Directly

Do not do this:

```jsx
count = count + 1;
```

Do this:

```jsx
setCount(count + 1);
```

React state must be updated using the setter function.

---

## Common Mistakes

### Mistake 1: Using Normal Variables for UI Data

Bad:

```jsx
let error = "Invalid username";
```

Better:

```jsx
const [error, setError] = useState("Invalid username");
```

Use state when the value affects the screen.

---

### Mistake 2: Changing State Directly

Bad:

```jsx
rooms.push(newRoom);
setRooms(rooms);
```

Better:

```jsx
setRooms([...rooms, newRoom]);
```

React works best when we create a new array/object instead of modifying the old one directly.

---

### Mistake 3: Creating Too Much State

Not every value needs state.

For example:

```jsx
const fullName = firstName + " " + lastName;
```

If `fullName` can be calculated from existing state, do not create separate state for it.

---

## Industry Best Practice

Use state only for data that:

- Changes over time.
- Affects what the user sees.
- Cannot simply be calculated from other existing values.

In HelloStay, good examples of state are:

```jsx
const [rooms, setRooms] = useState([]);
const [formData, setFormData] = useState({});
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState("");
```

Bad example:

```jsx
const [roomCount, setRoomCount] = useState(rooms.length);
```

Because `roomCount` can be calculated:

```jsx
const roomCount = rooms.length;
```

---

## Summary

State in React means:

> **Data remembered by a component that controls the UI.**

When state changes:

1. React remembers the new value.
2. React re-renders the component.
3. The screen updates.

For HelloStay, state will be used heavily in forms, API data, loading states, errors, authentication, dashboard views, rooms, guests, stays, and bookings.

---

## Small Quiz

### Questions

1. What is the difference between a normal variable and React state?
2. Why do we use `setCount()` instead of changing `count` directly?
3. In a rooms list page, which of these should be state?
   - `rooms`
   - `isLoading`
   - `error`
   - `rooms.length`

### Answer

`rooms`, `isLoading`, and `error` should be state.

`rooms.length` can be calculated from `rooms`.

---

## Suggested Next Step

Next, learn `useState` deeply by building a small input field where typing into the input updates text on the screen.
