import { useMemo, useState } from "react";
import Seo from "@/components/Seo";
import AppShell from "@/components/AppShell";
import DataTableShell from "@/components/DataTableShell";
import ConfirmDialog from "@/components/ConfirmDialog";
import { mockTeachers, type Teacher } from "@/mockdata";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Search, UserRoundPen, Trash2, BadgeCheck, CalendarClock } from "lucide-react";

function statusBadge(s: Teacher["status"]) {
  if (s === "active")
    return <Badge className="rounded-full bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/20">Active</Badge>;
  if (s === "on_leave")
    return <Badge className="rounded-full bg-amber-500/15 text-amber-700 ring-1 ring-amber-500/20">On Leave</Badge>;
  return <Badge variant="secondary" className="rounded-full">Inactive</Badge>;
}

export default function TeachersPage() {
  const [rows, setRows] = useState<Teacher[]>(() => mockTeachers);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | Teacher["status"]>("all");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState<Teacher | null>(null);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesQ =
        !qq ||
        r.name.toLowerCase().includes(qq) ||
        r.department.toLowerCase().includes(qq) ||
        r.email.toLowerCase().includes(qq);
      const matchesStatus = status === "all" ? true : r.status === status;
      return matchesQ && matchesStatus;
    });
  }, [rows, q, status]);

  const [form, setForm] = useState<Omit<Teacher, "id">>({
    name: "",
    department: "Science",
    email: "",
    phone: "",
    status: "active",
    joinedAt: new Date().toISOString().slice(0, 10),
  });

  const resetForm = () =>
    setForm({
      name: "",
      department: "Science",
      email: "",
      phone: "",
      status: "active",
      joinedAt: new Date().toISOString().slice(0, 10),
    });

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.department.trim()) return "Department is required";
    if (!form.email.trim() || !form.email.includes("@")) return "Valid email is required";
    if (!form.phone.trim()) return "Phone is required";
    return null;
  };

  const onCreate = () => {
    const err = validate();
    if (err) return alert(err);
    const next: Teacher = { ...form, id: crypto.randomUUID() };
    setRows((p) => [next, ...p]);
    setCreateOpen(false);
    resetForm();
  };

  const openEdit = (t: Teacher) => {
    setEditing(t);
    setForm({ ...t, id: undefined as never });
    setEditOpen(true);
  };

  const onUpdate = () => {
    if (!editing) return;
    const err = validate();
    if (err) return alert(err);
    setRows((p) => p.map((r) => (r.id === editing.id ? { ...r, ...form } : r)));
    setEditOpen(false);
    setEditing(null);
    resetForm();
  };

  const onDelete = (t: Teacher) => {
    setDeleting(t);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!deleting) return;
    setRows((p) => p.filter((r) => r.id !== deleting.id));
    setConfirmOpen(false);
    setDeleting(null);
  };

  const markActive = (t: Teacher) => {
    setRows((p) => p.map((r) => (r.id === t.id ? { ...r, status: "active" } : r)));
  };

  const markLeave = (t: Teacher) => {
    setRows((p) => p.map((r) => (r.id === t.id ? { ...r, status: "on_leave" } : r)));
  };

  return (
    <>
      <Seo title="Teachers • Crestview Admin" description="Manage teachers: departments, status and contact details." />
      <AppShell pageTitle="Teachers">
        <DataTableShell
          title="Teachers"
          subtitle="Staff directory"
          toolbar={
            <>
              <div className="relative w-full sm:w-[280px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  data-testid="teachers-search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search name, dept, email…"
                  className="rounded-xl pl-10"
                />
              </div>
              <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                <SelectTrigger data-testid="teachers-status-filter" className="w-full sm:w-[170px] rounded-xl">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Dialog open={createOpen} onOpenChange={(o) => { setCreateOpen(o); if (o) resetForm(); }}>
                <DialogTrigger asChild>
                  <Button
                    data-testid="teachers-create"
                    className="rounded-xl bg-gradient-to-r from-primary to-primary/85 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                    onClick={() => setCreateOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Teacher
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[560px]" data-testid="teachers-create-dialog">
                  <DialogHeader>
                    <DialogTitle>Add teacher</DialogTitle>
                  </DialogHeader>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Name</Label>
                      <Input data-testid="teachers-form-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="rounded-xl" />
                    </div>

                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Select value={form.department} onValueChange={(v) => setForm((p) => ({ ...p, department: v }))}>
                        <SelectTrigger data-testid="teachers-form-dept" className="rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["Science", "Mathematics", "Languages", "Social Studies", "Arts", "Sports"].map((d) => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as any }))}>
                        <SelectTrigger data-testid="teachers-form-status" className="rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="on_leave">On Leave</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input data-testid="teachers-form-email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="rounded-xl" />
                    </div>

                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input data-testid="teachers-form-phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="rounded-xl" />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label>Joined</Label>
                      <Input data-testid="teachers-form-joined" type="date" value={form.joinedAt} onChange={(e) => setForm((p) => ({ ...p, joinedAt: e.target.value }))} className="rounded-xl" />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button data-testid="teachers-form-cancel" variant="secondary" className="rounded-xl" onClick={() => setCreateOpen(false)}>
                      Cancel
                    </Button>
                    <Button data-testid="teachers-form-submit" className="rounded-xl" onClick={onCreate}>
                      Create
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          }
        >
          <div className="p-4">
            <Table data-testid="teachers-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Joined</TableHead>
                  <TableHead className="w-[60px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t, idx) => (
                  <TableRow key={t.id} data-testid={`teachers-row-${idx}`} className="hover:bg-muted/40">
                    <TableCell className="font-semibold">{t.name}</TableCell>
                    <TableCell className="text-muted-foreground">{t.department}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{t.email}</TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">{t.phone}</TableCell>
                    <TableCell>{statusBadge(t.status)}</TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">{t.joinedAt}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button data-testid={`teachers-actions-${idx}`} variant="ghost" size="icon" className="rounded-xl">
                            <MoreHorizontal className="h-4.5 w-4.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            data-testid={`teachers-mark-active-${idx}`}
                            className="cursor-pointer"
                            onClick={() => markActive(t)}
                          >
                            <BadgeCheck className="mr-2 h-4 w-4" />
                            Mark Active
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            data-testid={`teachers-mark-leave-${idx}`}
                            className="cursor-pointer"
                            onClick={() => markLeave(t)}
                          >
                            <CalendarClock className="mr-2 h-4 w-4" />
                            Set On Leave
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            data-testid={`teachers-edit-${idx}`}
                            className="cursor-pointer"
                            onClick={() => openEdit(t)}
                          >
                            <UserRoundPen className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            data-testid={`teachers-delete-${idx}`}
                            className="cursor-pointer text-destructive focus:text-destructive"
                            onClick={() => onDelete(t)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}

                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground" data-testid="teachers-empty">
                      No teachers found. Try adjusting filters.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </DataTableShell>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-[560px]" data-testid="teachers-edit-dialog">
            <DialogHeader>
              <DialogTitle>Edit teacher</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Name</Label>
                <Input data-testid="teachers-edit-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={form.department} onValueChange={(v) => setForm((p) => ({ ...p, department: v }))}>
                  <SelectTrigger data-testid="teachers-edit-dept" className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Science", "Mathematics", "Languages", "Social Studies", "Arts", "Sports"].map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as any }))}>
                  <SelectTrigger data-testid="teachers-edit-status" className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on_leave">On Leave</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input data-testid="teachers-edit-email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input data-testid="teachers-edit-phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="rounded-xl" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Joined</Label>
                <Input data-testid="teachers-edit-joined" type="date" value={form.joinedAt} onChange={(e) => setForm((p) => ({ ...p, joinedAt: e.target.value }))} className="rounded-xl" />
              </div>
            </div>
            <DialogFooter>
              <Button data-testid="teachers-edit-cancel" variant="secondary" className="rounded-xl" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button data-testid="teachers-edit-submit" className="rounded-xl" onClick={onUpdate}>
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Delete teacher?"
          description={`This will remove "${deleting?.name ?? "teacher"}" from the directory. This action can't be undone.`}
          confirmText="Delete"
          destructive
          onConfirm={confirmDelete}
        />
      </AppShell>
    </>
  );
}
