"use client";

import Link from "next/link";
import { motion, type Variants } from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: MessageSquareText,
    title: "เขียนคอมเมนต์",
    description:
      "ผู้อ่านแสดงความคิดเห็นใต้บทความได้ทันที พร้อมตรวจสอบความถูกต้องของข้อมูลก่อนส่ง",
  },
  {
    icon: ShieldCheck,
    title: "อนุมัติก่อนเผยแพร่",
    description:
      "ทุกคอมเมนต์จะเข้าสู่สถานะรอตรวจสอบ แสดงต่อสาธารณะเฉพาะรายการที่ผู้ดูแลอนุมัติแล้ว",
  },
  {
    icon: Zap,
    title: "จัดการรวดเร็ว",
    description:
      "แดชบอร์ดผู้ดูแลคัดกรองคอมเมนต์ อนุมัติหรือปฏิเสธได้ในคลิกเดียวพร้อมแอนิเมชันลื่นไหล",
  },
];

const steps = [
  "ผู้อ่านส่งคอมเมนต์ใต้บทความ",
  "ระบบบันทึกเป็นสถานะ “รออนุมัติ”",
  "ผู้ดูแลตรวจและอนุมัติ",
  "คอมเมนต์ปรากฏต่อสาธารณะ",
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
} satisfies Variants;

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
} satisfies Variants;

export function Landing() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden border-b border-border/60 px-6 py-24 sm:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary/8 via-background to-background"
        />
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="mx-auto flex w-full max-w-3xl flex-col items-center text-center"
        >
          <motion.div variants={item}>
            <Badge
              variant="outline"
              className="mb-6 gap-1.5 border-primary/30 bg-background/80 px-3 py-1 text-sm"
            >
              <Sparkles className="size-3.5 text-primary" />
              ระบบคอมเมนต์ที่ต้องผ่านการอนุมัติ
            </Badge>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-6xl"
          >
            พื้นที่บทความที่{" "}
            <span className="text-primary">สวยงาม</span> และปลอดภัย
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-pretty text-lg leading-8 text-muted-foreground"
          >
            ออกแบบด้วย shadcn/ui และแอนิเมชันจาก Framer Motion
            ให้ทุกคอมเมนต์ผ่านการคัดกรองก่อนเผยแพร่จริง
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button asChild size="lg" className="gap-2 rounded-full px-8">
              <Link href="/blog/welcome">
                อ่านบทความตัวอย่าง
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link href="/admin">เข้าสู่แดชบอร์ดผู้ดูแล</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <section className="mx-auto -mt-10 w-full max-w-5xl px-6 pb-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FadeIn key={feature.title} inView delay={index * 0.12}>
              <Card className="h-full transition-shadow hover:shadow-lg hover:shadow-primary/10">
                <CardContent className="flex flex-col gap-4">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <feature.icon className="size-6" />
                  </span>
                  <h3 className="text-lg font-semibold tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <FadeIn inView>
          <Card className="overflow-hidden border-primary/15 bg-gradient-to-br from-card to-accent/30">
            <CardContent className="flex flex-col gap-8 py-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-md">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  ขั้นตอนการทำงาน
                </h2>
                <p className="mt-3 text-muted-foreground">
                  ตั้งแต่ผู้อ่านพิมพ์คอมเมนต์จนถึงการเผยแพร่ ทุกอย่างถูกควบคุมด้วยสถานะที่ชัดเจน
                </p>
              </div>
              <ol className="flex flex-1 flex-col gap-3">
                {steps.map((step, index) => (
                  <motion.li
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-3 rounded-xl border bg-background/80 px-4 py-3"
                  >
                    <CheckCircle2 className="size-5 shrink-0 text-success" />
                    <span className="text-sm font-medium">
                      <span className="mr-2 text-muted-foreground">
                        {index + 1}.
                      </span>
                      {step}
                    </span>
                  </motion.li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </FadeIn>
      </section>
    </div>
  );
}
