import type { DashboardResponse } from "@shared/routes";

export interface IStorage {
  getDashboard(): Promise<DashboardResponse>;
}

export class MemStorage implements IStorage {
  async getDashboard(): Promise<DashboardResponse> {
    return {
      stats: [
        {
          id: "total-students",
          title: "Our Total Students",
          value: 50000,
          deltaText: "8% increase",
          icon: "students",
          color: "green",
        },
        {
          id: "total-parents",
          title: "Total Parents",
          value: 80000,
          deltaText: "5% increase",
          icon: "parents",
          color: "yellow",
        },
        {
          id: "expert-teachers",
          title: "Our Expert Teachers",
          value: 10000,
          deltaText: "12% increase",
          icon: "teachers",
          color: "blue",
        },
        {
          id: "yearly-earnings",
          title: "Yearly Total Earnings",
          value: 1000000,
          deltaText: "3% increase",
          icon: "earnings",
          color: "purple",
        },
      ],
      feesChart: [
        { label: "Jan", income: 10000, expenses: 4000 },
        { label: "Feb", income: 12000, expenses: 5000 },
        { label: "Mar", income: 15000, expenses: 4500 },
        { label: "Apr", income: 14000, expenses: 6000 },
        { label: "May", income: 17000, expenses: 5500 },
        { label: "Jun", income: 19000, expenses: 7000 },
        { label: "Jul", income: 21000, expenses: 6500 },
      ],
      notices: [
        {
          id: "notice-1",
          date: "11 May, 2017",
          title: "Lorem ipsum",
          body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ut lorem at odio imperdiet posuere.",
        },
        {
          id: "notice-2",
          date: "10 May, 2017",
          title: "Consectetur",
          body: "Consectetur adipiscing elit. Integer non interdum urna. Sed sit amet ipsum at sem consequat luctus.",
        },
        {
          id: "notice-3",
          date: "09 May, 2017",
          title: "Aenean commodo",
          body: "Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis.",
        },
      ],
      activities: [
        {
          id: "act-1",
          time: "1 min ago",
          text: "New student admitted",
          kind: "success",
        },
        {
          id: "act-2",
          time: "10 mins ago",
          text: "Fees payment received",
          kind: "info",
        },
        {
          id: "act-3",
          time: "1 hour ago",
          text: "New teacher joined",
          kind: "warning",
        },
        {
          id: "act-4",
          time: "Yesterday",
          text: "Expense added",
          kind: "danger",
        },
      ],
      events: [
        {
          id: "evt-1",
          date: "2017-04-11",
          title: "PTA Meeting",
          color: "green",
        },
        {
          id: "evt-2",
          date: "2017-04-14",
          title: "Sports Day",
          color: "blue",
        },
        {
          id: "evt-3",
          date: "2017-04-17",
          title: "Exam Begins",
          color: "red",
        },
      ],
    };
  }
}

export const storage = new MemStorage();
