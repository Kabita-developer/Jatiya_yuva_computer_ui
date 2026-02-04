import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function DataTableShell({
  title,
  subtitle,
  toolbar,
  children,
}: {
  title: string;
  subtitle: string;
  toolbar: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-sm font-semibold text-muted-foreground">{subtitle}</div>
          <h2 className="mt-1 text-3xl font-extrabold tracking-tight">{title}</h2>
        </div>
        <div className={cn("flex flex-col gap-2 sm:flex-row sm:items-center")}>{toolbar}</div>
      </div>

      <div className="rounded-2xl border border-card-border bg-card shadow-premium">
        {children}
      </div>
    </div>
  );
}
