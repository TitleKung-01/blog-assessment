# Workflow — Flow การทำงาน

## 1. ผู้อ่านอ่านบทความ

```mermaid
sequenceDiagram
    participant Browser
    participant NextJS as Next.js Server
    participant DB as PostgreSQL

    Browser->>NextJS: GET /blog
    NextJS->>DB: findMany BlogArticle (published, paginated)
    DB-->>NextJS: articles[]
    NextJS-->>Browser: HTML (Server Component)

    Browser->>NextJS: GET /blog/welcome
    NextJS->>DB: findUnique by slug
    NextJS->>DB: increment viewCount
    NextJS->>DB: findMany Comment (slug, APPROVED)
    DB-->>NextJS: article + comments
    NextJS-->>Browser: HTML article page
```

**Search & Pagination**

- ค้นหา: `GET /blog?q=keyword&page=1`
- Server-side filter ด้วย Prisma `contains` บน `title`
- 10 บทความต่อหน้า

---

## 2. ผู้เยี่ยมชมส่งคอมเมนต์

```mermaid
sequenceDiagram
    participant User
    participant Form as CommentForm
    participant API as POST /api/comments
    participant DB as PostgreSQL
    participant Admin as Admin Dashboard

    User->>Form: กรอกชื่อ + ข้อความ (ไทย+ตัวเลข)
    Form->>Form: validate client-side
    Form->>API: POST { name, content, slug }
    API->>API: validate Thai+numbers
    API->>DB: findUnique BlogArticle by slug
    API->>DB: create Comment (status=PENDING)
    DB-->>API: comment
    API-->>Form: 201 Created
    Form-->>User: "รอการอนุมัติจากผู้ดูแล"

    Note over Admin,DB: คอมเมนต์ยังไม่แสดงใต้บทความ

    Admin->>API: GET /api/comments?status=PENDING
    API-->>Admin: pending comments[]
    Admin->>API: PATCH /api/comments/:id/approve
    API->>DB: update status=APPROVED
    Admin-->>User: คอมเมนต์ปรากฏเมื่อ refresh หน้าบทความ
```

**State machine ของ Comment:**

```mermaid
stateDiagram-v2
    [*] --> PENDING: POST /api/comments
    PENDING --> APPROVED: Admin approve
    PENDING --> REJECTED: Admin reject
    APPROVED --> [*]
    REJECTED --> [*]
```

---

## 3. Admin จัดการระบบ

```mermaid
flowchart TD
    A["เข้า /admin/sign-in"] --> B{"POST /api/auth/sign-in<br/>role=ADMIN"}
    B -->|success| C["Session cookie set"]
    B -->|fail| A
    C --> D["Admin Dashboard"]

    D --> E["จัดการบทความ"]
    D --> F["จัดการคอมเมนต์"]

    E --> G["GET/POST /api/blog"]
    E --> H["PATCH /api/blog/:id"]

    F --> I["GET /api/comments?status=..."]
    F --> J["approve / reject"]
```

**Admin signup flow:**

1. ตั้ง `ADMIN_SIGNUP_CODE` ใน `.env`
2. ไป `/admin/sign-up` กรอก email, name, password, signup code
3. ระบบสร้าง User ด้วย `role = ADMIN` และ login อัตโนมัติ

---

## 4. Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant DB

    Client->>API: POST /api/auth/sign-in
    API->>DB: findUnique User by email
    API->>API: verify password hash
    API->>API: createSessionToken (HMAC)
    API-->>Client: Set-Cookie: session=...

    Client->>API: GET /api/auth/session (with cookie)
    API->>API: verifySessionToken
    API->>DB: findUnique User
    API-->>Client: { authenticated: true, user }
```

---

## 5. สถาปัตยกรรมเลเยอร์ (Clean Architecture)

```mermaid
flowchart TB
    subgraph presentation ["Presentation Layer"]
        Pages["app/**/page.tsx"]
        Components["components/**"]
    end

    subgraph application ["Application Layer"]
        Hooks["hooks/use-session.ts<br/>hooks/use-admin-comments.ts"]
    end

    subgraph infrastructure ["Infrastructure Layer"]
        API["app/api/**/route.ts"]
        Lib["lib/auth.ts, lib/prisma.ts, lib/validation.ts"]
        DB["PostgreSQL via Prisma"]
    end

    Pages --> Components
    Components --> Hooks
    Hooks --> API
    Pages --> Lib
    API --> Lib
    Lib --> DB
```

| Layer | หน้าที่ | ตัวอย่าง |
|-------|--------|---------|
| Presentation | UI + routing | `app/blog/page.tsx`, `components/blog/comment-form.tsx` |
| Application | Client state & orchestration | `useSession`, `useAdminComments` |
| Infrastructure | Business logic + data access | `lib/auth.ts`, `lib/blog-queries.ts`, Prisma |
