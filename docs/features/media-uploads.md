# Media Uploads

## Overview
Away Days supports photo and video uploads for watching experiences, allowing users to showcase their match experiences visually.

## Features

### Upload Capabilities
- **Multiple Files**: Upload multiple photos and videos per experience
- **File Types**: Supports all image formats (PNG, JPG, GIF, etc.) and video formats (MP4, MOV, etc.)
- **Size Limits**: Maximum 50MB per file
- **Preview System**: Real-time previews with ability to remove files before submission

### Storage System
- **Vercel Blob Storage**: Secure cloud storage with public access for media
- **Automatic Naming**: Random suffix added to prevent filename conflicts
- **Direct Upload**: Files uploaded directly to Blob storage during form submission

## Database Schema

### experienceMedia Table
- **experienceId**: Links to watching experience
- **mediaType**: "photo" or "video"
- **mediaUrl**: Public URL to the stored file
- **caption**: Optional caption (future feature)

## API Endpoints

### Upload Media
- **Endpoint**: `POST /api/experiences/media`
- **File**: `src/app/api/experiences/media/route.ts`
- **Authentication**: Required - user must own the experience
- **Process**:
  1. Validates file type and size
  2. Uploads to Vercel Blob storage
  3. Saves media record to database
  4. Returns media URL and metadata

## UI Components

### Upload Interface
- **Drag & Drop Zone**: User-friendly file selection
- **File Previews**: Grid display with thumbnails
- **Remove Buttons**: Individual file removal
- **File Information**: Shows file type and size

### Display Components
- **Profile Gallery**: Grid layout in user dashboard
- **Feed Gallery**: Compact grid in social feed
- **Click to Open**: Full-size viewing in new tab
- **Video Previews**: Muted preview with click to play

## Environment Requirements

### Required Variables
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob storage access token
- Must be configured for uploads to work

### Configuration
```typescript
// Automatic configuration in API routes
import { put } from "@vercel/blob";

const blob = await put(file.name, file, {
  access: 'public',
  addRandomSuffix: true,
});
```

## User Experience

### Upload Flow
1. User selects files via click or drag-and-drop
2. Files validated (type, size) with user feedback
3. Preview thumbnails shown immediately
4. User can remove unwanted files
5. On form submit, files uploaded in parallel
6. Experience created with linked media

### Viewing Flow
1. Media displayed in responsive grid layouts
2. Photos show as thumbnails with hover effects
3. Videos show as preview frames
4. Click to open full-size in new tab
5. Consistent display across profile and feed

## Technical Implementation

### File Validation
- Client-side validation for immediate feedback
- Server-side validation for security
- File type checking using MIME types
- Size limit enforcement

### Performance Optimizations
- Parallel upload processing
- Thumbnail generation for previews
- Lazy loading for large galleries
- Responsive image sizing

### Security Features
- User ownership verification
- File type validation
- Size limit enforcement
- Public but unpredictable URLs