import Seo from "@/components/Seo";
import AppShell from "@/components/AppShell";
import { useDashboard } from "@/hooks/use-dashboard";
import StatCard from "@/components/StatCard";
import FeesChart from "@/components/FeesChart";
import NoticeBoard from "@/components/NoticeBoard";
import ActivityFeed from "@/components/ActivityFeed";
import MiniCalendar from "@/components/MiniCalendar";
import { mockDashboardResponse } from "@/mockdata";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const dash = useDashboard();

  const data = dash.data ?? mockDashboardResponse;

  return (
    <>
      <Seo
        title="Dashboard • Crestview Admin"
        description="School management dashboard: stats, fee analytics, notices, activity and calendar."
      />
      <AppShell pageTitle="Dashboard">
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Overview</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Snapshot of your campus operations — updated in real time (when available).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                data-testid="dashboard-refresh"
                variant="secondary"
                className="rounded-xl"
                onClick={() => dash.refetch()}
                disabled={dash.isFetching}
              >
                <RefreshCw className={dash.isFetching ? "mr-2 h-4 w-4 animate-spin" : "mr-2 h-4 w-4"} />
                {dash.isFetching ? "Refreshing…" : "Refresh"}
              </Button>
              <Button
                data-testid="dashboard-export"
                className="rounded-xl bg-gradient-to-r from-primary to-primary/85 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                onClick={() => {
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "dashboard-export.json";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Export
              </Button>
            </div>
          </div>

          {dash.isError ? (
            <div data-testid="dashboard-error" className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
              Failed to load dashboard from API. Showing mock data.{" "}
              <span className="text-muted-foreground">({(dash.error as Error)?.message})</span>
            </div>
          ) : null}

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.stats.map((s) => (
              <StatCard key={s.id} card={s} />
            ))}
          </section>

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <FeesChart className="lg:col-span-2" data={data.feesChart} />
            <MiniCalendar events={data.events} />
          </section>

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <NoticeBoard
              notices={data.notices}
              onViewAll={() => {
                // eslint-disable-next-line no-alert
                alert("Full notices list (mock):\n\n" + data.notices.map((n) => `• ${n.date} — ${n.title}`).join("\n"));
              }}
            />
            <div className="lg:col-span-2">
              <ActivityFeed items={data.activities} />
            </div>
          </section>
        </div>
      </AppShell>
    </>
  );
}
