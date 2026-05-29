# Aurora Blog

บล็อกพร้อมระบบคอมเมนต์ที่ต้องอนุมัติ — สร้างด้วย Next.js 16, Prisma, PostgreSQL

## Features

- หน้ารวม Blog — ค้นหาชื่อเรื่อง, pagination 10 รายการ/หน้า
- หน้าบทความ — อ่านเนื้อหา, ดูจำนวน view, แสดงความคิดเห็น
- ระบบคอมเมนต์ — ส่งได้โดยไม่ login, ต้องรอ admin อนุมัติก่อนแสดง
- Admin Dashboard — จัดการบทความ (CRUD) + moderation คอมเมนต์
- Auth — สมัคร/เข้าสู่ระบบ USER และ ADMIN (admin signup ต้องมีรหัส)
- Dark mode — รองรับ light/dark/system theme

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, shadcn/ui |
| Animation | Motion |
| Database | PostgreSQL |
| ORM | Prisma 7 |
| Auth | Signed HttpOnly session cookie (HMAC-SHA256) |
| Language | TypeScript 5 |

---

## Prerequisites

- **Node.js** `>=22.12.0 <23` (ดู `.nvmrc`)
- **PostgreSQL** หรือใช้ `prisma dev` สำหรับ local DB

---

## Getting Started

### 1. Clone & install

```bash
git clone <repo-url>
cd blog-assessment
npm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

แก้ไขค่าใน `.env`:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `DIRECT_DATABASE_URL` | optional | ใช้กับ seed/studio เมื่อ URL เป็น `prisma+postgres://` |
| `AUTH_SECRET` | ✅ | คีย์ลงนาม session (อย่างน้อย 32 ตัวอักษร) |
| `ADMIN_SIGNUP_CODE` | ✅ | รหัสสำหรับสมัคร admin |

### 3. Database setup

**Option A — Prisma local dev database:**

```bash
npm run db:local    # start local PostgreSQL via Prisma
npm run db:push     # apply schema
npm run db:seed     # seed 11 sample articles
```

**Option B — Existing PostgreSQL:**

```bash
npm run db:push
npm run db:seed
```

### 4. Run development server

```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) — redirect ไป `/blog` อัตโนมัติ

### 5. Create admin account

1. ตั้ง `ADMIN_SIGNUP_CODE` ใน `.env`
2. ไป [http://localhost:3000/admin/sign-up](http://localhost:3000/admin/sign-up)
3. กรอก email, name, password และรหัส admin
4. เข้า [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |
| `npm run db:local` | Start Prisma local PostgreSQL |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed sample articles |
| `npm run db:studio` | Open Prisma Studio |

---

## Project Structure

```
blog-assessment/
├── app/                    # Next.js App Router (pages + API)
│   ├── api/                # REST API routes
│   ├── blog/               # Public blog pages
│   ├── admin/              # Admin pages
│   └── globals.css         # Design tokens + utilities
├── components/
│   ├── blog/               # Blog UI components
│   ├── admin/              # Admin UI components
│   ├── auth/               # Auth form
│   └── ui/                 # shadcn/ui primitives
├── hooks/                  # Custom React hooks
├── lib/                    # Shared utilities (auth, prisma, validation)
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed data
└── docs/                   # Design documentation
```

---

## Documentation

เอกสารออกแบบระบบ (ตามข้อกำหนดการส่งงาน):

| Document | Description |
|----------|-------------|
| [Database Schema](docs/database-schema.md) | ER diagram, ตาราง, index, เหตุผลการออกแบบ DB |
| [API Design](docs/api-design.md) | REST endpoints, request/response, auth |
| [Workflow](docs/workflow.md) | Flow การทำงาน + sequence diagrams |
| [Design Rationale](docs/design-rationale.md) | เหตุผลเลือก tech stack, architecture, security |

---

## Assumptions & Limitations

### Assumptions (สมมติฐาน)

- ผู้ส่งคอมเมนต์ไม่จำเป็นต้อง login — กรอกชื่อเองได้
- คอมเมนต์รองรับเฉพาะภาษาไทยและตัวเลข (ตาม requirement)
- รูปภาพบทความใช้ URL ภายนอก ไม่มี file upload
- Admin มีเพียง 1 role (`ADMIN`) — ไม่แยก editor/moderator
- Single-instance deployment — rate limit ใช้ in-memory

### Limitations (ข้อจำกัด)

- Session เป็น stateless cookie — revoke ก่อนหมดอายุทำไม่ได้โดยตรง
- Rate limiting reset เมื่อ restart server
- ไม่มี email verification / password reset
- ไม่มี category, tags, RSS feed (ระบุใน roadmap)
- Comment ไม่มี FK ไป BlogArticle ระดับ DB (validate ใน API)
- `components/home/landing.tsx` และ `components/magic/*` ยังไม่ได้ wire กับ route

---

## Progress Status

### ✅ ทำเสร็จแล้ว

- [x] Database schema (User, BlogArticle, Comment) + seed 11 บทความ
- [x] หน้ารวม Blog — search, pagination, article cards
- [x] หน้าบทความ — cover, gallery, view count, prose reading
- [x] ระบบคอมเมนต์ — ส่ง, validate ไทย+ตัวเลข, moderation workflow
- [x] Auth — sign-up/sign-in/sign-out/session (USER + ADMIN)
- [x] Admin Dashboard — CRUD บทความ + approve/reject คอมเมนต์
- [x] UI redesign — editorial style, dark mode, responsive, mobile menu
- [x] Clean Architecture — hooks, kebab-case components, layer separation
- [x] Security — rate limit, HMAC session, security headers, password hash
- [x] Documentation — README + docs/ (schema, API, workflow, rationale)

### 🔜 ถ้ามีเวลาเพิ่ม จะทำต่อ

1. **File upload** — อัปโหลดรูปปก/แกลเลอรี่แทน URL manual
2. **Category & Tags** — จัดหมวดหมู่บทความ + filter
3. **Email notifications** — แจ้ง admin เมื่อมีคอมเมนต์ใหม่
4. **Password reset** — flow ลืมรหัสผ่าน
5. **Unit & E2E tests** — Jest + Playwright ครอบคลุม API และ critical flows
6. **Redis session store** — revoke session + rate limit ที่ scale ได้
7. **RSS/Atom feed** — ให้ผู้อ่าน subscribe เนื้อหาใหม่
8. **Wire landing page** — ใช้ `components/home/landing.tsx` เป็นหน้าแรกแทน redirect

---

## License

Private — assessment project.
