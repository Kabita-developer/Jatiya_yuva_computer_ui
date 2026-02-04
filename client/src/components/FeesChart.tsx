import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import type { ChartPoint } from "@shared/schema";
import { cn } from "@/lib/utils";

function money(v: number) {
  return new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(v);
}

export default function FeesChart({
  data,
  className,
}: {
  data: ChartPoint[];
  className?: string;
}) {
  return (
    <div
      data-testid="fees-chart"
      className={cn(
        "rounded-2xl border border-card-border bg-card p-5 shadow-premium",
        "transition-all duration-300 hover:shadow-xl hover:shadow-black/10",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-muted-foreground">Fees Collection</div>
          <div className="mt-1 text-xl font-extrabold tracking-tight">Income vs Expenses</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-[hsl(var(--chart-1))]" />
            Income
          </span>
          <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-[hsl(var(--chart-5))]" />
            Expenses
          </span>
        </div>
      </div>

      <div className="mt-4 h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
            <defs>
              <linearGradient id="incomeFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.35} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="expenseFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-5))" stopOpacity={0.25} />
                <stop offset="95%" stopColor="hsl(var(--chart-5))" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="4 6" vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis
              tickFormatter={money}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              width={44}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--popover) / 0.9)",
                border: "1px solid hsl(var(--border))",
                borderRadius: 14,
                boxShadow: "0 20px 45px rgba(0,0,0,0.12)",
                backdropFilter: "blur(8px)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 700 }}
              itemStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value: number) => new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)}
            />

            <Area
              type="monotone"
              dataKey="income"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2.5}
              fill="url(#incomeFill)"
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="hsl(var(--chart-5))"
              strokeWidth={2.5}
              fill="url(#expenseFill)"
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
