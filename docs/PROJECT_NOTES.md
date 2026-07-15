# HelloStay Project Notes

## Product Vision
HelloStay is designed as a general-purpose hotel management system rather than a custom solution for a single hotel.

### Target Market
- Small hotels
- Medium hotels
- Guest houses
- Lodges
- Resorts

### Long-Term Goal
Allow hotel owners from different countries to use the same application with minimal configuration.

---

## Future Requirements

### Hotel Registration
During initial setup, the application should allow the hotel owner to register: Hotel Name, Country, Address, Contact Information, Hotel Facilities (WiFi, Restaurant, Parking, Laundry, Swimming Pool, etc.).

### Multi-Currency Support
The application should support multiple currencies based on the hotel's country (INR, USD, EUR, GBP, etc.). Planned for future implementation.

### Room Image Management
During room creation, the hotel owner should be able to: Add, Update, and Remove room images.

### Customer Identity Storage
Customer records should support storing scanned identification documents (Passport, National ID, Driving License).

### OCR-Based Customer Registration
Future versions may support automatic extraction of customer information from scanned identity documents.

### Billing System
During checkout, the application should: Generate bill automatically, Calculate charges, Produce printable invoice. Printing support should be available from within the application.


### Frontend & Desktop Requirements Converted From Previous Architecture Decisions
These requirements are no longer treated as completed frontend architecture decisions because the frontend is being rebuilt from scratch. They are preserved here as future requirements to revisit during the new React/Electron implementation.

#### Future Requirement FE-59: UI/UX Design System
**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 59 (Accepted)

**Stack:** React + Vite, Tailwind CSS, Lucide React, Framer Motion, Electron.
**Design Language:** Inspired by Linear, Notion, Stripe Dashboard. Corner radius 10-14px. Soft shadows. Premium typography. Light/dark mode. Smooth animations.
**Layout:** Desktop-first, collapsible sidebar, breadcrumb navigation, toast notifications, keyboard shortcuts, search everywhere, empty states.


#### Future Requirement FE-60: Module Specifications & Features
**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 60 (Accepted)

Complete feature requirements and role-based permissions for all 18 modules documented. Owner gets full access. Roles: Receptionist, Room Manager, Housekeeping, Accountant, Security, Custom. Employees never see management modules.


#### Future Requirement FE-61: Dynamic UI Configuration & Setup Flow
**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 61 (Accepted)

Sidebar dynamically adapts to hotel's registered facilities (e.g., no Restaurant tab if not configured). Strict setup flow: Installer → RegisterOwner → RegisterHotel → Dashboard. localStorage heavily used for multi-step setup.


#### Future Requirement FE-62: Multi-Currency Support & Flexible Room Types
**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 62 (Accepted)

Country/Currency selection during setup. Dynamic currency display from localStorage. Searchable room type selector with 20 presets + custom input. Inline status change in Rooms table.


#### Future Requirement FE-63: Role-Based Access Control (RBAC) & Module Visibility
**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 63 (Accepted)

Three login roles: Owner (full), Manager (Dashboard, Rooms, Inventory, Expenses), Employee (Dashboard, Rooms, Inventory). Role stored in localStorage. Sidebar filters nav items by role.


#### Future Requirement FE-64: Full Module Implementation Strategy
**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 64 (Accepted)

All 10 remaining modules implemented with consistent architecture: useState + lazy initialization from localStorage, Filter/Sort → Display → Mutate → Write-back pattern, data table/card grid with sort/search/filter/pagination, Add/Edit/View modals, inline actions, stats cards.


#### Future Requirement FE-65: Bookings Module Data Model
**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 65 (Accepted)

Booking stores guest info, room assignment, dates, status (Reserved/Checked In/Checked Out/Cancelled), auto-calculated total, payment tracking. Room availability validated against date conflicts.


#### Future Requirement FE-66: Guest Profile Architecture
**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 66 (Accepted)

Guests as independent profiles matched to bookings at runtime by name. Card-based layout with avatar initials, stay history from bookings.


#### Future Requirement FE-67: HR & Payroll System Design
**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 67 (Accepted)

Tab-based interface: Attendance (daily marking), Payroll (monthly calculation), Payslips. Salary = perDay × presentDays + halfDays × perDay × 0.5.


#### Future Requirement FE-68: Expense Tracking Architecture

**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 68 (Accepted)

Flat expense records with 12 predefined categories, color-coded dots, category breakdown bar chart, date range filtering, payment method tracking.


#### Future Requirement FE-69: Inventory Management Design

**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 69 (Accepted)

Quantity-based tracking with stock alerts (In Stock/Low Stock/Out of Stock). Quick +/- stock adjustment, per-unit cost, total value, storage location.


#### Future Requirement FE-70: Restaurant Module Design

**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 70 (Accepted)

Three tabs: Orders (status workflow), Menu (items with categories), Tables (visual status grid). Order status progression: Preparing → Ready → Served → Paid.


#### Future Requirement FE-71: Reports Module with recharts

**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 71 (Accepted)

Four report types: Overview (bar + pie + KPIs), Occupancy (distribution), Revenue (line + pie), Expenses (horizontal bar). All responsive with Tooltips.


#### Future Requirement FE-72: Data Export/Import System

**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 72 (Accepted)

Settings module provides JSON export/import of all localStorage data with timestamp. Blob download and FileReader upload patterns.


#### Future Requirement FE-73: Module localStorage Key Registry

**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 73 (Accepted)

Every module has a dedicated localStorage key: `helloStay_hotelData`, `helloStay_rooms`, `helloStay_bookings`, `helloStay_guests`, `helloStay_employees`, `helloStay_attendance`, `helloStay_payslips`, `helloStay_expenses`, `helloStay_inventory`, `helloStay_facilityBookings`, `helloStay_facilityCharges`, `helloStay_restaurantMenu`, `helloStay_restaurantOrders`.


#### Future Requirement FE-74: Booking ↔ Room Status Synchronization

**Status:** Future Requirement / To be implemented during frontend rebuild | **Original Date:** 2026-06-24
**Source:** Former AD 74 (Accepted)

Room status is derived from booking status. New Booking → Reserved, Checked In → Occupied, Checked Out → Cleaning, Cancelled/Deleted → Available (if no other active bookings). `syncRoomStatus()` helper atomically updates room state and localStorage.


#### Future Requirement FE-75: Role-Based Manual Room Status Overrides

**Status:** Future Requirement / To be implemented during frontend rebuild | **Original Date:** 2026-06-24
**Source:** Former AD 75 (Accepted)

Only Owner/Manager can manually change room status to: Available, Maintenance, Cleaning. Occupied/Reserved are booking-driven only. Employee sees read-only badge.


#### Future Requirement FE-76: App Default Route — Login-First Behavior

**Status:** Future Requirement / To be implemented during frontend rebuild | **Original Date:** 2026-06-24
**Source:** Former AD 76 (Accepted)

Root (`/`) and fallback (`*`) redirect to `/login`. Login is the mandatory entry point with explicit role selection.


#### Future Requirement FE-77: Room Edit Modal Reuse Pattern

**Status:** Future Requirement / To be implemented during frontend rebuild | **Original Date:** 2026-06-24
**Source:** Former AD 77 (Accepted)

`AddRoomModal` accepts optional `editingRoom` prop. When provided → Edit mode with pre-filled form. `key` prop forces clean remount between add/edit modes.


#### Future Requirement FE-78: Dashboard Room Occupancy Chart Redesign — Cross-Highlight Interaction

**Status:** Future Requirement / To be implemented during frontend rebuild | **Original Date:** 2026-06-24
**Source:** Former AD 78 (Accepted)

Donut chart + status breakdown panel with cross-highlight. Single `hoveredStatus` state links chart segments to panel rows via `fillOpacity`/CSS opacity. No floating tooltips. Empty state fallback. CSS transitions replace Framer Motion for hover effects. Reduced from ~280 to 198 lines.


#### Future Requirement FE-79: Inline Delete Confirmation Pattern

**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 79 (Accepted)

Delete actions use inline Yes/No confirmation buttons replacing separate modals. Single `deletingId` state tracks which row is in confirm mode. Reducing modal fatigue for rapid operations.


#### Future Requirement FE-80: Smart Pagination Algorithm

**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 80 (Accepted)

Pagination shows max 5 page buttons with sliding window. When total pages > 5, window shifts based on current page position (start, middle, end). Previous/Next buttons with disabled states at boundaries.


#### Future Requirement FE-81: useCallback + Functional State Updates Pattern

**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 81 (Accepted)

Save functions use `useCallback` for referential stability. State updates use functional form (`prev => ...`) for correctness when multiple state updates are batched. This prevents stale closures in async operations.


#### Future Requirement FE-82: Currency Symbol Lookup Table

**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 82 (Accepted)

Currency symbols stored in a static lookup object (`CURRENCY_SYMBOLS`) in `utils/currencies.js` for O(1) access. Supports 26+ currencies. Fallback to `₹` when currency not found or localStorage empty.


#### Future Requirement FE-83: Static Data Constants Outside Components

**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 83 (Accepted)

Static data (status options, color maps, payment types, chart colors) defined as module-level constants outside components. Avoids redefinition on every render, keeps JSX clean, and centralizes configuration.


#### Future Requirement FE-84: Try/Catch JSON Parsing Safety Pattern

**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 84 (Accepted)

All `localStorage.getItem()` + `JSON.parse()` calls are wrapped in try/catch with fallback to default values. Prevents app crashes from corrupt localStorage data.


#### Future Requirement FE-85: Gradient Header Pattern in Modals

**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 85 (Accepted)

All modals use a gradient header section (`bg-gradient-to-r from-blue-600 to-indigo-700`) for visual hierarchy. Consistent across BookingModal, BillingModal, GuestView, and EmployeeDetail modals.


#### Future Requirement FE-86: Authentication Flow, Profile Selection & Startup Sequence

**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 86 (Accepted)

The application needs a seamless and professional entry point that gracefully handles different authentication states while supporting multiple users (e.g., Owner, Manager, Employee) for a single hotel instance. The standard username/password flow was too tedious for locally saved roles.
- **Animated Splash Entry**: A new `<Splash />` component acts as the global entry point (`/`). It displays a premium animation. After 2 seconds, it provides a "Get Started" gateway button that unconditionally routes all users to the Profile Selection screen.
- **Local Profile Selection**: Instead of a traditional login form, we implemented an "Account Selection" screen similar to modern streaming services (Netflix/Hulu). Local accounts are stored in `localStorage` under `helloStay_accounts`.
- **Profile Authentication & Remember Me**: Clicking a profile does not log the user in instantly. Instead, it transitions to a Password Entry view dedicated to that specific profile. The "Remember Me" toggle (which sets `helloStay_keepLoggedIn`) is located on this specific authentication screen.
- **Session Persistence**: Session state is managed via `helloStay_session` and `helloStay_keepLoggedIn`. If successful, the user is routed to the Dashboard (or Hotel Setup if incomplete).


#### Future Requirement FE-87: V2 Features / Deferred Modules

**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 87 (Accepted)

To streamline the initial Minimum Viable Product (MVP) and focus on the core booking experience, several advanced operational modules have been temporarily removed from the project and deferred to Version 2.0.
When planning Version 2.0, the following modules should be restored:
1. **Employees**: Staff records, roles, statuses.
2. **HR and Payroll**: Management of employee shifts, salaries, deductions, and performance reviews.
3. **Expenses**: A ledger for tracking hotel operational costs (electricity, maintenance) against revenue.
4. **Inventory**: Management of hotel supplies (linens, toiletries, housekeeping carts) to track usage.
5. **Manage Facilities**: Administrative module for updating, pricing, and scheduling maintenance.
6. **Restaurant**: POS integration specifically for in-house dining, table management, and room service.
7. **Reports**: Advanced analytics dashboards for revenue visualization and occupancy forecasting.


#### Future Requirement FE-88: Profiles, Permissions & Hotel Information Restructure

**Status:** Future Requirement / To be implemented during frontend rebuild | **Original Date:** 2026-06-25
**Source:** Former AD 88 (Accepted)

Significant architectural improvements were made to identity, permissions, and initial routing:
- **Enhanced Profile Management:** Added inline "Edit Role" and "Delete Role" capabilities to both the `Login` screen and the dashboard `Profile` screen. Extended profile data to support updating credentials and assigned permissions. Prevented deletion of the final Owner profile.
- **Permission Management System:** Replaced hardcoded string roles with a flexible, array-based module permission system (e.g., `Bookings`, `Rooms`, `Settings`). The Owner manages these from the profile edit modal. `Sidebar.jsx` and `AppRoutes.jsx` (via `ProtectedRoute`) now dynamically render and protect routes based on the active session's permission array. Owners implicitly inherit `Full Access`.
- **Hotel Information Hub:** Replaced `RegisterHotel.jsx` with a dual-purpose `HotelInfo.jsx`. It sits immediately after the `Splash` screen. If unconfigured, it acts as the setup form. If configured, it acts as a read-only display hub with "Edit", "Delete", and "Proceed" actions.
- **Security & Owner Authentication:** Introduced `OwnerAuthModal`. Privileged actions—such as Editing/Deleting the Hotel, or Editing/Deleting *another* Owner profile—now prompt for the target Owner's password. Editing/Deleting an Employee profile does not require the password prompt when initiated by an Owner, smoothing UX while maintaining strict security for administrative accounts.


#### Future Requirement FE-89: Simplified Checkout Configuration

**Status:** Future Requirement / To be implemented during frontend rebuild | **Original Date:** 2026-06-25
**Source:** Former AD 89 (Accepted)

Based on user feedback, the fixed checkout time settings (e.g., global 11:00 AM checkout) and the associated late checkout fee automatic calculations have been removed from the application modules (`Settings`, `HotelInfo`).
- **Deferred Feature:** Fixed global checkout times are documented here for potential future addition in a V2 billing update.
- **Current Approach:** The application retains the 12hr / 24hr "Checkout Duration" setting, which dictates stay length logic. Check-in and check-out logic during Bookings continues to rely on explicitly user-selected dates and times rather than a globally enforced hour.


#### Future Requirement FE-90: Centralized Data Store as Single Source of Truth

**Status:** Future Requirement / To be implemented during frontend rebuild | **Original Date:** 2026-06-25
**Source:** Former AD 90 (Accepted)

All cross-module data mutations now route through `frontend/src/utils/dataStore.js`. Modules no longer write directly to `localStorage` for shared entities. Exports include `SYNC_EVENT`, `triggerSync()`, `getRooms/saveRooms`, `getGuests/saveGuests`, `getBookings/saveBookings`, `createBookingWithGuest`, `updateBookingStatus`, `deleteBooking`, `deleteRoom`. Components use `get*()` for lazy state initialization and listen to `SYNC_EVENT` to re-fetch data when another module mutates it.


#### Future Requirement FE-91: Strict GuestId Referential Integrity

**Status:** Future Requirement / To be implemented during frontend rebuild | **Original Date:** 2026-06-25
**Source:** Former AD 91 (Accepted)

Bookings store `guestId` for primary guest and `guests[].guestId` for additional guests. The Guests module matches bookings via `booking.guestId === guest.id`. A legacy fallback matches by exact `guestName + guestPhone` for pre-migration bookings. This replaces unreliable name-based matching that broke on name changes or duplicates.


#### Future Requirement FE-92: Type-Driven Occupancy Automation

**Status:** Future Requirement / To be implemented during frontend rebuild | **Original Date:** 2026-06-25
**Source:** Former AD 92 (Accepted)

Room maxOccupancy is auto-populated from room type when creating a new room: Single→1, Double/Twin→2, Suite/Family/Deluxe→4, Triple→3, Quad→4. Implemented via `autoSetOccupancyFromRoomType()` in dataStore, triggered only on create (not edit). Guest count in BookingModal is capped to the room's `maxOccupancy`.


#### Future Requirement FE-93: Guarded Room State Transitions

**Status:** Future Requirement / To be implemented during frontend rebuild | **Original Date:** 2026-06-25
**Source:** Former AD 93 (Accepted)

Room status is primarily derived from booking lifecycle. Manual overrides are blocked when an active Reserved or Checked In booking exists for that room. The status state machine: `Reserved → Occupied → Cleaning → Available` (with `Cancelled` as terminal state). Only the Owner can Force a room to Available via a confirmation dialog (for emergency cases like guest left without checkout).


#### Future Requirement FE-94: Unified Activity Feed

**Status:** Future Requirement / To be implemented during frontend rebuild | **Original Date:** 2026-06-25
**Source:** Former AD 94 (Accepted)

`getGuestActivity(guestId)` in dataStore returns a sorted, combined array of booking lifecycle events and guest profile changes. Activity types: `booking_created`, `check_in`, `check_out`, `booking_cancelled`, `guest_updated`, `guest_created`. Each entry has `{ id, type, description, timestamp }`. Rendered as a timeline in the Guest View Modal's "All Activity" tab with type-specific icons and colors.


#### Future Requirement FE-95: One-Time Legacy Migration

**Status:** Future Requirement / To be implemented during frontend rebuild | **Original Date:** 2026-06-25
**Source:** Former AD 95 (Accepted)

A startup migration (`migrateLegacyBookings()`) runs once on app load, guarded by the `helloStay_migration_v1_complete` localStorage flag. It matches each booking without a `guestId` to a guest profile by exact `guestName + guestPhone` match, then writes the matched `guestId` back to the booking. The migration runs silently and is transparent to the user.


---

## Technology Stack

### Frontend
- **React 19** (via Vite 8) - Component-based architecture with reusability
- **Tailwind CSS 3** - Utility-first CSS framework for rapid UI development
- **Framer Motion 12** - Production-ready animation library
- **Lucide React** - Consistent iconography
- **Recharts 3** - Composable charting library
- **React Router DOM 7** - Client-side SPA routing
- **Axios 1** - HTTP client for API calls
- **clsx** + **tailwind-merge** - Conditional CSS class management

### Desktop Layer
- **Electron 42** - Cross-platform desktop wrapper

### Backend
- **FastAPI** (Python) - High-performance REST API framework
- **Uvicorn** - ASGI server
- **SQLAlchemy 2** (modern Mapped/mapped_column style) - ORM
- **Alembic** - Database migration tool
- **Pydantic v2** - Request/response validation
- **python-jose** - JWT token handling
- **passlib** + **bcrypt** - Password hashing

### Database
- **SQLite** - Serverless embedded database (hellostay.db)

---

## Application Modules
This section describes every module (page) in HelloStay, its purpose, key features, and target user role.

### Dashboard
Central overview screen showing real-time hotel performance metrics. KPI cards, Room Occupancy donut chart (recharts), Activity Timeline, Welcome banner with hotel name. Target: Owner, Manager, Employee.

### Rooms
Manage all hotel rooms. Data table with sort/search/filter/pagination. Inline status change, Add/Edit Room modal with searchable room type selector, dynamic currency display. Target: Owner, Manager, Employee.

### Bookings
Handle room reservations. Full data table, New Booking modal with room selection, auto-calculate total, room availability validation, status workflow, payment tracking, billing modal with late checkout fee calculation. Target: Owner (planned).

### Guests
Maintain guest database. Card-based layout with avatar initials, stay history derived from bookings (guestId-based with legacy name+phone fallback), total spent calculation, search/filter/pagination. Tabbed View Modal: Profile (personal info), Stays (full stay history), Facilities (Coming Soon), Expenses (Coming Soon), All Activity (unified timeline of booking lifecycle + profile events). Target: Owner (planned).

### Employees
Manage hotel staff records. Data table with sort/search/role filter/status filter. Edit/View modals, quick Active/Inactive toggle. Target: Owner.

### HR & Payroll
Tab-based: Attendance | Payroll | Payslips. Daily attendance marking, monthly salary calculation based on attendance, payslip generation. Target: Owner (planned).

### Expenses
Track operational expenses. Data table with category filter/date range filter. Category breakdown bar chart, 12 predefined categories, payment method tracking. Target: Owner, Manager.

### Inventory
Manage supplies and stock. Data table with category/stock status filters. Quick stock adjustment (+/-), stock status alerts (In Stock/Low Stock/Out of Stock). Target: Owner, Manager, Employee.

### Facilities (Manage Facilities)
Manage hotel facilities (Spa, Pool, Gym, etc.). Facility cards with real-time stats. Booking system with payment status options (Club to Final Bill, Paid Before, Paid After, Complimentary). Charges configuration (All Guests, By Room Type, By Room Number, Free for All). Target: Owner, Manager.

### Restaurant
Manage in-house restaurant operations. Tabs: Orders (status workflow: Preparing→Ready→Served→Paid), Menu (item management), Tables (visual status grid). Condition: Only visible if "In-house Restaurant" facility selected. Target: Owner, Manager.

### Reports
Generate analytics with recharts. Tabs: Overview (Revenue bar + Occupancy pie + KPIs), Occupancy (room distribution), Revenue (monthly line + payment pie), Expenses (category horizontal bar). Target: Owner (planned).

### Settings
Configure application preferences. Tabs: Hotel Profile, System, Backup & Data. Export/Import all localStorage data as JSON. Target: Owner (planned).

### Profile
View/edit logged-in user's personal profile. Gradient header card, edit name/email/phone, change password form, role badge display. Target: Owner, Manager, Employee (planned).

---

## Backend Architecture Decisions

### Backend AD 1: Backend Layer Separation
**Status:** Accepted

Backend follows a layered architecture: `api/`, `core/`, `database/`, `models/`, `schemas/`. Each folder has a single responsibility for cleaner code, easier debugging, better scalability, and simpler testing.

### Backend AD 2: Database Choice
**Status:** Accepted

**Chosen:** SQLite. HelloStay is an offline desktop application requiring no server setup, easy backup, easy deployment, and lightweight footprint.

### Backend AD 3: Database Layer Separation
**Status:** Accepted

Database-related code (`base.py`, `connection.py`, `session.py`) is stored separately from API code for reusability and maintainability.

### Backend AD 4: Model-Based Database Design
**Status:** Accepted

Database tables are defined using SQLAlchemy models for object-oriented design, cleaner code, and easier maintenance.

### Backend AD 5: ORM-Based Table Generation
**Status:** Accepted (Superseded by AD 48 for production)

Tables were initially generated from SQLAlchemy models rather than raw SQL for consistent schema definition.

### Backend AD 6: Session-Based Database Access
**Status:** Accepted

Database operations performed through SQLAlchemy sessions for centralized access, better transaction control, and industry-standard patterns.

### Backend AD 7: Separate API Layer
**Status:** Accepted

API endpoints are stored in dedicated router files per module for better organization and scalability.

### Backend AD 8: Documentation-Driven Development
**Status:** Accepted

Documentation maintained alongside development. Knowledge gained during development is preserved for future reference.

### Backend AD 9: Hotel-Level Business Settings
**Status:** Accepted (Future)

Business configuration settings (check-in time, checkout time, GST, invoice settings) will be stored in a dedicated `hotel_settings` table rather than the `rooms` or `system_info` table.

### Backend AD 10: V1 First, V2 Later Strategy
**Status:** Accepted

Prioritize completing a fully functional V1 (core functionality, complete hotel workflow) before implementing advanced architecture improvements. V2 will focus on normalization, relationships, enhanced validation, and performance optimizations.

### Backend AD 11: Room Facilities Storage
**Status:** Accepted (V1)

Room facilities stored as a comma-separated string in V1 for simplicity. A dedicated facilities table may be introduced in V2.

### Backend AD 12: Room Status Validation Strategy
**Status:** Accepted (V1)

Room status stored as a String field in V1 with allowed values: Available, Occupied, Reserved, Maintenance. Validation on frontend dropdown and API.

### Backend AD 13: Optional Maximum Occupancy
**Status:** Accepted

`max_occupancy` field is optional and nullable to accommodate hotel owners who may not define it.

### Backend AD 14: Room Status vs Reservation Availability
**Status:** Accepted

`room_status` represents current operational state only. Date-based availability is determined through reservation records.

### Backend AD 15: Upcoming Reservation Visibility
**Status:** Accepted

Future reservations are not stored in `room_status`. They are obtained from reservation records.

### Backend AD 16: Room Configuration vs Room Operations
**Status:** Accepted (V1)

Single `RoomUpdate` schema used for simplicity in V1. Room operations (status) and configuration (price, type) may be separated in V2.

### Backend AD 17: Centralized Database Session Management
**Status:** Accepted

Database sessions managed through a shared `get_db()` dependency to avoid repetitive session creation code.

### Backend AD 18: Database Session Dependency
**Status:** Accepted

Shared `get_db()` dependency uses yield/finally pattern for automatic session cleanup.

### Backend AD 19: Database Access Pattern
**Status:** Accepted

FastAPI dependency injection (`db: Session = Depends(get_db)`) replaces manual session creation per endpoint.

### Backend AD 20: Explicit Schema-to-Model Mapping
**Status:** Accepted (V1)

Explicit field mapping (`room_number=room.room_number`) used in V1 instead of `Room(**room.model_dump())` for easier learning and debugging.

### Backend AD 21: Room API Response Strategy
**Status:** Accepted

Room APIs use FastAPI `response_model` instead of manual response dictionaries for cleaner code and validation.

### Backend AD 22: Pydantic ORM Serialization
**Status:** Accepted

`model_config = ConfigDict(from_attributes=True)` enables direct ORM-to-Pydantic serialization.

### Backend AD 23: Room Creation API Pattern
**Status:** Accepted

Standard pattern: Create ORM object → `db.add()` → `db.commit()` → `db.refresh()` → Return ORM object.

### Backend AD 24: Router Registration Pattern
**Status:** Accepted

Each module exports an `APIRouter` registered in `main.py` via `app.include_router()`.

### Backend AD 25: Room Number Uniqueness
**Status:** Accepted

`room_number` has a database-level UNIQUE constraint to prevent duplicates.

### Backend AD 26: Single Room Retrieval Pattern
**Status:** Accepted

`GET /rooms/{room_id}` with 404 HTTPException when room not found.

### Backend AD 27: Room Partial Update Strategy
**Status:** Accepted

Uses `model_dump(exclude_unset=True)` + `setattr()` for partial updates, preserving existing values.

### Backend AD 28: Missing Resource Handling
**Status:** Accepted

All endpoints return HTTP 404 when a requested resource does not exist (REST-compliant).

### Backend AD 29: Delete Response Strategy
**Status:** Accepted

Delete endpoints return a success message object since the resource no longer exists.

### Backend AD 30: Guest Information Storage
**Status:** Accepted

Guest table stores identity info only. Booking-related fields (room_number, check_in/out) belong to the Booking/Stay table.

### Backend AD 31: Guest Phone Number Strategy
**Status:** Accepted (V1)

Phone numbers stored as strings to support international numbers and preserve formatting. Future versions will separate country_code.

### Backend AD 32: Guest Update Strategy
**Status:** Accepted

`GuestUpdate` schemas use all-optional fields for partial updates. `GuestCreate` requires all fields.

### Backend AD 33: Migration-Based Schema Management
**Status:** Accepted

Alembic migrations manage all database schema changes to prevent data loss and keep schema synchronized with models.

### Backend AD 34: Router Prefix Pattern
**Status:** Accepted

Each router defines its own `prefix` and `tags` for cleaner routes and Swagger grouping.

### Backend AD 35: Separate Guest Identity From Room Assignment
**Status:** Accepted

Guest records store only identity information. Room assignment handled through separate occupancy/check-in logic.

### Backend AD 36: Room Occupancy Model
**Status:** Accepted

A room may contain multiple guests simultaneously (families, couples, group bookings). No one-guest-per-room restriction.

### Backend AD 37: Separate Guest Identity From Stay Records
**Status:** Accepted

Guest information and hotel stay information in separate tables. The same guest may stay multiple times.

### Backend AD 38: Stay Status Simplification
**Status:** Accepted (V1)

Stay table supports only two statuses initially: Checked In, Checked Out.

### Backend AD 39: Avoid Duplicate Room Information
**Status:** Accepted

Stay table stores `room_id` only (not `room_number`). Room data retrieved through relationship.

### Backend AD 40: Nullable Check-Out Timestamp
**Status:** Accepted

`check_out_datetime` is nullable. Active stays identified by `check_out_datetime IS NULL`.

### Backend AD 41: Store Price Snapshot In Stay Records
**Status:** Accepted

Stay table contains `price_per_night` as a snapshot at check-in time. Future room price changes do not affect historical records.

### Backend AD 42: Stay Records Preserve Historical Relationships
**Status:** Accepted

Stay table does not enforce uniqueness on `guest_id`/`room_id`. Same guest or room can appear in multiple stays.

### Backend AD 43: Introduce Stay Entity for Occupancy Tracking
**Status:** Accepted

Stay entity introduced as a transactional record linking Guest and Room with price snapshot and timestamps.

### Backend AD 44: Normalize Guest–Stay Relationship Using a Junction Table
**Status:** Accepted

`GuestStay` junction table supports multiple guests per stay and multiple stays per guest, with `is_primary_guest` flag for billing.

### Backend AD 45: Keep Direct Model Imports During Learning Phase
**Status:** Temporary

Models use direct imports during learning phase. Will refactor to `TYPE_CHECKING` strategy later.

### Backend AD 46: Resolve Model Circular Imports Using TYPE_CHECKING
**Status:** Accepted

Bidirectional relationships resolved using `from typing import TYPE_CHECKING` with forward references.

### Backend AD 47: Adopt Alembic as the Sole Database Schema Manager
**Status:** Accepted

`Base.metadata.create_all()` removed. All schema changes through Alembic migrations.

### Backend AD 48: Rebuild Initial Migration History Before Feature Development
**Status:** Accepted

Existing dev database and incomplete migration files discarded. Clean initial migration generated.

### Backend AD 49: Store Historical Stay Price Independently from Room Price
**Status:** Accepted

Stay model stores agreed nightly rate at check-in. Room model stores only current price. Small intentional duplication in exchange for accurate historical billing.

### Backend AD 50: Validate Auto-Generated Migrations Before Applying
**Status:** Accepted

Every autogenerated migration must be manually reviewed before applying to the database.

### Backend AD 51: Verify ORM Metadata Before Generating Migrations
**Status:** Accepted

Verify all expected tables are present in `Base.metadata.tables` before generating important migrations.

### Backend AD 52: Review Auto-Generated Migrations Before Database Upgrade
**Status:** Accepted

Review confirms: table creation, column definitions, primary keys, foreign keys, constraints, indexes, cascade behavior.

### Backend AD 53: Use Alembic as the Sole Database Schema Manager
**Status:** Accepted

Alembic is the single source of truth. `Base.metadata.create_all()` removed from application startup.

### Backend AD 54: Adopt Version-Controlled Database Evolution
**Status:** Accepted

Workflow: Update ORM models → Generate migration → Review → Apply via `alembic upgrade head`.

### Backend AD 55: Separate Documentation by Technology Layer
**Status:** Accepted

Monolithic LEARNING_NOTEBOOK.md split into: BACKEND_CONCEPTS.md, FRONTEND_CONCEPTS.md, ELECTRON_CONCEPTS.md, FULLSTACK_FLOW.md.

---

## Frontend Architecture Decisions

### Frontend AD 0: Backend-Contract-First Frontend Rebuild Orientation
**Status:** Accepted
**Date Recorded:** 2026-06-29
**Milestone:** Frontend Milestone 0 — Frontend Orientation, Backend Contract Review, and Architecture Boundary Confirmation

The HelloStay frontend rebuild begins with a backend-contract-first orientation before adding React code, Electron code, routing, authentication, dashboard, rooms, guests, stays/bookings, finance, or history.

**Decision:**
Use Milestone 0 to confirm the frontend architecture direction before implementation. The frontend must be designed from the actual FastAPI backend contracts, not from assumptions or the deleted frontend implementation.

This single architecture decision includes the following accepted decisions from Milestone 0:
* The backend API contract must drive frontend development.
* FastAPI remains the source of truth for business logic, validation, authentication, database operations, hotel workflows, and finance truth.
* React is responsible only for the renderer UI: screens, forms, components, routing, state, loading states, error states, and API calls.
* Electron is responsible only for the desktop shell: app lifecycle, BrowserWindow creation, startup flow, native OS integration, packaging, and future backend startup/checking.
* Preload/IPC should be used only for safe desktop communication between React renderer and Electron main process.
* React must not directly access SQLite, filesystem APIs, or backend internals.
* Electron must not contain room, guest, stay, booking, finance, or database business logic.
* A central API client must be used later instead of scattered `fetch()` calls.
* The future frontend structure should be feature-based.
* Authentication must not be implemented as real frontend integration until backend auth routes exist.
* The current backend term `Stay` should be used internally instead of pretending there is a complete `/bookings` API.
* The first frontend-backend integration should be the backend health check using `GET /`.
* Rooms should be built before Guests, and Guests should be built before Stays.
* Dashboard should not be implemented first because it depends on existing module data or a future backend summary endpoint.
* Finance should eventually come from backend-calculated APIs, not permanent frontend-only calculations.

**Why this decision was made:**
HelloStay is being rebuilt as a production-oriented offline desktop hotel management system. The frontend must be understandable, maintainable, and aligned with the completed backend architecture.

Starting with an orientation milestone prevents these mistakes:
* Building UI screens that do not match backend schemas.
* Creating fake API services.
* Implementing fake authentication before backend auth routes exist.
* Moving backend business rules into React.
* Moving hotel workflow logic into Electron.
* Rebuilding the deleted frontend blindly.
* Adding routing, dashboard, or modules before the foundation is clear.
* Confusing `Booking` and `Stay` while the backend currently exposes `/stay`.

This decision protects the project architecture and supports the learning goal: understanding how professional engineers plan before implementation.

**Affected files:**
No frontend source files were created or modified during this milestone.

Backend files reviewed during this milestone included:
* Backend `main.py`
* Backend room API file
* Backend guest API file
* Backend stay API file
* Backend guest-stay API file
* Backend system-info API file
* Backend security utility file
* Backend token schema file
* Backend database connection/session/base files
* Backend Room model
* Backend Guest model
* Backend Stay model
* Backend GuestStay model
* Backend SystemInfo model
* Backend Room schema
* Backend Guest schema
* Backend Stay schema
* Backend GuestStay schema
* Existing `PROJECT_NOTES.md`

**Frontend structure after cleanup:**
No frontend structure was changed during Milestone 0.

Approved future direction:
frontend/
src/
features/
startup/
rooms/
guests/
stays/
guestStays/
shared/
components/
services/
hooks/
utils/

**Accepted implementation details:**
* No implementation was performed in this milestone.
* Milestone 0 was treated as a planning, review, and architecture-boundary milestone.
* The current backend was reviewed as the source of truth.
* The currently registered backend areas were identified as:

  * Health Check
  * System Info
  * Rooms
  * Guests
  * Stays
  * Guest-Stays
* The first future frontend API integration should use:

  * `GET /`
* A future shared API client should be introduced before feature API services.
* Future API service files should be organized by feature:

  * `systemApi.js`
  * `roomsApi.js`
  * `guestsApi.js`
  * `staysApi.js`
  * `guestStaysApi.js`
* Real authentication should wait until backend authentication routes are implemented and registered.
* The frontend should use `Stay` internally because the backend currently exposes `/stay`, not `/bookings`.

**Backend contract considered:**
Current backend APIs confirmed:

Health Check:
* `GET /`

System Info:
* `GET /system-info`

Rooms:
* `POST /rooms`
* `GET /rooms`
* `GET /rooms/{room_id}`
* `PUT /rooms/{room_id}`
* `DELETE /rooms/{room_id}`

Guests:
* `POST /guests`
* `GET /guests`
* `GET /guests/{guest_id}`
* `PUT /guests/{guest_id}`
* `DELETE /guests/{guest_id}`

Stays:
* `POST /stay`
* `GET /stay`
* `GET /stay/{stay_id}`
* `PUT /stay/{stay_id}`
* `DELETE /stay/{stay_id}`

Guest-Stays:
* `POST /guest-stays`
* `GET /guest-stays`
* `GET /guest-stays/{guest_stay_id}`
* `PUT /guest-stays/{guest_stay_id}`
* `DELETE /guest-stays/{guest_stay_id}`

Backend/API gaps identified:
* No registered auth router was visible in the uploaded backend entry file.
* No confirmed register endpoint.
* No confirmed login endpoint.
* No confirmed current-user/session endpoint.
* No dashboard summary endpoint.
* No finance summary endpoint.
* No true `/bookings` API.
* No available-room search endpoint.
* No dedicated check-in/check-out workflow endpoints.

**What was intentionally not added:**
* No React code
* No Electron code
* No React Router
* No API client
* No Axios/fetch services
* No authentication UI
* No dashboard
* No rooms UI
* No guests UI
* No stays/bookings UI
* No finance/history UI
* No shared components
* No shared context/state management
* No custom hooks
* No utility modules
* No preload/IPC implementation
* No backend startup from Electron
* No desktop packaging

**Bugs/issues found and resolved:**
* No source-code bugs were fixed because Milestone 0 did not modify code.
* A major planning issue was identified: authentication utilities exist, but real auth routes were not confirmed as registered in the uploaded backend entry file.
* A naming mismatch was identified: V1 product language says “Bookings,” but the current backend exposes “Stays.”
* A sequencing issue was resolved: Dashboard, authentication, and bookings should not be the first implementation targets.
* The correct first integration was selected: Start Page plus backend health check.

**Remaining tasks:**
* Start Frontend Milestone 1 if not already completed in the active project timeline.
* Keep frontend implementation aligned with actual backend contracts.
* Add real authentication only after backend auth endpoints are available.
* Add dashboard only after enough backend data or a dashboard summary endpoint exists.
* Add finance only after backend finance support exists, or clearly mark any frontend-derived finance as temporary.
* Revisit the Booking vs Stay model when the backend supports true reservation workflows.
* Introduce a central API client before building feature-level API services.
* Keep Electron limited to desktop shell responsibilities.

**Next recommended step:**
Proceed to the next milestone in the frontend rebuild sequence.

If Frontend Milestone 1 is already completed, continue with:

Frontend Milestone 2 — Electron Desktop Shell Setup.

Keep Electron limited to desktop shell responsibilities: app lifecycle, BrowserWindow creation, secure preload planning, and renderer loading.

Do not add hotel features, routing, backend integration, authentication, dashboard, rooms, guests, stays/bookings, finance, or history during the Electron shell setup milestone.


---

### Frontend AD 1: Minimal React Foundation Before Features
**Status:** Accepted
**Date Recorded:** 2026-06-29
**Milestone:** Frontend Milestone 1 — React Project Setup

The HelloStay frontend rebuild begins with a minimal Vite + React foundation before adding hotel features, routing, backend integration, authentication, or Electron.

**Decision:**
Create a clean React frontend using Vite with JavaScript, not TypeScript. Keep the first milestone focused only on app startup, root rendering, basic global CSS, and fixed development port configuration.

**Why this decision was made:**
The frontend is being rebuilt from scratch for learning, maintainability, and production clarity. Starting with a small foundation prevents confusion and avoids mixing React setup with unrelated concerns such as routing, authentication, API services, dashboard UI, rooms, guests, bookings, or Electron. This also keeps React clearly separated as the future Electron renderer process.

**Affected files:**
* `frontend/src/main.jsx`
* `frontend/src/App.jsx`
* `frontend/src/styles/global.css`
* `frontend/vite.config.js`

**Frontend structure after cleanup:**
frontend/
  src/
    main.jsx
    App.jsx
    styles/
      global.css

**Accepted implementation details:**
* `main.jsx` imports React, `createRoot`, `App.jsx`, and `./styles/global.css`.
* `App.jsx` renders a minimal HelloStay setup screen only.
* `global.css` contains only basic reset styles, typography, body layout, and temporary welcome-card styling.
* `vite.config.js` fixes the Vite dev server to port `5173` with `strictPort: true`.
* Unused Vite starter files were removed:

  * `src/App.css`
  * `src/index.css`
  * `src/assets/react.svg`
  * `src/assets/vite.svg`
  * `src/assets/hero.png`
  * empty `src/assets/` folder

**Backend contract considered:**
The backend already allows the React development origin at `http://localhost:5173`, so the frontend dev server must remain on port `5173`.

**What was intentionally not added:**
* No React Router
* No API client
* No Axios/fetch services
* No authentication UI
* No dashboard
* No rooms, guests, stays, bookings, finance, or history pages
* No Electron main/preload setup
* No backend startup from Electron
* No Tailwind or design system setup yet

**Bugs/issues found and resolved:**
* The folder review initially included `node_modules`, creating noisy output.
* Correct review command should focus on `src/` or exclude `node_modules`.
* Unused Vite starter files were identified and removed.
* No React code errors were found in reviewed files.

**Sub-decisions included in this AD:**
- Use Vite + React as the frontend foundation.
- Use JavaScript instead of TypeScript for the rebuild.
- Keep React as the future Electron renderer process.
- Configure Vite to run on port `5173`.
- Use `strictPort: true` so Vite does not silently switch ports.
- Use a minimal `src/` structure with only `main.jsx`, `App.jsx`, and `styles/global.css`.
- Use one global CSS file during the foundation milestone.
- Remove unused Vite starter files and assets.
- Do not create empty future folders until they are needed.
- Do not add React Router in Milestone 1.
- Do not add API services in Milestone 1.
- Do not add authentication in Milestone 1.
- Do not add Electron in Milestone 1.
- Do not build hotel feature modules in Milestone 1.
- Do not move backend business logic into React.

**Remaining tasks:**
* Verify `npm run dev` opens the app at `http://localhost:5173`.
* Confirm browser console has no red errors.
* Confirm Network tab shows no backend API calls during Milestone 1.
* Begin Electron setup only in Milestone 2.

**Next recommended step:**
Start Frontend Milestone 2: Electron Desktop Shell Setup. Keep Electron limited to desktop shell responsibilities: app lifecycle, BrowserWindow creation, secure preload planning, and renderer loading. Do not add hotel features, routing, backend integration, or authentication yet.

---

### Frontend AD 2: Electron Desktop Shell Setup
**Status:** Accepted
**Date Recorded:** 2026-06-29
**Milestone:** Frontend Milestone 2 — Electron Desktop Shell Setup

#### Context
HelloStay is an offline desktop Hotel Management System. The frontend was already initialized as a minimal Vite + React application in Milestone 1. The next step was to introduce Electron as the desktop shell while keeping the architecture clean and avoiding premature feature development.

Electron is responsible for desktop application behavior. React remains responsible for the user interface. FastAPI remains the source of truth for business logic, validation, database operations, authentication, and API contracts.

#### Decision
Introduce a minimal Electron shell around the existing Vite React frontend.

The Electron setup will include:

* `frontend/electron/main.js` as the Electron main process entry file.

* `frontend/electron/preload.js` as the preload script placeholder.

* A secure Electron `BrowserWindow`.

* Development loading from the Vite dev server at:
  http://localhost:5173

* A future production loading branch using the React build output.

* npm scripts for running Vite and Electron together during development.

Electron will not start the FastAPI backend yet. Electron will not contain hotel business logic. Electron will not access SQLite directly. React will not get direct Node.js access.

#### Architectural Boundaries
The application is separated into clear responsibilities:
Electron main process
  Owns desktop lifecycle, BrowserWindow creation, app startup, app quit behavior.

Electron preload script
  Reserved for future safe renderer-main communication.

React renderer process
  Owns screens, components, forms, UI state, user interaction, and visual rendering.

FastAPI backend
  Owns business logic, validation, authentication, database operations, and API contracts.

SQLite database
  Owns persistent local data storage.

#### BrowserWindow Security Configuration

The Electron `BrowserWindow` must use secure defaults:
```js
webPreferences: {
  preload: path.join(__dirname, "preload.js"),
  nodeIntegration: false,
  contextIsolation: true,
}
```

`nodeIntegration` is disabled so React cannot directly use Node.js APIs.

`contextIsolation` is enabled so Electron/preload code and React renderer code remain separated.

The preload script is connected but exposes no APIs yet.

#### Development Loading Decision

During development, Electron loads the Vite React dev server:
http://localhost:5173

This allows React fast refresh and keeps frontend development simple.

The Electron main process uses a development branch to load the Vite URL and a future production branch to load the built React output from `dist/index.html`.

Production packaging is not part of this milestone.

#### npm Script Decision

The frontend package uses development scripts to run React and Electron together:
```json
"dev": "vite",
"electron": "wait-on http://localhost:5173; electron .",
"desktop": "concurrently -k \"npm run dev\" \"npm run electron\""
```

`concurrently` is used to run the Vite dev server and Electron at the same time.

`wait-on` is used so Electron starts only after the Vite dev server is available.

A PowerShell-compatible command separator is used because the local Windows PowerShell environment did not support `&&`.

#### Main Process Platform Decision
The Electron main process handles platform-specific close behavior.

On Windows and Linux, the app quits when all windows are closed.

On macOS, the app remains active until the user explicitly quits, matching normal macOS desktop behavior.

The final implementation may use an explicit Node process import:
```js
import process from "node:process";
```

and check:
```js
process.platform !== "darwin"
```

This avoids editor/tooling confusion where the global `process` object may not be recognized.

#### Preload Decision
Create `frontend/electron/preload.js`, but expose nothing during this milestone.

The preload script exists only to prepare the secure architecture for future IPC and desktop APIs.

No `contextBridge`, `ipcRenderer`, filesystem access, app version access, printing, backup, or native OS integration is added yet.

#### Why This Decision Was Made
This decision keeps the project simple, secure, and understandable.

Starting with a minimal Electron shell helps separate responsibilities clearly before adding more complexity. It prevents the common beginner mistake of mixing React UI code, Electron desktop code, backend logic, and database access in the same layer.

This also supports HelloStay’s long-term goal as an offline desktop application while preserving FastAPI as the backend source of truth.

#### Benefits
* Clear separation between desktop shell and React UI.
* Secure Electron defaults from the beginning.
* React remains simple and browser-like.
* FastAPI remains responsible for business rules and data operations.
* The app can run as a desktop window during development.
* Future preload/IPC work has a safe place to be added later.
* Packaging can be introduced later without rushing the architecture.

##### Trade-Offs
* Development now requires running both Vite and Electron.
* The app is not packaged yet.
* Electron does not yet start or manage the FastAPI backend.
* The preload file exists but does not provide functionality yet.
* The startup scripts are still development-focused and may be improved later for stronger cross-platform behavior.

These trade-offs are acceptable because Milestone 2 focuses only on the desktop shell foundation.

#### Affected Files
frontend/package.json
frontend/electron/main.js
frontend/electron/preload.js

#### Not Included In This Decision

This decision does not include:
* React Router
* Authentication
* Login flow
* Dashboard
* Rooms
* Guests
* Stays
* Bookings
* Finance
* History
* Backend API integration
* FastAPI process startup from Electron
* SQLite access from Electron
* IPC API design
* File system access
* Printing
* App packaging
* Installer setup

#### Final Outcome
HelloStay can now be launched as a desktop application during development.

The command:
```bash
npm run desktop
```

starts Vite, waits for the Vite dev server, starts Electron, creates a secure desktop window, and loads the React frontend inside it.

#### Consequence
Future milestones can now build on a clear desktop architecture:

Electron wraps the app.
React renders the UI.
Preload safely bridges future desktop APIs.
FastAPI owns business logic.
SQLite stores data.

This decision establishes the foundation for future Electron capabilities without weakening security or mixing responsibilities.

---

### Frontend AD 3: Startup Flow and Routing Belong to the React Renderer
**Status:** Accepted
**Date Recorded:** 2026-06-30
**Milestone:** Frontend Milestone 3 — Startup Flow and Routing
**Project:** HelloStay — Offline Hotel Management System

#### 1. Decision
HelloStay will handle startup flow and application routing inside the React renderer process using React Router.

The Electron main process will not manage React routes. It will only create the desktop window, manage the application lifecycle, and load the React app.

Route definitions will be stored separately in:
src/routes/AppRoutes.jsx

Page-level components will be stored in:
src/pages/

The app will start at:
/

The first milestone route structure will be:
/          → StartPage
/login     → LoginPage
*          → NotFoundPage

#### 2. Context
HelloStay is an offline desktop application built with Electron, React, and FastAPI.

Electron provides the desktop shell. React provides the user interface inside Electron. FastAPI remains the source of truth for backend business logic, validation, database operations, authentication, and API contracts.

Before adding hotel features, authentication, dashboard layout, or API integration, the frontend needs a clean way to move between screens.

Routing is the mechanism that allows a single React application to show different pages based on the current URL.

#### 3. Why This Decision Was Made
This decision was made to keep the frontend architecture clean and scalable.

A production application should not keep all screens inside `App.jsx`. As the project grows, putting all page logic directly inside `App.jsx` would make the file difficult to understand and maintain.

By separating routes into `AppRoutes.jsx`, the application has a clear place for route definitions.

By separating pages into the `pages/` folder, each screen becomes easier to locate, modify, test, and extend.

This also protects the separation of responsibilities between Electron and React.

Electron should not know about routes like:
/login
/rooms
/guests
/dashboard

Those are UI-level routes and belong to React.

#### 4. Architecture Rule

The accepted architecture rule is:
React renderer owns application routing.
Electron main process owns desktop lifecycle.
FastAPI owns backend business logic and API contracts.

This means:
* React decides which page to show.
* Electron decides how the desktop window opens.
* FastAPI decides how business data is created, validated, stored, and returned.

#### 5. Chosen Approach
The chosen routing approach for Milestone 3 is `BrowserRouter`.

`BrowserRouter` was selected because:
* It is beginner-friendly.
* It works well with the Vite development server.
* It gives clean URLs.
* It is commonly used in React applications.
* It supports normal paths like `/login`.

Example:
/login

instead of:
/#/login

#### 6. Alternatives Considered

##### Alternative 1: Keep conditional rendering inside App.jsx

Example:
If current screen is "start", show StartPage.
If current screen is "login", show LoginPage.

This was rejected because it does not scale well. It also teaches a weaker architecture pattern for a production application.

##### Alternative 2: Use HashRouter

Example route:
/#/login

This can be useful in some packaged Electron applications because it avoids server fallback issues.

However, it was not chosen for this milestone because the app is currently running through Vite during development, and clean browser-style URLs are better for learning React Router basics.

HashRouter may be reconsidered later during Electron packaging if required.

##### Alternative 3: Use advanced React Router data routers
This was rejected for now because Milestone 3 has no route loaders, form actions, backend calls, or route-level data fetching.

The milestone only needs simple page navigation.

#### 7. Consequences

##### Positive Consequences
* The app now has a clean routing foundation.
* `App.jsx` remains small.
* Route definitions are easy to find.
* Page components are organized clearly.
* React renderer responsibilities are clear.
* Electron remains separated from UI routing.
* The app is ready for future login, dashboard, and feature routes.

##### Trade-Offs
Using `BrowserRouter` may require additional care later when the Electron app is packaged and loaded from production build files.

This is acceptable because Milestone 3 is focused on development-time routing and beginner-friendly learning.

The routing strategy can be revisited later during the packaging milestone if needed.

#### 8. Affected Files

The following files were added:
frontend/src/routes/AppRoutes.jsx
frontend/src/pages/StartPage.jsx
frontend/src/pages/LoginPage.jsx
frontend/src/pages/NotFoundPage.jsx

The following files were updated:
frontend/src/main.jsx
frontend/src/App.jsx
frontend/src/styles/global.css

#### 9. What This Decision Does Not Include

This decision does not include:
* Real authentication.
* Login API integration.
* JWT storage.
* Auth context.
* Protected routes.
* Dashboard routes.
* Dashboard layout.
* Hotel feature modules.
* Backend startup from Electron.
* Electron packaging.

These will be handled in later milestones.

#### 10. Future Implications

This decision prepares the project for later milestones such as:
/login
/dashboard
/rooms
/guests
/stays
/bookings
/finance
/history
/settings

Later, authentication can introduce protected routes.

Example future structure:
Public routes:
  /
  /login

Protected routes:
  /dashboard
  /rooms
  /guests
  /stays
  /finance

However, protected routes should only be added after real authentication and auth state are designed.

#### 11. Final Decision Summary
HelloStay will use React Router inside the React renderer process for application navigation.

Electron will not manage application routes.

FastAPI will not be involved in frontend routing.

The route definitions will live in `src/routes/AppRoutes.jsx`, and screen-level components will live in `src/pages/`.

This keeps the architecture simple, maintainable, beginner-friendly, and production-oriented.


---

### Frontend AD 4: UI Foundation and Reusable Component System

**Status:** Accepted
**Date Recorded:** 2026-06-30
**Milestone:** Frontend Milestone 4 — UI Foundation and Layout System

#### Context

HelloStay is an offline desktop Hotel Management System built with a FastAPI backend, React frontend, and Electron desktop shell.

Milestone 1 established the minimal React foundation using Vite and JavaScript.
Milestone 2 introduced Electron as the desktop shell while keeping React as the renderer process.
Milestone 3 introduced React Router and basic placeholder pages.

At this stage, the application has routing and simple pages, but it does not yet have a reusable visual foundation. Before building authentication, dashboard screens, rooms, guests, stays, bookings, finance, history, or settings, the frontend needs a small UI foundation that promotes consistency, readability, and maintainability.

#### Decision

Create a simple UI foundation using plain CSS and reusable React components.

The frontend will use:

* CSS variables for design tokens.
* A clean global CSS structure.
* Small reusable UI components.
* Simple page-level styling.
* Beginner-friendly component patterns using props, children, and className.

The following reusable UI components are introduced:

* `Button`
* `Input`
* `Card`
* `Loading`
* `ErrorMessage`

These components are placed under:

```txt
frontend/src/components/ui/
```

Existing placeholder pages may use these components lightly:

```txt
frontend/src/pages/StartPage.jsx
frontend/src/pages/LoginPage.jsx
frontend/src/pages/NotFoundPage.jsx
```

No full dashboard shell, sidebar, topbar, protected routes, authentication, backend integration, or hotel features are introduced in this milestone.

#### Architecture Decision

The frontend will begin with a small custom design system instead of using Tailwind CSS, icon libraries, animation libraries, or third-party UI component libraries.

Styling remains inside the React renderer layer. Electron will not contain UI component logic.

The responsibility split remains:

```txt
FastAPI backend
  Business logic, validation, authentication rules, database operations, API contracts

Electron main process
  Desktop window, app lifecycle, native shell behavior

Electron preload layer
  Safe renderer-main communication when needed

React renderer process
  Pages, components, forms, routing, UI state, styling
```

#### Why This Decision Was Made

A reusable UI foundation prevents duplicated styles and inconsistent interface patterns as the application grows.

HelloStay will eventually contain many screens such as login, dashboard, room management, guest management, stay management, finance, history, and settings. These screens will repeatedly need buttons, inputs, cards, loading states, and error messages.

Creating these reusable pieces early helps the project stay organized without prematurely building full business features.

Plain CSS is intentionally chosen for this milestone because it helps build strong fundamentals before introducing additional styling tools. Since the project is being built for learning and production-quality engineering, the priority is to understand how UI systems work from first principles.

#### What This Decision Allows

This decision allows future pages to use consistent components such as:

```jsx
<Button>Save</Button>
<Input label="Username" />
<Card>...</Card>
<Loading message="Loading rooms..." />
<ErrorMessage message="Something went wrong." />
```

It also creates a stable place for design tokens such as:

```css
--color-primary
--color-bg
--color-surface
--color-border
--radius-md
--space-md
```

This keeps styling centralized and reduces repeated hard-coded values.

#### What This Decision Prevents

This decision prevents:

* Duplicating button styles across pages.
* Duplicating input markup across forms.
* Mixing page-level components with reusable UI components.
* Adding dashboard layout too early.
* Adding authentication before the visual foundation exists.
* Moving UI logic into Electron.
* Introducing styling libraries before understanding CSS fundamentals.
* Creating hotel-specific components before generic UI foundations are stable.

#### Affected Files

New files:

```txt
frontend/src/components/ui/Button.jsx
frontend/src/components/ui/Input.jsx
frontend/src/components/ui/Card.jsx
frontend/src/components/ui/Loading.jsx
frontend/src/components/ui/ErrorMessage.jsx
```

Modified files:

```txt
frontend/src/styles/global.css
frontend/src/pages/StartPage.jsx
frontend/src/pages/LoginPage.jsx
frontend/src/pages/NotFoundPage.jsx
```

Unchanged responsibilities:

```txt
frontend/electron/
backend/
frontend/src/routes/AppRoutes.jsx
```

#### Implementation Direction

The UI foundation should remain small and readable.

The global stylesheet should contain:

```txt
1. CSS variables
2. base reset
3. body styling
4. page helper classes
5. reusable UI component classes
```

The UI components should be simple functional React components.

The components should accept props only where useful. Examples:

```txt
Button:
  children
  variant
  type
  disabled
  className

Input:
  label
  error
  helperText
  id
  className

Card:
  children
  className

Loading:
  message

ErrorMessage:
  message
```

#### Design System Direction

The design system is intentionally minimal.

It includes:

* Primary color
* Background color
* Surface color
* Text color
* Muted text color
* Border color
* Error color
* Border radius values
* Spacing values
* Box shadows
* Base font family

This is enough for the current milestone.

The design system should grow only when future screens reveal real repeated needs.

#### Electron Boundary

No Electron files should be changed for this milestone.

Electron’s role remains limited to the desktop shell. React owns the visual interface.

The Electron main process must not create React components, HTML forms, login UI, buttons, page layout, or CSS styling.

If future desktop-native features are required, they should go through a secure preload and IPC boundary. That is not needed in this milestone.

#### Backend Boundary

No backend endpoints are consumed in this milestone.

Although the FastAPI backend already contains endpoints for rooms, guests, stays, guest-stays, and system info, Milestone 4 does not connect to them.

The backend remains the future source of truth for:

* Business rules
* Validation
* Authentication
* Database access
* API contracts

#### Consequences

Positive consequences:

* The UI becomes more consistent.
* Future pages become easier to build.
* Basic visual tokens are centralized.
* Components are easier to reuse.
* The project remains beginner-friendly.
* The React renderer stays cleanly separated from Electron.
* The app avoids unnecessary dependencies.

Trade-offs:

* Plain CSS requires discipline as the project grows.
* The design system is basic and not visually complete yet.
* Some temporary layout spacing may still exist in placeholder pages.
* More advanced UI patterns are intentionally delayed.

#### Rejected Alternatives

##### Tailwind CSS

Rejected for this milestone.

Tailwind can be useful later, but introducing it now would add another tool before the core React and CSS fundamentals are clear.

##### UI Component Library

Rejected for this milestone.

Libraries such as Material UI, Ant Design, or Chakra UI provide many ready-made components, but they reduce the opportunity to learn reusable component design from first principles.

##### Full Dashboard Layout

Rejected for this milestone.

A dashboard layout requires authentication flow, protected routes, navigation structure, and real app sections. That belongs in a later milestone.

##### Feature-Specific Components

Rejected for this milestone.

Components such as `RoomCard`, `GuestTable`, `BookingForm`, and `FinanceWidget` are not created yet because hotel features are not part of Milestone 4.

#### Final Decision

HelloStay will use a small custom UI foundation built with plain CSS and reusable React components.

This foundation belongs entirely to the React renderer process and will support future frontend milestones without introducing unnecessary complexity or dependencies.

The accepted reusable UI components for this milestone are:

```txt
Button
Input
Card
Loading
ErrorMessage
```

This decision keeps the project simple, understandable, production-oriented, and aligned with the learning goal of rebuilding the frontend from first principles.

---

### Frontend AD 5: Centralized API Client and Backend Communication Boundary

**Status:** Accepted
**Date Recorded:** 2026-06-30
**Milestone:** Frontend Milestone 5 — API Client and Backend Communication

#### Decision

HelloStay frontend will use a centralized API communication layer instead of placing API calls directly inside React page components.

A dedicated `services` folder was introduced in the React renderer process:

```txt
frontend/src/services/
  apiClient.js
  systemService.js
```

`apiClient.js` is responsible for shared HTTP request behavior, including:

```txt
API base URL handling
request method handling
request headers
safe JSON parsing
basic error handling
network failure handling
future token attachment location
```

`systemService.js` was introduced as a minimal safe service for backend communication testing only. It calls safe backend endpoints such as `/` and `/system-info`, not hotel feature workflows.

#### Why This Decision Was Made

The frontend must not scatter raw `fetch()` calls across pages and components.

Scattered API calls create problems such as:

```txt
duplicated backend URLs
inconsistent error handling
repeated JSON parsing logic
unclear loading/error behavior
difficulty adding authentication tokens later
harder maintenance as rooms, guests, stays, finance, and history grow
```

A centralized API client creates one predictable boundary between React and FastAPI.

The React renderer owns frontend API communication, while FastAPI remains the source of truth for business logic, validation, database operations, and API contracts.

Electron remains responsible for desktop shell concerns only. Electron main process must not contain hotel API service logic.

#### Accepted Communication Flow

```txt
React page/component
  ↓
domain service file
  ↓
apiClient.js
  ↓
FastAPI backend
  ↓
SQLite/database layer
```

For Milestone 5, the tested flow was:

```txt
LoginPage temporary test UI
  ↓
systemService.js
  ↓
apiClient.js
  ↓
FastAPI / and /system-info endpoints
```

#### API Base URL Decision

The development API base URL is defined through a Vite environment variable:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

This keeps backend location configuration outside page components.

A fallback default may exist in `apiClient.js` for development safety:

```js
const DEFAULT_API_BASE_URL = "http://127.0.0.1:8000";
```

Vite environment variables exposed to the browser must begin with `VITE_`.

#### Fetch vs Axios Decision

The frontend will use the browser-native `fetch()` API for this milestone.

Reason:

```txt
no extra dependency
better beginner learning value
clearer understanding of HTTP, JSON, headers, responses, and errors
sufficient for current needs
```

Axios may be reconsidered later if the project needs interceptors, advanced request cancellation, or more complex HTTP behavior.

#### Error Handling Decision

The API client will distinguish between:

```txt
network errors
backend errors
```

Network errors happen when the frontend cannot reach the backend at all.

Examples:

```txt
backend server is not running
wrong port
wrong API base URL
connection refused
```

Backend errors happen when FastAPI responds with an error status code.

Examples:

```txt
404 Not Found
422 Validation Error
500 Internal Server Error
```

The API client will throw a consistent custom error object so future screens can show reliable user-facing messages.

#### JSON Parsing Decision

The API client will not assume every backend response always contains JSON.

It will safely handle:

```txt
JSON responses
empty 204 responses
plain text responses
invalid or empty response bodies
```

This prevents frontend crashes caused by unsafe `response.json()` usage.

#### Authentication Preparation Decision

The API client contains a future token attachment location, but real authentication token logic is intentionally not implemented in this milestone.

This preserves milestone boundaries.

Future authentication can attach tokens from one centralized location instead of modifying every service or page.

#### Temporary UI Decision

A temporary backend connection test was added to the login page only for Milestone 5 verification.

The temporary test confirmed that React can successfully call:

```txt
/
 /system-info
```

through the service layer.

After verification, the temporary UI should be removed from the user-facing login page.

The files `apiClient.js`, `systemService.js`, and `.env.development` should remain.

#### Affected Files

```txt
frontend/.env.development
frontend/src/services/apiClient.js
frontend/src/services/systemService.js
frontend/src/pages/LoginPage.jsx
```

`LoginPage.jsx` was affected only temporarily for testing.

#### Boundaries Confirmed

The following boundaries are accepted:

```txt
React renderer:
  UI, user interaction, API service calls

services/apiClient.js:
  shared frontend HTTP behavior

services/systemService.js:
  safe backend system/health communication

Electron main process:
  desktop shell, BrowserWindow, app lifecycle

FastAPI backend:
  business logic, validation, database operations, API contracts
```

#### Explicit Non-Decisions

The following were intentionally not implemented in Milestone 5:

```txt
real authentication
token storage
protected routes
dashboard layout
room service
guest service
stay service
booking workflow
finance/history services
Electron backend startup
application packaging
```

#### Result

Milestone 5 established the official frontend API communication foundation for HelloStay.

Future feature modules must use service files and the centralized API client instead of direct page-level API calls.

---

### Frontend AD 6: Authentication UI Foundation Before Real Auth Integration

**Status:** Accepted
**Date Recorded:** 2026-06-30
**Milestone:** Frontend Milestone 6 — Authentication UI Foundation

#### Decision

The HelloStay frontend will build the authentication UI foundation before implementing real authentication behavior.

Milestone 6 introduces real login and registration form interfaces using React controlled components, form validation, loading states, error states, and a dedicated `authService.js` service boundary. However, the frontend will not perform real login, real registration, dashboard redirect, token persistence, protected routing, or global authentication state until the backend exposes and confirms actual authentication endpoints.

#### Context

HelloStay V1 requires a clean startup and authentication flow:

1. User opens the app.
2. User sees the start page.
3. User navigates to login.
4. User can log in with username and password.
5. User can create a new account.
6. After real authentication is implemented, the user should enter the main dashboard.

At this milestone, the backend contains JWT/password helper functionality and token schemas, but the available FastAPI router registration does not show confirmed auth endpoints such as login, register, me, or logout. Therefore, the frontend must not invent endpoint paths or fake successful authentication.

#### Why This Decision Was Made

Authentication is a security-sensitive workflow. The frontend must not decide whether a username and password are correct. Credential verification belongs to the backend because the backend owns password hashing, database lookup, validation, JWT creation, and API contracts.

Building fake authentication in React would create the wrong architecture and may lead to unsafe habits such as:

* Hardcoding fake users.
* Redirecting to dashboard without real verification.
* Treating React state as the source of truth for identity.
* Storing fake tokens.
* Adding protected routes before real auth state exists.
* Inventing backend endpoint paths that may later conflict with the real API.

This milestone keeps the UI work productive while preserving backend authority.

#### Final Decision

For Milestone 6:

* Build a real `LoginPage` UI form.
* Build a real `RegisterPage` UI form.
* Use controlled React inputs.
* Use `useState` for form values, field errors, form error, and loading state.
* Add basic frontend validation for required fields.
* Add password confirmation validation on the registration page.
* Use existing reusable UI components.
* Create `authService.js` as the dedicated authentication service layer.
* Keep `authService.js` prepared for future login/register calls.
* Do not invent endpoint paths.
* Do not hardcode fake users.
* Do not redirect to dashboard after login.
* Do not create `ProtectedRoute`.
* Do not create global auth context yet.
* Do not persist tokens yet.
* Do not move authentication logic into Electron.

#### Affected Files

```text
frontend/src/services/authService.js
frontend/src/pages/LoginPage.jsx
frontend/src/pages/RegisterPage.jsx
frontend/src/routes/AppRoutes.jsx
frontend/src/styles/global.css
frontend/src/components/ui/Input.jsx
frontend/src/components/ui/Button.jsx
```

#### Responsibility Separation

#### React Renderer

React handles:

* Login form UI.
* Register form UI.
* Controlled input state.
* Frontend validation.
* Submit handling.
* Loading and error display.
* Calling `authService.js`.

#### Service Layer

`authService.js` handles:

* Authentication-related frontend API boundary.
* Login function placeholder.
* Register function placeholder.
* Clear errors when auth endpoints are not confirmed.
* Future integration with `apiClient.js`.

#### FastAPI Backend

FastAPI remains responsible for:

* User lookup.
* Password hashing.
* Password verification.
* JWT creation.
* Request validation.
* Response contract.
* Auth route ownership.

#### Electron Main Process

Electron does not handle:

* Username/password form logic.
* Authentication validation.
* JWT creation.
* Hotel business rules.
* Dashboard authorization.

Electron remains responsible only for desktop shell responsibilities such as app lifecycle, window creation, safe preload exposure, packaging, and future backend startup behavior.

#### Implementation Outcome

Milestone 6 produced a clean authentication UI foundation without pretending that real auth exists.

The login page now behaves like a real form but stops at the correct boundary when no confirmed backend login endpoint exists.

The register page supports the V1 account creation direction but does not create fake accounts.

The service layer now provides a dedicated place for future auth API integration.

#### Consequences

##### Positive Consequences

* Authentication UI is now ready for future backend integration.
* Login and registration forms are beginner-friendly and production-oriented.
* Form behavior is predictable because controlled components are used.
* Page components remain clean because API responsibility is moved to `authService.js`.
* The project avoids fake authentication.
* Future Milestone 7 can focus on auth contract, token strategy, auth context, and protected routes.

##### Trade-Offs

* Login does not yet succeed.
* Register does not yet create an account.
* There is no dashboard redirect yet.
* The user sees an expected “auth endpoint not confirmed” style error after valid form submission.
* More backend verification/design is needed before real authentication can be completed.

These trade-offs are accepted because they preserve architectural correctness.

#### Explicitly Deferred

The following are intentionally postponed:

* Real login API call.
* Real register API call.
* Auth endpoint path selection.
* Token storage.
* AuthContext.
* ProtectedRoute.
* Dashboard redirect after login.
* Current user restore flow.
* Logout behavior.
* Role-based authorization.
* Electron-based secure token storage strategy.

#### Future Milestone Dependency

Milestone 7 should build on this decision by verifying or designing the backend authentication contract.

Milestone 7 should answer:

* What is the register endpoint?
* What is the login endpoint?
* What request body does login expect?
* What response body does login return?
* Does the backend return `access_token` and `token_type`?
* Is there a `/me` endpoint?
* How should the frontend restore the current user?
* Where should the token be stored?
* How should logout work?
* When should protected routes be introduced?

#### Final Rule

React may collect credentials and send them through the service layer, but React must never be the source of truth for whether credentials are correct.

FastAPI remains the authentication authority.

---

### Frontend AD 7: Auth State and Protected Route Foundation

**Status:** Accepted
**Date Recorded:** 2026-07-01
**Milestone:** Frontend Milestone 7 — Auth State and Protected Routes

#### Context

HelloStay requires a clear authentication foundation before building the real dashboard and hotel modules. The application needs a way to know whether a user is authenticated, protect private routes, redirect unauthenticated users to the login page, and support logout behavior.

At this stage, the frontend authentication UI exists, but real backend authentication is not fully confirmed from the currently available backend files. The backend contains JWT/password utility foundations and token schemas, but no registered authentication router or confirmed login endpoint is currently visible in `main.py`.

#### Decision

Use React Context to manage global frontend authentication state and create a dedicated `ProtectedRoute` component to guard private frontend routes.

Authentication state will be handled in the React renderer process, not in Electron main process. The frontend will store only temporary session/token data needed for the logged-in session. Hotel business data such as rooms, guests, stays, bookings, finance, and history must not be stored in browser storage.

A temporary protected route, `/dashboard`, will be added only to verify route protection. This is not the real dashboard shell.

#### Accepted Implementation Direction

The following files are introduced or updated:

```txt
frontend/src/context/AuthContext.jsx
frontend/src/routes/ProtectedRoute.jsx
frontend/src/routes/AppRoutes.jsx
frontend/src/pages/LoginPage.jsx
frontend/src/pages/DashboardPlaceholderPage.jsx
frontend/src/services/authService.js
frontend/src/main.jsx
```

#### Key Decisions

1. **React Context is used for auth state**

   Auth state must be shared across multiple parts of the app, including login page, protected routes, future dashboard, and future logout controls. Keeping auth state only inside `LoginPage.jsx` would make the state local and unavailable to the rest of the application.

2. **`AuthProvider` wraps the application**

   `AuthProvider` is placed high enough in the component tree so route components and pages can access authentication state using a custom `useAuth()` hook.

3. **`ProtectedRoute` handles private route guarding**

   Private routes are wrapped with `ProtectedRoute`. If the user is not authenticated, the component redirects to `/login`. If the user is authenticated, it renders the protected page.

4. **Frontend guards are not treated as backend security**

   `ProtectedRoute` improves frontend navigation and user experience, but it does not secure backend data. FastAPI must still validate tokens and protect private APIs.

5. **Session/token data may be stored temporarily**

   For V1, frontend session/token data may be stored using `sessionStorage` as a simple beginner-friendly strategy. This allows refresh survival during the current session while avoiding long-term persistence.

6. **Hotel business data must not be stored in frontend storage**

   Rooms, guests, stays, bookings, finance, income, and history remain backend/database responsibilities. FastAPI and SQLite remain the source of truth.

7. **No fake production authentication**

   Because a confirmed backend login endpoint is not currently available, the frontend must not invent endpoint names, request bodies, response bodies, fake users, or fake production tokens.

8. **Electron does not manage auth form state**

   Electron main process remains responsible for desktop shell concerns only: app lifecycle, windows, startup behavior, and later packaging. React renderer handles auth UI and frontend auth state. FastAPI handles credential validation and token creation.

#### Why This Decision Was Made

This decision keeps the frontend architecture clean and prepares the app for real authentication without coupling the UI to unconfirmed backend contracts.

It also teaches a professional separation of responsibility:

```txt
React renderer:
- login form
- auth UI state
- global frontend auth state
- protected route behavior

FastAPI backend:
- credential validation
- password verification
- JWT creation
- private API protection

Electron main process:
- desktop window
- app lifecycle
- startup behavior
- packaging later
```

#### Consequences

Positive consequences:

```txt
Auth state is centralized.
Protected routing is reusable.
LoginPage stays focused on form behavior.
Future dashboard can depend on a clean auth foundation.
The frontend does not fake backend behavior.
Electron responsibilities remain cleanly separated.
```

Trade-offs:

```txt
Real login success flow cannot be fully tested until the backend exposes a confirmed auth endpoint.
Authenticated access to private routes remains blocked without a real token.
Role-based permissions are intentionally postponed.
```

#### Deferred Work

The following items are intentionally postponed:

```txt
Real backend login integration
Register endpoint integration
Token verification on app startup
Refresh token handling
Role-based permissions
Real dashboard shell
Sidebar navigation
Rooms module
Guests module
Stays/bookings module
Finance/history module
Electron backend startup
Electron secure token storage
Packaging
```

#### Final Decision Summary

HelloStay will use React Context for global frontend authentication state and a reusable `ProtectedRoute` component for route guarding. This milestone establishes the frontend structure for authentication while avoiding fake production login until the FastAPI auth endpoint contract is confirmed.

---

### Frontend AD 8: Protected Dashboard Shell with Nested Module Navigation

**Status:** Accepted
**Date Recorded:** 2026-07-01
**Milestone:** Frontend Milestone 8 — Dashboard Layout and Navigation

**Decision:**
HelloStay will use a protected dashboard application shell built in React using React Router nested routes.

The dashboard shell will be implemented as a layout component:

```txt
src/layouts/DashboardLayout.jsx
```

This layout is responsible for the common dashboard structure:

```txt
Sidebar navigation
Top header
Main content area
Logout button
React Router Outlet
```

The dashboard pages will be rendered inside the layout using React Router’s `Outlet`.

**Route Structure Decision:**
Dashboard routes will be grouped under a common parent route:

```txt
/dashboard
/dashboard/rooms
/dashboard/guests
/dashboard/stays
/dashboard/finance
/dashboard/history
```

The `/dashboard` route renders the dashboard layout. The child routes render placeholder pages inside the layout.

```txt
/dashboard          → DashboardHome
/dashboard/rooms    → RoomsPage
/dashboard/guests   → GuestsPage
/dashboard/stays    → StaysPage
/dashboard/finance  → FinancePage
/dashboard/history  → HistoryPage
```

**Protected Route Decision:**
The existing `ProtectedRoute` will protect the dashboard parent route.

This means all dashboard child routes are protected automatically.

Accepted route structure:

```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<DashboardHome />} />
  <Route path="rooms" element={<RoomsPage />} />
  <Route path="guests" element={<GuestsPage />} />
  <Route path="stays" element={<StaysPage />} />
  <Route path="finance" element={<FinancePage />} />
  <Route path="history" element={<HistoryPage />} />
</Route>
```

This avoids repeating `ProtectedRoute` around every dashboard page.

**Layout Responsibility Decision:**
The sidebar, header, and main dashboard frame belong in `DashboardLayout.jsx`.

They should not be duplicated inside every dashboard page.

Accepted structure:

```txt
DashboardLayout
├── Sidebar
├── Top Header
└── Outlet
    ├── DashboardHome
    ├── RoomsPage
    ├── GuestsPage
    ├── StaysPage
    ├── FinancePage
    └── HistoryPage
```

This keeps the application shell stable while only the inner page content changes.

**Navigation Decision:**
Sidebar navigation will use `NavLink` from React Router.

`NavLink` was chosen instead of `Link` because it supports active route styling.

```txt
Link     → navigation only
NavLink  → navigation + active route awareness
```

The dashboard home link uses `end: true` so it is active only on `/dashboard`, not on child routes like `/dashboard/rooms`.

**Placeholder Page Decision:**
Milestone 8 creates placeholder pages only.

Created placeholder pages:

```txt
DashboardHome.jsx
RoomsPage.jsx
GuestsPage.jsx
StaysPage.jsx
FinancePage.jsx
HistoryPage.jsx
```

These pages do not contain real feature logic yet.

No API calls, tables, forms, modals, charts, search, filters, CRUD logic, finance calculations, or history workflows were added.

This keeps Milestone 8 focused only on layout and navigation.

**Electron Boundary Decision:**
Dashboard routing and dashboard UI belong in the React renderer process.

Electron should not control dashboard pages, sidebar links, React routes, or hotel module navigation.

Electron remains responsible for:

```txt
Desktop shell
BrowserWindow
App lifecycle
Preload security
Native desktop integration
Future packaging
```

React remains responsible for:

```txt
Routes
Pages
Layouts
Sidebar navigation
Header UI
Protected dashboard rendering
Logout interaction
```

**Backend Boundary Decision:**
FastAPI remains the source of truth for hotel business logic, validation, database operations, and API contracts.

Milestone 8 does not call backend endpoints for rooms, guests, stays, finance, or history.

The dashboard pages are placeholders only. Real backend integration will happen in future milestones.

**Authentication Development Decision:**
Real backend authentication is not implemented yet.

Because the backend login/register endpoints are not currently available, temporary frontend-only authentication mocks were accepted in `authService.js`.

These mocks exist only to test:

```txt
Login UI flow
Register UI flow
Auth state
ProtectedRoute behavior
Dashboard access
Logout behavior
```

These mocks are not production authentication and must be removed when real FastAPI authentication endpoints are implemented.

**Auth File Organization Decision:**
Authentication context code was split into separate files to avoid React Fast Refresh errors and improve separation of responsibilities.

Accepted structure:

```txt
src/context/AuthContext.js
src/context/AuthProvider.jsx
src/hooks/useAuth.js
```

Responsibilities:

```txt
AuthContext.js       → creates and exports AuthContext only
AuthProvider.jsx     → stores token, login, logout, and auth state
useAuth.js           → exposes reusable useAuth hook
```

The old combined file was removed from active use:

```txt
src/context/AuthContext.jsx
```

This avoids the `react-refresh/only-export-components` ESLint warning.

**Final Decision Summary:**
Milestone 8 establishes the protected dashboard shell for HelloStay.

The application now has a scalable dashboard layout that can host future modules such as rooms, guests, stays, finance, and history.

No real hotel feature logic was added in this milestone.

---

### Frontend AD 9 — Rooms Read-Only Data Fetching Through Service Layer

**Status:** Accepted
**Date Recorded:** 2026-07-02
**Milestone:** Frontend Milestone 9 — Rooms Module Read-Only Foundation
**Project:** HelloStay — Offline Hotel Management System

#### Decision

The HelloStay frontend will fetch room data through a dedicated room service file instead of calling the backend directly from `RoomsPage.jsx`.

A new service file was introduced:

```txt
frontend/src/services/roomService.js
```

This service contains a `getRooms` function that calls the backend `GET /rooms` endpoint through the existing shared `apiClient.js`.

The Rooms page uses this service function to load and display room data in a read-only format.

#### Reason for the Decision

Rooms is the first real hotel module connected to backend data.

Because of that, it is important to establish a clean frontend pattern before adding more complex workflows.

Calling the backend directly inside `RoomsPage.jsx` would mix UI logic and API communication logic in the same file. That may look simple at first, but it becomes harder to maintain as the application grows.

Using a service layer keeps responsibilities clear:

```txt
RoomsPage.jsx
- displays UI
- manages loading, error, empty, and success states
- calls getRooms()

roomService.js
- owns room-related API functions
- knows that rooms are fetched from /rooms

apiClient.js
- owns common request logic
- owns base URL handling
- owns shared error and response handling

FastAPI backend
- owns validation
- owns business rules
- owns database operations
- owns the room API contract
```

This pattern supports future growth when more room functions are added, such as create, edit, delete, and status update.

#### Architecture Rule Established

Frontend feature modules should not call raw backend endpoints directly from page components.

Instead, API calls should flow through feature-specific service files.

For the Rooms module, the rule is:

```txt
RoomsPage.jsx must call roomService.js.
roomService.js must call apiClient.js.
apiClient.js must communicate with FastAPI.
```

#### Data Flow

```txt
RoomsPage.jsx
  ↓
getRooms()
  ↓
roomService.js
  ↓
apiRequest("/rooms")
  ↓
apiClient.js
  ↓
FastAPI GET /rooms
  ↓
SQLite database
```

#### Why Read-Only First

The Rooms module starts with read-only functionality because reading data is safer and simpler than modifying data.

The frontend must first prove that it can:

```txt
Connect to the backend
Handle API responses
Render backend data
Handle loading states
Handle errors
Handle empty results
Keep UI readable
```

Only after this foundation is stable should the module add write operations such as create, edit, and delete.

This reduces complexity and avoids mixing too many concepts in one milestone.

#### React State Decision

`RoomsPage.jsx` manages three local states:

```js
rooms
isLoading
error
```

This decision keeps the module simple.

Global state is not needed yet because room data is only used inside the Rooms page in this milestone.

A custom hook such as `useRooms()` was intentionally not introduced yet because the logic is still small and beginner-friendly.

#### useEffect Decision

`useEffect` is used to fetch rooms when the `RoomsPage` component loads.

This is appropriate because fetching room data is a side effect.

The effect uses an inner async function instead of making the `useEffect` callback directly async.

Accepted pattern:

```js
useEffect(() => {
  async function loadRooms() {
    // fetch rooms here
  }

  loadRooms();
}, []);
```

Rejected pattern:

```js
useEffect(async () => {
  // do not do this
}, []);
```

The rejected pattern is avoided because React expects the effect callback to return either nothing or a cleanup function, not a Promise.

#### UI State Decision

The Rooms page must handle four UI states:

```txt
Loading
Error
Empty
Success
```

This is accepted as the standard pattern for future backend-connected pages in HelloStay.

A production-quality page should not assume that data will always load successfully.

#### Electron Responsibility Decision

No room data fetching logic should be added to the Electron main process or preload layer.

Electron is responsible for:

```txt
Desktop shell
Application lifecycle
Native window
Safe desktop integration
Future packaging
```

React is responsible for:

```txt
Screens
Components
User interaction
Calling frontend services
Displaying API data
```

FastAPI is responsible for:

```txt
Room business logic
Validation
Database queries
API contracts
```

Therefore, room API calls belong in the React renderer process service layer, not in Electron.

#### Backend Source of Truth Decision

FastAPI remains the source of truth for room data.

The frontend must not use `localStorage` or `sessionStorage` as the source of truth for rooms.

The frontend may temporarily store fetched room data in React state for rendering, but the actual room records come from the backend database through `GET /rooms`.

#### Affected Files

```txt
frontend/src/services/roomService.js
frontend/src/pages/RoomsPage.jsx
frontend/src/styles/global.css
```

#### Not Included in This Decision

This architecture decision does not cover:

```txt
Creating rooms
Editing rooms
Deleting rooms
Room forms
Room modals
Room status update
Room availability calculation
Room filtering
Room sorting
Room pagination
Booking integration
Stay integration
Finance integration
History integration
```

These will be handled in later milestones.

#### Consequences

This decision creates a clean and repeatable pattern for future modules.

The same structure can later be used for:

```txt
guestService.js
stayService.js
financeService.js
historyService.js
```

It also makes the Rooms module easier to expand because new room API functions can be added to `roomService.js` without making `RoomsPage.jsx` messy.

#### Final Decision Summary

HelloStay accepts a service-layer-based approach for room data fetching.

For Milestone 9, the Rooms page reads room records from FastAPI through `roomService.js` and `apiClient.js`, displays them in a read-only UI, and handles loading, error, empty, and success states.

This decision keeps the frontend modular, beginner-friendly, production-oriented, and aligned with the project rule that FastAPI remains the source of truth.

---

### Frontend AD 10: Rooms Module Create Foundation Through Service Layer

**Status:** Accepted
**Date Recorded:** 2026-07-03
**Milestone:** Frontend Milestone 10 — Rooms Module Create Foundation

HelloStay now supports creating room records from the React frontend while keeping FastAPI as the source of truth for validation, persistence, and room data.

**Decision:**
Add room creation to the existing Rooms module by introducing a `createRoom()` function inside `roomService.js` and connecting it to an inline controlled form inside `RoomsPage.jsx`.

The frontend sends new room data to the backend using `POST /rooms` through the existing API client and service layer. After successful creation, the frontend clears the form and refreshes the room list from the backend.

**Why this decision was made:**
Milestone 9 introduced read-only room listing using `GET /rooms`. Creating rooms is the next natural step because the user can now move from viewing backend records to creating real backend records.

Room creation was implemented only after the read-only foundation because write operations require more frontend responsibility:

* controlled form fields
* form state
* submit handling
* frontend validation
* loading state
* error state
* request payload preparation
* backend persistence verification
* list refresh after successful creation

Keeping this milestone focused only on creation avoids mixing too many concepts at once.

**Architecture reasoning:**
Room creation belongs in the React renderer UI and the frontend service layer, not in Electron and not in local storage.

React is responsible for:

* displaying the room creation form
* storing temporary form input in component state
* validating basic user input before submission
* calling the room service
* showing loading and error feedback
* refreshing the UI after creation

`roomService.js` is responsible for:

* exposing a clear `createRoom(roomData)` function
* keeping room API calls in one place
* using the existing `apiClient.js`

FastAPI remains responsible for:

* validating request data
* enforcing backend rules
* writing room records to SQLite
* returning the saved room data

Electron remains responsible only for desktop shell behavior and does not contain room API logic.

**Affected files:**

* `frontend/src/services/roomService.js`
* `frontend/src/pages/RoomsPage.jsx`
* `frontend/src/styles/global.css` if styling additions were needed

**Implementation summary:**
`roomService.js` was updated to include:

```js
export function createRoom(roomData) {
  return apiRequest("/rooms", {
    method: "POST",
    body: roomData,
  });
}
```

`RoomsPage.jsx` was updated with:

* `initialRoomFormData`
* `formData` state
* `isCreating` state
* `createError` state
* controlled form inputs
* `handleInputChange`
* `validateRoomForm`
* `handleCreateRoom`
* room list refresh after successful creation

**Validation decision:**
Basic frontend validation was added before submitting the form:

* `room_number` is required
* `price_per_night` is required
* `price_per_night` must be a positive number
* `room_status` is required
* `max_occupancy` must be a positive whole number if provided

Frontend validation improves user experience, but it does not replace backend validation. FastAPI and the database remain the real source of truth.

**Data flow:**

```txt
User fills Add Room form
  ↓
RoomsPage stores input in controlled form state
  ↓
Frontend validates basic input
  ↓
RoomsPage calls createRoom(roomPayload)
  ↓
roomService calls apiClient
  ↓
apiClient sends POST /rooms
  ↓
FastAPI validates and saves room
  ↓
RoomsPage refreshes rooms list
  ↓
Updated room appears in UI
```

**Important constraint discovered:**
Room numbers must be unique. During verification, creating a duplicate room number caused the backend/database to reject the request because `rooms.room_number` has a unique constraint.

This confirmed that:

* the frontend POST request was reaching the backend
* the backend was attempting to save the room
* SQLite was enforcing room-number uniqueness
* duplicate room handling should be improved in a future backend polish task

**What was intentionally not added:**

* edit room
* delete room
* inline room status update
* booking-based availability
* room images
* pagination
* sorting
* advanced filtering
* modal-based create form
* optimistic UI updates
* Electron-based room API logic
* localStorage room persistence

**Consequences:**
The Rooms module now has its first complete write workflow. The frontend can create real backend records while still preserving clean separation between React, service layer, API client, FastAPI, and SQLite.

This decision also establishes the pattern future create workflows should follow:

```txt
Page form → service function → apiClient → FastAPI endpoint → database → refetch UI
```

**Future considerations:**
Future milestones may add:

* room edit foundation using `PUT /rooms/{room_id}`
* room delete foundation using `DELETE /rooms/{room_id}`
* better backend duplicate-room handling with clear HTTP errors
* room status update rules
* booking-based room availability
* room filtering and search
* component extraction if `RoomsPage.jsx` becomes too larg

---

### Frontend AD 11 — Room Edit and Delete Through Service Layer

**Status:** Accepted
**Date Recorded:** 2026-07-08
**Milestone:** Milestone 11 — Rooms Module Edit and Delete Foundation
**Project:** HelloStay Frontend

#### Context

HelloStay is an offline desktop Hotel Management System built with FastAPI, React, and Electron.

By the end of Milestone 10, the Rooms module already supported reading rooms from the backend and creating new room records. Milestone 11 required the frontend to support updating and deleting existing room records.

The backend already exposes room update and delete endpoints:

```txt
PUT /rooms/{room_id}
DELETE /rooms/{room_id}
```

The backend also supports partial room updates through the `RoomUpdate` schema. FastAPI remains the source of truth for validation, database operations, and room records.

#### Decision

Room edit and delete functionality will be implemented in the React renderer process using the existing frontend service-layer pattern.

All room API calls must remain inside:

```txt
frontend/src/services/roomService.js
```

The Rooms page must call service functions instead of directly calling backend URLs.

The following service functions are accepted:

```txt
updateRoom(roomId, roomData)
deleteRoom(roomId)
```

`updateRoom` will call:

```txt
PUT /rooms/{room_id}
```

`deleteRoom` will call:

```txt
DELETE /rooms/{room_id}
```

The Rooms page will manage UI-specific state such as:

* selected room being edited
* form values
* create/edit mode
* update loading state
* update error state
* delete confirmation state
* delete loading state
* delete error state

After successful update or delete, the Rooms page will refetch the rooms list from the backend instead of performing optimistic local updates.

#### Why This Decision Was Made

This decision keeps the frontend architecture simple, readable, and beginner-friendly.

The service layer prevents API endpoint details from spreading across UI components. This makes the code easier to maintain because endpoint paths, HTTP methods, and request behavior stay centralized.

Reusing the room form for both create and edit avoids duplicate form code while still keeping the implementation small enough for the current stage of the project.

Refetching the rooms list after update or delete keeps the UI synchronized with the backend database. This is safer than manually updating local state because FastAPI remains the source of truth.

Optimistic updates were intentionally avoided because they add rollback complexity if the backend request fails.

Inline delete confirmation was chosen instead of a modal because it is simpler, easier to understand, and appropriate for this early foundation milestone.

#### Responsibility Separation

React renderer process is responsible for:

* Displaying room data
* Managing form state
* Switching between create and edit mode
* Showing update/delete loading states
* Showing update/delete error states
* Asking for delete confirmation
* Calling room service functions

Service layer is responsible for:

* Encapsulating room API functions
* Calling the existing API client
* Hiding endpoint details from page components

FastAPI backend is responsible for:

* Validating room data
* Updating room records
* Deleting room records
* Returning updated data or errors
* Protecting database integrity

Electron main process is responsible for:

* Desktop shell behavior
* App lifecycle
* Native window management

Electron main process must not contain room update or delete logic.

#### Affected Files

```txt
frontend/
  src/
    services/
      roomService.js

    pages/
      RoomsPage.jsx

    styles/
      global.css
```

#### Accepted Implementation Rules

The Rooms page may use state such as:

```txt
editingRoomId
formData
isSavingRoom
saveError
deleteConfirmId
deletingRoomId
deleteError
```

The edit form should be pre-filled from the selected room record.

The user must be able to cancel edit mode.

Delete must require confirmation before calling the backend.

The rooms list should refresh after successful update or delete.

Frontend validation may be used to improve user experience, but backend validation remains authoritative.

#### Rejected Alternatives

Directly calling `fetch` inside `RoomsPage.jsx` was rejected because it mixes API details with UI logic.

Moving room edit/delete logic into Electron was rejected because Electron should not contain hotel business logic or database workflow logic.

Using localStorage as the source of truth was rejected because room records must come from the backend database.

Optimistic update was rejected for this milestone because it introduces additional complexity too early.

A modal confirmation system was rejected for this milestone because inline confirmation is simpler and sufficient.

Creating advanced room-specific abstractions was rejected unless the page becomes too large to maintain.

#### Consequences

The Rooms module now follows a clearer CRUD architecture.

The code remains beginner-friendly while still following production-oriented separation of concerns.

The frontend remains aligned with the backend API contract.

Room data stays synchronized with the backend after updates and deletes.

The project is now better prepared for future Rooms module improvements such as filtering, searching, pagination, room status workflows, and booking/stay integration.

#### Future Considerations

Future milestones may revisit this decision when the Rooms module becomes more complex.

Possible future improvements include:

* Extracting a reusable `RoomForm` component
* Extracting a `RoomList` or `RoomTable` component
* Adding search and filters
* Adding pagination
* Adding room status workflows
* Adding booking-based availability
* Adding modal confirmation for destructive actions
* Adding optimistic updates if the UX requires it
* Adding stronger validation helpers
* Adding automated tests for room service functions and Rooms page behavior

#### Summary

Frontend AD 11 establishes that room update and delete operations must go through the frontend service layer, not directly through page components or Electron.

React manages the user interface and interaction state.

The service layer manages API communication.

FastAPI remains the source of truth for room data and validation.

This decision completes the basic CRUD foundation for the Rooms module while preserving HelloStay’s clean frontend architecture.

---

### Frontend AD 12 — Refine Rooms Module Through Small Component Extraction

**Status:** Accepted
**Date Recorded:** 2026-07-08
**Milestone:** Frontend Milestone 12 — Rooms Module UX Refinement and Code Cleanup

After completing room listing, creation, editing, and deletion in Milestones 9, 10, and 11, the Rooms page had enough behavior to justify a small refactor.

The decision was made to refine the Rooms module through limited component extraction and visual cleanup while preserving all existing behavior.

**Decision:**

Keep `RoomsPage.jsx` as the page-level coordinator for the Rooms module, but extract focused room-specific UI into smaller components where it improves readability.

The accepted structure is:

* `RoomsPage.jsx` for page state, API coordination, loading state, error state, success messages, create/edit mode, and refresh behavior.
* `RoomForm.jsx` for the create/edit room form UI.
* `RoomTable.jsx` for displaying the room list and room-level actions.
* `roomService.js` for all room API calls.
* `global.css` for visual layout and styling improvements.

**Why this decision was made:**

The Rooms module had become more complex after adding read, create, update, and delete behavior. Keeping everything inside one page file would still work, but the file would become harder to read and maintain as the application grows.

Extracting `RoomForm.jsx` and `RoomTable.jsx` improves readability because the form and list are separate UI concerns. This allows `RoomsPage.jsx` to focus on feature behavior instead of being overloaded with all JSX details.

This refactor is intentionally small. It improves code clarity without introducing unnecessary architecture such as custom hooks, reducers, global state, or external state libraries.

**Architecture rules confirmed:**

* FastAPI remains the source of truth for room data and validation.
* React does not store room data as the permanent source of truth.
* `localStorage` is not used as the source of truth for rooms.
* All room API calls remain inside `roomService.js`.
* `RoomsPage.jsx` coordinates API calls through `roomService.js`.
* `RoomForm.jsx` and `RoomTable.jsx` do not call the backend directly.
* Electron main process does not contain room UI logic or room API logic.
* React renderer owns UI, form state, interaction, loading states, and error display.
* Backend business logic is not moved into React or Electron.

**Component responsibility decision:**

`RoomsPage.jsx` owns state because create/edit/delete behavior affects the whole page.

`RoomForm.jsx` receives form data, validation errors, mode, loading state, and handlers through props. It does not own the main room form state.

`RoomTable.jsx` receives rooms and action handlers through props. It does not perform API requests directly.

This keeps data flow simple:

`RoomsPage.jsx → RoomForm.jsx`
`RoomsPage.jsx → RoomTable.jsx`
`RoomsPage.jsx → roomService.js → FastAPI`

**Design decision:**

The Rooms page should follow the HelloStay V1 frontend design direction: clean, modern, desktop-first, professional, and easy for hotel staff to scan.

The UI should use:

* clear page headings,
* card-based surfaces,
* consistent spacing,
* readable typography,
* clean form layout,
* desktop-friendly room table,
* visible status badges,
* clear edit and delete actions,
* understandable loading, empty, error, and success states.

The UI should not become flashy or overly complex. Clarity is more important than visual decoration.

**Rejected alternatives:**

A full rewrite of the Rooms module was rejected because the existing behavior was already working.

A large abstraction using custom hooks was rejected because it would hide important learning concepts too early.

Global state for rooms was rejected because only the Rooms page currently needs this data.

Reducers were rejected because the current state transitions are still understandable with `useState`.

External state libraries were rejected because they are unnecessary for this stage of the project.

A modal-based create/edit flow was rejected for now because it would add extra UI complexity before the basic page flow is fully mastered.

**Consequences:**

The Rooms module is now easier to understand and maintain.

The page has a cleaner separation between feature behavior and UI rendering.

The create/edit/delete flow remains connected to the backend through the existing service layer.

The project remains beginner-friendly while still moving toward production-quality structure.

Future milestones can build on this pattern when implementing Guests, Bookings, Stays, Finance, History, and Settings.

**Final decision:**

Use small, practical component extraction for the Rooms module and keep the architecture simple. Preserve backend integration, avoid premature abstraction, and improve the user experience without changing the business behavior.

---

### Frontend AD 13: Guests Module Read-Only Service and Page Pattern

**Status:** Accepted
**Date Recorded:** 2026-07-08
**Milestone:** Frontend Milestone 13 — Guests Module Read-Only Foundation

The HelloStay frontend will implement the Guests module using the same clean service/page separation pattern already proven in the Rooms module. Guest data must be read from the FastAPI backend through a dedicated frontend service file instead of being fetched directly inside the page component.

**Decision:**

Create a dedicated `guestService.js` file inside the frontend services folder and use it as the only place for guest-related API calls.

For Milestone 13, the service exposes only one function:

`getGuests()`

This function calls:

`GET /guests`

through the existing `apiClient.js`.

The `GuestsPage.jsx` component consumes `guestService.getGuests()` and is responsible only for UI behavior, including loading, error, empty, and success states.

**Why this decision was made:**

The Guests module is the second major backend-connected dashboard module after Rooms. This makes it an important opportunity to confirm that the frontend architecture is reusable and not hardcoded for only one feature.

Keeping guest API calls inside `guestService.js` improves separation of concerns. The page component does not need to know how the HTTP request is built, how the base URL is handled, or how the API client processes the response. The page only needs to request guest data and render the correct UI state.

This pattern also makes the module easier to grow in future milestones. Later guest features such as create, update, delete, search, filters, and guest stay history can be added to the guest service and Guests page in a controlled way without mixing too many responsibilities too early.

**Architecture rules accepted in this decision:**

* Guest data must come from FastAPI, not from hardcoded frontend data.
* `localStorage` must not be used as the source of truth for guests.
* `GuestsPage.jsx` should not directly call `fetch`.
* Guest API logic belongs in `guestService.js`.
* Common HTTP behavior remains inside `apiClient.js`.
* FastAPI remains the source of truth for validation, database operations, and API contracts.
* React is responsible for UI state and rendering.
* Electron main process must not contain guest API logic.
* Guest create, edit, delete, stay history, and booking integration must be handled in later milestones.

**Affected files:**

* `frontend/src/services/guestService.js`
* `frontend/src/pages/GuestsPage.jsx`
* `frontend/src/styles/global.css` if guest-specific styling was added globally

**Result:**

The Guests page now follows a production-oriented frontend pattern:

`GuestsPage.jsx → guestService.js → apiClient.js → FastAPI GET /guests`

This decision keeps the Guests module simple, testable, beginner-friendly, and ready for future expansion.

---

### Frontend AD 14: Guest Creation Through Service Layer and Backend Source of Truth

**Status:** Accepted
**Date Recorded:** 2026-07-08
**Milestone:** Frontend Milestone 14 — Guests Module Create Foundation

The Guests module will create guest records through the FastAPI backend using a dedicated guest service function instead of handling API calls directly inside the page component or storing guest records locally in the frontend.

**Decision:**

Add guest creation by extending the existing Guests module with a `createGuest(guestData)` function inside `guestService.js`. The function sends a `POST /guests` request through the shared `apiClient.js`.

The `GuestsPage.jsx` component owns only the UI state required for the create flow, including form values, frontend validation messages, create loading state, and create error state. After a guest is created successfully, the frontend clears the form and refetches the guest list from the backend.

**Why this decision was made:**

FastAPI remains the source of truth for guest records, backend validation, duplicate constraints, database writes, and API contracts. React should not directly perform database-like operations or treat local state as the permanent source of truth for guests.

Using `guestService.js` keeps API communication organized and consistent with earlier milestones. This follows the same service-layer pattern already used by the Rooms module and the read-only Guests module.

Refetching the guest list after successful creation was chosen instead of optimistic updates because this milestone prioritizes correctness, simplicity, and beginner-friendly learning. Refetching ensures the UI reflects the actual backend/database state after creation.

**Architecture rules confirmed:**

* React renderer process handles the guest form, UI state, validation messages, and user interactions.
* `guestService.js` handles guest API functions.
* `apiClient.js` handles shared request behavior.
* FastAPI handles validation, persistence, duplicate constraints, and returned guest records.
* Electron main process does not contain guest creation logic.
* Preload/IPC is not used for normal guest CRUD API calls in this milestone.
* Local storage is not used as the source of truth for guest records.

**Implementation notes:**

The guest creation form uses controlled components. Each input value is stored in React state and updated through an `onChange` handler. The input `name` attributes match the backend field names so the frontend form data maps directly to the backend guest creation schema.

Basic frontend validation was added for all required fields:

* Guest name is required
* Guest phone number is required
* Guest address is required
* ID proof type is required
* ID proof number is required

Frontend validation improves user experience by catching missing fields before sending the request. Backend validation and database constraints still remain the final authority.

The initial guest loading logic was adjusted to avoid the React Hooks `set-state-in-effect` lint issue. Data fetching was separated from immediate state updates so that `useEffect` starts the asynchronous fetch and state updates occur after the request resolves.

**Affected files:**

* `frontend/src/services/guestService.js`
* `frontend/src/pages/GuestsPage.jsx`

**Rejected alternatives:**

Directly calling `fetch()` inside `GuestsPage.jsx` was rejected because it would mix page UI logic with API implementation details.

Using optimistic updates was rejected for this milestone because it adds complexity and can make the frontend temporarily show data that may not match the backend.

Creating a separate `GuestForm.jsx` component was deferred because the current milestone benefits from keeping the create flow visible and beginner-friendly inside `GuestsPage.jsx`.

Using a modal form was rejected because it would add extra UI state, accessibility concerns, and unnecessary complexity before the basic create flow is fully understood.

**Result:**

Guest creation now follows the established HelloStay frontend architecture: React manages the UI, the service layer manages API calls, and FastAPI remains the source of truth for guest data.

---

### Frontend AD 15: Guest Updates and Deletions Use Service-Layer Mutations with Server Refetching

**Status:** Accepted
**Date Recorded:** 2026-07-15
**Milestone:** Frontend Milestone 15 — Guests Module Edit and Delete Foundation

The HelloStay Guests module supports editing and deleting guest records through the existing frontend service layer while keeping FastAPI as the source of truth.

**Decision:**

Guest update and delete operations must be performed through `guestService.js` using the existing shared `apiClient.js`.

The Guests page must not call backend endpoints directly. It should express user actions through service functions such as:

* `updateGuest(guestId, guestData)`
* `deleteGuest(guestId)`

Guest updates use:

* `PUT /guests/{guest_id}`

Guest deletions use:

* `DELETE /guests/{guest_id}`

After a successful update or deletion, the frontend refetches the guest list from the backend instead of relying on optimistic updates or treating local React state as the permanent source of truth.

Editing uses a separate editable copy of the selected guest. The original selected guest record and the controlled edit-form state remain separate so the frontend can pre-fill fields, detect changed values, cancel editing safely, and avoid directly mutating list data.

Guest deletion requires an explicit inline confirmation before the destructive request is sent.

**Why this decision was made:**

FastAPI remains responsible for validation, database operations, uniqueness constraints, and guest persistence. Keeping all guest requests inside `guestService.js` preserves the established frontend architecture and prevents endpoint details from spreading across React components.

Refetching after update and delete ensures that the UI reflects the backend’s confirmed state. It is simpler and safer than optimistic updates during the current stage of the project because it avoids rollback logic and local-state synchronization problems.

Separate edit state makes the editing workflow easier to understand and maintain. It prevents the displayed guest list from being mutated while the user is typing and allows edit mode to be cancelled without affecting backend or list data.

Inline delete confirmation was chosen instead of a modal because it is beginner-friendly, visually connected to the selected guest, and does not require premature modal infrastructure, focus management, keyboard handling, or overlay behavior.

**Architecture boundaries:**

* React renderer process manages guest forms, selected guest state, loading states, validation messages, confirmation UI, and user interaction.
* `guestService.js` owns guest-related API operations and endpoint paths.
* `apiClient.js` owns shared request configuration, response parsing, authentication headers, and normalized request errors.
* FastAPI remains responsible for guest validation, updates, deletions, database persistence, and duplicate-field enforcement.
* Electron main process and preload scripts do not contain guest CRUD logic.
* Local storage is not used as the source of truth for guest records.

**Update strategy:**

The edit form is pre-filled from the selected guest record.

Before submission:

* Form values are trimmed.
* Required-field validation is performed.
* Edited values are compared with the original guest.
* Only changed fields are included in the update payload.
* A request is not sent when no values have changed.

Frontend validation improves usability, but backend validation remains authoritative.

**Delete strategy:**

The first Delete action opens an inline confirmation state for the selected guest.

The actual DELETE request is sent only after the user confirms the destructive action.

During deletion:

* The selected guest’s delete action shows a loading state.
* Repeated delete submissions are disabled.
* The confirmation remains visible if deletion fails.
* Backend error messages are displayed when available.
* The guest list is refetched after successful deletion.

**Loading and error-state decision:**

Create, update, and delete operations use separate loading and error states.

This prevents one operation from incorrectly controlling unrelated UI and makes it clear which action is currently running or has failed.

Examples include:

* `isCreating`
* `isUpdating`
* `deletingGuestId`
* `createError`
* `updateError`
* `deleteError`

A guest ID is stored for delete loading instead of using only a general Boolean so the UI can identify the exact guest being deleted.

**Affected files:**

* `frontend/src/services/guestService.js`
* `frontend/src/pages/GuestsPage.jsx`
* Guest-related styles in the existing frontend stylesheet

**Consequences:**

**Positive consequences:**

* Guest API logic remains centralized.
* The backend continues to be the source of truth.
* Editing is predictable and cancelable.
* Destructive deletion requires confirmation.
* Loading and error states are operation-specific.
* The implementation remains small and understandable.
* The approach follows the established Rooms module architecture without blindly copying its code.
* The design can later support reusable guest components.

**Trade-offs:**

* Refetching performs an additional GET request after each mutation.
* The edit form currently adds more state and handlers to `GuestsPage.jsx`.
* Inline confirmation is simpler than a modal but may require later visual refinement.
* Duplicate database errors depend on the quality of backend error responses.
* Optimistic UI updates are intentionally postponed.

**Rejected alternatives:**

* Calling FastAPI directly from `GuestsPage.jsx`.
* Moving guest update or delete logic into Electron.
* Treating React state or local storage as permanent guest storage.
* Deleting a guest immediately after the first click.
* Introducing a modal system only for this milestone.
* Optimistically updating the list before the backend confirms success.
* Building guest stays, bookings, history, document upload, or OCR during this milestone.

**Future implications:**

A future Guests UX refinement milestone may extract reusable components such as:

* `GuestForm.jsx`
* `GuestCard.jsx`
* `GuestList.jsx`

A later backend-hardening milestone may provide consistent conflict responses for duplicate phone numbers and ID proof numbers.

Guest stay history, booking integration, activity timelines, document handling, filtering, sorting, and pagination should remain separate future milestones.

---

## Backend Milestone History

### Frontend Rebuild Note
The previous frontend/Electron implementation milestones have been intentionally removed from this history because the frontend will be rebuilt from scratch. The related frontend decisions are now tracked under Future Requirements instead of Architecture Decisions.

### Backend Milestone 0 — Project Planning & Documentation
**Status:** Completed
Project vision, technology stack, architecture approach, and documentation structure defined.

### Backend Milestone 1 — Development Environment Setup
**Status:** Completed
Git repository, virtual environment, dependency installation, requirements.txt.

### Backend Milestone 2 — Backend Architecture Setup
**Status:** Completed
Layered backend structure (api/, core/, database/, models/, schemas/).

### Backend Milestone 3 — Database Foundation
**Status:** Completed
SQLite integration, engine, SessionLocal, Base model, first SystemInfo model.

### Backend Milestone 4 — CRUD API Development
**Status:** Completed
Complete CRUD for SystemInfo using FastAPI and SQLAlchemy.

### Backend Milestone 5 — API Testing & Validation
**Status:** Completed
Swagger UI testing of all CRUD operations.

### Backend Milestone 6 — Room API Foundation
**Status:** Completed
RoomCreate/RoomResponse/RoomUpdate schemas, get_db dependency, APIRouter, response_model.

### Backend Milestone 7 — First Room API Registration
**Status:** Completed
Room router registered in main.py, Swagger integration.

### Backend Milestone 8 — Room Retrieval APIs
**Status:** Completed
GET /rooms (list all), GET /rooms/{room_id} (single with 404 handling).

### Backend Milestone 9 — Room Retrieval API
**Status:** Completed
List response model, ORM serialization for collections.

### Backend Milestone 10 — Single Room Retrieval
**Status:** Completed
GET /rooms/{room_id} with HTTPException 404.

### Backend Milestone 11 — Room CRUD Module
**Status:** COMPLETED
Full CRUD: POST, GET (list + single), PUT (partial update), DELETE with proper error handling.

### Backend Milestone 12 — Guest CRUD API
**Status:** Completed
Full guest CRUD with Alembic migration.

### Backend Milestone 13 — Stay Management System
**Status:** Completed
Stay model with foreign keys, price snapshot, nullable checkout, full CRUD.

### Backend Milestone 14 — Documentation Restructuring
**Status:** Completed
LEARNING_NOTES.md split into BACKEND_CONCEPTS.md, FRONTEND_CONCEPTS.md, ELECTRON_CONCEPTS.md, FULLSTACK_FLOW.md.

### Backend Milestone 15 — Guest Stay Module
**Status:** Completed
GuestStay junction table for many-to-many Guest-Stay relationship with is_primary_guest flag.

### Backend Milestone 16 — Backend Authentication Setup
**Status:** Completed
passlib[bcrypt], python-jose for JWT, core/security.py, schemas/token.py.

---

## Frontend Milestone Plan

### HelloStay Frontend V1 Milestone Plan

#### Objective
Divide the remaining **HelloStay frontend + Electron desktop app work** into clear milestones so each milestone can be completed in a separate ChatGPT session under the HelloStay project.

The goal is to keep every session focused, reduce confusion, preserve accuracy, and help with learning:
- React
- JavaScript
- Electron
- Frontend architecture

### Milestone 0: Project Orientation and Rules Review

#### Purpose
Before writing code, review the existing backend, API contracts, architecture decisions, and V1 scope.

#### Scope
This milestone is only for understanding the project.

#### Topics
- HelloStay V1 feature scope
- Existing FastAPI backend structure
- Authentication flow
- API endpoints
- Architecture Decisions
- Offline desktop requirement
- Electron + React responsibility separation

#### Output
A clear frontend implementation strategy.

#### Done When

You understand:
- What belongs in React
- What belongs in Electron
- What belongs in FastAPI
- What V1 includes
- What V1 excludes

#### Suggested Session Title
**Milestone 0 — HelloStay Frontend Orientation**

---

### Milestone 1: Frontend Project Setup

#### Purpose
Create the frontend project from scratch.

#### Scope
Set up the React frontend foundation without building features yet.

#### Topics
- Vite + React setup
- JavaScript project structure
- Basic folder organization
- Development scripts
- ESLint basics
- Environment variables
- API base URL setup

#### Folder/File Focus
```text
frontend/
  src/
    main.jsx
    App.jsx
    routes/
    pages/
    components/
    services/
    hooks/
    context/
    utils/
    styles/
```

#### Output
A clean React app that runs successfully.

#### Done When
- React app starts without errors
- Folder structure is ready
- No hotel features are implemented yet

#### Suggested Session Title
**Milestone 1 — React Project Setup**

---

### Milestone 2: Electron Desktop Shell Setup

#### Purpose
Add Electron as the desktop shell around React.

#### Scope
Set up Electron main process, preload file, and secure renderer loading.

#### Topics
- Electron main process
- Renderer process
- Preload script
- BrowserWindow
- Context isolation
- Node integration security
- Loading React inside Electron
- Development vs production startup

#### Folder/File Focus
```text
electron/
  main.js
  preload.js

frontend/
  src/
```

#### Output
HelloStay opens as a desktop window.

#### Done When
- Electron window opens
- React UI loads inside Electron
- Security basics are respected
- Backend logic is not moved into Electron

#### Suggested Session Title
**Milestone 2 — Electron Desktop Shell**

---

### Milestone 3: App Startup Flow

#### Purpose
Build the first user-facing flow.

#### Scope
Create the app start screen and redirect flow into login.

#### Topics
- App startup screen
- React Router
- Navigation
- Initial loading screen
- Desktop app startup behavior
- Offline-first mindset

#### Pages
- StartPage
- LoginPage placeholder

#### Output
The app opens to a start page, then moves to login.

#### Done When
- Start page exists
- Login route exists
- Navigation works
- No authentication logic yet

#### Suggested Session Title
**Milestone 3 — Startup Flow and Routing**

---

### Milestone 4: Layout System and Design Foundation

#### Purpose
Create the visual foundation before feature screens.

#### Scope
Build reusable layout, spacing, colors, typography, and shared UI components.

#### Topics
- CSS strategy
- Global styles
- App layout
- Reusable buttons
- Inputs
- Cards
- Loading state component
- Error message component
- Responsive desktop UI basics

#### Folder/File Focus
```text
components/ui/
  Button.jsx
  Input.jsx
  Card.jsx
  Loading.jsx
  ErrorMessage.jsx

styles/
  global.css
```

#### Output
A clean design foundation for the whole app.

#### Done When
- UI components are reusable
- Pages do not contain messy duplicated styles
- The app has a consistent visual style

#### Suggested Session Title
**Milestone 4 — UI Foundation and Layout System**

---

### Milestone 5: API Client Setup

#### Purpose
Create the frontend layer that talks to the FastAPI backend.

#### Scope
No screens yet. Only API communication setup.

#### Topics
- Fetch API or Axios
- API base URL
- Request helpers
- Error handling
- JSON parsing
- Authentication token attachment
- Backend unavailable handling

#### Folder/File Focus
```text
services/
  apiClient.js
  authService.js
```

#### Output
A reusable API client.

#### Done When
- Frontend can call backend safely
- Errors are handled consistently
- API code is not scattered inside components

#### Suggested Session Title
**Milestone 5 — API Client and Backend Communication**

---

### Milestone 6: Authentication UI

#### Purpose
Build login and create-account screens.

#### Scope
Create the UI first, then connect it to backend authentication.

#### Topics
- Controlled forms
- React state
- Form submission
- Validation
- Login request
- Register request
- JWT storage strategy
- Auth errors
- Loading states

#### Pages
- LoginPage
- RegisterPage

#### Output
User can create an account and log in.

#### Done When
- Login works with backend
- Register works with backend
- Invalid credentials show error
- Loading state appears during requests
- Token is stored safely for V1

#### Suggested Session Title
**Milestone 6 — Authentication UI and Logic**

---

### Milestone 7: Auth State and Protected Routes

#### Purpose
Teach the app who is logged in and protect private pages.

#### Scope
Create global authentication state.

#### Topics
- React Context API
- AuthProvider
- Protected routes
- Logout
- Persisting login across refresh
- Redirecting unauthenticated users

#### Folder/File Focus
```text
context/
  AuthContext.jsx

routes/
  ProtectedRoute.jsx
```

#### Output
Only logged-in users can access the dashboard.

#### Done When
- Dashboard is protected
- Logged-out users go to login
- Logged-in users remain logged in
- Logout works

#### Suggested Session Title
**Milestone 7 — Auth Context and Protected Routes**

---

### Milestone 8: Main Dashboard Shell

#### Purpose
Build the main application structure after login.

#### Scope
Create the dashboard layout but not all feature logic yet.

#### Topics
- Sidebar navigation
- Header
- Main content area
- Nested routes
- Dashboard cards
- Page layout consistency

#### Pages
- DashboardLayout
- DashboardHome
- RoomsPage placeholder
- BookingsPage placeholder
- GuestsPage placeholder
- FinancePage placeholder
- HistoryPage placeholder
- SettingsPage optional

#### Output
A professional app shell for HelloStay.

#### Done When
- Sidebar navigation works
- Header shows app/user info
- Feature pages are reachable
- Layout is reusable

#### Suggested Session Title
**Milestone 8 — Dashboard Layout and Navigation**

---

### Milestone 9: Rooms Management

#### Purpose
Build the first real hotel module.

#### Scope
Manage hotel rooms using backend APIs.

#### Topics
- Fetching room list
- Room table/grid
- Create room form
- Edit room form
- Delete/deactivate room
- Room status
- Loading/error/empty states
- Component decomposition

#### Pages/Components
- RoomsPage
- RoomList
- RoomCard or RoomTable
- RoomForm
- RoomStatusBadge

#### Output
User can manage rooms.

#### Done When
- Rooms can be listed
- Rooms can be created
- Rooms can be edited
- Rooms can be deleted/deactivated depending on backend rules
- Errors are shown properly

#### Suggested Session Title
**Milestone 9 — Rooms Management Module**

---

### Milestone 10: Guests Management

#### Purpose
Build guest record management.

#### Scope
Create, view, update, and search guests.

#### Topics
- Guest list
- Guest details
- Guest form
- Search/filter
- ID/contact fields
- Form validation
- Reusable form patterns

#### Pages/Components
- GuestsPage
- GuestList
- GuestForm
- GuestDetails
- GuestSearch

#### Output
User can manage guest records.

#### Done When
- Guests can be listed
- Guests can be created
- Guests can be edited
- Guest search works
- Guest details are clear

#### Suggested Session Title
**Milestone 10 — Guests Management Module**

---

### Milestone 11: Bookings Management

#### Purpose
Build the central hotel workflow: bookings.

#### Scope
Create and manage room bookings.

#### Topics
- Booking list
- Create booking
- Select guest
- Select available room
- Check-in/check-out dates
- Booking status
- Backend validation
- Date handling
- Conflict handling

#### Pages/Components
- BookingsPage
- BookingList
- BookingForm
- BookingDetails
- BookingStatusBadge
- RoomAvailabilitySelector
- GuestSelector

#### Output
User can create and manage bookings.

#### Done When
- Bookings can be listed
- New booking can be created
- Guest and room are selected properly
- Date validation works
- Backend conflict errors are displayed clearly

#### Suggested Session Title
**Milestone 11 — Bookings Management Module**

---

### Milestone 12: Booking Lifecycle Actions

#### Purpose
Add real hotel workflow actions to bookings.

#### Scope
Implement status-based actions.

#### Topics
- Check-in
- Check-out
- Cancel booking
- Booking status transitions
- Confirm dialogs
- Business-rule-driven UI
- Preventing invalid actions

#### Components
- BookingActions
- ConfirmDialog
- StatusActionButton

#### Output
Bookings can move through their lifecycle.

#### Done When
- User can check in a booking
- User can check out a booking
- User can cancel when allowed
- Invalid actions are hidden or disabled
- Backend remains source of truth

#### Suggested Session Title
**Milestone 12 — Booking Lifecycle Actions**

---

### Milestone 13: Finance and Income Overview

#### Purpose
Show income and financial summaries for V1.

#### Scope
Display total income and finance-related booking/payment data based on existing backend endpoints.

#### Topics
- Finance dashboard
- Total income
- Date filters
- Booking revenue
- Paid/unpaid status if backend supports it
- Summary cards
- Basic charts only if needed

#### Pages/Components
- FinancePage
- IncomeSummaryCards
- FinanceFilters
- RevenueTable

#### Output
User can see financial overview.

#### Done When
- Total income is visible
- Finance data comes from backend
- Date filtering works if backend supports it
- Empty/error states are handled

#### Suggested Session Title
**Milestone 13 — Finance and Income Module**

---

### Milestone 14: History Module

#### Purpose
Show historical hotel activity.

#### Scope
Display previous bookings, completed stays, cancelled bookings, and relevant records.

#### Topics
- Booking history
- Guest stay history
- Filters
- Date ranges
- Status filters
- Read-only historical data
- Difference between active data and history

#### Pages/Components
- HistoryPage
- HistoryList
- HistoryFilters
- HistoryDetails

#### Output
User can review historical records.

#### Done When
- History page works
- Completed/cancelled/past data is visible
- Filters work
- No accidental editing of historical records

#### Suggested Session Title
**Milestone 14 — History Module**

---

### Milestone 15: Dashboard Metrics

#### Purpose
Make the dashboard useful after core modules exist.

#### Scope
Show operational summary on the dashboard home.

#### Topics
- Available rooms
- Occupied rooms
- Active bookings
- Today’s check-ins
- Today’s check-outs
- Total guests
- Income summary
- Parallel API calls
- Loading multiple data sources

#### Components
- DashboardHome
- MetricCard
- TodayActivity
- DashboardSummary

#### Output
Dashboard gives a quick overview of hotel status.

#### Done When
- Metrics are displayed
- Data is current
- Loading states are clean
- Errors do not break the whole dashboard

#### Suggested Session Title
**Milestone 15 — Dashboard Metrics and Overview**

---

### Milestone 16: Error Handling, Empty States, and UX Polish

#### Purpose
Make the app feel reliable and professional.

#### Scope
Improve user experience across all modules.

#### Topics
- Global error patterns
- Empty states
- Loading skeletons
- Form error messages
- Toast notifications
- Confirmation modals
- Disabled buttons
- Accessibility basics
- Keyboard usability

#### Output
The app becomes much more usable.

#### Done When
- Every page handles loading
- Every page handles errors
- Empty lists look intentional
- Forms guide the user clearly
- Destructive actions require confirmation

#### Suggested Session Title
**Milestone 16 — UX Polish and Error Handling**

---

### Milestone 17: Offline Desktop Behavior

#### Purpose
Improve the Electron/offline production behavior.

#### Scope
Handle local backend startup and desktop app reliability.

#### Topics
- FastAPI backend startup from Electron
- Checking backend availability
- Startup loading state
- Backend connection failure screen
- App quit behavior
- Localhost API configuration
- Desktop-specific error handling

#### Electron Responsibility Split

##### Electron Main
- Starts/checks backend
- Manages window lifecycle

##### Preload
- Exposes safe desktop APIs

##### React Renderer
- Shows startup/loading/error UI

#### Output
The desktop app behaves properly when launched offline.

#### Done When
- App can detect backend availability
- User sees a clear message if backend is unavailable
- React does not directly access unsafe Node APIs
- Electron remains only a shell and startup manager

#### Suggested Session Title
**Milestone 17 — Offline Electron Startup Behavior**

---

### Milestone 18: Security Review

#### Purpose
Review the app for common frontend and Electron security mistakes.

#### Scope
No new features. Review and harden the app.

#### Topics
- JWT storage risks
- Protected routes limitations
- Backend authorization
- Electron context isolation
- Disable nodeIntegration
- Secure preload APIs
- Input validation
- XSS prevention
- API error leakage
- Local desktop risks

#### Output
Security checklist and improvements.

#### Done When
- Electron security basics are correct
- Auth flow is reasonably safe for V1
- No backend business rules are trusted only in frontend
- Sensitive data is not casually exposed

#### Suggested Session Title
**Milestone 18 — Frontend and Electron Security Review**

---

### Milestone 19: Testing and Debugging Workflow

#### Purpose
Learn how to test and debug the application like an engineer.

#### Scope
Add practical testing and debugging workflows.

#### Topics
- Manual test checklist
- React DevTools
- Browser DevTools
- Network tab
- Electron DevTools
- Backend logs
- API error debugging
- Component testing basics
- Integration testing strategy

#### Output
A repeatable testing checklist.

#### Done When
- Each module has manual test cases
- Common bugs can be diagnosed
- You know where to look when something fails

#### Suggested Session Title
**Milestone 19 — Testing and Debugging Workflow**

---

### Milestone 20: Packaging Preparation

#### Purpose
Prepare HelloStay for desktop distribution.

#### Scope
Set up production build and packaging flow.

#### Topics
- React production build
- Electron production loading
- Environment configuration
- electron-builder or similar tool
- App icon
- Installer basics
- File paths
- SQLite database location
- Backend executable strategy

#### Output
A production packaging plan.

#### Done When
- React builds successfully
- Electron can load production build
- Packaging strategy is clear
- Database/backend file path issues are understood

#### Suggested Session Title
**Milestone 20 — Electron Packaging Preparation**

---

### Milestone 21: Final V1 Review and Stabilization

#### Purpose
Review the whole V1 application before considering it complete.

#### Scope
Final cleanup, refactoring, bug fixing, and quality review.

#### Topics
- Code cleanup
- Folder consistency
- Naming consistency
- Removing dead code
- UI consistency
- Backend contract review
- Business rule review
- V1 scope review
- Known limitations

#### Output
HelloStay V1 frontend is stable and understandable.

#### Done When
- Rooms work
- Guests work
- Bookings work
- Finance works
- History works
- Auth works
- Electron desktop shell works
- V1 excludes employees as planned

#### Suggested Session Title
**Milestone 21 — Final V1 Review and Stabilization**

---

### Recommended Milestone Order
Use this exact order:

1. Project Orientation
2. React Project Setup
3. Electron Desktop Shell
4. Startup Flow and Routing
5. UI Foundation
6. API Client
7. Authentication UI
8. Auth State and Protected Routes
9. Dashboard Layout
10. Rooms Management
11. Guests Management
12. Bookings Management
13. Booking Lifecycle Actions
14. Finance and Income
15. History
16. Dashboard Metrics
17. UX Polish
18. Offline Electron Startup
19. Security Review
20. Testing and Debugging
21. Packaging Preparation
22. Final V1 Review

---

## Completed Frontend Milestones

### Frontend Milestone 0 — Frontend Orientation, Backend Contract Review, and Architecture Boundary Confirmation
**Status:** Completed
**Date Recorded:** 2026-06-29

Frontend orientation was completed before writing new React/Electron frontend code.

**What was completed:**
* Reviewed the current HelloStay backend files before starting the frontend rebuild.
* Confirmed that the frontend must be built from actual backend API contracts, not assumptions.
* Confirmed that FastAPI remains the source of truth for business logic, validation, authentication, database operations, and hotel workflow rules.
* Confirmed that React is responsible for renderer UI only: screens, forms, components, routing, loading states, error states, and API calls.
* Confirmed that Electron is responsible for desktop shell behavior only: app window, lifecycle, startup flow, native desktop integration, and packaging.
* Confirmed that preload/IPC should be used only for safe desktop communication when React needs controlled access to Electron functionality.
* Reviewed the currently registered backend routers.
* Confirmed that the backend currently supports Health Check, System Info, Rooms, Guests, Stays, and Guest-Stays.
* Confirmed that the backend currently exposes CRUD-style APIs for Rooms, Guests, Stays, and Guest-Stays.
* Confirmed that the backend has JWT/security helper utilities and token schemas, but no registered authentication router was visible in the uploaded `main.py`.
* Confirmed that real frontend authentication should not be implemented until backend auth routes exist.
* Confirmed that the current backend uses `Stay`, not `Booking`, so the frontend should use `Stay` internally until a true booking/reservation API exists.
* Confirmed that the first frontend-backend integration should be the backend health check using `GET /`.
* Confirmed that the frontend should use a central API client instead of scattered `fetch()` calls.
* Confirmed that future frontend folders should be feature-based, not random or prematurely over-structured.
* Recorded the following architecture decisions from this milestone:

  * Backend contract first.
  * FastAPI remains the source of truth.
  * React is the renderer UI layer.
  * Electron is the desktop shell only.
  * Preload/IPC is only for safe desktop access.
  * A central API client is required.
  * A feature-based folder structure should be used.
  * Real auth must wait until backend auth API exists.
  * Use backend term `Stay` internally.
  * First API integration must be the backend health check.
  * Build Rooms before Guests, Guests before Stays.
  * Dashboard should not be built first.
  * Finance must eventually come from backend-calculated APIs.

**Final approved source structure:**
No frontend source structure was created or modified during this milestone.

Milestone 0 was a planning and orientation milestone only.

Approved future direction:
frontend/
src/
features/
startup/
rooms/
guests/
stays/
guestStays/
shared/
components/
services/
hooks/
utils/

**Files reviewed and approved:**
* Backend `main.py`
* Backend room API file
* Backend guest API file
* Backend stay API file
* Backend guest-stay API file
* Backend system-info API file
* Backend security utility file
* Backend token schema file
* Backend database connection/session/base files
* Backend Room model
* Backend Guest model
* Backend Stay model
* Backend GuestStay model
* Backend SystemInfo model
* Backend Room schema
* Backend Guest schema
* Backend Stay schema
* Backend GuestStay schema
* Existing `PROJECT_NOTES.md`

**Why this milestone matters:**
This milestone prevents the frontend rebuild from starting with guesses, fake APIs, or premature UI decisions.

It establishes the correct engineering direction before implementation:
* The backend API contract drives frontend development.
* React must not contain backend business rules.
* Electron must not become a second backend.
* The preload layer must remain secure and limited.
* Frontend modules must be built in dependency order.
* Authentication must not be faked before backend support exists.
* The first integration must be small, real, and testable.

This milestone protects the project from rebuilding the deleted frontend blindly and keeps the new implementation understandable for learning.

**Backend/API contracts involved:**

Current backend APIs confirmed:
* `GET /`
* `GET /system-info`

Rooms:
* `POST /rooms`
* `GET /rooms`
* `GET /rooms/{room_id}`
* `PUT /rooms/{room_id}`
* `DELETE /rooms/{room_id}`

Guests:
* `POST /guests`
* `GET /guests`
* `GET /guests/{guest_id}`
* `PUT /guests/{guest_id}`
* `DELETE /guests/{guest_id}`

Stays:
* `POST /stay`
* `GET /stay`
* `GET /stay/{stay_id}`
* `PUT /stay/{stay_id}`
* `DELETE /stay/{stay_id}`

Guest-Stays:
* `POST /guest-stays`
* `GET /guest-stays`
* `GET /guest-stays/{guest_stay_id}`
* `PUT /guest-stays/{guest_stay_id}`
* `DELETE /guest-stays/{guest_stay_id}`

Backend/API gaps identified:
* No registered auth router was visible in the uploaded backend entry file.
* No confirmed register endpoint.
* No confirmed login endpoint.
* No confirmed current-user/session endpoint.
* No dashboard summary endpoint.
* No finance summary endpoint.
* No true `/bookings` API.
* No available-room search endpoint.
* No dedicated check-in/check-out workflow endpoints.

**What was intentionally deferred:**
* Writing React code
* Writing Electron code
* Creating frontend folders
* Creating reusable components
* Creating API service files
* Creating routing
* Creating authentication UI
* Creating dashboard UI
* Creating rooms UI
* Creating guests UI
* Creating stays/bookings UI
* Creating finance/history UI
* Creating shared state/context
* Creating custom hooks
* Creating preload/IPC APIs
* Starting FastAPI from Electron
* Packaging the desktop app

**Cleanup performed:**
No code cleanup was performed because this milestone did not modify source files.

Planning cleanup was performed by separating confirmed backend-supported features from future or missing features.

Confirmed as currently supported:

* Health check
* System info
* Rooms
* Guests
* Stays
* Guest-Stays

Marked as pending or future backend support:
* Authentication
* Dashboard summary
* Finance summary
* True bookings/reservations
* Available-room search
* Dedicated check-in/check-out workflow

**Debugging/learning conclusion:**
Before building a frontend feature, always inspect the backend route, schema, model, and response shape.

Do not guess endpoint names or field names.

For HelloStay, frontend debugging should start with the smallest possible full-stack check:
React Start Page
  ↓
systemApi
  ↓
apiClient
  ↓
GET /
  ↓
FastAPI health check response

This confirms that React, FastAPI, CORS, and the API client are working before any hotel module is added.

**Next milestone:**
Frontend Milestone 1 — React Project Setup.

---

### Frontend Milestone 1 — React Project Setup
**Status:** Completed
**Date Recorded:** 2026-06-29

React frontend setup was completed using Vite with JavaScript.

**What was completed:**
* Created a new React frontend using Vite.
* Used JavaScript instead of TypeScript.
* Created a minimal root React app.
* Added `src/main.jsx` as the React entry point.
* Added `src/App.jsx` as the root component.
* Added `src/styles/global.css` for basic global styling.
* Configured Vite to run on port `5173`.
* Enabled `strictPort: true` so Vite does not silently switch ports.
* Removed unused Vite starter files and assets.
* Kept the frontend free of feature logic.

**Final approved source structure:**
frontend/
  src/
    main.jsx
    App.jsx
    styles/
      global.css

**Files reviewed and approved:**

* `frontend/src/App.jsx`
* `frontend/src/main.jsx`
* `frontend/src/styles/global.css`
* `frontend/vite.config.js`

**Why this milestone matters:**
This milestone establishes a clean React renderer foundation before Electron, routing, authentication, API services, or hotel modules are introduced. It keeps the frontend rebuild understandable and prevents premature architecture decisions.

**Backend/API contracts involved:**
No backend API integration was implemented. However, the frontend port was aligned with the backend CORS configuration, which currently allows `http://localhost:5173`.

**What was intentionally deferred:**
* Electron desktop shell
* React Router
* API services
* Authentication
* Dashboard
* Rooms module
* Guests module
* Stays/bookings module
* Finance/history
* Feature components
* Shared context/state management
* Custom hooks
* Utility modules

**Cleanup performed:**
* Removed unused default Vite CSS files.
* Removed unused starter image assets.
* Avoided creating empty future folders such as `components`, `pages`, `routes`, `services`, `hooks`, `context`, and `utils`.

**Debugging/learning conclusion:**
When checking project structure, avoid listing `node_modules` because it contains dependency files and creates noisy output. Prefer:

```powershell
Get-ChildItem .\src -Recurse -File | Select-Object FullName
```

**Next milestone:**
Frontend Milestone 2 — Electron Desktop Shell Setup.

---

### Frontend Milestone 2 — Electron Desktop Shell Setup
**Status:** Completed
**Milestone Number:** 2
**Layer:** Desktop / Frontend Shell
**Technology Used:** Electron, Vite, React, JavaScript

#### Objective
Set up the basic Electron desktop shell around the existing Vite React frontend without adding hotel features, routing, authentication, backend integration, packaging, or business logic.

The goal of this milestone was to make HelloStay open as a desktop application while keeping React as the renderer process and Electron as the desktop shell.

#### Completed Work
* Installed Electron as the desktop runtime.

* Installed `concurrently` to run Vite and Electron together during development.

* Installed `wait-on` to wait for the Vite dev server before launching Electron.

* Created the Electron main process file:
  frontend/electron/main.js

* Created the Electron preload file:
  frontend/electron/preload.js

* Configured Electron to create a secure `BrowserWindow`.

* Configured Electron to load the Vite React app from:
  http://localhost:5173

* Kept `nodeIntegration` disabled.

* Kept `contextIsolation` enabled.

* Added Electron development scripts in `package.json`.

* Verified that the React app opens inside a native Electron desktop window.

#### Files Added
frontend/electron/main.js
frontend/electron/preload.js

#### Files Updated
frontend/package.json


#### Final Electron Main Process Responsibility
The Electron main process is responsible only for desktop application lifecycle concerns:

* Starting the Electron app.
* Creating the main desktop window.
* Loading the React Vite development server during development.
* Preparing for future production loading from the React build output.
* Handling macOS activate behavior.
* Quitting the app on non-macOS platforms when all windows are closed.

The Electron main process does not contain hotel business logic, database logic, authentication logic, API logic, room logic, booking logic, guest logic, or financial logic.

#### Final Preload Responsibility
The preload file exists as a future secure bridge between Electron and React.

For this milestone, the preload file intentionally exposes nothing.

No IPC, desktop APIs, filesystem access, or backend logic were added.

#### Development Script Setup
The project now supports running the desktop app during development using:

```bash
npm run desktop
```

The development script starts:
Vite React dev server
Electron desktop shell

Electron waits for Vite to become available before opening the desktop window.

#### Important Security Decisions Preserved
* React renderer does not get direct Node.js access.
* Electron APIs are not exposed directly to React.
* `nodeIntegration` remains disabled.
* `contextIsolation` remains enabled.
* Preload remains empty until a real desktop capability is needed.
* Backend business logic remains in FastAPI.
* Database operations remain outside React and Electron.

#### What Was Intentionally Not Added
The following were intentionally excluded from this milestone:

* React Router
* Authentication
* Dashboard
* Rooms module
* Guests module
* Stays module
* Bookings module
* Finance module
* History module
* API service layer
* FastAPI backend startup from Electron
* SQLite access from Electron
* IPC communication
* App packaging
* Installer setup
* Production build configuration beyond a basic future loading branch

#### Verification Result
The command:

```bash
npm run desktop
```

successfully opened the HelloStay React frontend inside an Electron desktop window.

#### Summary
Milestone 2 successfully introduced Electron as the desktop shell for HelloStay while preserving a clean architecture:

Electron main process → desktop lifecycle
React renderer        → user interface
Preload script        → future safe bridge
FastAPI backend       → business logic and API contracts
SQLite database       → persistence

This milestone completed the basic desktop foundation without mixing frontend UI, desktop lifecycle, backend logic, or database responsibilities.

---

### Frontend Milestone 3: Startup Flow and Routing
**Status:** Completed
**Date Completed:** 2026-06-30
**Project:** HelloStay — Offline Hotel Management System
**Frontend Stack:** React, JavaScript, Vite
**Desktop Shell:** Electron

#### 1. Milestone Objective
The objective of Milestone 3 was to introduce a clean startup flow and basic routing structure inside the React renderer process.

This milestone focused only on navigation between minimal placeholder pages. No hotel features, backend integration, authentication, dashboard layout, protected routes, Electron backend startup, or packaging logic were added.

#### 2. Scope of This Milestone

Milestone 3 included:
* Installing React Router DOM.
* Creating a clean routing structure.
* Creating a minimal `StartPage`.
* Creating a minimal `LoginPage` placeholder.
* Creating a `NotFoundPage` fallback route.
* Setting up routing through `BrowserRouter`.
* Moving route definitions into a dedicated `AppRoutes.jsx` file.
* Making the app open on the startup page.
* Adding a button on the startup page that navigates to the login page.

#### 3. Out of Scope

The following were intentionally not added:
* Real authentication.
* Login form.
* JWT handling.
* Auth state.
* Protected routes.
* Dashboard routes.
* Dashboard layout.
* Rooms module.
* Guests module.
* Stays or bookings module.
* Finance module.
* History module.
* Settings module.
* Backend API calls.
* FastAPI startup from Electron.
* Electron packaging.

This was intentional because the milestone was only about routing foundation.

#### 4. Final Route Structure

The app now supports the following routes:
/          → StartPage
/login     → LoginPage
*          → NotFoundPage

The `*` route acts as a fallback for unknown paths.

Example:
/random-page → NotFoundPage


#### 5. Final Folder Structure

The frontend now follows this structure:
frontend/
  src/
    main.jsx
    App.jsx

    routes/
      AppRoutes.jsx

    pages/
      StartPage.jsx
      LoginPage.jsx
      NotFoundPage.jsx

    styles/
      global.css

#### 6. Files Added

The following files were added:
src/routes/AppRoutes.jsx
src/pages/StartPage.jsx
src/pages/LoginPage.jsx
src/pages/NotFoundPage.jsx

#### 7. Files Updated

The following files were updated:
src/main.jsx
src/App.jsx
src/styles/global.css


#### 8. Implementation Summary
`main.jsx` now wraps the React application with `BrowserRouter`.

main.jsx
  ↓
BrowserRouter
  ↓
App.jsx
  ↓
AppRoutes.jsx
  ↓
Page components


`App.jsx` was kept small and only renders `AppRoutes`.

`AppRoutes.jsx` owns all route definitions.

The startup page contains a button that uses `useNavigate` to move the user to `/login`.

The login page is only a placeholder.

The not-found page uses `Link` to return to the startup page.

#### 9. Responsibilities After This Milestone

#### React Renderer Process

React owns:
* Page rendering.
* Route definitions.
* Client-side navigation.
* Startup page.
* Login placeholder page.
* Fallback route.

#### Electron Main Process

Electron owns:
* Desktop window creation.
* App lifecycle.
* Loading the React app.
* Desktop shell behavior.

Electron does not know about React routes such as `/login`.

#### FastAPI Backend

FastAPI remains responsible for:
* Business logic.
* Validation.
* Database operations.
* API contracts.
* Authentication logic later.

No backend integration was added in this milestone.

#### 10. Key Concepts Learned

This milestone introduced the following concepts:
* Routing in a React single-page application.
* Difference between client-side navigation and full page reload.
* Why Electron desktop apps can still use React Router.
* Why routes belong in the React renderer process.
* What `BrowserRouter` does.
* What `Routes` does.
* What `Route` does.
* What `Link` does.
* What `useNavigate` does.
* Why authentication and protected routes should wait for later milestones.

#### 11. Verification Steps Completed

The following URLs were verified:
http://localhost:5173/
http://localhost:5173/login
http://localhost:5173/random-page


Expected results:
/              shows StartPage
/login         shows LoginPage
/random-page   shows NotFoundPage


The app was also verified through Electron using:
```bash
npm run desktop
```

#### 12. Milestone Result
Milestone 3 was completed successfully.

HelloStay now has a clean routing foundation inside the React renderer process while preserving the separation between React, Electron, and FastAPI.

#### 13. Suggested Next Milestone

The recommended next milestone is:
Frontend Milestone 4: Authentication UI Foundation

Milestone 4 should still avoid real backend authentication at first. It should focus on creating a clean login page UI structure, basic form state, input handling, and frontend-only validation concepts before connecting to the FastAPI authentication API.

---

### Frontend Milestone 4 Notes: UI Foundation and Layout System

#### Milestone Name

Frontend Milestone 4 — UI Foundation and Layout System

#### Milestone Status

Completed / Ready to Implement

#### Purpose of This Milestone

The purpose of Milestone 4 is to create the basic visual foundation for the HelloStay React frontend.

This milestone does not build hotel features. It prepares the frontend so future screens can be built consistently using reusable UI components and shared styling rules.

The focus is on:

* CSS variables
* Global styling organization
* Reusable UI components
* Basic placeholder page improvement
* Renderer-only UI responsibilities

#### What Was Already Completed Before This Milestone

#### Milestone 1

* React frontend was created using Vite.
* JavaScript was selected instead of TypeScript.
* The app runs on `http://localhost:5173`.
* A clean minimal frontend structure was created.
* No feature logic was added.

#### Milestone 2

* Electron was installed.
* A basic Electron desktop shell was created.
* Electron opens the Vite React app in a desktop window.
* Electron main process, preload script, and renderer process responsibilities were separated.
* `nodeIntegration` remains disabled.
* `contextIsolation` remains enabled.
* No backend startup, packaging, authentication, routing, or hotel features were added.

#### Milestone 3

* React Router was introduced.
* A basic routing structure was created.
* `AppRoutes.jsx` was created.
* `StartPage`, `LoginPage`, and `NotFoundPage` were created.
* The app can navigate from the start page to the login page.
* No real authentication, protected routes, dashboard, backend calls, or hotel features were added.

#### Milestone 4 Scope

Milestone 4 adds a reusable UI foundation only.

Included:

* Improved `global.css`
* CSS variables for design tokens
* Basic page helper classes
* Reusable UI component classes
* `Button` component
* `Input` component
* `Card` component
* `Loading` component
* `ErrorMessage` component
* Light usage of these components in existing placeholder pages

Excluded:

* Real authentication
* Backend API calls
* Protected routes
* Dashboard layout
* Sidebar
* Topbar
* Rooms module
* Guests module
* Stays module
* Bookings module
* Finance module
* History module
* Settings module
* Electron backend startup
* App packaging
* Tailwind CSS
* UI libraries
* Icon libraries
* Animation libraries

#### Final Folder Direction

```txt
frontend/
  src/
    components/
      ui/
        Button.jsx
        Input.jsx
        Card.jsx
        Loading.jsx
        ErrorMessage.jsx

    pages/
      StartPage.jsx
      LoginPage.jsx
      NotFoundPage.jsx

    routes/
      AppRoutes.jsx

    styles/
      global.css
```

#### Key Concept: Design System

A design system is a reusable set of visual rules and UI building blocks.

In this milestone, the design system is intentionally small.

It includes:

* Colors
* Spacing
* Border radius
* Shadows
* Font family
* Button styles
* Input styles
* Card styles
* Error styles
* Loading styles

The goal is not to create a complete enterprise design system yet. The goal is to avoid duplicated visual decisions and create a consistent foundation.

#### Key Concept: CSS Variables

CSS variables are reusable values defined in CSS.

Example:

```css
:root {
  --color-primary: #2563eb;
}
```

Then they can be reused like this:

```css
.ui-button--primary {
  background: var(--color-primary);
}
```

This helps avoid repeated hard-coded values.

Instead of writing the same color many times, we define it once and reuse it.

#### Key Concept: Reusable UI Components

Reusable UI components are small React components that can be used across many screens.

Examples:

```txt
Button
Input
Card
Loading
ErrorMessage
```

Instead of every page writing its own button style, every page can use:

```jsx
<Button>Save</Button>
```

This improves consistency and makes future changes easier.

#### Key Concept: Page Components vs UI Components

A page component represents a full screen.

Examples:

```txt
StartPage
LoginPage
NotFoundPage
```

A UI component is a small reusable piece used inside pages.

Examples:

```txt
Button
Input
Card
Loading
ErrorMessage
```

Simple rule:

```txt
Page component = screen
UI component = reusable building block
```

#### Key Concept: Props

Props are values passed into a React component.

Example:

```jsx
<Button variant="secondary">Cancel</Button>
```

Here:

```txt
variant is a prop
secondary is the prop value
Cancel is passed as children
```

Props allow one component to behave slightly differently in different places.

#### Key Concept: Children Prop

The `children` prop means the content placed between opening and closing component tags.

Example:

```jsx
<Card>
  <h1>HelloStay</h1>
  <p>Offline hotel management system</p>
</Card>
```

The `Card` component receives everything inside it as `children`.

This makes wrapper components flexible.

#### Key Concept: className

In normal HTML, we use:

```html
<div class="card"></div>
```

In React JSX, we use:

```jsx
<div className="card"></div>
```

React uses `className` because `class` is a reserved word in JavaScript.

#### Files Created

#### `frontend/src/components/ui/Button.jsx`

Purpose:

Creates a reusable button component.

Supports:

* `children`
* `variant`
* `type`
* `disabled`
* `className`
* extra props such as `onClick`

Common usage:

```jsx
<Button>Continue</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Back</Button>
```

#### `frontend/src/components/ui/Input.jsx`

Purpose:

Creates a reusable input component.

Supports:

* `label`
* `error`
* `helperText`
* `id`
* `className`
* normal input props such as `type`, `placeholder`, and `value`

Common usage:

```jsx
<Input
  id="username"
  label="Username"
  type="text"
  placeholder="Enter username"
/>
```

#### `frontend/src/components/ui/Card.jsx`

Purpose:

Creates a reusable surface/container component.

Common usage:

```jsx
<Card>
  <h1>HelloStay</h1>
  <p>Welcome to the app.</p>
</Card>
```

#### `frontend/src/components/ui/Loading.jsx`

Purpose:

Creates a reusable loading message component.

Common usage:

```jsx
<Loading message="Loading rooms..." />
```

#### `frontend/src/components/ui/ErrorMessage.jsx`

Purpose:

Creates a reusable error message component.

Common usage:

```jsx
<ErrorMessage message="Something went wrong." />
```

#### Files Modified

#### `frontend/src/styles/global.css`

Purpose:

Stores the global visual foundation.

Includes:

* CSS variables
* global reset
* body styles
* page helper classes
* reusable UI classes

Important sections:

```txt
:root design tokens
base reset
page layout helpers
UI component classes
```

#### `frontend/src/pages/StartPage.jsx`

Purpose:

Uses `Card` and `Button` to make the start page visually consistent.

Still only navigates to the login page.

No backend logic added.

#### `frontend/src/pages/LoginPage.jsx`

Purpose:

Uses `Card`, `Input`, and `Button` to show a placeholder login screen.

Important note:

The login form is not functional yet.

No authentication is added in Milestone 4.

#### `frontend/src/pages/NotFoundPage.jsx`

Purpose:

Uses `Card`, `Button`, and `ErrorMessage` to display a consistent 404 page.

#### Important Architecture Boundary

Milestone 4 belongs only to the React renderer process.

React renderer handles:

```txt
pages
components
forms
styling
routing UI
placeholder layout
```

Electron main process handles:

```txt
desktop window
app lifecycle
native shell behavior
```

Electron preload handles:

```txt
safe communication between renderer and main process when needed
```

FastAPI backend handles:

```txt
business logic
validation
database operations
API contracts
authentication rules
```

No Electron files should be changed in this milestone.

No FastAPI files should be changed in this milestone.

#### Why Dashboard Layout Was Not Built

Dashboard layout is intentionally delayed.

A real dashboard shell usually needs:

* authenticated user state
* protected routes
* sidebar navigation
* topbar
* logout behavior
* active route highlighting
* feature sections

Since real authentication and protected routes are not built yet, building the dashboard shell now would create premature structure.

Milestone 4 only builds generic UI pieces that can support the dashboard later.

#### Why Tailwind or UI Libraries Were Not Added

Tailwind, Material UI, Chakra UI, Ant Design, and similar tools are not used in this milestone.

Reason:

The project goal is to learn frontend architecture from first principles.

Plain CSS helps teach:

* CSS variables
* reusable class names
* layout basics
* component styling
* separation of concerns
* design token thinking

External libraries can be useful later, but they are unnecessary for this foundation milestone.

#### Verification Steps

After implementing Milestone 4:

Run the React development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:5173
```

Verify:

* Start page loads.
* Start page uses the new card/button styling.
* Clicking the login navigation opens the login page.
* Login page shows placeholder inputs.
* Login button remains disabled.
* Back navigation works.
* Unknown routes show the not found page.
* No console import errors appear.
* No CSS import errors appear.

If using Electron development command, verify:

```bash
npm run desktop
```

Expected result:

* Electron opens the React app.
* The same styled pages appear inside the desktop window.
* No Electron main/preload changes are required.

#### Common Errors and Fixes

##### Error: Failed to resolve import

Cause:

The file path is wrong or the file does not exist.

Example:

```txt
Failed to resolve import "../components/ui/Button.jsx"
```

Fix:

From a page file inside:

```txt
src/pages/
```

the correct import path is:

```jsx
import Button from "../components/ui/Button.jsx";
```

##### Error: Styles are not applied

Cause:

`global.css` may not be imported in `main.jsx`.

Fix:

Make sure this exists in:

```txt
frontend/src/main.jsx
```

```jsx
import "./styles/global.css";
```

##### Error: Login button does nothing

Cause:

The login button is intentionally disabled.

Milestone 4 does not implement authentication.

##### Error: Page navigation does not work

Cause:

The `Link` route path may not match `AppRoutes.jsx`.

Fix:

Check that `/login` exists in `AppRoutes.jsx`.

#### Beginner Lessons Learned

Milestone 4 teaches:

* How a small design system begins.
* How CSS variables reduce duplication.
* How reusable components make pages cleaner.
* How props customize components.
* How `children` makes wrapper components flexible.
* How `className` connects JSX to CSS.
* Why UI belongs in React, not Electron main.
* Why building features too early creates confusion.
* Why production apps grow through small stable foundations.

#### Production Lessons Learned

A production frontend should not grow randomly.

Before creating many feature screens, it needs:

* consistent styling rules
* reusable primitives
* clear folder structure
* predictable component APIs
* clean architecture boundaries

Milestone 4 establishes those basics.

#### Final Milestone 4 Result

At the end of this milestone, HelloStay has:

```txt
A cleaner global CSS foundation
A small design token system
Reusable UI components
Improved placeholder pages
Clear renderer-only UI responsibility
No premature hotel features
No premature dashboard shell
No backend integration
No Electron responsibility leakage
```

#### Suggested Next Milestone

The next milestone should likely focus on one of these:

```txt
Milestone 5 — Authentication UI Foundation
```

or

```txt
Milestone 5 — Login Page Form State and Validation Without Backend
```

Recommended next step:

Build the login page properly as a frontend-only form first.

That would teach:

* controlled inputs
* React state
* form submission
* validation
* error display
* disabled submit behavior
* loading state simulation
* preparing for future backend authentication

```
```

---

### Frontend Milestone 5 Notes: API Client and Backend Communication

**Milestone:** Frontend Milestone 5
**Status:** Completed
**Date Completed:** 2026-06-30

#### Goal

The goal of Milestone 5 was to introduce a clean, reusable frontend API communication layer between the React renderer and the FastAPI backend.

This milestone focused only on infrastructure.

It did not build hotel features, authentication, protected routes, dashboard layout, or Electron backend startup behavior.

#### What Was Completed

A new services folder was introduced:

```txt
frontend/src/services/
```

The following files were created:

```txt
frontend/src/services/apiClient.js
frontend/src/services/systemService.js
```

A frontend environment file was introduced:

```txt
frontend/.env.development
```

with the development backend URL:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

The backend connection was tested successfully from the React app.

Both backend responses were received successfully:

```txt
Health data from /
System info from /system-info
```

The backend root health endpoint confirms that the backend server is running, and the backend already allows the React development origin through CORS.

The `/system-info` endpoint was also used safely because it only returns basic application information from the `system_info` table.

#### Files Added

#### `frontend/src/services/apiClient.js`

Purpose:

```txt
Central reusable HTTP client for the React frontend.
```

Responsibilities:

```txt
read API base URL
build request URLs
send HTTP requests using fetch
set common headers
convert request bodies to JSON
parse response bodies safely
handle empty responses
handle network errors
handle backend error responses
prepare for future auth token attachment
```

#### `frontend/src/services/systemService.js`

Purpose:

```txt
Small safe service for backend communication testing.
```

Functions added:

```txt
getBackendHealth()
getSystemInfo()
```

This service was intentionally limited to system-level endpoints.

No feature services were created yet.

#### Temporary File Change

#### `frontend/src/pages/LoginPage.jsx`

A temporary backend connection test was added to the login page.

The test used:

```txt
useState
async/await
try/catch/finally
Loading component
ErrorMessage component
systemService.js
apiClient.js
```

The temporary UI confirmed the backend connection worked.

After successful verification, the temporary test UI should be removed from the login page because it is not production user-facing UI.

#### Important Concepts Learned

#### API Client

An API client is a reusable frontend utility that manages communication with the backend.

Instead of writing raw `fetch()` calls inside every component, components call service functions.

Correct pattern:

```txt
Component
  ↓
Service
  ↓
API client
  ↓
Backend
```

Incorrect pattern:

```txt
Component directly calls fetch everywhere
```

#### Services

Service files describe backend capabilities in frontend-friendly function names.

Example:

```js
getBackendHealth()
```

is clearer than writing:

```js
apiClient.get("/")
```

directly inside many components.

#### HTTP Methods

The basic HTTP methods were introduced:

```txt
GET     read data
POST    create data
PUT     update data
DELETE  remove data
```

Milestone 5 only tested safe `GET` requests.

#### Request and Response

A request is what the frontend sends to the backend.

A response is what the backend sends back.

The frontend must handle:

```txt
response status
response headers
response body
JSON data
error messages
```

#### Status Codes

Important status codes discussed:

```txt
200 success
201 created
204 success with no body
400 bad request
401 unauthenticated
403 forbidden
404 not found
422 FastAPI validation error
500 backend error
```

#### JSON

JSON is the data format used between React and FastAPI.

The API client safely parses JSON instead of assuming every response body is valid JSON.

#### Promises

A Promise represents a value that may be available later.

`fetch()` returns a Promise because network requests are asynchronous.

#### async/await

`async/await` allows asynchronous code to be written in a readable way.

It was used when calling backend service functions.

#### try/catch/finally

`try/catch/finally` was used to manage:

```txt
successful API response
failed API response
loading state cleanup
```

#### Network Error vs Backend Error

Network error:

```txt
React cannot reach FastAPI.
```

Backend error:

```txt
React reached FastAPI, but FastAPI returned an error status.
```

The API client now has a foundation for handling both.

#### Electron Boundary

No API service logic was placed in Electron.

Accepted boundary:

```txt
Electron main process:
  desktop window, lifecycle, shell behavior

React renderer:
  UI and frontend API communication

FastAPI:
  business logic, validation, database, API contracts
```

This keeps Electron from becoming a hidden backend or business-logic layer.

#### Backend Boundary

FastAPI remains the source of truth.

React does not validate hotel business rules independently.

React will later consume backend contracts for:

```txt
authentication
rooms
guests
stays
guest-stays
bookings
finance
history
```

The backend already contains routers for rooms, guests, stays, guest-stays, and system info, but Milestone 5 intentionally used only safe system-level communication.

#### What Was Intentionally Not Done

The following were not implemented:

```txt
real login
register account
auth token storage
protected routes
dashboard
sidebar layout
room management UI
guest management UI
stay management UI
booking workflows
finance screen
history screen
settings screen
Electron backend startup
packaging
```

This protected the milestone boundary.

#### Verification Steps Completed

The following checks passed:

```txt
React app runs successfully
FastAPI backend runs successfully
React can call backend /
React can call backend /system-info
API response appears in temporary UI
network communication works through service layer
apiClient.js handles the request
systemService.js exposes safe test functions
```

#### Cleanup Step

After successful verification, remove the temporary backend test UI from `LoginPage.jsx`.

Keep:

```txt
frontend/.env.development
frontend/src/services/apiClient.js
frontend/src/services/systemService.js
```

Remove only the temporary test UI code from the page.

#### Final Milestone Result

Milestone 5 successfully established the frontend API communication foundation.

HelloStay now has a clean service layer that future milestones can build on.

Future frontend features should not directly call `fetch()` inside page components. They should use domain service files that depend on `apiClient.js`.

#### Suggested Next Milestone

The next milestone should be:

```txt
Frontend Milestone 6 — Authentication UI Structure
```

Recommended scope:

```txt
create login form state
create create-account form UI
prepare authService.js
understand backend auth contract
do not build protected dashboard yet unless authentication is working
```

Authentication should be handled as a separate milestone because it introduces forms, validation, token handling, user state, and route protection.

---

### Frontend Milestone 6 Notes: Authentication UI Foundation

**Status:** Completed
**Date Completed:** 2026-06-30
**Milestone:** Frontend Milestone 6 — Authentication UI Foundation

#### Goal

The goal of Milestone 6 was to create the authentication UI foundation for HelloStay without implementing fake authentication or assuming backend endpoint contracts that are not yet confirmed.

This milestone focused on frontend form structure, React state, validation, loading states, error handling, routing, and service-layer preparation.

#### Completed Work

Milestone 6 completed the following:

* Converted `LoginPage.jsx` from a placeholder screen into a real login form UI.
* Created `RegisterPage.jsx` for the V1 account creation direction.
* Added a `/register` route in `AppRoutes.jsx`.
* Used existing shared UI components such as:

  * `Button`
  * `Input`
  * `Card`
  * `Loading`
  * `ErrorMessage`
* Used controlled components for form fields.
* Used React `useState` for form values.
* Added field-level validation.
* Added form-level error state.
* Added loading/submitting state.
* Disabled form controls while submitting.
* Added `authService.js` as the dedicated authentication service layer.
* Prepared login/register service functions for future backend integration.
* Avoided direct API calls inside page components.
* Avoided fake authentication.
* Avoided hardcoded users.
* Avoided dashboard redirect.
* Avoided token persistence.
* Avoided protected routes.
* Kept Electron separate from authentication form logic.

#### Files Added

```text
frontend/src/services/authService.js
frontend/src/pages/RegisterPage.jsx
```

#### Files Updated

```text
frontend/src/pages/LoginPage.jsx
frontend/src/routes/AppRoutes.jsx
frontend/src/styles/global.css
```

Depending on the existing reusable UI component implementation, these may also have been checked or adjusted:

```text
frontend/src/components/ui/Input.jsx
frontend/src/components/ui/Button.jsx
```

#### Authentication Flow Reviewed

The expected future authentication flow for HelloStay V1 is:

```text
StartPage
   |
   v
LoginPage
   |
   v
authService.login()
   |
   v
apiClient
   |
   v
FastAPI auth endpoint
   |
   v
Backend verifies credentials
   |
   v
Backend returns JWT token
   |
   v
Frontend updates auth state
   |
   v
Protected dashboard access
```

Milestone 6 implemented only the frontend foundation up to the service boundary.

#### Important Backend Finding

The backend currently contains JWT/password helper functionality and token schemas, but the available FastAPI app setup does not show a registered authentication router.

This means the frontend should not yet assume endpoint paths such as:

```text
/auth/login
/auth/register
/auth/me
/logout
```

These must be confirmed or created in the backend before real frontend authentication is implemented.

#### Key Concepts Learned

#### Authentication

Authentication answers:

```text
Who is this user?
```

In HelloStay, this means verifying a username and password before allowing access to hotel management features.

#### Authorization

Authorization answers:

```text
What is this authenticated user allowed to do?
```

Authorization is not part of Milestone 6. It will matter later when roles and permissions are introduced.

#### Controlled Components

The form inputs are controlled by React state.

This means the input value is stored in React, and the UI updates whenever the state changes.

Example concept:

```text
Input value changes
   |
   v
onChange runs
   |
   v
React state updates
   |
   v
Component re-renders
   |
   v
Input displays new value
```

#### useState

`useState` was used to remember:

* Form field values.
* Field validation errors.
* General form error.
* Loading/submitting state.

#### preventDefault

`event.preventDefault()` was used to stop the browser from refreshing the page during form submission.

This is necessary because HelloStay is a React single-page application inside an Electron desktop shell.

#### Loading State

Loading state was added so the UI can show when the app is attempting an authentication action.

Even though real auth is not connected yet, this prepares the UI for real API calls.

#### Error State

Error state was added so users can see useful feedback when validation fails or when auth endpoints are not confirmed.

#### Service Layer

`authService.js` was created so authentication-related API behavior does not live directly inside page components.

This keeps the architecture cleaner and prepares the project for future backend integration.

#### What Was Intentionally Not Added

The following were intentionally not added in Milestone 6:

* Real login API integration.
* Real register API integration.
* Fake users.
* Fake successful login.
* Dashboard redirect.
* AuthContext.
* ProtectedRoute.
* Token storage.
* Logout.
* Current user restore.
* Role-based authorization.
* Dashboard layout.
* Rooms, guests, stays, bookings, finance, or history screens.
* Electron backend startup.
* Electron packaging.

#### Why These Were Not Added

These features depend on a confirmed authentication contract from the backend.

Before adding them, the project needs to know:

* Which endpoint handles login.
* Which endpoint handles registration.
* What request body each endpoint expects.
* What response body each endpoint returns.
* Whether JWT is returned.
* How the current user is fetched.
* How logout should behave.
* How token storage should work in an offline Electron app.

Adding protected routes or token persistence before answering these questions would create unstable architecture.

#### Verification Checklist

Milestone 6 is considered complete if the following are true:

```text
/login opens correctly.
/register opens correctly.
Login fields are typeable.
Register fields are typeable.
Empty login form shows validation errors.
Empty register form shows validation errors.
Password mismatch shows an error on register.
Submit button disables while submitting.
Loading UI appears during submit.
Valid login submit does not fake success.
Valid register submit does not fake account creation.
No dashboard redirect happens.
No token is stored.
No ProtectedRoute exists.
No AuthContext exists yet.
No auth endpoint path is invented.
```

#### Current Application State After Milestone 6

The frontend now has:

```text
StartPage
LoginPage
RegisterPage
NotFoundPage
Reusable UI components
apiClient.js
authService.js
Basic routing
Authentication UI foundation
```

The frontend still does not have:

```text
Real authentication
Global auth state
Protected routes
Dashboard
Hotel modules
Electron backend startup
Packaging
```

#### Architecture Boundary Preserved

Milestone 6 preserved the correct responsibility split:

```text
React:
Forms, UI state, validation display, user interaction.

authService.js:
Authentication service boundary.

apiClient.js:
Generic backend communication behavior.

FastAPI:
Credential verification, password hashing, JWT creation, database access, API contracts.

Electron:
Desktop shell only, not authentication logic.
```

#### Milestone 6 Result

Milestone 6 successfully prepared HelloStay for real authentication without violating the source-of-truth rule.

The frontend now looks and behaves like it is ready for authentication, but it correctly waits for backend contract confirmation before real login/register behavior is added.

#### Recommended Next Milestone

The next milestone should be:

```text
Frontend Milestone 7 — Authentication Contract and Auth State Foundation
```

Milestone 7 should focus on:

* Verifying or defining the backend auth API contract.
* Deciding the login request shape.
* Deciding the login response shape.
* Planning token handling.
* Planning current user restore.
* Planning AuthContext.
* Planning ProtectedRoute.
* Preparing redirect-after-login behavior.
* Still avoiding dashboard feature development until the auth foundation is stable.

---

### Frontend Milestone 7 Notes: Auth State and Protected Routes

**Status:** Completed with backend-auth limitation documented
**Date Completed:** 2026-07-01
**Milestone:** Frontend Milestone 7 — Auth State and Protected Routes

#### Objective

The objective of this milestone was to introduce global authentication state and protected frontend routing in HelloStay without building the real dashboard or hotel modules.

The milestone focused on preparing the frontend authentication foundation while respecting the rule that FastAPI remains the source of truth for real authentication, validation, token creation, and API security.

#### What Was Built

The following authentication foundation was added or prepared:

```txt
AuthContext.jsx
ProtectedRoute.jsx
DashboardPlaceholderPage.jsx
AuthProvider wrapping
LoginPage connection to AuthContext
Temporary protected /dashboard route
Logout behavior structure
Safe authService.js placeholder
```

#### Files Added or Updated

```txt
frontend/src/context/AuthContext.jsx
frontend/src/routes/ProtectedRoute.jsx
frontend/src/routes/AppRoutes.jsx
frontend/src/pages/LoginPage.jsx
frontend/src/pages/DashboardPlaceholderPage.jsx
frontend/src/services/authService.js
frontend/src/main.jsx
```

#### Main Concepts Learned

This milestone introduced the following React and frontend architecture concepts:

```txt
Global state
React Context
Context Provider
useContext
Custom hooks
AuthProvider
Protected routes
Navigate from React Router
Redirect behavior
Session/token storage strategy
Authentication vs authorization
Frontend guards vs backend security
```

#### AuthContext Responsibility

`AuthContext.jsx` became the central place for frontend authentication state.

It is responsible for:

```txt
tracking the current token
checking whether the user is authenticated
exposing login()
exposing logout()
storing temporary frontend session/token data
clearing token data on logout
providing auth state to the rest of the app
```

This keeps authentication state out of individual page components.

#### ProtectedRoute Responsibility

`ProtectedRoute.jsx` protects private frontend routes.

Its responsibility is simple:

```txt
If user is authenticated:
  render the protected page

If user is not authenticated:
  redirect to /login
```

This milestone verified that unauthenticated access to `/dashboard` correctly redirects to `/login`.

#### Temporary Dashboard Placeholder

A temporary `DashboardPlaceholderPage.jsx` was created only for route protection testing.

This page is not the real dashboard.

It exists only to verify:

```txt
private route access
auth context availability
logout behavior structure
redirect behavior
```

The real dashboard shell, sidebar, navigation, and hotel modules will be built in later milestones.

#### LoginPage Behavior

`LoginPage.jsx` was connected to the auth context structure.

The page now has responsibility for:

```txt
controlled username/password form state
basic frontend validation
calling login() from AuthContext
showing loading state
showing error state
redirecting authenticated users away from login
```

However, real login success is not yet fully testable because the confirmed backend authentication endpoint is not currently available.

#### Backend Auth Limitation

The current backend has authentication foundations such as password hashing, password verification, JWT creation, and token schemas.

However, based on the currently available backend files, `main.py` does not register an authentication router or expose a confirmed login endpoint.

Because of this, the frontend does not fake login success and does not invent endpoint contracts.

#### Verified Output

The following behavior was verified successfully:

```txt
Visiting /dashboard while unauthenticated redirects to /login.
The protected route guard works.
AuthProvider is correctly wrapping the app.
useAuth is available inside protected routing flow.
No fake token is created.
No fake production login is implemented.
```

#### Not Yet Verified

The following behavior is intentionally not marked complete yet:

```txt
successful backend login
real token returned from FastAPI
authenticated access to /dashboard after login
logout after real authenticated login
token validation on app startup
role-based permission handling
```

These require a confirmed backend authentication endpoint.

#### Important Rules Followed

This milestone followed these project rules:

```txt
No full dashboard layout was built.
No sidebar navigation was built.
No rooms module was built.
No guests module was built.
No stays/bookings module was built.
No finance/history module was built.
No settings module was built.
No Electron backend startup was added.
No packaging was added.
No auth logic was placed randomly inside page components.
No backend business logic was moved into React or Electron.
No hotel business data was stored in localStorage/sessionStorage.
No fake production authentication was created.
```

#### Token Storage Decision

For V1 frontend session state, temporary token storage may use `sessionStorage`.

Reason:

```txt
It is simple.
It survives page refresh during the current session.
It clears when the session/window closes.
It avoids longer-term persistence compared to localStorage.
```

This is a simple V1 decision and can be revisited later when Electron packaging and more secure desktop storage are introduced.

#### Authentication vs Authorization

This milestone handled authentication foundation only.

Authentication answers:

```txt
Who is the user?
```

Authorization answers:

```txt
What is the user allowed to do?
```

Role-based permissions are intentionally postponed to a future milestone.

#### Frontend Guard vs Backend Security

A protected frontend route is useful, but it is not real backend security.

Frontend protected routes:

```txt
control UI navigation
improve user experience
prevent normal unauthenticated access through the interface
```

Backend security:

```txt
protects actual hotel data
validates tokens
rejects unauthorized API requests
prevents direct API misuse
```

FastAPI must still protect private APIs when authentication endpoints are completed.

#### Electron Responsibility Reminder

Electron main process does not manage login form state, token state, route access, or hotel business logic.

Correct responsibility split:

```txt
React renderer:
- auth UI
- auth state
- protected routes
- redirects

FastAPI:
- credential validation
- JWT creation
- database access
- API protection

Electron main:
- desktop shell
- app lifecycle
- native window
- startup flow
```

#### Milestone Result

Milestone 7 successfully created the frontend authentication-state foundation and verified unauthenticated protected route behavior.

The milestone is complete from the frontend-structure perspective, with real login integration blocked until the backend exposes and registers a confirmed authentication endpoint.

#### Suggested Next Step

The next milestone should not build rooms, guests, bookings, or finance yet if backend authentication is still incomplete.

Recommended next step:

```txt
Milestone 8 — Backend Auth Contract Review / Frontend Auth Integration Preparation
```

This milestone should confirm or create the real backend authentication API contract before the frontend attempts real login integration.

---

### Milestone 8 Notes: Dashboard Layout and Navigation

**Goal:**
Milestone 8 introduced the main protected dashboard structure for HelloStay.

The purpose was to replace the temporary protected placeholder page with a real dashboard shell.

The milestone focused on:

```txt
Dashboard layout
Sidebar navigation
Top header
Nested dashboard routes
Protected dashboard access
Placeholder pages for future modules
Logout behavior
```

**Completed Work:**
A new dashboard layout was created:

```txt
src/layouts/DashboardLayout.jsx
```

This layout contains:

```txt
Sidebar navigation
Top header
Main content area
Logout button
Outlet for nested route rendering
```

The layout is desktop-first because HelloStay is an Electron desktop application.

**Dashboard Pages Created:**
The following placeholder pages were created:

```txt
src/pages/DashboardHome.jsx
src/pages/RoomsPage.jsx
src/pages/GuestsPage.jsx
src/pages/StaysPage.jsx
src/pages/FinancePage.jsx
src/pages/HistoryPage.jsx
```

These pages are placeholders only.

They do not contain:

```txt
API calls
Tables
Forms
Modals
Charts
CRUD logic
Search
Filters
Business workflows
```

**Route Updates:**
`AppRoutes.jsx` was updated to support protected nested dashboard routes.

Final route direction:

```txt
/                   → StartPage
/login              → LoginPage
/register           → RegisterPage
/dashboard          → DashboardLayout + DashboardHome
/dashboard/rooms    → DashboardLayout + RoomsPage
/dashboard/guests   → DashboardLayout + GuestsPage
/dashboard/stays    → DashboardLayout + StaysPage
/dashboard/finance  → DashboardLayout + FinancePage
/dashboard/history  → DashboardLayout + HistoryPage
*                   → NotFoundPage
```

The dashboard parent route is protected by `ProtectedRoute`.

This means all child routes under `/dashboard` are protected automatically.

**React Router Concepts Learned:**
Nested routes were introduced.

A parent route can render a layout, and child routes can render inside that layout.

The `Outlet` component marks where child route content appears.

Example:

```txt
DashboardLayout
└── Outlet
    └── Current child page
```

When the URL is `/dashboard/rooms`, the layout remains visible and only the main content changes to `RoomsPage`.

**NavLink Concept Learned:**
The sidebar uses `NavLink`.

`NavLink` was used because it can detect the active route.

Difference:

```txt
Link     → navigates only
NavLink  → navigates and supports active styling
```

The dashboard home link uses `end: true` so it is active only on `/dashboard`.

Without `end: true`, the dashboard link could remain active on child routes like `/dashboard/rooms`.

**Layout Concept Learned:**
A dashboard layout is an application shell.

An application shell is the stable outer frame of the app.

For HelloStay, the shell contains:

```txt
Sidebar
Header
Main content area
```

The benefit is that the sidebar and header are written once and reused across all dashboard pages.

Without a layout, each page would need to duplicate sidebar and header code.

**Files Added:**

```txt
src/layouts/DashboardLayout.jsx

src/pages/DashboardHome.jsx
src/pages/RoomsPage.jsx
src/pages/GuestsPage.jsx
src/pages/StaysPage.jsx
src/pages/FinancePage.jsx
src/pages/HistoryPage.jsx

src/context/AuthContext.js
src/context/AuthProvider.jsx
src/hooks/useAuth.js
```

**Files Updated:**

```txt
src/routes/AppRoutes.jsx
src/pages/LoginPage.jsx
src/pages/RegisterPage.jsx
src/services/authService.js
src/styles/global.css
src/App.jsx
src/main.jsx
src/routes/ProtectedRoute.jsx
```

**Files Removed from Active Use:**

```txt
src/pages/DashboardPlaceholderPage.jsx
src/context/AuthContext.jsx
```

**Auth Refactor Notes:**
The old auth file caused a React Fast Refresh warning because it exported a context object, a provider component, and a custom hook from the same file.

Old structure:

```txt
AuthContext.jsx
├── AuthContext
├── AuthProvider
└── useAuth
```

New structure:

```txt
AuthContext.js
└── AuthContext only

AuthProvider.jsx
└── AuthProvider only

useAuth.js
└── useAuth only
```

This fixed the Fast Refresh warning and made the auth code easier to maintain.

**Temporary Auth Mock Notes:**
Backend authentication is not implemented yet.

Because of that, real login and registration cannot be tested against FastAPI yet.

Temporary frontend-only mocks were added in:

```txt
src/services/authService.js
```

Temporary login returns a fake token:

```txt
dev-token-...
```

Temporary registration allows the register page UI to load and submit without crashing.

These mocks are only for frontend development.

They must be removed when backend login/register endpoints are implemented.

**Bug Fixed: Dashboard Redirected to Login:**
Problem:

```txt
/dashboard always redirected to /login
```

Cause:

```txt
ProtectedRoute saw isAuthenticated as false because no backend login token was available.
```

Fix:

```txt
Temporary frontend login mock was added so AuthProvider could receive an access_token and set isAuthenticated to true.
```

**Bug Fixed: Fast Refresh AuthContext Error:**
Problem:

```txt
Fast refresh only works when a file only exports components.
```

Cause:

```txt
AuthContext.jsx exported AuthContext, AuthProvider, and useAuth together.
```

Fix:

```txt
AuthContext.js
AuthProvider.jsx
useAuth.js
```

were created and imports were updated.

**Bug Fixed: Missing AuthContext Import:**
Problem:

```txt
Vite could not resolve ./AuthContext.js from AuthProvider.jsx.
```

Cause:

```txt
AuthContext.js was expected by imports but was missing or not correctly created.
```

Fix:

```txt
src/context/AuthContext.js
```

was created with only the React context export.

**Bug Fixed: Old AuthContext Import:**
Problem:

```txt
The old AuthContext.jsx error still appeared.
```

Cause:

```txt
main.jsx still imported the old AuthContext.jsx file.
```

Fix:

```txt
main.jsx was cleaned so it only renders App.
App.jsx became responsible for wrapping AppRoutes with AuthProvider.
```

**Bug Fixed: Register Page Not Found:**
Problem:

```txt
Clicking Create new account showed NotFoundPage.
```

Cause:

```txt
The RegisterPage existed but /register was not correctly registered in AppRoutes.jsx.
```

Fix:

```txt
RegisterPage was imported into AppRoutes.jsx.
The /register route was added.
The login page link was matched to /register.
```

**Bug Fixed: White Screen:**
Problem:

```txt
Opening the frontend showed a white screen.
```

Cause:

```txt
RegisterPage.jsx imported registerAccount, but authService.js did not export registerAccount.
```

Fix:

```txt
registerAccount was added to authService.js as a temporary development mock.
```

Lesson learned:

```txt
A white screen usually means React crashed.
The browser console usually shows the real reason.
```

**Verification Completed:**
The following behaviors were verified:

```txt
Frontend opens at http://localhost:5173
StartPage loads
LoginPage loads
RegisterPage loads
Temporary login works
sessionStorage stores hellostay_access_token
ProtectedRoute allows dashboard after login
/dashboard opens DashboardLayout
Sidebar appears
Top header appears
DashboardHome placeholder appears
Rooms placeholder opens
Guests placeholder opens
Stays placeholder opens
Finance placeholder opens
History placeholder opens
Active sidebar link styling works
Logout clears token
/dashboard redirects to /login after logout
```

**What Was Not Added:**
Milestone 8 intentionally did not add:

```txt
Real backend authentication
Backend startup from Electron
Dashboard metrics
Charts
Rooms CRUD
Guests CRUD
Stays or bookings workflow
Finance logic
History logic
Role-based permissions
Settings
Packaging
Production auth persistence
```

**Current Final Frontend Direction:**
The frontend now has a protected dashboard foundation.

Future module pages can be added inside the dashboard layout without changing the core shell.

Current structure:

```txt
DashboardLayout
└── Outlet
    └── Feature module page
```

**Suggested Next Step:**
The next milestone should be:

```txt
Milestone 9 — Rooms Module Read-Only Foundation
```

Recommended focus:

```txt
Create room service functions
Connect to the existing backend /rooms endpoint
Display a simple read-only rooms list
Add loading state
Add error state
Do not add create/edit/delete yet
```

---

### Milestone 9 Notes — Rooms Module Read-Only Foundation

**Status:** Completed
**Milestone:** Frontend Milestone 9
**Project:** HelloStay — Offline Hotel Management System
**Date Recorded:** 2026-07-02

#### Purpose

Milestone 9 introduced the first real backend-connected hotel module in the HelloStay frontend: the Rooms module read-only foundation.

The goal of this milestone was to connect the existing React frontend to the FastAPI backend `GET /rooms` endpoint and display room records in the dashboard without adding create, edit, delete, forms, modals, filters, pagination, or booking-related availability logic.

This milestone marks the transition from placeholder dashboard pages to real API-driven frontend behavior.

#### What Was Built

The Rooms page was updated from a placeholder page into a real read-only data page.

The frontend now:

* Uses the existing shared API client.
* Adds a room-specific service file.
* Calls the backend `GET /rooms` endpoint.
* Fetches rooms when the Rooms page loads.
* Stores room data in React state.
* Shows a loading state while the request is running.
* Shows an error state if the backend request fails.
* Shows an empty state if no rooms exist.
* Shows a read-only room list/card layout when rooms are available.

#### Files Added

```txt
frontend/src/services/roomService.js
```

#### Files Updated

```txt
frontend/src/pages/RoomsPage.jsx
frontend/src/styles/global.css
```

#### Main Implementation Details

A new `roomService.js` file was created inside the `services` folder.

The service exposes a `getRooms` function that calls:

```txt
GET /rooms
```

through the existing `apiRequest` helper from `apiClient.js`.

The `RoomsPage.jsx` file was updated to use:

```js
useState
useEffect
getRooms
```

The page manages three main pieces of state:

```js
rooms
isLoading
error
```

The page now handles four important UI states:

```txt
Loading state
Error state
Empty state
Success state
```

#### Data Flow

```txt
RoomsPage.jsx
  ↓ calls
getRooms()
  ↓ calls
apiRequest("/rooms")
  ↓ sends request to
FastAPI GET /rooms
  ↓ returns
Room records from SQLite database
  ↓ displayed in
RoomsPage.jsx
```

#### Backend Endpoint Used

```txt
GET /rooms
```

Expected room fields:

```txt
id
room_number
price_per_night
room_status
room_type
max_occupancy
facilities
```

#### What Was Intentionally Not Added

The following were intentionally not added in this milestone:

```txt
Create room
Edit room
Delete room
Room forms
Room modals
Inline room status update
Room image support
Pagination
Sorting
Advanced filters
Booking-based availability
Guest logic
Stay logic
Finance logic
History logic
Electron backend startup
Packaging
```

#### React Concepts Practiced

This milestone introduced and practiced important React concepts:

```txt
Component state with useState
Side effects with useEffect
Async data fetching
Conditional rendering
Loading UI
Error UI
Empty UI
Success UI
Rendering lists with map()
Using keys in lists
Separating API logic from UI logic
```

#### JavaScript Concepts Practiced

This milestone also reinforced JavaScript concepts:

```txt
ES module imports and exports
Async functions
await
try/catch/finally
Arrays
Array.isArray()
Conditional checks
Nullish coalescing
Template-friendly data rendering
```

#### Architecture Lessons

The key architecture lesson was that UI pages should not directly know all backend request details.

Instead:

```txt
RoomsPage.jsx handles UI.
roomService.js handles room-related API functions.
apiClient.js handles common HTTP request behavior.
FastAPI handles business logic, validation, and database access.
Electron remains only the desktop shell.
```

This keeps the application clean, testable, and easier to maintain.

#### Verification Completed

The milestone is considered complete because:

* The room service file was created.
* The `getRooms` function calls the existing API client.
* `RoomsPage.jsx` fetches room data on page load.
* Loading state appears while data is being fetched.
* Error state appears when the backend request fails.
* Empty state appears when no rooms exist.
* Room records display successfully when backend data exists.
* No CRUD functionality was added.
* Electron files were not modified.
* Backend business logic remained inside FastAPI.

#### Final Outcome

Milestone 9 successfully established the read-only foundation for the Rooms module.

HelloStay now has its first real dashboard module connected to the backend through the frontend service layer.

This creates a safe foundation for future room workflows such as creating, editing, deleting, and managing room availability.

---

### Frontend Milestone 10 — Rooms Module Create Foundation

**Status:** Completed
**Date Completed:** 2026-07-03
**Related AD:** Frontend AD 10 — Rooms Module Create Foundation Through Service Layer

**Goal:**
Add the ability to create new room records from the Rooms page using the existing backend `POST /rooms` endpoint.

**Starting point:**
Milestone 9 had already completed the read-only Rooms foundation:

* `RoomsPage.jsx` displayed rooms from the backend
* `roomService.js` had `getRooms()`
* `GET /rooms` was connected through `apiClient.js`
* loading state was implemented
* error state was implemented
* empty state was implemented
* rooms were displayed in a card-based read-only UI

Milestone 10 continued from that foundation without rebuilding the Rooms page from scratch.

**Completed work:**

* Added `createRoom()` to `roomService.js`
* Connected `createRoom()` to `POST /rooms`
* Kept room API calls inside the service layer
* Added an inline Add New Room form to `RoomsPage.jsx`
* Used existing reusable UI components:

  * `Card`
  * `Button`
  * `Input`
  * `Loading`
  * `ErrorMessage`
* Added controlled form state using `useState`
* Added form input handling with `handleInputChange`
* Added frontend validation with `validateRoomForm`
* Added submit handling with `handleCreateRoom`
* Used `event.preventDefault()` to stop default browser form submission
* Converted input strings into backend-friendly payload values
* Added `isCreating` loading state for room creation
* Added `createError` state for creation errors
* Cleared the form after successful room creation
* Refreshed the rooms list after successful creation
* Verified backend persistence by refreshing the page
* Verified duplicate room-number behavior
* Fixed a React effect warning by avoiding the problematic `loadRooms()` call pattern inside `useEffect`

**Final frontend behavior:**

The Rooms page now supports this flow:

```txt
Open Rooms page
  ↓
Existing rooms load from backend
  ↓
User fills Add New Room form
  ↓
Frontend validates the form
  ↓
User submits the form
  ↓
POST /rooms is sent through roomService
  ↓
Room is created in backend database
  ↓
Form clears
  ↓
Rooms list refreshes
  ↓
New room appears on the page
```

**Form fields added:**

* Room Number
* Room Type
* Price Per Night
* Max Occupancy
* Room Status
* Facilities

**Validation rules added:**

* Room number is required
* Price per night is required
* Price per night must be a valid positive number
* Room status is required
* Max occupancy must be a valid positive whole number if provided

**Important React concepts practiced:**

* controlled components
* `useState`
* `useEffect`
* event handling
* form submission
* `event.preventDefault()`
* conditional rendering
* loading states
* error states
* async/await
* service-layer API calls
* refreshing data after mutation

**Important JavaScript concepts practiced:**

* object state
* object spreading
* computed property names
* string trimming
* number conversion
* async functions
* try/catch/finally
* validation functions
* conditional payload values

**Important frontend architecture concepts practiced:**

* page components should not directly contain raw fetch logic
* service functions make API usage cleaner
* backend remains the source of truth
* frontend validation improves UX but does not replace backend validation
* refetching after create is safer than optimistic updates in early milestones
* Electron should not contain room business logic
* features should be added in small, testable milestones

**Verification completed:**

The following behavior was confirmed:

* Rooms page loads successfully
* Existing rooms are displayed
* Add New Room form appears
* New room can be created successfully
* Form clears after successful creation
* Rooms list refreshes after successful creation
* Created room remains after page refresh
* Duplicate room number produces backend/database uniqueness behavior
* React effect warning was resolved
* No edit/delete/status update behavior was added

**Known backend improvement discovered:**
When a duplicate room number is submitted, the database correctly blocks the duplicate because room numbers are unique. However, the backend currently surfaces this as an internal server error. A future backend polish task should convert this into a clean user-facing error such as:

```txt
Room number already exists.
```

This is not part of Milestone 10 frontend scope but should be tracked for production readiness.

**Files changed:**

```txt
frontend/
  src/
    services/
      roomService.js

    pages/
      RoomsPage.jsx
```

Optional styling may also have been added or adjusted in:

```txt
frontend/
  src/
    styles/
      global.css
```

**What was not included in this milestone:**

* room editing
* room deletion
* room status mutation
* booking integration
* availability calculation
* room images
* pagination
* sorting
* advanced filtering
* modal form
* room-specific component extraction
* Electron backend startup
* packaging
* guest, booking, finance, history, or settings logic

**Completion summary:**
Milestone 10 successfully introduced the first create workflow in the Rooms module. The implementation stayed beginner-friendly and production-oriented by using the existing service layer, controlled form state, basic validation, backend submission, loading/error handling, and post-create refetching.

**Suggested next milestone:**
Milestone 11 should be:

```txt
Milestone 11 — Rooms Module Edit Foundation
```

Recommended focus:

* add `updateRoom()` in `roomService.js`
* connect to `PUT /rooms/{room_id}`
* allow selecting one room for editing
* reuse the existing room form pattern where reasonable
* keep delete separate
* keep room status mutation separate
* keep booking availability separate
* avoid advanced filters and pagination for now

---

### Frontend Milestone 11 — Rooms Module Edit and Delete Foundation

**Status:** Completed
**Date Completed:** 2026-07-08
**Project:** HelloStay Frontend
**Frontend Area:** Rooms Module
**Related Architecture Decision:** Frontend AD 11

Milestone 11 focused on completing the basic room management foundation by adding edit and delete functionality to the existing Rooms module.

Before this milestone, the Rooms module already supported reading rooms from the backend and creating new rooms. In this milestone, the module was extended so that existing room records can be updated and deleted through the FastAPI backend while keeping React responsible only for UI state, user interaction, and API coordination.

#### Completed Work

The existing `roomService.js` file was extended with two new service functions:

* `updateRoom(roomId, roomData)`
* `deleteRoom(roomId)`

The `updateRoom` function sends room updates to the backend using:

```txt
PUT /rooms/{room_id}
```

The `deleteRoom` function deletes a room through the backend using:

```txt
DELETE /rooms/{room_id}
```

All room-related API calls remain inside the room service layer instead of being written directly inside the page component.

The existing `RoomsPage.jsx` implementation was enhanced to support edit mode. Each room now has an edit action. When the user clicks edit, the selected room’s current values are copied into the form so the user can update them. The same form is reused for both room creation and room editing.

The page now tracks the selected room being edited using edit-related state. This allows the UI to switch between create mode and edit mode clearly.

A cancel edit action was also added so the user can leave edit mode and return the form to its default create-room state.

Delete functionality was added to each room item. Because deletion is a destructive action, an inline confirmation pattern was added before the room is deleted. This keeps the milestone simple and beginner-friendly without introducing modal complexity too early.

Loading and error states were added for update and delete operations. After a successful update or delete, the rooms list is refreshed from the backend so the UI stays synchronized with the database.

#### Files Changed

```txt
frontend/
  src/
    services/
      roomService.js

    pages/
      RoomsPage.jsx

    styles/
      global.css
```

#### Key Concepts Practiced

This milestone reinforced several important React and frontend engineering concepts:

* Service-layer API organization
* Controlled form inputs
* Reusing a form for create and edit workflows
* Pre-filling form state from selected data
* Tracking edit mode with React state
* Canceling edit mode safely
* Handling destructive actions with confirmation
* Managing update and delete loading states
* Managing update and delete error states
* Refreshing server data after mutations
* Keeping FastAPI as the source of truth
* Keeping Electron out of business logic

#### Backend Integration

The frontend now integrates with the existing backend room update and delete routes.

Room update uses:

```txt
PUT /rooms/{room_id}
```

Room delete uses:

```txt
DELETE /rooms/{room_id}
```

The backend remains responsible for validation, database updates, database deletion, and error responses such as room-not-found cases.

React does not directly modify the database. React sends requests to FastAPI through the service layer.

#### UI Behavior Added

The Rooms page now supports the following user flow:

```txt
Load rooms
Create room
Click Edit on an existing room
Pre-fill form with room data
Update room
Refresh rooms list
Cancel edit mode if needed
Click Delete on an existing room
Show inline confirmation
Confirm deletion
Refresh rooms list
```

#### Important Boundaries

This milestone intentionally did not add:

* Booking-based room availability
* Room status automation
* Stays or bookings integration
* Guests module logic
* Finance module logic
* History module logic
* Advanced filtering
* Pagination
* Sorting
* Room images
* Optimistic updates
* Modal system
* Electron backend startup
* Electron room API logic

These features are reserved for future milestones.

#### Verification Completed

Milestone 11 was considered complete after verifying that:

* Rooms still load correctly.
* New rooms can still be created.
* Existing rooms can be selected for editing.
* The edit form is pre-filled correctly.
* Edited room details are saved through the backend.
* The rooms list refreshes after update.
* Edit mode can be canceled.
* Delete confirmation appears before deletion.
* Clicking cancel prevents deletion.
* Confirming delete removes the room through the backend.
* The rooms list refreshes after deletion.
* Errors are shown when update or delete fails.
* The UI remains visually consistent with the HelloStay V1 design direction.

#### Summary

Milestone 11 completed the basic CRUD foundation for the Rooms module.

The Rooms module now supports:

```txt
Create → POST /rooms
Read   → GET /rooms
Update → PUT /rooms/{room_id}
Delete → DELETE /rooms/{room_id}
```

This milestone strengthened the project’s frontend architecture by keeping API communication inside the service layer, keeping form and interaction state inside React, and preserving FastAPI as the source of truth for room data.

The Rooms module is now ready for future UX cleanup, filtering, and later booking/stay integration.

---

### Frontend Milestone 12 — Rooms Module UX Refinement and Code Cleanup

**Status:** Completed
**Date Completed:** 2026-07-08
**Project:** HelloStay — Offline Hotel Management System
**Frontend Stack:** React, JavaScript, Vite, Electron Renderer
**Backend Stack:** FastAPI, SQLAlchemy, SQLite

Milestone 12 focused on refining the already-working Rooms module after Milestones 9, 10, and 11.

The goal of this milestone was not to add new backend features or start a new module. The goal was to improve the readability, structure, user experience, and visual consistency of the Rooms page while preserving the existing get, create, edit, and delete behavior.

The Rooms module remains connected to the FastAPI backend through the existing room service layer. FastAPI continues to be the source of truth for room data, validation, database operations, and API contracts.

**What was completed:**

* Reviewed the existing `RoomsPage.jsx` after room listing, creation, editing, and deletion had already been implemented.
* Identified that the page had grown large enough to benefit from small, focused component extraction.
* Refactored the Rooms module without rewriting it from scratch.
* Preserved existing backend integration and CRUD behavior.
* Kept room API calls inside `roomService.js`.
* Improved the visual layout of the Rooms page.
* Improved the page heading, spacing, card surfaces, form layout, and room list display.
* Improved the create/edit form experience.
* Made edit mode easier to understand by changing the form heading and showing a cancel edit action.
* Improved success and error message placement.
* Improved validation messages for required room fields.
* Improved delete confirmation behavior and delete loading feedback.
* Ensured errors do not break the entire Rooms page.
* Preserved room list refresh behavior after create, update, and delete operations.
* Kept reusable UI components generic.
* Extracted room-specific components only where they improved readability.

**Files added or refined:**

* `src/pages/RoomsPage.jsx`
* `src/components/rooms/RoomForm.jsx`
* `src/components/rooms/RoomTable.jsx`
* `src/styles/global.css`

**Responsibilities after this milestone:**

`RoomsPage.jsx` is responsible for page-level behavior, including room state, form state, loading state, error state, success messages, create/edit mode, and calls to `roomService.js`.

`RoomForm.jsx` is responsible for rendering the create/edit room form. It receives form data, validation errors, mode, submit state, and event handlers through props.

`RoomTable.jsx` is responsible for rendering the room list in a clean desktop-friendly table format. It receives room data and edit/delete handlers through props.

`roomService.js` remains the only frontend service layer for room-related API requests.

`global.css` contains the visual styling required for the improved Rooms page layout, form, table, buttons, alerts, empty state, and status badges.

**Important concepts learned:**

* Refactoring means improving code structure without changing behavior.
* Refactoring is different from rewriting.
* Refactoring is safest after a feature already works.
* Component extraction should be done only when it improves readability.
* Too many components too early can make code harder to understand.
* Props allow parent components to pass data and functions to child components.
* Page components should coordinate feature behavior.
* Feature components should render focused parts of the UI.
* Service files should isolate API communication.
* React renderer owns UI, state, forms, and user interaction.
* Electron main process should not contain room API logic or UI logic.
* Backend business rules should not be moved into React or Electron.

**Verification completed or required:**

The following behavior should work after Milestone 12:

* Rooms load from the backend.
* A new room can be created.
* The room list refreshes after creation.
* Existing rooms can be edited.
* The form clearly switches into edit mode.
* Edit mode can be cancelled.
* The room list refreshes after update.
* Rooms can be deleted after confirmation.
* Delete state is visible while deletion is happening.
* Validation messages appear for invalid form input.
* Success messages appear after successful create, update, and delete actions.
* API errors are shown clearly without crashing the page.
* The Rooms page still feels like part of the dashboard layout introduced in Milestone 8.

**What was intentionally not added:**

* No Guests module.
* No Bookings or Stays workflow.
* No finance, history, or settings logic.
* No room availability calculation based on bookings.
* No room image upload.
* No dashboard metrics.
* No backend changes.
* No Electron backend startup.
* No packaging work.
* No global room state.
* No reducers.
* No external state library.
* No custom room hook yet.

**Result:**

Milestone 12 completed the first cleanup pass of the Rooms module. The feature now has clearer structure, better user experience, improved visual consistency, and better separation between page logic, room-specific UI components, reusable UI, and backend service calls.

---

### Frontend Milestone 13: Guests Module Read-Only Foundation

**Status:** Completed
**Milestone:** Frontend Milestone 13
**Module:** Guests
**Focus Area:** Read-only guest listing through backend API integration

Frontend Milestone 13 introduced the first real foundation of the Guests module in the HelloStay frontend. The purpose of this milestone was to connect the existing protected dashboard Guests page to the FastAPI backend and display guest records in a simple read-only interface.

This milestone continued the architectural pattern already learned from the Rooms module. Instead of placing API logic directly inside the page component, a separate guest service file was created to keep backend communication organized and maintainable.

The backend endpoint used in this milestone was:

`GET /guests`

This endpoint returns a list of guest records containing:

* `id`
* `guest_name`
* `guest_phone_number`
* `guest_address`
* `id_proof_type`
* `id_proof_number`

A new service file was added:

`frontend/src/services/guestService.js`

This file contains the `getGuests()` function, which calls the backend through the existing `apiClient.js`. This keeps all guest-related API calls inside the guest service layer and prevents the page component from directly handling raw API request details.

The existing `GuestsPage.jsx` placeholder from the dashboard area was updated into a working read-only page. The page now uses React state to manage:

* guest records
* loading state
* error state

The page uses `useEffect` to fetch guests when the component first loads. This means the guest list is requested automatically when the user opens the Guests page.

The Guests page now handles the main API UI states:

* Loading state while guest data is being fetched
* Error state if the backend request fails
* Empty state if no guests are available
* Success state when guest records are returned and displayed

Guest records are displayed in a clean, simple, read-only UI consistent with the HelloStay V1 design direction. The guest display includes useful guest information such as guest name, phone number, ID proof type, ID proof number, and address. A simple initials/avatar placeholder may be used to make the guest cards more readable and visually clear.

No create, edit, delete, modal, form, stay history, booking integration, guest timeline, document upload, OCR, finance, history, settings, Electron backend startup, or packaging logic was added in this milestone.

This milestone respected the responsibility separation of the HelloStay architecture:

* FastAPI remains responsible for guest data, validation, database operations, and API contracts.
* React is responsible for displaying the Guests page and managing UI state.
* `guestService.js` is responsible for guest-related API calls.
* `apiClient.js` remains responsible for common request handling.
* Electron main process is not involved in guest data fetching.

This milestone successfully established the read-only Guests module foundation and prepared the project for future guest creation, editing, deletion, and guest-stay integration milestones.

---

### Frontend Milestone 14: Guests Module Create Foundation

**Status:** Completed
**Milestone:** Frontend Milestone 14 — Guests Module Create Foundation
**Project:** HelloStay — Offline Hotel Management System

Frontend Milestone 14 added the create foundation for the Guests module. This milestone continued directly from the Milestone 13 read-only Guests module and introduced the ability to create new guest records from the React frontend using the existing FastAPI backend.

The goal of this milestone was not to build the full Guests module. The milestone focused only on adding a beginner-friendly, production-oriented create flow while keeping the backend as the source of truth for guest data, validation, database operations, and duplicate constraints.

The existing `GuestsPage.jsx` was preserved and extended instead of being rebuilt from scratch. A new guest creation form was added to the Guests page using controlled React form inputs. The form collects the required guest fields expected by the backend:

* `guest_name`
* `guest_phone_number`
* `guest_address`
* `id_proof_type`
* `id_proof_number`

The `guestService.js` file was updated with a new `createGuest(guestData)` function. This function sends a `POST /guests` request through the existing `apiClient.js`, keeping all guest-related API communication inside the service layer.

The Guests page now supports:

* Fetching existing guests from the backend
* Displaying loading, error, empty, and success states
* Entering guest details through a controlled form
* Basic frontend validation for required fields
* Submitting guest data to the backend
* Showing creation errors clearly
* Clearing the form after successful guest creation
* Refreshing the guest list after a new guest is created

A React Hooks ESLint issue appeared during the milestone because `loadGuests()` was called inside `useEffect`, and that function immediately triggered synchronous state updates. The implementation was corrected by separating pure guest fetching from state-updating logic. A `fetchGuests()` function was introduced to only fetch and return data, while state updates were handled after the asynchronous request completed. This kept the code aligned with React Hooks linting expectations and improved the structure of the data-fetching logic.

This milestone also reinforced important frontend concepts:

* Controlled components
* `useState` for form data
* `useEffect` for initial data loading
* Form submission using `onSubmit`
* `event.preventDefault()`
* Client-side validation
* Backend validation as the final source of truth
* Service-layer API organization
* Refetching data after create operations
* Avoiding direct state mutation
* Avoiding premature abstraction

Electron responsibilities did not change in this milestone. Guest creation remains a renderer process concern that communicates with the FastAPI backend through the frontend service layer. No guest business logic was moved into Electron main process, preload scripts, or IPC.

This milestone intentionally did not add guest edit, guest delete, guest stay history, booking integration, ID document upload, OCR, advanced filtering, pagination, sorting, finance, history, or settings logic.

**Files affected:**

* `frontend/src/services/guestService.js`
* `frontend/src/pages/GuestsPage.jsx`

**Outcome:**

The Guests module can now create new guest records through the backend, clear the form after successful creation, and refresh the guest list so the newly created guest appears in the UI.

---

### Frontend Milestone 15: Guests Module Edit and Delete Foundation

**Status:** Completed
**Date Completed:** 2026-07-15

Milestone 15 extended the HelloStay Guests module with the foundational ability to update and delete existing guest records through the FastAPI backend.

The implementation continued from the completed Guests module created in Milestones 13 and 14. The existing guest loading and creation behavior was preserved instead of rebuilding `GuestsPage.jsx` from scratch.

**Completed work:**

* Reviewed and extended the existing Milestone 14 Guests page.
* Added `updateGuest(guestId, guestData)` to `guestService.js`.
* Added `deleteGuest(guestId)` to `guestService.js`.
* Integrated `PUT /guests/{guest_id}` through the shared API client.
* Integrated `DELETE /guests/{guest_id}` through the shared API client.
* Kept all guest-related HTTP operations inside `guestService.js`.
* Added an Edit action to each displayed guest.
* Added selected guest state for identifying the guest being edited.
* Added separate controlled edit-form state.
* Pre-filled the edit form using the selected guest’s current values.
* Added edit-form change handling.
* Added edit cancellation behavior.
* Added frontend validation for all required guest fields.
* Added normalization and trimming of edited guest data.
* Added comparison between original and edited values.
* Added partial update payload construction containing only changed fields.
* Prevented unnecessary update requests when no values changed.
* Added update loading state.
* Added update error state.
* Displayed backend update errors when available.
* Refetched the guest list after a successful update.
* Added a Delete action to each displayed guest.
* Added beginner-friendly inline delete confirmation.
* Added delete cancellation behavior.
* Added per-guest deletion loading state.
* Added delete error handling.
* Refetched the guest list after successful deletion.
* Closed edit mode when the currently edited guest was deleted.
* Preserved the existing create-guest workflow.
* Kept the UI aligned with the desktop-first HelloStay dashboard design.

**Guest update flow:**

The completed update workflow is:

```text
User selects Edit
        ↓
Selected guest is stored in editingGuest
        ↓
Current guest values are copied into editFormData
        ↓
User edits controlled inputs
        ↓
Frontend normalizes and validates the values
        ↓
Changed values are compared with the original guest
        ↓
PUT /guests/{guest_id} is sent
        ↓
FastAPI updates the database record
        ↓
Guests are refetched
        ↓
Edit mode closes
```

The original guest object and editable form state remain separate. This prevents direct mutation of the guest list and allows the user to cancel editing safely.

**Guest delete flow:**

The completed delete workflow is:

```text
User selects Delete
        ↓
Inline confirmation appears
        ↓
User confirms or cancels
        ↓
DELETE /guests/{guest_id} is sent after confirmation
        ↓
FastAPI deletes the database record
        ↓
Guests are refetched
        ↓
Confirmation state closes
```

Deletion is not performed from the first click because it is a destructive action.

**Validation completed:**

The edit form validates the following required fields:

* `guest_name`
* `guest_phone_number`
* `guest_address`
* `id_proof_type`
* `id_proof_number`

Whitespace is removed before validation and submission.

Frontend validation provides immediate feedback, while FastAPI remains responsible for authoritative validation, uniqueness rules, and database operations.

**State introduced or extended:**

The Guests page now manages separate state for:

* Loaded guest records
* Initial loading
* Guest-loading errors
* Create form data
* Create loading and errors
* Selected editing guest
* Edit form data
* Edit validation errors
* Update loading and errors
* Active delete confirmation
* Guest currently being deleted
* Delete errors

Separating these states prevents one operation from incorrectly controlling another operation’s UI.

**Service-layer changes:**

`guestService.js` now provides the complete guest CRUD foundation required so far:

* `getGuests()`
* `createGuest(guestData)`
* `updateGuest(guestId, guestData)`
* `deleteGuest(guestId)`

The page does not contain hardcoded backend URLs or direct `fetch()` calls.

**Frontend behavior verified:**

The completed module supports:

* Loading existing guests.
* Creating new guests.
* Opening edit mode.
* Pre-filling current guest data.
* Cancelling edit mode.
* Validating edited data.
* Updating one or more fields.
* Detecting submissions with no changes.
* Showing update progress.
* Showing update failures.
* Persisting updates after refresh.
* Opening inline delete confirmation.
* Cancelling deletion.
* Confirming deletion.
* Showing delete progress.
* Showing delete failures.
* Persisting deletion after refresh.

**Architecture responsibilities preserved:**

**React renderer process:**

* Displays guest records.
* Manages forms and controlled inputs.
* Manages edit selection.
* Manages loading and error UI.
* Manages inline delete confirmation.
* Calls guest service functions.

**Service layer:**

* Defines guest update and delete requests.
* Hides endpoint and HTTP-method details from the page.
* Uses the shared API client.

**FastAPI backend:**

* Finds guest records.
* Validates update data.
* Applies partial updates.
* Enforces database constraints.
* Commits updates and deletions.
* Returns success or error responses.

**Electron:**

* No guest business logic was added to the Electron main process.
* No guest API calls were added to preload scripts.
* Electron continues to act only as the desktop shell.

**Files changed:**

* `frontend/src/services/guestService.js`
* `frontend/src/pages/GuestsPage.jsx`
* Existing stylesheet containing guest-related styles

**Not included in this milestone:**

* Guest stay history
* Booking or stay integration
* Guest activity timelines
* ID document uploads
* OCR
* Pagination
* Sorting
* Advanced filtering
* Optimistic updates
* Modal infrastructure
* Finance logic
* History module logic
* Electron backend startup
* Desktop packaging

**Result:**

The Guests module now has a complete basic CRUD foundation:

```text
Create + Read + Update + Delete
```

Guest mutations pass through the established frontend service layer, are confirmed by the FastAPI backend, and are followed by a guest-list refetch. The implementation remains readable, beginner-friendly, and consistent with the architecture established in earlier HelloStay frontend milestones.

**Suggested next milestone:**

Milestone 16 should focus on Guests Module UX Refinement and Code Cleanup.

Recommended areas include:

* Reviewing the size and readability of `GuestsPage.jsx`.
* Extracting guest-specific components only where they simplify the page.
* Reusing a shared `GuestForm` for create and edit if the resulting prop design remains clear.
* Improving action-button variants and destructive-action styling.
* Improving field-level validation presentation.
* Improving loading, empty, and mutation feedback.
* Preserving the existing API behavior without adding guest stays or booking integration.

---