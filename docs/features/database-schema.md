# Database Schema

## Overview
Away Days uses PostgreSQL with Drizzle ORM for type-safe database operations. The schema supports football match tracking, user experiences, and social features.

## Core Tables

### matches
Stores football match information.
```sql
- id (text, primary key)
- homeTeam (text, not null)
- awayTeam (text, not null)
- homeScore (integer, nullable)
- awayScore (integer, nullable)
- matchDate (timestamp, not null)
- competition (text, not null) -- e.g., "Premier League"
- venue (text, nullable) -- Stadium name
- season (text, not null) -- e.g., "2024/25"
- createdAt (timestamp, default now)
- updatedAt (timestamp, default now)
```

### watchingExperiences
Core table storing user's watching experiences.
```sql
- id (text, primary key)
- userId (text, not null, references user.id)
- matchId (text, nullable, references matches.id)
- customMatchDescription (text, nullable) -- For non-database matches
- watchingLocation (text, not null) -- User's location description
- locationDetails (text, nullable) -- Additional location info
- rating (integer, not null) -- 1-5 star rating
- review (text, nullable) -- User's written review
- watchedAt (timestamp, not null) -- When they watched it
- isPublic (boolean, not null, default true) -- Privacy control
- aiCategorizedLocation (text, nullable) -- AI-generated category
- createdAt (timestamp, default now)
- updatedAt (timestamp, default now)
```

### friendships
Manages friend relationships between users.
```sql
- id (text, primary key)
- requesterId (text, not null, references user.id)
- addresseeId (text, not null, references user.id)
- status (enum: "pending", "accepted", "declined", "blocked")
- createdAt (timestamp, default now)
- updatedAt (timestamp, default now)
```

### experienceMedia
Stores photos/videos for watching experiences (future feature).
```sql
- id (text, primary key)
- experienceId (text, not null, references watchingExperiences.id)
- mediaType (enum: "photo", "video")
- mediaUrl (text, not null) -- Path/URL to media file
- caption (text, nullable)
- createdAt (timestamp, default now)
```

### likes
Social interaction: likes on experiences.
```sql
- id (text, primary key)
- userId (text, not null, references user.id)
- experienceId (text, not null, references watchingExperiences.id)
- createdAt (timestamp, default now)
- UNIQUE(userId, experienceId) -- Prevent duplicate likes
```

### comments
Comments on watching experiences (future feature).
```sql
- id (text, primary key)
- userId (text, not null, references user.id)
- experienceId (text, not null, references watchingExperiences.id)
- content (text, not null)
- createdAt (timestamp, default now)
- updatedAt (timestamp, default now)
```

## Authentication Tables (Better Auth)

### user
```sql
- id (text, primary key)
- name (text, not null)
- email (text, not null, unique)
- emailVerified (boolean)
- image (text, nullable)
- createdAt (timestamp, default now)
- updatedAt (timestamp, default now)
```

### session, account, verification
Standard Better Auth tables for authentication management.

## Relationships

### One-to-Many
- `user` → `watchingExperiences` (user can have many experiences)
- `matches` → `watchingExperiences` (match can have many viewing experiences)
- `watchingExperiences` → `experienceMedia` (experience can have many media files)
- `watchingExperiences` → `likes` (experience can have many likes)
- `watchingExperiences` → `comments` (experience can have many comments)

### Many-to-Many
- `user` ↔ `user` through `friendships` (bidirectional relationships)

## Indexes and Performance
- Primary keys on all tables for fast lookups
- Foreign key constraints ensure data integrity
- Timestamps for audit trails and chronological queries
- Unique constraints prevent duplicate relationships

## Migration History
- Initial migration: Better Auth tables
- Migration 0001: Added football-specific tables (matches, watchingExperiences, friendships, experienceMedia, likes, comments)

## Configuration
- **File**: `drizzle.config.ts`
- **Schema**: `src/lib/schema.ts`
- **Connection**: Uses `POSTGRES_URL` environment variable
- **ORM**: Drizzle ORM with PostgreSQL driver