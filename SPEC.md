# Family Command Center - MVP Specification

## Project Overview
- **Name**: Family Command Center
- **Type**: Micro-SaaS Web Application
- **Core functionality**: Coordination hub for busy families (3+ kids) to manage schedules, chores, and parent communication
- **Target users**: Parents with 3+ children needing schedule coordination

## UI/UX Specification

### Layout Structure
- **Navigation**: Bottom tab bar for mobile, sidebar for desktop
- **Views**: Calendar, Chores, Messages, Settings
- **Responsive breakpoints**: 
  - Mobile: < 768px (bottom tabs)
  - Desktop: >= 768px (sidebar nav)

### Visual Design
- **Color Palette**:
  - Primary: #6366F1 (Indigo-500 - warm family feel)
  - Secondary: #F59E0B (Amber-500 - energy/activity)
  - Background: #FEFCE8 (Amber-50 - warm cream)
  - Surface: #FFFFFF
  - Text Primary: #1F2937
  - Text Secondary: #6B7280
  - Success: #10B981 (Emerald-500)
  - Danger: #EF4444 (Red-500)
  
- **Kid Colors** (for calendar events):
  - Kid 1: #EC4899 (Pink-500)
  - Kid 2: #8B5CF6 (Violet-500)
  - Kid 3: #06B6D4 (Cyan-500)
  - Kid 4: #F97316 (Orange-500)
  - Kid 5: #84CC16 (Lime-500)

- **Typography**:
  - Font Family: "Outfit" (Google Fonts - friendly, modern)
  - Headings: Bold, larger sizes
  - Body: Regular, 14-16px
  - Labels: Medium, 12px

- **Spacing**: 4px base unit (4, 8, 12, 16, 24, 32)

- **Visual Effects**:
  - Cards: subtle shadow (0 2px 8px rgba(0,0,0,0.08))
  - Buttons: scale(0.98) on press
  - Transitions: 200ms ease

### Components

#### Calendar View
- Monthly grid with color-coded event dots
- Event list below calendar
- Quick add button (FAB)
- Filter by kid/activity type
- States: today highlight, selected day, events indicator

#### Chore Board
- Rotation grid (assignable to each kid)
- Chore cards with status toggle
- Assignee avatars with kid colors
- Drag to reassign (or tap to cycle)
- States: pending, done, overdue

#### Messages
- Thread list view
- Quick compose input
- Parent selector (who's messaging)
- No phone numbers - just parent names
- States: unread badge, input focused

#### Activity Alerts
- Toast notifications for upcoming events
- Alert before event (configurable: 30min, 1hr, 1day)
- Sound toggle in settings

## Functionality Specification

### Core Features
1. **Family Calendar**
   - Add/edit/delete events
   - Color-coded by kid
   - Event types: activity, appointment, school, other
   - Recurring events support
   - Date/time with duration

2. **Chore Rotation**
   - Predefined chores list
   - Assign to kids (rotate weekly/manual)
   - Mark complete
   - Track completion streaks

3. **Parent Messaging**
   - Create message threads
   - Quick replies
   - No phone numbers required
   - Local storage only (no real-time sync for MVP)

4. **Notifications**
   - Browser notifications for upcoming events
   - Alert timing configuration
   - Enable/disable toggle

5. **Data Persistence**
   - All data in localStorage
   - JSON structure for events, chores, messages
   - Export/import functionality

### Data Models
```javascript
// Events
{
  id: string,
  title: string,
  kidId: number,
  type: 'activity' | 'appointment' | 'school' | 'other',
  date: string,
  time: string,
  duration: number,
  recurring: boolean,
  recurringPattern: string
}

// Chores
{
  id: string,
  title: string,
  assigneeId: number,
  status: 'pending' | 'done',
  dueDate: string
}

// Messages
{
  id: string,
  fromId: number,
  content: string,
  timestamp: string,
  read: boolean
}

// Family
{
  kids: [{ id, name, color }],
  parents: [{ id, name }]
}
```

## Acceptance Criteria
1. App loads and displays calendar view on mobile/desktop
2. Can add an event and see it on calendar
3. Can add a chore and assign to kid
4. Can send a message to another parent
5. Can toggle chore status
6. Data persists after page refresh
7. Mobile layout has bottom navigation
8. Desktop layout has sidebar navigation
9. Notifications work (browser permission required)
10. Build completes without errors
