import { GraduationCap, UsersRound, Users, Wallet } from "lucide-react";
import type { StatCard as StatCardType } from "@shared/schema";
import { cn } from "@/lib/utils";

const iconMap = {
  students: GraduationCap,
  parents: UsersRound,
  teachers: Users,
  earnings: Wallet,
} as const;

const colorMap = {
  green: {
    ring: "ring-emerald-500/20",
    bg: "bg-emerald-500/10",
    fg: "text-emerald-700 dark:text-emerald-300",
    glow: "shadow-emerald-500/20",
  },
  yellow: {
    ring: "ring-amber-500/20",
    bg: "bg-amber-500/10",
    fg: "text-amber-700 dark:text-amber-300",
    glow: "shadow-amber-500/20",
  },
  blue: {
    ring: "ring-blue-500/20",
    bg: "bg-blue-500/10",
    fg: "text-blue-700 dark:text-blue-300",
    glow: "shadow-blue-500/20",
  },
  purple: {
    ring: "ring-purple-500/20",
    bg: "bg-purple-500/10",
    fg: "text-purple-700 dark:text-purple-300",
    glow: "shadow-purple-500/20",
  },
} as const;

export default function StatCard({ card }: { card: StatCardType }) {
  const Icon = iconMap[card.icon];
  const c = colorMap[card.color];

  const formatted =
    card.icon === "earnings"
      ? new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(card.value)
      : new Intl.NumberFormat().format(card.value);

  return (
    <div
      data-testid={`stat-card-${card.id}`}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-card-border bg-card p-5 shadow-premium",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/10",
      )}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className={cn("absolute -right-12 -top-12 h-44 w-44 rounded-full blur-3xl", c.bg)} />
        <div className="absolute -left-16 -bottom-16 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-muted-foreground">{card.title}</div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight">{formatted}</div>
          {card.deltaText ? (
            <div className="mt-2 text-xs text-muted-foreground">
              <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 ring-1", c.ring, c.fg, c.bg)}>
                {card.deltaText}
              </span>
            </div>
          ) : null}
        </div>

        <div
          className={cn(
            "grid h-12 w-12 place-items-center rounded-2xl ring-1",
            c.bg,
            c.ring,
            "shadow-lg",
            c.glow,
            "transition-transform duration-300 group-hover:scale-[1.04]"
          )}
        >
          <Icon className={cn("h-5 w-5", c.fg)} />
        </div>
      </div>
    </div>
  );
}
