# Questify API Reference

## Base URL

```
https://questiai-43b71abdd48b.herokuapp.com/api
```

## Authentication

All protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

## Response Envelope

All endpoints (except file streaming) return a consistent JSON envelope:

```json
{
  "success": true | false,
  "message": "Human readable message",
  "data": { } | [ ] | null
}
```

## Error Codes

| Status | Meaning                                         |
| ------ | ----------------------------------------------- |
| 400    | Bad request / validation error                  |
| 401    | Invalid or missing token                        |
| 403    | Forbidden (unverified account or access denied) |
| 404    | Resource not found                              |
| 409    | Conflict (e.g. email already registered)        |
| 500    | Internal server error                           |

---

# Auth `/api/auth`

## POST `/api/auth/register`

Register a new user. Sends an OTP to the provided email.

**Request Body**

```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

> `password` minimum 8 characters.

**Success `201`**

```json
{
  "success": true,
  "message": "OTP sent to your email",
  "data": null
}
```

**Error `409`** — email already registered

```json
{
  "success": false,
  "message": "Email already registered",
  "data": null
}
```

---

## POST `/api/auth/verify`

Verify the user's email using the OTP sent during registration.

**Request Body**

```json
{
  "email": "john@example.com",
  "otp": "482910"
}
```

**Success `200`**

```json
{
  "success": true,
  "message": "Account verified successfully",
  "data": null
}
```

**Error `400`** — invalid or expired OTP

```json
{
  "success": false,
  "message": "Verification code expired, or invalid",
  "data": null
}
```

---

## POST `/api/auth/resend-otp`

Resend the registration OTP to the user's email.

**Request Body**

```json
{
  "email": "john@example.com"
}
```

**Success `200`**

```json
{
  "success": true,
  "message": "OTP sent to your email",
  "data": null
}
```

**Error `400`** — account already verified

```json
{
  "success": false,
  "message": "Account already verified",
  "data": null
}
```

---

## POST `/api/auth/login`

Authenticate and receive an access token.

**Request Body**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success `200`**

```json
{
  "success": true,
  "message": "Login successfull",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer"
  }
}
```

**Error `400`** — wrong credentials

```json
{
  "success": false,
  "message": "Incorrect Email or Password",
  "data": null
}
```

**Error `403`** — account not verified

```json
{
  "success": false,
  "message": "Account not verified. Please verify your email first.",
  "data": null
}
```

---

## POST `/api/auth/forgot-password`

Send a password reset OTP to the user's email.

**Request Body**

```json
{
  "email": "john@example.com"
}
```

**Success `200`**

```json
{
  "success": true,
  "message": "A reset OTP has been sent via email",
  "data": null
}
```

**Error `404`** — email not found

```json
{
  "success": false,
  "message": "User not found",
  "data": null
}
```

---

## POST `/api/auth/reset-password`

Reset the user's password using the OTP received via email.

**Request Body**

```json
{
  "email": "john@example.com",
  "otp": "193847",
  "new_password": "newpassword123"
}
```

> `new_password` minimum 8 characters.

**Success `200`**

```json
{
  "success": true,
  "message": "Password reset successfully",
  "data": null
}
```

**Error `400`** — invalid or expired OTP

```json
{
  "success": false,
  "message": "Verification code expired, or invalid",
  "data": null
}
```

---

## PATCH `/api/auth/user/password` 🔒

Change the authenticated user's password.

**Request Body**

```json
{
  "old_password": "password123",
  "new_password": "newpassword456"
}
```

> `new_password` minimum 8 characters.

**Success `200`**

```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": null
}
```

**Error `400`** — old password incorrect

```json
{
  "success": false,
  "message": "Incorrect password",
  "data": null
}
```

---

## GET `/api/auth/user/profile` 🔒

Get the authenticated user's basic profile.

**Success `200`**

```json
{
  "success": true,
  "message": "User profile fetched",
  "data": {
    "user_id": "81434829-f84b-45a3-9bb6-aefc308440b3",
    "full_name": "John Doe",
    "email": "john@example.com",
    "avatar_url": "avatars/81434829-avatar",
    "is_verified": true,
    "created_at": "2026-01-01T10:00:00",
    "updated_at": "2026-01-10T12:00:00"
  }
}
```

---

## GET `/api/auth/user/profile/full` 🔒

Get the authenticated user's full profile including study stats.

**Success `200`**

```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "user_id": "81434829-f84b-45a3-9bb6-aefc308440b3",
    "full_name": "John Doe",
    "email": "john@example.com",
    "avatar_url": "avatars/81434829-avatar",
    "peak_performance_time": "morning",
    "total_study_hours": 4.5,
    "exams_completed": 9,
    "average_score": 82.3,
    "current_streak": 3,
    "longest_streak": 7,
    "created_at": "2026-01-01T10:00:00",
    "updated_at": "2026-01-10T12:00:00"
  }
}
```

---

## PATCH `/api/auth/user/profile` 🔒

Update the authenticated user's profile. All fields are optional.

**Request Body**

```json
{
  "full_name": "John Updated",
  "peak_performance_time": "evening"
}
```

**Success `200`**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user_id": "81434829-f84b-45a3-9bb6-aefc308440b3",
    "full_name": "John Updated",
    "email": "john@example.com",
    "avatar_url": null,
    "peak_performance_time": "evening",
    "total_study_hours": 4.5,
    "exams_completed": 9,
    "average_score": 82.3,
    "current_streak": 3,
    "longest_streak": 7,
    "created_at": "2026-01-01T10:00:00",
    "updated_at": "2026-01-15T09:00:00"
  }
}
```

---

## GET `/api/auth/user/avatar` 🔒

Stream the authenticated user's avatar image file.

**Success `200`**
Returns the raw image binary with the appropriate `Content-Type` header (e.g. `image/jpeg`, `image/png`, `image/webp`).

**Error `400`** — no avatar set

```json
{
  "success": false,
  "message": "No avatar set",
  "data": null
}
```

---

## PUT `/api/auth/user/profile/avatar` 🔒

Upload or replace the authenticated user's avatar.

**Request** — `multipart/form-data`
| Field | Type | Required |
|-------|------|----------|
| `file` | image file (JPEG, PNG, WebP) | yes |

**Success `200`**

```json
{
  "success": true,
  "message": "Avatar updated successfully",
  "data": {
    "user_id": "81434829-f84b-45a3-9bb6-aefc308440b3",
    "full_name": "John Doe",
    "email": "john@example.com",
    "avatar_url": "avatars/81434829-avatar",
    "is_verified": true,
    "created_at": "2026-01-01T10:00:00",
    "updated_at": "2026-01-15T09:00:00"
  }
}
```

**Error `400`** — unsupported file type

```json
{
  "success": false,
  "message": "Avatar must be a JPEG, PNG, or WebP image",
  "data": null
}
```

---

## DELETE `/api/auth/user/profile/avatar` 🔒

Remove the authenticated user's avatar.

**Success `200`**

```json
{
  "success": true,
  "message": "Avatar removed successfully",
  "data": {
    "user_id": "81434829-f84b-45a3-9bb6-aefc308440b3",
    "full_name": "John Doe",
    "email": "john@example.com",
    "avatar_url": null,
    "is_verified": true,
    "created_at": "2026-01-01T10:00:00",
    "updated_at": "2026-01-15T09:00:00"
  }
}
```

---

## DELETE `/api/auth/user` 🔒

Permanently delete the authenticated user's account and all associated data.

**Success `200`**

```json
{
  "success": true,
  "message": "Account deleted successfully",
  "data": null
}
```

---

# Materials `/api/material`

## GET `/api/material/` 🔒

Get all materials uploaded by the authenticated user.

**Success `200`**

```json
{
  "success": true,
  "message": "Materials fetched successfully",
  "data": [
    {
      "material_id": "a3f1c2d4-1234-5678-abcd-ef0123456789",
      "file_name": "lecture_notes.pdf",
      "file_type": "application/pdf",
      "file_size": 204800,
      "status": "processed",
      "collection_id": "b1e2d3c4-5678-1234-abcd-ef0123456789",
      "created_at": "2026-01-05T08:00:00"
    }
  ]
}
```

---

## GET `/api/material/{material_id}` 🔒

Get a single material by ID.

**Path Parameter**
| Param | Type | Description |
|-------|------|-------------|
| `material_id` | UUID string | ID of the material |

**Success `200`**

```json
{
  "success": true,
  "message": "Material fetched successfully",
  "data": {
    "material_id": "a3f1c2d4-1234-5678-abcd-ef0123456789",
    "file_name": "lecture_notes.pdf",
    "file_type": "application/pdf",
    "file_size": 204800,
    "status": "processed",
    "collection_id": "b1e2d3c4-5678-1234-abcd-ef0123456789",
    "created_at": "2026-01-05T08:00:00"
  }
}
```

**Error `403`** — material belongs to another user

```json
{
  "success": false,
  "message": "Access denied",
  "data": null
}
```

---

## GET `/api/material/{material_id}/download` 🔒

Download the raw file for a material.

**Path Parameter**
| Param | Type | Description |
|-------|------|-------------|
| `material_id` | UUID string | ID of the material |

**Success `200`**
Returns the raw file binary with `Content-Type` and `Content-Disposition: attachment; filename*=UTF-8''<encoded_name>` headers.

**Error `403`** — material belongs to another user

```json
{
  "success": false,
  "message": "Access denied",
  "data": null
}
```

---

## POST `/api/material/upload` 🔒

Upload a new material file.

**Request** — `multipart/form-data`
| Field | Type | Required |
|-------|------|----------|
| `file` | PDF or supported document | yes |

**Success `201`**

```json
{
  "success": true,
  "message": "Material uploaded successfully",
  "data": {
    "material_id": "a3f1c2d4-1234-5678-abcd-ef0123456789",
    "file_name": "lecture_notes.pdf",
    "file_type": "application/pdf",
    "file_size": 204800,
    "status": "processing",
    "collection_id": null,
    "created_at": "2026-01-05T08:00:00"
  }
}
```

**Error `400`** — unsupported file type

```json
{
  "success": false,
  "message": "File type not allowed",
  "data": null
}
```

---

## DELETE `/api/material/{material_id}` 🔒

Delete a material and its file from storage.

**Path Parameter**
| Param | Type | Description |
|-------|------|-------------|
| `material_id` | UUID string | ID of the material |

**Success `200`**

```json
{
  "success": true,
  "message": "Material deleted successfully",
  "data": null
}
```

**Error `404`**

```json
{
  "success": false,
  "message": "Material not found",
  "data": null
}
```

---

## POST `/api/material/preprocess` 🔒

Chunk, embed, and group a list of materials into a collection.

**Request Body**

```json
{
  "material_ids": [
    "a3f1c2d4-1234-5678-abcd-ef0123456789",
    "c4d5e6f7-8901-2345-abcd-ef0123456789"
  ]
}
```

**Success `200`**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "collection_id": "b1e2d3c4-5678-1234-abcd-ef0123456789",
    "user_id": "81434829-f84b-45a3-9bb6-aefc308440b3",
    "title": null,
    "description": null,
    "confidence": 0.0,
    "created_at": "2026-01-05T08:30:00"
  }
}
```

---

## POST `/api/material/analyze` 🔒

Queue an AI analysis job on a collection to extract chapters and metadata. This is an **asynchronous** operation — it returns a job ID immediately. Poll `GET /api/material/analyze/{job_id}/status` for the result.

> Rate limited to **2 requests per 60 seconds** per user.

**Request Body**

```json
{
  "collection_id": "b1e2d3c4-5678-1234-abcd-ef0123456789",
  "confidence": 0.85
}
```

**Success `202`**

```json
{
  "success": true,
  "message": "Analysis queued",
  "data": {
    "job_id": "a1b2c3d4-e5f6-7890-abcd-ef0123456789",
    "status": "pending"
  }
}
```

**Error `400`** — rate limit exceeded

```json
{
  "success": false,
  "message": "Analyze rate limit reached. Try again in 42s.",
  "data": null
}
```

---

## GET `/api/material/analyze/{job_id}/status` 🔒

Poll the status of an analysis job.

**Path Parameter**
| Param | Type | Description |
|-------|------|-------------|
| `job_id` | string | Job ID returned by `POST /api/material/analyze` |

**Success `200`** — job still running

```json
{
  "success": true,
  "message": "Job status fetched",
  "data": {
    "job_id": "a1b2c3d4-e5f6-7890-abcd-ef0123456789",
    "status": "pending"
  }
}
```

**Success `200`** — job completed

```json
{
  "success": true,
  "message": "Job status fetched",
  "data": {
    "job_id": "a1b2c3d4-e5f6-7890-abcd-ef0123456789",
    "status": "done",
    "data": {
      "document_title": "Introduction to Machine Learning",
      "main_description": "A comprehensive overview of ML concepts.",
      "total_chapters": 2,
      "chapters": [
        {
          "chapter_number": 1,
          "chapter_title": "Supervised Learning",
          "chapter_description": "Covers regression and classification.",
          "keywords": ["regression", "classification", "labels"]
        },
        {
          "chapter_number": 2,
          "chapter_title": "Unsupervised Learning",
          "chapter_description": "Covers clustering and dimensionality reduction.",
          "keywords": ["clustering", "PCA", "k-means"]
        }
      ]
    }
  }
}
```

**Success `200`** — job failed

```json
{
  "success": true,
  "message": "Job status fetched",
  "data": {
    "job_id": "a1b2c3d4-e5f6-7890-abcd-ef0123456789",
    "status": "failed",
    "error": "No chunks found for this collection"
  }
}
```

**Error `400`** — job not found or expired

```json
{
  "success": false,
  "message": "Job not found or expired",
  "data": null
}
```

---

## GET `/api/material/collections/{collection_id}/chapters` 🔒

List all chapters and their metadata for a given collection.

**Path Parameter**
| Param | Type | Description |
|-------|------|-------------|
| `collection_id` | UUID | ID of the collection |

**Success `200`**

```json
{
  "success": true,
  "message": "Chapters fetched successfully",
  "data": [
    {
      "chapter_id": "d1e2f3a4-1234-5678-abcd-ef0123456789",
      "collection_id": "b1e2d3c4-5678-1234-abcd-ef0123456789",
      "chapter_number": 1,
      "title": "Supervised Learning",
      "description": "Covers regression and classification.",
      "keywords": ["regression", "classification"],
      "created_at": "2026-01-05T09:00:00"
    }
  ]
}
```

**Error `404`** — collection not found or not owned by user

```json
{
  "success": false,
  "message": "Collection not found",
  "data": null
}
```

---

# Collections `/api/collections`

Collections organize materials, chapters, and study resources into cohesive units for learning.

## GET `/api/collections/` 🔒

Get all collections created by the authenticated user.

**Success `200`**

```json
{
  "success": true,
  "message": "Collections fetched successfully",
  "data": [
    {
      "collection_id": "b1e2d3c4-5678-1234-abcd-ef0123456789",
      "user_id": "81434829-f84b-45a3-9bb6-aefc308440b3",
      "title": "Introduction to Machine Learning",
      "description": "A comprehensive overview of ML concepts and applications",
      "confidence": 0.85,
      "created_at": "2026-01-05T08:30:00"
    }
  ]
}
```

---

## GET `/api/collections/{collection_id}` 🔒

Get a specific collection by ID.

**Path Parameter**
| Param | Type | Description |
|-------|------|-------------|
| `collection_id` | UUID | ID of the collection to fetch |

**Success `200`**

```json
{
  "success": true,
  "message": "Collection fetched successfully",
  "data": {
    "collection_id": "b1e2d3c4-5678-1234-abcd-ef0123456789",
    "user_id": "81434829-f84b-45a3-9bb6-aefc308440b3",
    "title": "Introduction to Machine Learning",
    "description": "A comprehensive overview of ML concepts and applications",
    "confidence": 0.85,
    "created_at": "2026-01-05T08:30:00"
  }
}
```

**Error `404`** — collection not found

```json
{
  "success": false,
  "message": "Collection not found",
  "data": null
}
```

**Error `403`** — collection belongs to another user

```json
{
  "success": false,
  "message": "Access denied",
  "data": null
}
```

---

## DELETE `/api/collections/{collection_id}` 🔒

Delete a collection and all its associated data.

**Path Parameter**
| Param | Type | Description |
|-------|------|-------------|
| `collection_id` | UUID | ID of the collection to delete |

**Success `200`**

```json
{
  "success": true,
  "message": "Collection deleted successfully",
  "data": null
}
```

**Error `404`** — collection not found

```json
{
  "success": false,
  "message": "Collection not found",
  "data": null
}
```

---

# Exams `/api/exam`

## POST `/api/exam/generate-exam` 🔒

Generate an exam for a collection based on selected chapters and settings.

**Request Body**

```json
{
  "collection_id": "b1e2d3c4-5678-1234-abcd-ef0123456789",
  "chapter_ids": ["d1e2f3a4-1234-5678-abcd-ef0123456789"],
  "question_count": 10,
  "difficulty": "Medium",
  "question_types": ["Multiple Choice", "True/False"]
}
```

> `difficulty` options: `Easy`, `Medium`, `Hard`, `Mixed`
> `question_types` options: `Multiple Choice`, `True/False`, `Fill in Blank`, `Matching`, `Short Answer`, `Coding`
> `question_count` range: 1–100, default 25

**Success `200`**

```json
{
  "success": true,
  "message": "Exam generated successfully",
  "data": {
    "exam_id": "f1a2b3c4-1234-5678-abcd-ef0123456789",
    "exam_title": "Machine Learning Quiz",
    "questions": [
      {
        "question_id": "g1h2i3j4-1234-5678-abcd-ef0123456789",
        "question_type": "Multiple Choice",
        "question_text": "What is the goal of supervised learning?",
        "difficulty": "Medium",
        "content": {
          "options": [
            "Clustering data",
            "Predicting labels",
            "Reducing dimensions",
            "Generating data"
          ],
          "correct_option_index": 1
        },
        "explanation": "Supervised learning uses labeled data to predict outputs."
      }
    ]
  }
}
```

---

## GET `/api/exam/results` 🔒

Get all exam submission results for the authenticated user.

**Success `200`**

```json
{
  "success": true,
  "message": "Exam results fetched successfully",
  "data": [
    {
      "submission_id": "h1i2j3k4-1234-5678-abcd-ef0123456789",
      "exam_id": "f1a2b3c4-1234-5678-abcd-ef0123456789",
      "exam_title": "Machine Learning Quiz",
      "total_score": 8.0,
      "max_score": 10.0,
      "status": "graded",
      "created_at": "2026-01-06T10:00:00"
    }
  ]
}
```

---

## POST `/api/exam/submit` 🔒

Submit answers for an exam and receive graded results.

**Request Body**

```json
{
  "exam_id": "f1a2b3c4-1234-5678-abcd-ef0123456789",
  "answers": {
    "g1h2i3j4-1234-5678-abcd-ef0123456789": "Predicting labels"
  }
}
```

> `answers` is a map of `question_id` → user's answer string.

**Success `200`**

```json
{
  "success": true,
  "message": "Exam submitted and graded successfully",
  "data": {
    "submission_id": "h1i2j3k4-1234-5678-abcd-ef0123456789",
    "exam_id": "f1a2b3c4-1234-5678-abcd-ef0123456789",
    "user_id": "81434829-f84b-45a3-9bb6-aefc308440b3",
    "total_score": 8.0,
    "max_score": 10.0,
    "status": "graded",
    "created_at": "2026-01-06T10:00:00",
    "graded_items": [
      {
        "graded_item_id": "i1j2k3l4-1234-5678-abcd-ef0123456789",
        "question_id": "g1h2i3j4-1234-5678-abcd-ef0123456789",
        "user_answer": "Predicting labels",
        "is_correct": true,
        "score_attained": 1.0,
        "feedback_note": "Correct!",
        "graded_by": "deterministic"
      }
    ]
  }
}
```

---

# Notes `/api/notes`

> All note generation endpoints take a `collection_id` and return the generated note. Each note type also exposes a GET by collection and a GET for all notes belonging to the authenticated user.

## POST `/api/notes/cornell` 🔒

Generate a Cornell note for a collection.

**Request Body**

```json
{
  "collection_id": "b1e2d3c4-5678-1234-abcd-ef0123456789"
}
```

**Success `201`**

```json
{
  "success": true,
  "message": "Cornell note generated successfully",
  "data": {
    "note_id": "n1o2t3e4-1234-5678-abcd-ef0123456789",
    "collection_id": "b1e2d3c4-5678-1234-abcd-ef0123456789",
    "title": "Supervised Learning Notes",
    "method": "cornell",
    "cues": [
      { "keyword": "Regression", "content": "Predicts continuous values." },
      { "keyword": "Classification", "content": "Predicts discrete categories." }
    ],
    "summary": "Supervised learning uses labeled data to train models.",
    "created_at": "2026-01-06T11:00:00"
  }
}
```

---

## GET `/api/notes/cornell/{collection_id}` 🔒

Get all Cornell notes for a collection.

**Path Parameter**
| Param | Type | Description |
|-------|------|-------------|
| `collection_id` | UUID | ID of the collection |

**Success `200`**

```json
{
  "success": true,
  "message": "Cornell notes fetched successfully",
  "data": [
    {
      "note_id": "n1o2t3e4-1234-5678-abcd-ef0123456789",
      "collection_id": "b1e2d3c4-5678-1234-abcd-ef0123456789",
      "title": "Supervised Learning Notes",
      "method": "cornell",
      "cues": [
        { "keyword": "Regression", "content": "Predicts continuous values." }
      ],
      "summary": "Supervised learning uses labeled data to train models.",
      "created_at": "2026-01-06T11:00:00"
    }
  ]
}
```

---

## GET `/api/notes/cornell` 🔒

Get all Cornell notes for the authenticated user across all collections.

**Success `200`**

```json
{
  "success": true,
  "message": "Cornell notes fetched successfully",
  "data": [ ]
}
```

---

## DELETE `/api/notes/cornell/{note_id}` 🔒

Delete a Cornell note by ID.

**Path Parameter**
| Param | Type | Description |
|-------|------|-------------|
| `note_id` | UUID | ID of the note to delete |

**Success `200`**

```json
{
  "success": true,
  "message": "Cornell note deleted successfully",
  "data": null
}
```

---

## POST `/api/notes/sentence` 🔒

Generate a Sentence note for a collection.

**Request Body**

```json
{
  "collection_id": "b1e2d3c4-5678-1234-abcd-ef0123456789"
}
```

**Success `201`**

```json
{
  "success": true,
  "message": "Sentence note generated successfully",
  "data": {
    "note_id": "s1e2n3t4-1234-5678-abcd-ef0123456789",
    "collection_id": "b1e2d3c4-5678-1234-abcd-ef0123456789",
    "title": "Machine Learning Sentence Notes",
    "method": "sentence",
    "sections": [
      { "content": "Supervised learning uses labeled data to train models." },
      { "content": "Regression predicts continuous numerical values." }
    ],
    "created_at": "2026-01-06T11:30:00"
  }
}
```

---

## GET `/api/notes/sentence/{collection_id}` 🔒

Get all Sentence notes for a collection.

**Success `200`**

```json
{
  "success": true,
  "message": "Sentence notes fetched successfully",
  "data": [ ]
}
```

---

## GET `/api/notes/sentence` 🔒

Get all Sentence notes for the authenticated user.

**Success `200`**

```json
{
  "success": true,
  "message": "Sentence notes fetched successfully",
  "data": [ ]
}
```

---

## DELETE `/api/notes/sentence/{note_id}` 🔒

Delete a Sentence note by ID.

**Success `200`**

```json
{
  "success": true,
  "message": "Sentence note deleted successfully",
  "data": null
}
```

---

## POST `/api/notes/boxing` 🔒

Generate a Boxing note for a collection.

**Request Body**

```json
{
  "collection_id": "b1e2d3c4-5678-1234-abcd-ef0123456789"
}
```

**Success `201`**

```json
{
  "success": true,
  "message": "Boxing note generated successfully",
  "data": {
    "note_id": "b1o2x3i4-1234-5678-abcd-ef0123456789",
    "collection_id": "b1e2d3c4-5678-1234-abcd-ef0123456789",
    "title": "Machine Learning Boxing Notes",
    "method": "boxing",
    "boxes": [
      {
        "title": "Supervised Learning",
        "items": ["Regression", "Classification", "Ensemble Methods"]
      }
    ],
    "created_at": "2026-01-06T12:00:00"
  }
}
```

---

## GET `/api/notes/boxing/{collection_id}` 🔒

Get all Boxing notes for a collection.

**Success `200`**

```json
{
  "success": true,
  "message": "Boxing notes fetched successfully",
  "data": [ ]
}
```

---

## GET `/api/notes/boxing` 🔒

Get all Boxing notes for the authenticated user.

**Success `200`**

```json
{
  "success": true,
  "message": "Boxing notes fetched successfully",
  "data": [ ]
}
```

---

## DELETE `/api/notes/boxing/{note_id}` 🔒

Delete a Boxing note by ID.

**Success `200`**

```json
{
  "success": true,
  "message": "Boxing note deleted successfully",
  "data": null
}
```

---

## POST `/api/notes/outline` 🔒

Generate an Outline note for a collection.

**Request Body**

```json
{
  "collection_id": "b1e2d3c4-5678-1234-abcd-ef0123456789"
}
```

**Success `201`**

```json
{
  "success": true,
  "message": "Outline note generated successfully",
  "data": {
    "note_id": "o1u2t3l4-1234-5678-abcd-ef0123456789",
    "collection_id": "b1e2d3c4-5678-1234-abcd-ef0123456789",
    "title": "Machine Learning Outline",
    "method": "outline",
    "sections": [
      {
        "heading": "1. Supervised Learning",
        "bullets": ["Uses labeled data", "Goal: Predict outputs from inputs"]
      }
    ],
    "created_at": "2026-01-06T12:30:00"
  }
}
```

---

## GET `/api/notes/outline/{collection_id}` 🔒

Get all Outline notes for a collection.

**Success `200`**

```json
{
  "success": true,
  "message": "Outline notes fetched successfully",
  "data": [ ]
}
```

---

## GET `/api/notes/outline` 🔒

Get all Outline notes for the authenticated user.

**Success `200`**

```json
{
  "success": true,
  "message": "Outline notes fetched successfully",
  "data": [ ]
}
```

---

## DELETE `/api/notes/outline/{note_id}` 🔒

Delete an Outline note by ID.

**Success `200`**

```json
{
  "success": true,
  "message": "Outline note deleted successfully",
  "data": null
}
```

---

## POST `/api/notes/mind-map` 🔒

Generate a Mind Map note for a collection.

**Request Body**

```json
{
  "collection_id": "b1e2d3c4-5678-1234-abcd-ef0123456789"
}
```

**Success `201`**

```json
{
  "success": true,
  "message": "Mind map note generated successfully",
  "data": {
    "note_id": "m1i2n3d4-1234-5678-abcd-ef0123456789",
    "collection_id": "b1e2d3c4-5678-1234-abcd-ef0123456789",
    "title": "Machine Learning Mind Map",
    "method": "mind_map",
    "root": {
      "label": "Machine Learning",
      "notes": "Core ML concepts",
      "children": [
        {
          "label": "Supervised Learning",
          "notes": "Uses labeled data",
          "children": []
        }
      ]
    },
    "created_at": "2026-01-06T13:00:00"
  }
}
```

---

## GET `/api/notes/mind-map/{collection_id}` 🔒

Get all Mind Map notes for a collection.

**Success `200`**

```json
{
  "success": true,
  "message": "Mind map notes fetched successfully",
  "data": [ ]
}
```

---

## GET `/api/notes/mind-map` 🔒

Get all Mind Map notes for the authenticated user.

**Success `200`**

```json
{
  "success": true,
  "message": "Mind map notes fetched successfully",
  "data": [ ]
}
```

---

## DELETE `/api/notes/mind-map/{note_id}` 🔒

Delete a Mind Map note by ID.

**Success `200`**

```json
{
  "success": true,
  "message": "Mind map note deleted successfully",
  "data": null
}
```

---

## POST `/api/notes/charting` 🔒

Generate a Charting note for a collection.

**Request Body**

```json
{
  "collection_id": "b1e2d3c4-5678-1234-abcd-ef0123456789"
}
```

**Success `201`**

```json
{
  "success": true,
  "message": "Charting note generated successfully",
  "data": {
    "note_id": "c1h2a3r4-1234-5678-abcd-ef0123456789",
    "collection_id": "b1e2d3c4-5678-1234-abcd-ef0123456789",
    "title": "Machine Learning Comparison Chart",
    "method": "charting",
    "columns": ["Algorithm", "Type", "Best For", "Complexity"],
    "rows": [
      ["Linear Regression", "Supervised", "Linear relationships", "O(n)"],
      ["K-Means", "Unsupervised", "Clustering", "O(nkd)"]
    ],
    "created_at": "2026-01-06T13:30:00"
  }
}
```

---

## GET `/api/notes/charting/{collection_id}` 🔒

Get all Charting notes for a collection.

**Success `200`**

```json
{
  "success": true,
  "message": "Charting notes fetched successfully",
  "data": [ ]
}
```

---

## GET `/api/notes/charting` 🔒

Get all Charting notes for the authenticated user.

**Success `200`**

```json
{
  "success": true,
  "message": "Charting notes fetched successfully",
  "data": [ ]
}
```

---

## DELETE `/api/notes/charting/{note_id}` 🔒

Delete a Charting note by ID.

**Success `200`**

```json
{
  "success": true,
  "message": "Charting note deleted successfully",
  "data": null
}
```

---

# Study Methods `/api/study`

> All study method endpoints take a `collection_id` and return the generated plan or session.

## POST `/api/study/pomodoro` 🔒

Generate a Pomodoro focus plan for a collection.

**Request Body**

```json
{
  "collection_id": "b1e2d3c4-5678-1234-abcd-ef0123456789"
}
```

**Success `201`**

```json
{
  "success": true,
  "message": "Pomodoro plan generated successfully",
  "data": {
    "id": "p1o2m3o4-1234-5678-abcd-ef0123456789",
    "collection_id": "b1e2d3c4-5678-1234-abcd-ef0123456789",
    "title": "ML Study Plan",
    "sessions": [
      {
        "session_number": 1,
        "task": "Review Supervised Learning",
        "duration_minutes": 25,
        "break_minutes": 5
      }
    ],
    "created_at": "2026-01-07T08:00:00"
  }
}
```

---

## GET `/api/study/pomodoro/{collection_id}` 🔒

Get all Pomodoro plans for a collection.

**Success `200`**

```json
{
  "success": true,
  "message": "Pomodoro plans fetched successfully",
  "data": [ ]
}
```

---

## POST `/api/study/feynman` 🔒

Generate a Feynman explanation for a collection.

**Request Body**

```json
{
  "collection_id": "b1e2d3c4-5678-1234-abcd-ef0123456789"
}
```

**Success `201`**

```json
{
  "success": true,
  "message": "Feynman explanation generated successfully",
  "data": {
    "id": "f1e2y3n4-1234-5678-abcd-ef0123456789",
    "collection_id": "b1e2d3c4-5678-1234-abcd-ef0123456789",
    "concept": "Supervised Learning",
    "simple_explanation": "It's like teaching a child with examples and correct answers.",
    "key_points": [
      "Uses labeled data with known inputs and outputs",
      "Model learns the mapping between inputs and outputs"
    ],
    "knowledge_gaps": [
      "How to handle noisy or incorrect labels"
    ],
    "created_at": "2026-01-07T08:30:00"
  }
}
```

---

## GET `/api/study/feynman/{collection_id}` 🔒

Get all Feynman explanations for a collection.

**Success `200`**

```json
{
  "success": true,
  "message": "Feynman explanations fetched successfully",
  "data": [ ]
}
```

---

## POST `/api/study/leitner` 🔒

Generate a Leitner System (spaced repetition flashcards) for a collection.

**Request Body**

```json
{
  "collection_id": "b1e2d3c4-5678-1234-abcd-ef0123456789"
}
```

**Success `201`**

```json
{
  "success": true,
  "message": "Leitner system generated successfully",
  "data": {
    "id": "l1e2i3t4-1234-5678-abcd-ef0123456789",
    "collection_id": "b1e2d3c4-5678-1234-abcd-ef0123456789",
    "title": "ML Flashcards",
    "boxes": [
      {
        "box_number": 1,
        "cards": [
          {
            "question": "What is overfitting?",
            "answer": "When a model memorizes training data instead of learning general patterns."
          }
        ]
      }
    ],
    "created_at": "2026-01-07T09:00:00"
  }
}
```

---

## GET `/api/study/leitner/{collection_id}` 🔒

Get all Leitner systems for a collection.

**Success `200`**

```json
{
  "success": true,
  "message": "Leitner systems fetched successfully",
  "data": [ ]
}
```

---

## POST `/api/study/sq3r` 🔒

Generate an SQ3R guide for a collection.

**Request Body**

```json
{
  "collection_id": "b1e2d3c4-5678-1234-abcd-ef0123456789"
}
```

**Success `201`**

```json
{
  "success": true,
  "message": "SQ3R guide generated successfully",
  "data": {
    "id": "s1q2r3r4-1234-5678-abcd-ef0123456789",
    "collection_id": "b1e2d3c4-5678-1234-abcd-ef0123456789",
    "survey": {
      "headings": ["Supervised Learning", "Model Evaluation"],
      "key_terms": ["regression", "accuracy", "loss"]
    },
    "questions": [
      "What is the difference between regression and classification?"
    ],
    "recite_points": [
      "Supervised learning requires labeled data."
    ],
    "review_summary": "This chapter covers the fundamentals of supervised learning.",
    "created_at": "2026-01-07T09:30:00"
  }
}
```

---

## GET `/api/study/sq3r/{collection_id}` 🔒

Get all SQ3R guides for a collection.

**Success `200`**

```json
{
  "success": true,
  "message": "SQ3R guides fetched successfully",
  "data": [ ]
}
```

---

## POST `/api/study/active-recall` 🔒

Generate an Active Recall session for a collection.

**Request Body**

```json
{
  "collection_id": "b1e2d3c4-5678-1234-abcd-ef0123456789"
}
```

**Success `201`**

```json
{
  "success": true,
  "message": "Active recall session generated successfully",
  "data": {
    "id": "a1c2t3i4-1234-5678-abcd-ef0123456789",
    "collection_id": "b1e2d3c4-5678-1234-abcd-ef0123456789",
    "topic": "Supervised Learning",
    "prompts": [
      {
        "question": "Explain how a decision tree makes predictions.",
        "hint": "Think about how it splits data at each node based on feature values."
      }
    ],
    "created_at": "2026-01-07T10:00:00"
  }
}
```

---

## GET `/api/study/active-recall/{collection_id}` 🔒

Get all Active Recall sessions for a collection.

**Success `200`**

```json
{
  "success": true,
  "message": "Active recall sessions fetched successfully",
  "data": [ ]
}
```

---

# Chat `/api/chat`

Interactive chat interface for asking questions and receiving AI-generated answers within a session.

## POST `/api/chat/session` 🔒

Create a new chat session. No request body required. The session title defaults to `"New Chat"` and is automatically renamed after the first question is asked.

**Success `201`**

```json
{
  "success": true,
  "message": "Chat session created successfully",
  "data": {
    "session_id": "s1o2m3e4-1234-5678-abcd-ef0123456789",
    "title": "New Chat",
    "created_at": "2026-01-08T10:00:00"
  }
}
```

---

## POST `/api/chat/ask` 🔒

Ask a question and get an AI-generated answer. Optionally continue an existing session.

**Request Body**

```json
{
  "question": "Explain what overfitting is and how to prevent it?",
  "session_id": "s1o2m3e4-1234-5678-abcd-ef0123456789"
}
```

> `session_id` is optional. If omitted, a new session is created automatically. If provided, the question is appended to the existing session.

**Success `201`**

```json
{
  "success": true,
  "message": "Answer generated successfully",
  "data": {
    "session_id": "s1o2m3e4-1234-5678-abcd-ef0123456789",
    "answer": "Overfitting occurs when a model learns the training data too well..."
  }
}
```

**Error `400`** — missing parameters

```json
{
  "success": false,
  "message": "Collection not found",
  "data": null
}
```

---

## GET `/api/chat/sessions` 🔒

Get all chat sessions for the authenticated user.

**Success `200`**

```json
{
  "success": true,
  "message": "Sessions fetched successfully",
  "data": [
    {
      "session_id": "s1o2m3e4-1234-5678-abcd-ef0123456789",
      "title": "ML Concepts Discussion",
      "created_at": "2026-01-08T10:00:00"
    }
  ]
}
```

---

## GET `/api/chat/sessions/{session_id}/messages` 🔒

Get all messages in a specific chat session.

**Path Parameter**
| Param | Type | Description |
|-------|------|-------------|
| `session_id` | UUID | ID of the chat session |

**Success `200`**

```json
{
  "success": true,
  "message": "Messages fetched successfully",
  "data": [
    {
      "message_id": "m1e2s3s4-1234-5678-abcd-ef0123456789",
      "role": "user",
      "content": "What is overfitting?",
      "created_at": "2026-01-08T10:05:00"
    },
    {
      "message_id": "m2f3s4s5-2345-6789-abcd-ef0123456789",
      "role": "assistant",
      "content": "Overfitting occurs when a model learns the training data too well...",
      "created_at": "2026-01-08T10:05:15"
    }
  ]
}
```

**Error `404`** — session not found

```json
{
  "success": false,
  "message": "Session not found",
  "data": null
}
```

**Error `403`** — session belongs to another user

```json
{
  "success": false,
  "message": "Access denied",
  "data": null
}
```
