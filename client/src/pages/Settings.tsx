import { useMemo, useState } from "react";
import Seo from "@/components/Seo";
import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Save, Shield, Bell, Palette, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [schoolName, setSchoolName] = useState("Crestview Academy");
  const [timezone, setTimezone] = useState("America/New_York");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [auditMode, setAuditMode] = useState(true);

  const dirty = useMemo(() => {
    return schoolName !== "Crestview Academy" ||
      timezone !== "America/New_York" ||
      emailNotifs !== true ||
      smsNotifs !== false ||
      auditMode !== true;
  }, [schoolName, timezone, emailNotifs, smsNotifs, auditMode]);

  const save = () => {
    // mock save
    // eslint-disable-next-line no-alert
    alert("Settings saved (mock).");
  };

  const reset = () => {
    setSchoolName("Crestview Academy");
    setTimezone("America/New_York");
    setEmailNotifs(true);
    setSmsNotifs(false);
    setAuditMode(true);
  };

  return (
    <>
      <Seo title="Settings • Crestview Admin" description="Configure school settings, notifications, theme and security preferences." />
      <AppShell pageTitle="Settings">
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Calibrate the dashboard to match your school’s operations.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                data-testid="settings-reset"
                variant="secondary"
                className="rounded-xl"
                onClick={reset}
                disabled={!dirty}
              >
                <Undo2 className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button
                data-testid="settings-save"
                className={cn(
                  "rounded-xl bg-gradient-to-r from-primary to-primary/85 shadow-lg shadow-primary/20",
                  "hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                )}
                onClick={save}
                disabled={!dirty}
              >
                <Save className="mr-2 h-4 w-4" />
                Save changes
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card data-testid="settings-school" className="rounded-2xl shadow-premium border-card-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  School profile
                </CardTitle>
                <CardDescription>Brand + operational defaults</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>School name</Label>
                  <Input data-testid="settings-school-name" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Input data-testid="settings-timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)} className="rounded-xl" />
                </div>

                <Separator />

                <div className="text-xs text-muted-foreground">
                  These values affect calendar formatting and exported reports.
                </div>
              </CardContent>
            </Card>

            <Card data-testid="settings-notifications" className="rounded-2xl shadow-premium border-card-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notifications
                </CardTitle>
                <CardDescription>Keep staff and guardians informed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-muted/30 p-4">
                  <div>
                    <div className="text-sm font-semibold">Email alerts</div>
                    <div className="text-xs text-muted-foreground">Fee reminders, notices, and alerts.</div>
                  </div>
                  <Switch data-testid="settings-email" checked={emailNotifs} onCheckedChange={setEmailNotifs} />
                </div>

                <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-muted/30 p-4">
                  <div>
                    <div className="text-sm font-semibold">SMS alerts</div>
                    <div className="text-xs text-muted-foreground">Critical reminders and urgent updates.</div>
                  </div>
                  <Switch data-testid="settings-sms" checked={smsNotifs} onCheckedChange={setSmsNotifs} />
                </div>

                <Button
                  data-testid="settings-test-notification"
                  variant="secondary"
                  className="w-full rounded-xl"
                  onClick={() => alert("Test notification sent (mock).")}
                >
                  Send test notification
                </Button>
              </CardContent>
            </Card>

            <Card data-testid="settings-security" className="rounded-2xl shadow-premium border-card-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Security & audit
                </CardTitle>
                <CardDescription>Guardrails for administrative actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-muted/30 p-4">
                  <div>
                    <div className="text-sm font-semibold">Audit mode</div>
                    <div className="text-xs text-muted-foreground">Log changes to roster and finance records.</div>
                  </div>
                  <Switch data-testid="settings-audit" checked={auditMode} onCheckedChange={setAuditMode} />
                </div>

                <Button
                  data-testid="settings-download-audit"
                  className="w-full rounded-xl"
                  onClick={() => {
                    const blob = new Blob(
                      [
                        JSON.stringify(
                          {
                            generatedAt: new Date().toISOString(),
                            auditMode,
                            notes: "This is a mock audit export. Connect to backend for real logs.",
                          },
                          null,
                          2
                        ),
                      ],
                      { type: "application/json" }
                    );
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "audit-export.json";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Download audit export
                </Button>

                <div className="text-xs text-muted-foreground">
                  For real user roles and audit trails, connect authentication + server logging.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppShell>
    </>
  );
}
