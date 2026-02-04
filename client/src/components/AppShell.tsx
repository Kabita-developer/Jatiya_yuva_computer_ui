import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Command,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  Users,
  UsersRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
};

const nav: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/students", label: "Students", icon: GraduationCap, badge: "New" },
  { href: "/parents", label: "Parents", icon: UsersRound },
  { href: "/teachers", label: "Teachers", icon: Users },
  { href: "/finance", label: "Finance", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

function useThemeToggle() {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
  return useMemo(() => {
    return {
      isDark,
      toggle: () => {
        const next = !isDark;
        setIsDark(next);
        document.documentElement.classList.toggle("dark", next);
      },
    };
  }, [isDark]);
}

export default function AppShell({
  children,
  pageTitle,
}: {
  children: React.ReactNode;
  pageTitle: string;
}) {
  const [location] = useLocation();
  const theme = useThemeToggle();

  const [query, setQuery] = useState("");

  const onSearch = () => {
    // purely UI mock; could route to a global search page later
    // eslint-disable-next-line no-console
    console.log("Search:", query);
  };

  return (
    <SidebarProvider defaultOpen className="mesh-bg grain">
      <Sidebar
        data-testid="sidebar"
        className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
      >
        <SidebarHeader className="px-3 py-3">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/"
              data-testid="sidebar-logo"
              className="group flex items-center gap-3 rounded-xl px-2.5 py-2 ring-1 ring-transparent hover:bg-sidebar-accent/60 hover:ring-sidebar-border transition-all duration-200"
            >
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-sidebar-primary to-sidebar-primary/70 shadow-lg shadow-black/25 ring-1 ring-white/10">
                <Command className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-tight">
                  Crestview Admin
                </div>
                <div className="text-[11px] text-sidebar-foreground/70">
                  School Management
                </div>
              </div>
            </Link>

            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarTrigger
                  data-testid="sidebar-trigger-desktop"
                  className="hidden md:inline-flex"
                />
              </TooltipTrigger>
              <TooltipContent>Collapse sidebar</TooltipContent>
            </Tooltip>
          </div>

          <div className="mt-3 hidden md:block">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sidebar-foreground/55" />
              <input
                data-testid="sidebar-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => (e.key === "Enter" ? onSearch() : undefined)}
                placeholder="Search students, invoices…"
                className={cn(
                  "w-full rounded-xl bg-white/5 px-10 py-2.5 text-sm",
                  "border border-sidebar-border/70 text-sidebar-foreground placeholder:text-sidebar-foreground/45",
                  "focus:outline-none focus:ring-4 focus:ring-sidebar-ring/15 focus:border-sidebar-ring/50",
                  "transition-all duration-200"
                )}
              />
              <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-lg border border-sidebar-border bg-white/5 px-2 py-0.5 text-[10px] text-sidebar-foreground/65 lg:block">
                ⌘K
              </kbd>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2">
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/70">
              Workspace
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.map((item) => {
                  const active = location === item.href;
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={active}>
                        <Link
                          href={item.href}
                          data-testid={`nav-${item.label.toLowerCase()}`}
                          className={cn(
                            "group flex items-center gap-3 rounded-xl px-3 py-2.5",
                            "transition-all duration-200",
                            "hover:bg-sidebar-accent/70 hover:shadow-sm",
                            active
                              ? "bg-sidebar-accent shadow-sm ring-1 ring-white/10"
                              : "text-sidebar-foreground/90"
                          )}
                        >
                          <Icon className={cn("h-4.5 w-4.5", active ? "text-sidebar-primary" : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground")} />
                          <span className="text-sm font-medium">{item.label}</span>
                          <span className="ml-auto flex items-center gap-2">
                            {item.badge ? (
                              <Badge
                                data-testid={`nav-badge-${item.label.toLowerCase()}`}
                                className="rounded-full bg-sidebar-primary/15 text-sidebar-primary ring-1 ring-sidebar-primary/25"
                              >
                                {item.badge}
                              </Badge>
                            ) : null}
                            {active ? (
                              <span className="h-1.5 w-1.5 rounded-full bg-sidebar-primary shadow-[0_0_0_4px_rgba(59,130,246,0.12)]" />
                            ) : null}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <div className="px-2 py-3">
            <Separator className="bg-sidebar-border/80" />
          </div>

          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/70">
              Quick actions
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="grid grid-cols-2 gap-2 px-1">
                <button
                  data-testid="quickaction-new-student"
                  onClick={() => (window.location.href = "/students")}
                  className={cn(
                    "rounded-xl border border-sidebar-border bg-white/5 px-3 py-2 text-left",
                    "hover:bg-white/10 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20",
                    "active:translate-y-0 active:shadow-md",
                    "transition-all duration-200"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-sidebar-primary" />
                    <div className="text-xs font-semibold">Students</div>
                  </div>
                  <div className="mt-1 text-[11px] text-sidebar-foreground/65">
                    Manage roster
                  </div>
                </button>

                <button
                  data-testid="quickaction-open-finance"
                  onClick={() => (window.location.href = "/finance")}
                  className={cn(
                    "rounded-xl border border-sidebar-border bg-white/5 px-3 py-2 text-left",
                    "hover:bg-white/10 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20",
                    "active:translate-y-0 active:shadow-md",
                    "transition-all duration-200"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-sidebar-primary" />
                    <div className="text-xs font-semibold">Finance</div>
                  </div>
                  <div className="mt-1 text-[11px] text-sidebar-foreground/65">
                    Invoices & fees
                  </div>
                </button>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-3">
          <div className="rounded-2xl border border-sidebar-border bg-gradient-to-br from-white/6 to-white/3 p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-xs font-semibold">Crestview Academy</div>
                <div className="truncate text-[11px] text-sidebar-foreground/70">
                  Term 2 · Admin Panel
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    data-testid="sidebar-profile-menu"
                    variant="secondary"
                    size="icon"
                    className="h-9 w-9 rounded-xl bg-white/8 text-sidebar-foreground hover:bg-white/14 border border-sidebar-border"
                  >
                    <Users className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    data-testid="toggle-theme"
                    onClick={theme.toggle}
                    className="cursor-pointer"
                  >
                    {theme.isDark ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                    Toggle theme
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    data-testid="go-settings"
                    onClick={() => (window.location.href = "/settings")}
                    className="cursor-pointer"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    data-testid="logout"
                    onClick={() => {
                      // no auth; placeholder action to satisfy interaction wiring
                      // eslint-disable-next-line no-alert
                      alert("Logged out (mock)");
                    }}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset className="min-h-dvh">
        {/* Top bar */}
        <div className="sticky top-0 z-30 border-b border-border/70 bg-background/70 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center gap-3">
              <Button
                data-testid="sidebar-trigger-mobile"
                variant="secondary"
                size="icon"
                className="md:hidden rounded-xl"
                onClick={() => {
                  // SidebarTrigger handles provider state; keep this for accessibility + test id.
                  const el = document.querySelector<HTMLButtonElement>('[data-sidebar="trigger"]');
                  el?.click();
                }}
              >
                <Menu className="h-4.5 w-4.5" />
              </Button>

              <div className="min-w-0">
                <div className="text-lg font-bold tracking-tight text-balance">
                  {pageTitle}
                </div>
                <div className="text-xs text-muted-foreground">
                  Keep your campus operations flowing — fast, clear, controlled.
                </div>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <div className="hidden sm:block">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      data-testid="topbar-search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => (e.key === "Enter" ? onSearch() : undefined)}
                      placeholder="Search…"
                      className="w-[220px] rounded-xl pl-10"
                    />
                  </div>
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      data-testid="topbar-notifications"
                      variant="secondary"
                      size="icon"
                      className="rounded-xl"
                      onClick={() => {
                        // eslint-disable-next-line no-alert
                        alert("Notifications (mock)");
                      }}
                    >
                      <Bell className="h-4.5 w-4.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>

                <div className="hidden md:flex items-center gap-1 rounded-xl border border-border bg-card/70 p-1 shadow-sm">
                  <Button
                    data-testid="topbar-back"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg"
                    onClick={() => window.history.back()}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    data-testid="topbar-forward"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg"
                    onClick={() => window.history.forward()}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="animate-float-in">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
