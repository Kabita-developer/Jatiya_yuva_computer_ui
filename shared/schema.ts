import { z } from "zod";

export type StatCard = {
  id: string;
  title: string;
  value: number;
  deltaText?: string;
  icon: "students" | "parents" | "teachers" | "earnings";
  color: "green" | "yellow" | "blue" | "purple";
};

export type ChartPoint = {
  label: string;
  income: number;
  expenses: number;
};

export type Notice = {
  id: string;
  date: string;
  title: string;
  body: string;
};

export type Activity = {
  id: string;
  time: string;
  text: string;
  kind: "info" | "success" | "warning" | "danger";
};

export type CalendarEvent = {
  id: string;
  date: string; // yyyy-mm-dd
  title: string;
  color: "green" | "blue" | "yellow" | "red";
};

export type DashboardResponse = {
  stats: StatCard[];
  feesChart: ChartPoint[];
  notices: Notice[];
  activities: Activity[];
  events: CalendarEvent[];
};

export const dashboardResponseSchema = z.object({
  stats: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      value: z.number(),
      deltaText: z.string().optional(),
      icon: z.enum(["students", "parents", "teachers", "earnings"]),
      color: z.enum(["green", "yellow", "blue", "purple"]),
    }),
  ),
  feesChart: z.array(
    z.object({
      label: z.string(),
      income: z.number(),
      expenses: z.number(),
    }),
  ),
  notices: z.array(
    z.object({
      id: z.string(),
      date: z.string(),
      title: z.string(),
      body: z.string(),
    }),
  ),
  activities: z.array(
    z.object({
      id: z.string(),
      time: z.string(),
      text: z.string(),
      kind: z.enum(["info", "success", "warning", "danger"]),
    }),
  ),
  events: z.array(
    z.object({
      id: z.string(),
      date: z.string(),
      title: z.string(),
      color: z.enum(["green", "blue", "yellow", "red"]),
    }),
  ),
});
