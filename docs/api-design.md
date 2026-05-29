# API Design

> REST API ผ่าน Next.js App Router (`app/api/`)

## สรุป Endpoints

| Method | Path | Auth | คำอธิบาย |
|--------|------|------|----------|
| `POST` | `/api/auth/sign-up` | — | สมัครสมาชิก USER หรือ ADMIN |
| `POST` | `/api/auth/sign-in` | — | เข้าสู่ระบบ |
| `POST` | `/api/auth/sign-out` | — | ออกจากระบบ (ลบ session cookie) |
| `GET` | `/api/auth/session` | cookie | ตรวจสอบ session ปัจจุบัน |
| `GET` | `/api/blog` | ADMIN | รายการบทความทั้งหมด (admin) |
| `POST` | `/api/blog` | ADMIN | สร้างบทความใหม่ |
| `GET` | `/api/blog/:id` | ADMIN | ดึงบทความตาม id |
| `PATCH` | `/api/blog/:id` | ADMIN | แก้ไขบทความ |
| `GET` | `/api/comments?slug=` | — | คอมเมนต์ที่อนุมัติแล้วของบทความ |
| `GET` | `/api/comments?status=` | ADMIN | คอมเมนต์ตามสถานะ (moderation) |
| `POST` | `/api/comments` | — | ส่งคอมเมนต์ใหม่ (status = PENDING) |
| `PATCH` | `/api/comments/:id/approve` | ADMIN | อนุมัติคอมเมนต์ |
| `PATCH` | `/api/comments/:id/reject` | ADMIN | ปฏิเสธคอมเมนต์ |

> หน้า blog สาธารณะ (`/blog`, `/blog/[slug]`) ใช้ **Server Components + Prisma โดยตรง** ไม่ผ่าน REST API เพื่อลด round-trip และ SEO ที่ดีขึ้น

---

## Authentication

### Session Model

- Cookie ชื่อ `session` (HttpOnly)
- Token format: `{base64url(payload)}.{hmac-sha256-signature}`
- Payload: `{ sub: userId, role, exp, n }`
- TTL: 8 ชั่วโมง
- Secret: env `AUTH_SECRET` (fallback `ADMIN_SESSION_SECRET`, `ADMIN_API_KEY`)

### Rate Limiting (in-memory)

| Endpoint | Limit |
|----------|-------|
| `POST /api/auth/sign-in` | 10 ครั้ง / 15 นาที / IP |
| `POST /api/auth/sign-up` | 5 ครั้ง / 15 นาที / IP |

---

## Auth Endpoints

### `POST /api/auth/sign-up`

**Request body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "ชื่อผู้ใช้",
  "role": "USER",
  "signupCode": "required-when-role-is-ADMIN"
}
```

**Responses:**

| Status | เงื่อนไข |
|--------|---------|
| `201` | สำเร็จ — ตั้ง session cookie |
| `400` | ข้อมูลไม่ครบ / email ไม่ถูกต้อง / password สั้นเกินไป |
| `403` | ADMIN signup code ไม่ถูกต้อง |
| `409` | email ซ้ำ |
| `429` | rate limit |

### `POST /api/auth/sign-in`

**Request body:**

```json
{
  "email": "admin@example.com",
  "password": "password123",
  "role": "ADMIN"
}
```

**Responses:**

| Status | เงื่อนไข |
|--------|---------|
| `200` | สำเร็จ — ตั้ง session cookie |
| `401` | email/password ไม่ถูก / role ไม่ตรง |
| `429` | rate limit |

### `GET /api/auth/session`

**Response (authenticated):**

```json
{
  "authenticated": true,
  "user": {
    "id": "clx...",
    "email": "admin@example.com",
    "name": "Admin",
    "role": "ADMIN"
  }
}
```

**Response (guest):**

```json
{ "authenticated": false }
```

---

## Blog Endpoints (Admin only)

### `POST /api/blog`

**Request body:**

```json
{
  "title": "ชื่อบทความ",
  "slug": "optional-slug",
  "summary": "สรุปสั้น",
  "content": "เนื้อหาเต็ม",
  "coverUrl": "https://...",
  "images": ["https://..."],
  "isPublished": true
}
```

**Responses:** `201` | `400` | `401` | `409` (slug ซ้ำ)

### `PATCH /api/blog/:id`

Partial update — ส่งเฉพาะ field ที่ต้องการเปลี่ยน

**Responses:** `200` | `400` | `401` | `404` | `409`

---

## Comment Endpoints

### `POST /api/comments`

**Request body:**

```json
{
  "name": "ชื่อผู้ส่ง",
  "content": "ข้อความคอมเมนต์ภาษาไทย",
  "slug": "welcome"
}
```

**Validation:**

- `name`, `content` ต้องเป็นภาษาไทยและตัวเลขเท่านั้น
- บทความต้องมีอยู่และ `isPublished = true`

**Responses:** `201` | `400` | `404`

### `GET /api/comments?slug=welcome`

คืนเฉพาะคอมเมนต์ `status = APPROVED` เรียง `createdAt asc`

### `GET /api/comments?status=PENDING`

Admin only — คืนคอมเมนต์ตามสถานะ เรียง `createdAt desc`

### `PATCH /api/comments/:id/approve`

เปลี่ยน `PENDING → APPROVED` เท่านั้น

### `PATCH /api/comments/:id/reject`

เปลี่ยน `PENDING → REJECTED` เท่านั้น

---

## Security Headers

Middleware (`proxy.ts`) ใส่ headers บน API routes:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

Admin routes ถูก guard ทั้งใน middleware และ `requireAdmin()` ใน route handler (defense in depth)
