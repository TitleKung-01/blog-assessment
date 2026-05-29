# Design Rationale — เหตุผลในการออกแบบ

## 1. Tech Stack

| เทคโนโลยี | เหตุผลที่เลือก |
|-----------|---------------|
| **Next.js 16 App Router** | Server Components ลด JS ฝั่ง client, SEO ดี, routing + API ใน repo เดียว |
| **React 19** | ใช้คู่ Next.js 16 ล่าสุด |
| **TypeScript** | type safety ข้าม frontend/backend |
| **Prisma + PostgreSQL** | schema-as-code, migration, type-safe queries |
| **Tailwind CSS v4** | utility-first, design tokens ผ่าน CSS variables |
| **shadcn/ui** | component ที่ copy มาเป็นเจ้าของ ปรับแต่งได้เต็มที่ |
| **Motion** | micro-interaction บน client components |

## 2. Database Design

### แยก `BlogArticle` กับ `Comment` โดย comment อ้างอิง slug

**ทางเลือกที่พิจารณา:**

| แนวทาง | ข้อดี | ข้อเสีย |
|--------|-------|---------|
| FK `articleId` | referential integrity | ต้อง join ทุกครั้ง, slug เปลี่ยนต้อง cascade |
| FK `slug` (logical) ✅ | ตรงกับ URL routing, query ง่าย | ไม่มี DB-level FK |

**ตัดสินใจ:** ใช้ `slug` เพราะ URL ของบทความใช้ slug เป็นหลัก และ MVP ไม่มีการลบบทความ

### Comment status เป็น enum แทน boolean

- รองรับ 3 สถานะ: `PENDING`, `APPROVED`, `REJECTED`
- Admin dashboard filter ตาม status ได้ชัดเจน
- ขยายเป็น `SPAM`, `ARCHIVED` ในอนาคตได้

### Index strategy

- Index ตาม query pattern จริง (published list, comment by slug+status, search by title)
- ไม่ over-index ใน MVP

## 3. API Design

### Server Components สำหรับ public pages, REST API สำหรับ mutations

| งาน | วิธี | เหตุผล |
|-----|------|--------|
| อ่านบทความ / คอมเมนต์ที่ approve | Prisma ใน Server Component | ไม่ต้อง expose API, โหลดเร็ว, SEO |
| ส่งคอมเมนต์, auth, admin CRUD | REST API routes | ต้องการ client interaction + validation |

### Defense in depth สำหรับ admin

1. `proxy.ts` middleware — block ก่อนถึง handler
2. `requireAdmin()` ใน route handler — ตรวจซ้ำ
3. Client-side redirect ใน admin dashboard — UX

### Session แบบ signed cookie แทน JWT ใน localStorage

- HttpOnly cookie ป้องกัน XSS อ่าน token
- HMAC-SHA256 sign payload — ไม่ต้องเก็บ session ใน DB (stateless)
- Trade-off: revoke session ยาก — ยอมรับได้ใน MVP

## 4. UI / UX Design

### Editorial publishing style

- **Whitespace มาก** — อ่านสบายตา โดยเฉพาะภาษาไทย
- **`.prose-article`** — line-height 1.9, font-size 1.0625rem
- **Container widths:** `max-w-4xl` (list), `max-w-2xl` (reading column)
- **Soft shadows** แทน card border หนา — ดู professional ไม่รก

### Clean Architecture ใน frontend

```
app/ (pages) → components/ (UI) → hooks/ (state) → api/ + lib/ (data)
```

- แยก `useSession`, `useAdminComments` ออกจาก component
- ย้ายไฟล์เป็น kebab-case (`comment-list.tsx`, `admin-dashboard.tsx`)
- Server Components เป็นค่าเริ่มต้น — `'use client'` เฉพาะที่จำเป็น

## 5. Security Decisions

| มาตรการ | รายละเอียด |
|---------|-----------|
| Password hashing | bcrypt ผ่าน `lib/password.ts` |
| Rate limiting | in-memory per IP บน auth endpoints |
| Timing-safe compare | ป้องกัน timing attack บน HMAC verify |
| Input validation | Thai+numbers สำหรับ comment, email/password rules |
| Security headers | X-Frame-Options, nosniff, Referrer-Policy |
| Admin signup code | env `ADMIN_SIGNUP_CODE` — ไม่เปิด admin signup ฟรี |

## 6. สิ่งที่ยังไม่ทำ (และเหตุผล)

| Feature | เหตุผลที่เลื่อน |
|---------|---------------|
| Email verification | เกินขอบเขต MVP |
| File upload รูป | ใช้ URL string แทน — ลด complexity |
| Redis session store | stateless cookie เพียงพอสำหรับ assessment |
| Unit tests | เน้น deliver working product + documentation |
| Category/Tags | ระบุใน roadmap แต่ยังไม่จำเป็นสำหรับ core flow |
