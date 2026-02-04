import type { Notice } from "@shared/schema";
import { CalendarDays, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function NoticeBoard({
  notices,
  onViewAll,
}: {
  notices: Notice[];
  onViewAll: () => void;
}) {
  return (
    <div
      data-testid="notice-board"
      className={cn(
        "rounded-2xl border border-card-border bg-card p-5 shadow-premium",
        "transition-all duration-300 hover:shadow-xl hover:shadow-black/10"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-muted-foreground">Notice Board</div>
          <div className="mt-1 text-xl font-extrabold tracking-tight">Announcements</div>
        </div>
        <Button
          data-testid="notice-view-all"
          variant="secondary"
          className="rounded-xl"
          onClick={onViewAll}
        >
          View all <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      <div className="mt-4 space-y-3">
        {notices.slice(0, 3).map((n, idx) => (
          <div key={n.id} className="rounded-2xl border border-border/70 bg-muted/30 p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
              <span data-testid={`notice-date-${idx}`}>{n.date}</span>
            </div>
            <div className="mt-1 text-sm font-bold" data-testid={`notice-title-${idx}`}>{n.title}</div>
            <div className="mt-1 text-sm text-muted-foreground line-clamp-2" data-testid={`notice-body-${idx}`}>
              {n.body}
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-4" />
      <div className="text-xs text-muted-foreground">
        Tip: Keep notices short and actionable for better parent engagement.
      </div>
    </div>
  );
}
