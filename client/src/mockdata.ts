import type { Activity, CalendarEvent, ChartPoint, DashboardResponse, Notice, StatCard } from "@shared/schema";

const id = () => crypto.randomUUID();

export const mockStats: StatCard[] = [
  { id: id(), title: "Total Students", value: 932, deltaText: "+28 this month", icon: "students", color: "green" },
  { id: id(), title: "Total Parents", value: 640, deltaText: "+12 this month", icon: "parents", color: "yellow" },
  { id: id(), title: "Total Teachers", value: 48, deltaText: "+2 hired", icon: "teachers", color: "blue" },
  { id: id(), title: "Earnings", value: 284560, deltaText: "+8.4% vs last term", icon: "earnings", color: "purple" },
];

export const mockFeesChart: ChartPoint[] = [
  { label: "Jan", income: 42000, expenses: 28000 },
  { label: "Feb", income: 46000, expenses: 31000 },
  { label: "Mar", income: 52000, expenses: 34000 },
  { label: "Apr", income: 60000, expenses: 39000 },
  { label: "May", income: 56000, expenses: 36000 },
  { label: "Jun", income: 64000, expenses: 41000 },
];

export const mockNotices: Notice[] = [
  {
    id: id(),
    date: "2026-02-01",
    title: "Midterm Exams Schedule Released",
    body: "The midterm timetable is available in Academics → Exams. Please ensure all fee dues are cleared by Feb 12.",
  },
  {
    id: id(),
    date: "2026-01-28",
    title: "PTA Meeting — Grade 6 to 10",
    body: "Parents are invited for the quarterly PTA meeting in the auditorium. Session starts at 4:00 PM. Please be seated by 3:50 PM.",
  },
  {
    id: id(),
    date: "2026-01-22",
    title: "Library Week & Book Donation Drive",
    body: "We are collecting age-appropriate books. Drop-off at the library front desk. Volunteers needed — contact Student Council.",
  },
];

export const mockActivities: Activity[] = [
  { id: id(), time: "09:18 AM", text: "Fee payment received from Student #1842 — Term 2", kind: "success" },
  { id: id(), time: "10:04 AM", text: "New student admission request pending approval", kind: "info" },
  { id: id(), time: "11:31 AM", text: "Bus route delay reported — Route B (traffic)", kind: "warning" },
  { id: id(), time: "12:22 PM", text: "Overdue fees reminder email failed for 3 parents", kind: "danger" },
  { id: id(), time: "02:05 PM", text: "Teacher roster updated for Science department", kind: "info" },
];

export const mockEvents: CalendarEvent[] = [
  { id: id(), date: "2026-02-05", title: "Inter-house Debate", color: "blue" },
  { id: id(), date: "2026-02-12", title: "Fee Due Date (Term 2)", color: "red" },
  { id: id(), date: "2026-02-15", title: "Sports Day Practice", color: "yellow" },
  { id: id(), date: "2026-02-21", title: "Science Fair", color: "green" },
];

export const mockDashboardResponse: DashboardResponse = {
  stats: mockStats,
  feesChart: mockFeesChart,
  notices: mockNotices,
  activities: mockActivities,
  events: mockEvents,
};

/* =========================================================
   CRUD datasets for pages (mock-only)
   ========================================================= */

export type Student = {
  id: string;
  name: string;
  grade: string;
  section: string;
  rollNo: string;
  guardian: string;
  phone: string;
  status: "active" | "inactive";
  joinedAt: string; // yyyy-mm-dd
};

export type Parent = {
  id: string;
  name: string;
  studentName: string;
  relationship: "Father" | "Mother" | "Guardian";
  phone: string;
  email: string;
  status: "active" | "inactive";
};

export type Teacher = {
  id: string;
  name: string;
  department: string;
  email: string;
  phone: string;
  status: "active" | "on_leave" | "inactive";
  joinedAt: string;
};

export type Invoice = {
  id: string;
  title: string;
  category: "Tuition" | "Transport" | "Library" | "Exams" | "Misc";
  studentName: string;
  amount: number;
  paid: number;
  status: "draft" | "sent" | "paid" | "overdue" | "void";
  dueDate: string;
  createdAt: string;
};

export const mockStudents: Student[] = [
  { id: id(), name: "Aarav Mehta", grade: "10", section: "A", rollNo: "10A-07", guardian: "Neha Mehta", phone: "+1 (555) 014-2211", status: "active", joinedAt: "2025-04-18" },
  { id: id(), name: "Sophia Kim", grade: "8", section: "C", rollNo: "8C-19", guardian: "Jin Kim", phone: "+1 (555) 018-3302", status: "active", joinedAt: "2024-09-01" },
  { id: id(), name: "Miguel Santos", grade: "6", section: "B", rollNo: "6B-03", guardian: "Ana Santos", phone: "+1 (555) 017-1109", status: "inactive", joinedAt: "2023-06-12" },
  { id: id(), name: "Zara Khan", grade: "9", section: "A", rollNo: "9A-14", guardian: "Imran Khan", phone: "+1 (555) 010-8874", status: "active", joinedAt: "2025-01-09" },
  { id: id(), name: "Ethan Brooks", grade: "7", section: "D", rollNo: "7D-22", guardian: "Claire Brooks", phone: "+1 (555) 015-9021", status: "active", joinedAt: "2024-02-26" },
];

export const mockParents: Parent[] = [
  { id: id(), name: "Neha Mehta", studentName: "Aarav Mehta", relationship: "Mother", phone: "+1 (555) 014-2211", email: "neha.mehta@example.com", status: "active" },
  { id: id(), name: "Jin Kim", studentName: "Sophia Kim", relationship: "Father", phone: "+1 (555) 018-3302", email: "jin.kim@example.com", status: "active" },
  { id: id(), name: "Ana Santos", studentName: "Miguel Santos", relationship: "Mother", phone: "+1 (555) 017-1109", email: "ana.santos@example.com", status: "inactive" },
  { id: id(), name: "Imran Khan", studentName: "Zara Khan", relationship: "Father", phone: "+1 (555) 010-8874", email: "imran.khan@example.com", status: "active" },
];

export const mockTeachers: Teacher[] = [
  { id: id(), name: "Dr. Amelia Stone", department: "Science", email: "amelia.stone@school.edu", phone: "+1 (555) 013-4420", status: "active", joinedAt: "2022-08-15" },
  { id: id(), name: "Noah Turner", department: "Mathematics", email: "noah.turner@school.edu", phone: "+1 (555) 011-2044", status: "on_leave", joinedAt: "2021-03-07" },
  { id: id(), name: "Priya Nair", department: "Languages", email: "priya.nair@school.edu", phone: "+1 (555) 012-7781", status: "active", joinedAt: "2023-11-21" },
  { id: id(), name: "Hassan Ali", department: "Social Studies", email: "hassan.ali@school.edu", phone: "+1 (555) 016-5510", status: "inactive", joinedAt: "2020-01-10" },
];

export const mockInvoices: Invoice[] = [
  { id: id(), title: "Term 2 Tuition", category: "Tuition", studentName: "Aarav Mehta", amount: 1200, paid: 1200, status: "paid", dueDate: "2026-02-12", createdAt: "2026-01-20" },
  { id: id(), title: "Transport (Feb)", category: "Transport", studentName: "Sophia Kim", amount: 180, paid: 0, status: "sent", dueDate: "2026-02-10", createdAt: "2026-01-28" },
  { id: id(), title: "Library Fine", category: "Library", studentName: "Miguel Santos", amount: 25, paid: 0, status: "overdue", dueDate: "2026-01-18", createdAt: "2026-01-10" },
  { id: id(), title: "Exam Fee", category: "Exams", studentName: "Zara Khan", amount: 90, paid: 45, status: "sent", dueDate: "2026-02-05", createdAt: "2026-01-29" },
  { id: id(), title: "Sports Kit", category: "Misc", studentName: "Ethan Brooks", amount: 60, paid: 0, status: "draft", dueDate: "2026-02-25", createdAt: "2026-02-01" },
];
