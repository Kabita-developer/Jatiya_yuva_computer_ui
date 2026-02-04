import { useMemo, useState } from "react";
import type { CalendarEvent } from "@shared/schema";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function toKey(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function addMonths(d: Date, delta: number) {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1);
}

const colorDot: Record<CalendarEvent["color"], string> = {
  green: "bg-emerald-500",
  blue: "bg-blue-500",
  yellow: "bg-amber-500",
  red: "bg-red-500",
};

export default function MiniCalendar({
  events,
}: {
  events: CalendarEvent[];
}) {
  const [cursor, setCursor] = useState(() => new Date());

  const byDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      const arr = map.get(e.date) ?? [];
      arr.push(e);
      map.set(e.date, arr);
    }
    return map;
  }, [events]);

  const days = useMemo(() => {
    const start = startOfMonth(cursor);
    const end = endOfMonth(cursor);
    const startDay = start.getDay(); // 0..6
    const totalDays = end.getDate();

    const cells: Array<{ date: Date; inMonth: boolean }> = [];

    for (let i = 0; i < startDay; i++) {
      const d = new Date(start);
      d.setDate(1 - (startDay - i));
      cells.push({ date: d, inMonth: false });
    }
    for (let d = 1; d <= totalDays; d++) {
      cells.push({ date: new Date(cursor.getFullYear(), cursor.getMonth(), d), inMonth: true });
    }
    while (cells.length % 7 !== 0) {
      const last = cells[cells.length - 1].date;
      const d = new Date(last);
      d.setDate(d.getDate() + 1);
      cells.push({ date: d, inMonth: false });
    }
    return cells;
  }, [cursor]);

  const monthLabel = cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const todayKey = toKey(new Date());

  return (
    <div
      data-testid="mini-calendar"
      className={cn(
        "rounded-2xl border border-card-border bg-card p-5 shadow-premium",
        "transition-all duration-300 hover:shadow-xl hover:shadow-black/10"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-muted-foreground">Calendar</div>
          <div className="mt-1 text-xl font-extrabold tracking-tight">{monthLabel}</div>
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/30 p-1">
          <Button
            data-testid="calendar-prev"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg"
            onClick={() => setCursor((c) => addMonths(c, -1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            data-testid="calendar-next"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg"
            onClick={() => setCursor((c) => addMonths(c, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground">
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <div key={d} className="py-1 font-semibold">
            {d}
          </div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {days.map(({ date, inMonth }, idx) => {
          const key = toKey(date);
          const dayEvents = byDate.get(key) ?? [];
          const isToday = key === todayKey;

          return (
            <button
              key={`${key}-${idx}`}
              data-testid={`calendar-day-${key}`}
              onClick={() => {
                if (dayEvents.length === 0) return;
                // eslint-disable-next-line no-alert
                alert(dayEvents.map((e) => `• ${e.title}`).join("\n"));
              }}
              className={cn(
                "group relative rounded-xl border px-2 py-2 text-left transition-all duration-200",
                "hover:-translate-y-0.5 hover:shadow-md active:translate-y-0",
                inMonth ? "bg-background/70" : "bg-muted/20 opacity-70",
                isToday ? "border-primary/40 ring-4 ring-primary/10" : "border-border/70",
                dayEvents.length ? "cursor-pointer" : "cursor-default"
              )}
            >
              <div className={cn("text-xs font-semibold", inMonth ? "text-foreground" : "text-muted-foreground")}>
                {date.getDate()}
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {dayEvents.slice(0, 2).map((e) => (
                  <span key={e.id} className={cn("h-1.5 w-1.5 rounded-full", colorDot[e.color])} />
                ))}
                {dayEvents.length > 2 ? (
                  <span className="text-[10px] text-muted-foreground">+{dayEvents.length - 2}</span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl border border-border/70 bg-muted/30 p-3">
        <div className="text-xs font-semibold text-muted-foreground">Upcoming</div>
        <div className="mt-2 space-y-2">
          {events
            .slice()
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, 3)
            .map((e, idx) => (
              <div key={e.id} data-testid={`calendar-upcoming-${idx}`} className="flex items-center gap-2">
                <span className={cn("h-2.5 w-2.5 rounded-full", colorDot[e.color])} />
                <div className="min-w-0">
                  <div className="text-xs font-semibold truncate">{e.title}</div>
                  <div className="text-[11px] text-muted-foreground">{e.date}</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
