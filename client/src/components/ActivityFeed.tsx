import type { Activity } from "@shared/schema";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const kindStyles: Record<Activity["kind"], { icon: React.ComponentType<{ className?: string }>; dot: string; ring: string; text: string }> = {
  info: { icon: Info, dot: "bg-blue-500", ring: "ring-blue-500/20", text: "text-blue-700 dark:text-blue-300" },
  success: { icon: CheckCircle2, dot: "bg-emerald-500", ring: "ring-emerald-500/20", text: "text-emerald-700 dark:text-emerald-300" },
  warning: { icon: AlertTriangle, dot: "bg-amber-500", ring: "ring-amber-500/20", text: "text-amber-700 dark:text-amber-300" },
  danger: { icon: XCircle, dot: "bg-red-500", ring: "ring-red-500/20", text: "text-red-700 dark:text-red-300" },
};

export default function ActivityFeed({ items }: { items: Activity[] }) {
  return (
    <div
      data-testid="activity-feed"
      className={cn(
        "rounded-2xl border border-card-border bg-card p-5 shadow-premium",
        "transition-all duration-300 hover:shadow-xl hover:shadow-black/10"
      )}
    >
      <div>
        <div className="text-sm font-semibold text-muted-foreground">Recent Activity</div>
        <div className="mt-1 text-xl font-extrabold tracking-tight">What’s happening</div>
      </div>

      <div className="mt-4 space-y-3">
        {items.slice(0, 5).map((a, idx) => {
          const s = kindStyles[a.kind];
          const Icon = s.icon;
          return (
            <div
              key={a.id}
              data-testid={`activity-item-${idx}`}
              className="group flex items-start gap-3 rounded-2xl border border-border/70 bg-muted/30 p-4 transition-all hover:bg-muted/55 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5"
            >
              <div className={cn("mt-0.5 grid h-9 w-9 place-items-center rounded-2xl ring-1", s.ring, "bg-background/60")}>
                <Icon className={cn("h-4.5 w-4.5", s.text)} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs text-muted-foreground" data-testid={`activity-time-${idx}`}>
                    {a.time}
                  </div>
                  <span className={cn("inline-flex h-2 w-2 rounded-full", s.dot)} />
                </div>
                <div className="mt-1 text-sm font-semibold leading-snug" data-testid={`activity-text-${idx}`}>
                  {a.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
