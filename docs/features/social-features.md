# Social Features

## Overview
Away Days includes comprehensive social functionality allowing users to connect with friends and share their football watching experiences.

## Friends System

### Database Schema
- **Table**: `friendships`
- **Key Fields**:
  - `requesterId`: User who sent friend request
  - `addresseeId`: User who received request
  - `status`: "pending", "accepted", "declined", "blocked"

### Friends Management (`/friends`)
- **File**: `src/app/friends/page.tsx`
- **Features**:
  - Send friend requests by email
  - View pending requests (sent/received)
  - Accept/decline friend requests
  - View accepted friends list

### API Endpoints

#### Get Friends List
- **Endpoint**: `GET /api/friends`
- **File**: `src/app/api/friends/route.ts`
- **Features**:
  - Returns all friendships for current user
  - Handles bidirectional relationships
  - Includes friend details and request status

#### Send Friend Request
- **Endpoint**: `POST /api/friends/request`
- **File**: `src/app/api/friends/request/route.ts`
- **Features**:
  - Find user by email
  - Prevent duplicate requests
  - Create pending friendship

#### Respond to Friend Request
- **Endpoint**: `POST /api/friends/respond`
- **File**: `src/app/api/friends/respond/route.ts`
- **Features**:
  - Accept/decline friend requests
  - Update friendship status
  - Only addressee can respond

## Social Feed

### Home Page Feed
- **File**: `src/app/page.tsx`
- **Features**:
  - Shows watching experiences from friends and self
  - Displays user who posted, match details, rating
  - Real-time activity sidebar
  - Encourages social engagement

### Feed API
- **Endpoint**: `GET /api/experiences/feed`
- **File**: `src/app/api/experiences/feed/route.ts`
- **Features**:
  - Fetches public experiences from accepted friends
  - Includes user's own experiences
  - Joins with match and user data
  - Ordered by recency

## Privacy Controls
- **Public/Private Experiences**: Users can control visibility via `isPublic` field
- **Friend-only Content**: Only accepted friends see each other's experiences
- **User Profiles**: Profile information shown in feed posts

## Usage Flow
1. User signs up and logs first experience
2. User adds friends via email on `/friends` page
3. Friends accept requests
4. Experiences from friends appear in home page feed
5. Users can see activity sidebar with recent friend activity

## Technical Details
- Bidirectional friendship handling (friend relationships work both ways)
- Efficient queries using JOIN operations
- Privacy-first design with explicit public/private controls
- Real-time feel with immediate UI updates after actions