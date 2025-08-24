# Watching Experiences

## Overview
The core feature of Away Days - allows users to log and track their football watching experiences with ratings, reviews, and location details.

## Database Schema
- **Table**: `watchingExperiences`
- **Key Fields**:
  - `matchId`: Links to matches table (optional for custom matches)
  - `customMatchDescription`: For matches not in the database
  - `watchingLocation`: User's description of where they watched
  - `locationDetails`: Additional location context
  - `rating`: 1-5 star rating
  - `review`: Optional text review
  - `aiCategorizedLocation`: AI-generated location category
  - `isPublic`: Controls visibility to friends

## Key Components

### Add Experience Form (`/add-experience`)
- **File**: `src/app/add-experience/page.tsx`
- **Features**:
  - Match details input (teams, scores, competition, date)
  - Location tracking (where user watched)
  - 5-star rating system
  - Optional review text
  - AI-powered location categorization

### API Endpoints

#### Create Experience
- **Endpoint**: `POST /api/experiences`
- **File**: `src/app/api/experiences/route.ts`
- **Features**:
  - Creates/finds match records
  - AI location categorization using OpenAI
  - Links experience to authenticated user

#### User Experiences
- **Endpoint**: `GET /api/experiences/user`
- **File**: `src/app/api/experiences/user/route.ts`
- **Features**:
  - Fetches user's watching history
  - Calculates user stats (total experiences, average rating, favorite location)
  - Joins with match data for display

## AI Integration
- Uses OpenAI to categorize watching locations into standard categories:
  - Stadium, Home, Pub/Bar, Friend's House, Outdoor, Other
- Fallback handling if AI fails
- Uses `OPENAI_MODEL` environment variable for model selection

## Media Upload Features
- **Photo/Video Support**: Users can upload multiple photos and videos (up to 50MB each)
- **File Validation**: Accepts image/* and video/* file types
- **Preview System**: Real-time preview of selected media with removal option
- **Vercel Blob Storage**: Secure cloud storage for all media files
- **Gallery Display**: Media shown in grid format on profiles and feeds

## Usage
1. User navigates to `/add-experience`
2. Fills in match details and location
3. Rates experience 1-5 stars
4. Optionally adds review
5. Optionally uploads photos/videos of the experience
6. System saves experience, uploads media, and categorizes location with AI
7. Experience with media appears in user's profile and friends' feeds