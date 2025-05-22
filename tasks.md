# 📅 Conference Room Scheduling System – Task Breakdown

## 🚩 Milestone 1: Initial Setup & System Foundation

### ✅ Task 1.1: Supabase Backend Initialization
- [x] Create Supabase project
- [x] Define tables: `companies`, `rooms`, `events`
- [x] Add necessary columns (e.g. `recurrence_rule`, `recurrence_exceptions`)
- [x] Set up foreign key relationships
- [x] Enable Realtime on `events` table

### ✅ Task 1.2: Implement Row-Level Security (RLS)
- [x] Use Supabase Auth (do not create manual `users` table)
- [x] Create `user_profiles` table for roles and company access
- [x] Define system admin based on email or `role` field
- [x] Create RLS policies:
  - [x] Only system admin can manage `companies` and `rooms`
  - [x] Company admins can only access and manage `events` of their company’s rooms

---

## 🚩 Milestone 2: Next.js App Scaffolding

### ✅ Task 2.1: Project Initialization
- [x] Initialize Next.js project with TypeScript
- [x] Install Tailwind CSS (or preferred styling system)
- [x] Set up Supabase client using SSR helpers
  - [x] `client.ts` (browser)
  - [x] `server.ts` (server)
  - [x] `middleware.ts` (auth + session refresh logic)
  - [x] Move `middleware.ts` to project root
  - [x] Configure route matching in `next.config.js`

### ✅ Task 2.2: Auth & Role Routing
- [ ] Implement Supabase Auth UI (sign in/out)
- [ ] Route handling for system admin vs company admin
- [ ] Role-check middleware for admin access

---

## 🚩 Milestone 3: Admin Interface (`/admin`)

### ✅ Task 3.1: Companies Management
- [ ] List all companies
- [ ] Add new company
- [ ] Deactivate/activate company
- [ ] Edit company info

### ✅ Task 3.2: Room Management
- [ ] List all rooms with assigned companies
- [ ] Add new room
- [ ] Edit room name or assignment
- [ ] Delete room (or soft delete)

---

## 🚩 Milestone 4: Company Dashboard (`/dashboard`)

### ✅ Task 4.1: Event Management UI
- [ ] Show calendar view of events
- [ ] Add new event
- [ ] Edit/delete event

### ✅ Task 4.2: Recurrent Meeting Support
- [ ] UI to select recurrence (daily, weekly, monthly)
- [ ] Store in RFC 5545 format
- [ ] Add ability to cancel/edit specific occurrences

---

## 🚩 Milestone 5: Recurrence Logic (Backend)

### ✅ Task 5.1: Recurrence Rule Expansion
- [ ] Install and set up `rrule.js` or `date-fns`
- [ ] Expand recurrent events per room/day in API
- [ ] Merge in exceptions (`recurrence_exceptions`)

### ✅ Task 5.2: Schedule API
- [ ] `/api/events?room=ROOM_ID&date=YYYY-MM-DD`
  - [ ] Expand rules
  - [ ] Include exceptions
  - [ ] Return sorted list of events

---

## 🚩 Milestone 6: Room Display Interface (`/rooms/[id]`)

### ✅ Task 6.1: Page UI & Logic
- [ ] Fullscreen layout
- [ ] Red + white if current event
- [ ] Black + white if next event
- [ ] “–” if no event for the day

### ✅ Task 6.2: Data Handling
- [ ] Fetch schedule at load and cache locally
- [ ] Poll hourly for updates
- [ ] Supabase Realtime for push updates
- [ ] Fallback to cached data if offline

---

## 🚩 Milestone 7: Device Setup

### ✅ Task 7.1: Tablet Configuration
- [x] Acquire tablets (done)
- [ ] Lock tablet to specific URL (`/rooms/[id]`) in kiosk mode
- [ ] Set tablet to fetch data at midnight

---

## 🚩 Milestone 8: Enhancements & Optional Features

### ✅ Task 8.1: Offline-First PWA
- [ ] Add service worker
- [ ] Cache schedules locally
- [ ] Support offline viewing and syncing

### ✅ Task 8.2: Analytics Dashboard
- [ ] Collect usage metrics (views, refreshes)
- [ ] Display in admin area

### ✅ Task 8.3: ICS Feed Export
- [ ] Generate `.ics` feed per room or company
- [ ] Add download or subscription link
