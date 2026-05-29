import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import { PrismaClient } from "@/app/generated/prisma/client";
import { getDirectDatabaseUrl } from "@/lib/database-url";

const pool = new Pool({
  connectionString: getDirectDatabaseUrl(),
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const articles = [
  {
    title: "ยินดีต้อนรับสู่ Aurora Blog",
    slug: "welcome",
    summary:
      "แนะนำระบบบล็อกที่รองรับคอมเมนต์แบบต้องอนุมัติ พร้อมพื้นที่ให้ผู้อ่านมีส่วนร่วมอย่างปลอดภัย",
    content: `ยินดีต้อนรับสู่ Aurora Blog

บทความนี้เป็นตัวอย่างสำหรับสาธิตระบบคอมเมนต์ที่ผู้อ่านสามารถมีส่วนร่วมได้อย่างปลอดภัย โดยทุกความคิดเห็นจะถูกตรวจสอบโดยผู้ดูแลก่อนแสดงต่อสาธารณะ

คุณสามารถค้นหาบทความจากชื่อเรื่อง อ่านเนื้อหาแบบเต็ม และแสดงความคิดเห็นใต้บทความได้`,
    coverUrl: null,
    publishedAt: new Date("2026-01-15"),
  },
  {
    title: "5 เทคนิคเขียนบทความให้น่าอ่าน",
    slug: "writing-tips",
    summary:
      "เริ่มจากหัวข้อที่ชัดเจน ใช้ย่อหน้าสั้น และสรุปประเด็นสำคัญให้ผู้อ่านจับใจความได้ทันที",
    content: `การเขียนบทความที่ดีไม่จำเป็นต้องยาว แต่ต้องชัดเจน

1. ตั้งหัวข้อให้บอกใจความได้ใน 1 บรรทัด
2. เปิดด้วยปัญหาหรือคำถามที่ผู้อ่านสนใจ
3. แบ่งเนื้อหาเป็นย่อหน้าสั้นๆ
4. ใช้ตัวอย่างจริงช่วยอธิบาย
5. ปิดท้ายด้วยสรุปหรือ call-to-action`,
    coverUrl: null,
    publishedAt: new Date("2026-02-01"),
  },
  {
    title: "ทำไมต้องมีระบบอนุมัติคอมเมนต์",
    slug: "comment-moderation",
    summary:
      "การคัดกรองความคิดเห็นก่อนเผยแพร่ช่วยลดสแปม รักษาบรรยากาศการสนทนา และเพิ่มความน่าเชื่อถือให้ชุมชนผู้อ่าน",
    content: `ระบบอนุมัติคอมเมนต์ช่วยให้เจ้าของบล็อกควบคุมคุณภาพเนื้อหาในพื้นที่สนทนาได้ดีขึ้น

เมื่อผู้ใช้ส่งคอมเมนต์ ระบบจะบันทึกสถานะ "รออนุมัติ" ก่อน จากนั้นผู้ดูแลสามารถอนุมัติหรือปฏิเสธได้จากแดชบอร์ด คอมเมนต์ที่อนุมัติแล้วเท่านั้นที่จะแสดงใต้บทความ`,
    coverUrl: null,
    publishedAt: new Date("2026-02-20"),
  },
  {
    title: "แนวทางออกแบบหน้ารวม Blog",
    slug: "blog-index-design",
    summary:
      "หน้ารวมควรแสดงภาพปก ชื่อเรื่อง สรุปเนื้อหา และวันที่โพสต์ พร้อมค้นหาและแบ่งหน้าเพื่อให้หาบทความได้ง่าย",
    content: `หน้ารวม Blog คือจุดเริ่มต้นของผู้อ่าน

องค์ประกอบสำคัญ ได้แก่ ภาพปก ชื่อบทความ สรุปสั้นๆ และวันที่เผยแพร่ ควรมีช่องค้นหาจากชื่อเรื่อง และ pagination ที่อ่านง่าย เช่น 10 รายการต่อหน้า`,
    coverUrl: null,
    publishedAt: new Date("2026-03-05"),
  },
  {
    title: "Next.js กับ Prisma สำหรับบล็อก",
    slug: "nextjs-prisma-blog",
    summary:
      "ใช้ Server Components ดึงข้อมูลจากฐานข้อมูลโดยตรง ลด JavaScript ฝั่ง client และทำให้หน้า blog โหลดเร็วขึ้น",
    content: `Next.js App Router ทำงานร่วมกับ Prisma ได้ดีมากสำหรับเว็บบล็อก

เราสามารถ query ข้อมูลบทความบน server แล้ว render HTML สำเร็จรูป ลดการ fetch ซ้ำจาก browser และยังรองรับการค้นหา/แบ่งหน้าผ่าน search params ได้อย่างเป็นธรรมชาติ`,
    coverUrl: null,
    publishedAt: new Date("2026-03-18"),
  },
  {
    title: "Tailwind CSS กับ shadcn/ui",
    slug: "tailwind-shadcn",
    summary:
      "ใช้ design system สำเร็จรูปช่วยให้ UI สม่ำเสมอ ปรับธีมได้ และพัฒนาหน้า blog ได้เร็วขึ้น",
    content: `Tailwind CSS ช่วยจัด layout และ spacing ได้รวดเร็ว ส่วน shadcn/ui ให้ component พื้นฐานที่ปรับแต่งได้

การผสมทั้งสองอย่างทำให้หน้า blog ดูทันสมัย รองรับ dark mode และดูแลรักษาง่ายในระยะยาว`,
    coverUrl: null,
    publishedAt: new Date("2026-04-02"),
  },
  {
    title: "การจัดการรูปภาพปกบทความ",
    slug: "cover-images",
    summary:
      "ภาพปกช่วยดึงดูดความสนใจ ควรใช้สัดส่วนที่สม่ำเสมอและมี alt text อธิบายเนื้อหาเพื่อ accessibility",
    content: `รูปภาพปกเป็นสิ่งแรกที่ผู้อ่านเห็นบนหน้ารวม blog

แนะนำให้ใช้สัดส่วนเดียวกันทุกบทความ บีบอัดไฟล์ให้เหมาะสม และใส่ alt text ที่สื่อความหมาย หากไม่มีรูป ควรมี placeholder ที่สวยงามแทน`,
    coverUrl: null,
    publishedAt: new Date("2026-04-15"),
  },
  {
    title: "SEO พื้นฐานสำหรับบทความ",
    slug: "basic-seo",
    summary:
      "ตั้ง title/description ที่ตรงประเด็น ใช้ slug ที่อ่านง่าย และโครงสร้าง heading ที่ชัดเจนช่วยให้ค้นหาเจอง่ายขึ้น",
    content: `SEO ไม่ซับซ้อนอย่างที่คิด

เริ่มจาก title ที่สื่อเนื้อหา summary ที่กระชับ slug ที่เป็น keyword อ่านง่าย และใช้ heading อย่างเป็นระบบ แต่ละหน้าควรมี metadata เฉพาะของตัวเอง`,
    coverUrl: null,
    publishedAt: new Date("2026-04-28"),
  },
  {
    title: "สร้างชุมชนผู้อ่านที่มีคุณภาพ",
    slug: "reader-community",
    summary:
      "ตอบคอมเมนต์ที่ได้รับการอนุมัติ ส่งเสริมการสนทนาเชิงสร้างสรรค์ และกำหนดกติกาที่ชัดเจน",
    content: `ชุมชนที่ดีเกิดจากการมีส่วนร่วมอย่างมีคุณภาพ

เจ้าของบล็อกควรตอบคอมเมนต์ที่ได้รับการอนุมัติ กำหนดแนวทางการแสดงความคิดเห็น และใช้ระบบ moderation เพื่อรักษาบรรยากาศที่ดี`,
    coverUrl: null,
    publishedAt: new Date("2026-05-10"),
  },
  {
    title: "แผนพัฒนาบล็อกในอนาคต",
    slug: "blog-roadmap",
    summary:
      "ขยายไปสู่ tag/category, RSS feed, และระบบ bookmark เพื่อให้ผู้อ่านติดตามเนื้อหาใหม่ได้สะดวก",
    content: `เมื่อ blog โตขึ้น ฟีเจอร์ถัดไปที่น่าสนใจ ได้แก่

- หมวดหมู่และแท็ก
- RSS/Atom feed
- บันทึกบทความโปรด
- แนะนำบทความที่เกี่ยวข้อง

เริ่มจากพื้นฐานที่มั่นคงก่อน แล้วค่อยเพิ่มทีละอย่าง`,
    coverUrl: null,
    publishedAt: new Date("2026-05-22"),
  },
  {
    title: "ทดสอบ pagination หน้ารวม Blog",
    slug: "pagination-demo",
    summary:
      "บทความตัวอย่างชิ้นที่ 11 สำหรับทดสอบการแบ่งหน้า 10 รายการต่อหน้า",
    content: `บทความนี้มีไว้เพื่อทดสอบ pagination

เมื่อมีบทความมากกว่า 10 รายการ หน้ารวม blog จะแสดงปุ่มเปลี่ยนหน้า และผู้ใช้สามารถเลื่อนดูบทความถัดไปได้`,
    coverUrl: null,
    publishedAt: new Date("2026-05-29"),
  },
] as const;

async function main() {
  for (const article of articles) {
    await prisma.blogArticle.upsert({
      where: { slug: article.slug },
      update: {
        title: article.title,
        summary: article.summary,
        content: article.content,
        coverUrl: article.coverUrl,
        publishedAt: article.publishedAt,
        images: [],
        isPublished: true,
      },
      create: {
        ...article,
        images: [],
        isPublished: true,
        viewCount: 0,
      },
    });
  }

  console.log(`Seeded ${articles.length} blog articles.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
