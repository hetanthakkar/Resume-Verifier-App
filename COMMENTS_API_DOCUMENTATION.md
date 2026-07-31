# Comments API Documentation

This document outlines the API endpoints needed to support the resume commenting feature.

## Base URL
```
http://localhost:8000/api
```

## Authentication
All endpoints require Bearer token authentication in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Endpoints

### 1. Get Comments for a Resume
**GET** `/resumes/{resume_id}/comments/`

Returns all comments for a specific resume.

**Response:**
```json
[
  {
    "id": "uuid",
    "text": "Great experience in React Native",
    "page_number": 1,
    "rect": {
      "x1": 100.5,
      "y1": 200.3,
      "x2": 300.7,
      "y2": 220.1
    },
    "created_at": "2024-01-15T10:30:00Z",
    "created_by": "user_id"
  }
]
```

### 2. Create a Comment
**POST** `/comments/`

Creates a new comment for a resume.

**Request Body:**
```json
{
  "text": "Great experience in React Native",
  "page_number": 1,
  "rect": {
    "x1": 100.5,
    "y1": 200.3,
    "x2": 300.7,
    "y2": 220.1
  },
  "resume_id": "uuid",
  "job_id": "uuid"
}
```

**Note:** The `rect` field can be an empty object `{}` when the comment is not associated with a specific annotation (e.g., general comments added from the comments screen).

**Response:**
```json
{
  "id": "uuid",
  "text": "Great experience in React Native",
  "page_number": 1,
  "rect": {
    "x1": 100.5,
    "y1": 200.3,
    "x2": 300.7,
    "y2": 220.1
  },
  "created_at": "2024-01-15T10:30:00Z",
  "created_by": "user_id",
  "resume_id": "uuid",
  "job_id": "uuid"
}
```

### 3. Update a Comment
**PUT** `/comments/{comment_id}/`

Updates an existing comment.

**Request Body:**
```json
{
  "text": "Updated comment text",
  "page_number": 1,
  "rect": {
    "x1": 100.5,
    "y1": 200.3,
    "x2": 300.7,
    "y2": 220.1
  },
  "resume_id": "uuid",
  "job_id": "uuid"
}
```

**Response:** Same as create response

### 4. Delete a Comment
**DELETE** `/comments/{comment_id}/`

Deletes a comment.

**Response:** 204 No Content

## Database Schema

### Comments Table
```sql
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    text TEXT NOT NULL,
    page_number INTEGER NOT NULL,
    rect JSONB DEFAULT '{}', -- Stores {x1, y1, x2, y2} coordinates or empty object {}
    resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_comments_resume_id ON comments(resume_id);
CREATE INDEX idx_comments_job_id ON comments(job_id);
CREATE INDEX idx_comments_created_by ON comments(created_by);
```

## Coordinate System

The `rect` field stores PDF coordinates in the following format:
- `x1, y1`: Top-left corner of the annotation
- `x2, y2`: Bottom-right corner of the annotation

Coordinates are in PDF points (1/72 inch) and are relative to the page content area.

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error",
  "details": {
    "text": ["This field is required."],
    "page_number": ["This field must be a positive integer."]
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "error": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "error": "Comment not found."
}
```

## Implementation Notes

1. **Security**: Ensure users can only access comments for resumes they have permission to view
2. **Validation**: Validate that page_number is within the PDF's page range
3. **Coordinates**: Store coordinates as JSONB for flexibility and querying capabilities
4. **Audit Trail**: Consider adding updated_at and updated_by fields for better tracking
5. **Soft Delete**: Consider implementing soft delete instead of hard delete for audit purposes 