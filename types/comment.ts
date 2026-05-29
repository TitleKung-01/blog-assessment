export type CommentStatus = "PENDING" | "APPROVED" | "REJECTED";

export type AdminComment = {
  id: string;
  name: string;
  content: string;
  slug: string;
  status: CommentStatus;
  createdAt: string;
  user?: { name: string; email: string } | null;
};

export type PublicComment = {
  id: string;
  name?: string;
  content: string;
  createdAt: Date;
  user?: { name: string } | null;
};

export const commentStatusMeta: Record<
  CommentStatus,
  { label: string; variant: "warning" | "success" | "destructive" }
> = {
  PENDING: { label: "รออนุมัติ", variant: "warning" },
  APPROVED: { label: "อนุมัติแล้ว", variant: "success" },
  REJECTED: { label: "ถูกปฏิเสธ", variant: "destructive" },
};

export const commentFilterTabs: { label: string; status: CommentStatus }[] = [
  { label: "รออนุมัติ", status: "PENDING" },
  { label: "อนุมัติแล้ว", status: "APPROVED" },
  { label: "ถูกปฏิเสธ", status: "REJECTED" },
];
