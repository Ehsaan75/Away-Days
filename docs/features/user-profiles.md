# User Profiles

## Overview
User profile system that displays personal football watching history, statistics, and achievements.

## Profile Dashboard (`/dashboard`)
- **File**: `src/app/dashboard/page.tsx`
- **Features**:
  - Personal stats cards (total experiences, average rating, favorite location)
  - Complete watching history with match details
  - Star rating displays
  - AI-categorized location badges
  - Quick access to add new experiences

## Statistics Calculation
- **Total Experiences**: Count of all user's logged matches
- **Average Rating**: Calculated from all ratings given
- **Favorite Location**: Most commonly used watching location
- **Real-time Updates**: Stats update when new experiences are added

## Experience Display
Each experience shows:
- Match information (teams, score, competition)
- User's rating (visual star display)
- Watching location and AI category
- Date watched
- Personal review/comments
- Location details and venue info

## Components

### Stats Cards
- Visual dashboard cards showing key metrics
- Icons for each stat type
- Empty states for new users
- Responsive grid layout

### Experience History
- Chronological list of all watching experiences
- Rich formatting with badges and ratings
- Hover effects for better UX
- Empty state encouraging first experience

### Star Rating System
- Visual 5-star rating display
- Used throughout the app for consistency
- Yellow filled stars for ratings
- Gray empty stars for remaining

## Authentication
- Protected routes requiring user login
- Graceful handling of unauthenticated users
- Integration with Better Auth session management

## Navigation Integration
- Accessible via "Profile" link in main navigation
- Quick action buttons to add experiences
- Consistent header with user identification

## Technical Implementation
- React hooks for state management
- API integration for dynamic data loading
- Responsive design with Tailwind CSS
- TypeScript for type safety
- Real-time data fetching with error handling